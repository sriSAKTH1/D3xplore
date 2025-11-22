import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, X, Activity } from 'lucide-react';
import { LiveClient, base64ToFloat32, float32ToBase64 } from '../services/geminiService';
import { LiveServerMessage } from '@google/genai';

interface LiveSessionProps {
  onClose: () => void;
}

const LiveSession: React.FC<LiveSessionProps> = ({ onClose }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Audio Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const clientRef = useRef<LiveClient | null>(null);
  const nextStartTimeRef = useRef<number>(0);

  // Visualizer for Audio
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    startSession();
    return () => {
      stopSession();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startSession = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      
      // Setup Input
      inputSourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
      processorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);
      
      inputSourceRef.current.connect(processorRef.current);
      processorRef.current.connect(audioContextRef.current.destination);

      clientRef.current = new LiveClient();

      await clientRef.current.connect(
        () => {
            console.log("Live Session Open");
            setIsConnected(true);
        },
        async (msg: LiveServerMessage) => {
            // Handle Audio Output
            const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioData && audioContextRef.current) {
                const ctx = audioContextRef.current;
                const float32 = base64ToFloat32(audioData);
                const buffer = ctx.createBuffer(1, float32.length, 24000); // Output usually 24k
                buffer.getChannelData(0).set(float32);
                
                const source = ctx.createBufferSource();
                source.buffer = buffer;
                source.connect(ctx.destination);
                
                const currentTime = ctx.currentTime;
                const startTime = Math.max(currentTime, nextStartTimeRef.current);
                source.start(startTime);
                nextStartTimeRef.current = startTime + buffer.duration;
            }
        },
        () => {
            console.log("Live Session Closed");
            setIsConnected(false);
        },
        (err) => {
            console.error("Live Error", err);
            setError("Connection failed. Please check API key and network.");
        }
      );

      processorRef.current.onaudioprocess = (e) => {
          if (isMuted) return;
          const inputData = e.inputBuffer.getChannelData(0);
          const base64 = float32ToBase64(inputData);
          clientRef.current?.sendAudio(base64);
      };

    } catch (e: any) {
      setError(e.message || "Failed to access microphone");
    }
  };

  const stopSession = () => {
    clientRef.current?.disconnect();
    processorRef.current?.disconnect();
    inputSourceRef.current?.disconnect();
    audioContextRef.current?.close();
  };

  const toggleMute = () => {
      setIsMuted(!isMuted);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 w-full max-w-md p-8 rounded-3xl shadow-2xl text-center relative animate-fade-in">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X size={24} />
        </button>

        <div className="flex flex-col items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center border-4 border-gray-700 relative">
            {isConnected ? (
                <div className="absolute inset-0 rounded-full border-4 border-blue-500 animate-ping opacity-20"></div>
            ) : null}
            <Activity size={48} className={isConnected ? "text-blue-500" : "text-gray-500"} />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
                {isConnected ? "Gemini Live Connected" : "Connecting..."}
            </h2>
            <p className="text-gray-400">Talk naturally to practice your DSA interview.</p>
          </div>

          {error && <div className="text-red-400 bg-red-900/30 p-2 rounded text-sm">{error}</div>}

          <div className="flex gap-4">
            <button 
                onClick={toggleMute}
                className={`p-4 rounded-full transition ${isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
                {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
            </button>
            <button 
                onClick={onClose}
                className="px-6 py-3 rounded-full bg-red-600 hover:bg-red-700 font-semibold"
            >
                End Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveSession;
