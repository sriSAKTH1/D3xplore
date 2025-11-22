import { GoogleGenAI, LiveServerMessage, Modality, Type } from "@google/genai";

// Helper to get API Key safely
const getApiKey = () => process.env.API_KEY || '';

// --- Text Chat & Search Grounding ---

export const sendChatMessage = async (
  history: { role: string; parts: { text: string }[] }[],
  message: string,
  options: { 
    useThinking?: boolean; 
    useSearch?: boolean; 
    image?: string; // base64
    useTTS?: boolean;
    modelId?: string;
  }
) => {
  if (!process.env.API_KEY) throw new Error("API Key missing");

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Default to selected model or Flash if undefined
  let model = options.modelId || 'gemini-2.5-flash'; 
  const config: any = { systemInstruction: "You are d3as.io, an expert DSA Tutor." };

  // Feature-based overrides
  if (options.useThinking) {
    model = 'gemini-3-pro-preview';
    config.thinkingConfig = { thinkingBudget: 16000 }; 
  } else if (options.useSearch) {
    // Search tool often requires specific models or capabilities, usually 2.5 series is good
    // If the user selected a model that supports tools, we keep it, otherwise default to flash
    if (!model.includes('gemini-3') && !model.includes('gemini-2.5')) {
        model = 'gemini-2.5-flash';
    }
    config.tools = [{ googleSearch: {} }];
  } else if (options.image) {
    // If image provided, ensure model is multimodal. 
    // Gemini 2.5 and 3 are multimodal.
    if (model === 'gemini-2.5-flash-lite-latest') model = 'gemini-2.5-flash'; // Lite might have limits, safer to upgrade
  }

  const contents: any[] = [];
  
  // Add image if present
  if (options.image) {
    contents.push({
      role: 'user',
      parts: [
        { inlineData: { mimeType: 'image/png', data: options.image } },
        { text: message }
      ]
    });
  } else {
     // For simple implementation here we are just sending the last message effectively 
     // if we use generateContent. For chat history, we should use ai.chats.create.
  }

  const reqContents = options.image 
    ? { parts: [{ inlineData: { mimeType: 'image/png', data: options.image } }, { text: message }] }
    : { parts: [{ text: message }] };

  const response = await ai.models.generateContent({
    model,
    contents: reqContents,
    config
  });

  return response;
};

// --- Text to Speech ---

export const generateSpeech = async (text: string) => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
      },
    },
  });
  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
};

// --- Live API Utilities ---

export class LiveClient {
  private session: Promise<any> | null = null;
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: getApiKey() });
  }

  async connect(
    onOpen: () => void,
    onMessage: (msg: LiveServerMessage) => void,
    onClose: () => void,
    onError: (err: any) => void
  ) {
    this.session = this.ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-09-2025',
      callbacks: {
        onopen: onOpen,
        onmessage: onMessage,
        onclose: onClose,
        onerror: onError,
      },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
        },
        systemInstruction: "You are d3as.io, a helpful Data Structures and Algorithms teaching assistant. Be concise and encouraging.",
      },
    });
    return this.session;
  }

  async sendAudio(base64Data: string, mimeType: string = 'audio/pcm;rate=16000') {
    if (this.session) {
      const sess = await this.session;
      sess.sendRealtimeInput({
        media: {
          mimeType,
          data: base64Data
        }
      });
    }
  }

  async disconnect() {
      if (this.session) {
         // Clean up if needed
      }
  }
}

// --- Audio Processing Utils ---

export function base64ToFloat32(base64: string): Float32Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  const int16 = new Int16Array(bytes.buffer);
  const float32 = new Float32Array(int16.length);
  for (let i = 0; i < int16.length; i++) {
    float32[i] = int16[i] / 32768.0;
  }
  return float32;
}

export function float32ToBase64(data: Float32Array): string {
  const int16 = new Int16Array(data.length);
  for (let i = 0; i < data.length; i++) {
    int16[i] = Math.max(-32768, Math.min(32767, data[i] * 32768));
  }
  const bytes = new Uint8Array(int16.buffer);
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
