import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Image as ImageIcon, Mic, Globe, BrainCircuit, Volume2, Bot, ChevronDown } from 'lucide-react';
import { ChatMessage } from '../types';
import { sendChatMessage, generateSpeech } from '../services/geminiService';

interface ChatWidgetProps {
  onOpenLive: () => void;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ onOpenLive }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '0', role: 'system', text: 'Hi! I am d3as.io, your advanced AI Mentor. How can I help you optimize your code today?', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isThinkingMode, setIsThinkingMode] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>('gemini-2.5-flash');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Auto-scroll to bottom only on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Construct history (simplified)
      const history = messages.map(m => ({
        role: m.role === 'system' ? 'model' : m.role,
        parts: [{ text: m.text }]
      }));

      const response = await sendChatMessage(history, userMsg.text, {
        useThinking: isThinkingMode,
        useSearch: isSearchMode,
        image: selectedImage?.split(',')[1], // remove data:image/png;base64,
        modelId: selectedModel
      });

      let responseText = response.text || "I couldn't generate a text response.";
      let groundingUrls: string[] = [];

      // Handle Search Grounding
      if (isSearchMode && response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
         response.candidates[0].groundingMetadata.groundingChunks.forEach((chunk: any) => {
            if (chunk.web?.uri) groundingUrls.push(chunk.web.uri);
         });
      }

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now(),
        groundingUrls
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error: any) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'system',
        text: `Error: ${error.message || 'Something went wrong.'}`,
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
      setSelectedImage(null);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleTTS = async (text: string) => {
      try {
          const audioBase64 = await generateSpeech(text);
          if (audioBase64) {
              const audio = new Audio(`data:audio/mp3;base64,${audioBase64}`);
              audio.play();
          }
      } catch (e) {
          console.error("TTS Error", e);
      }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-80 md:w-96 h-[550px] max-h-[85vh] bg-[#0f172a] border border-blue-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-up backdrop-blur-xl">
          {/* Header */}
          <div className="bg-[#1e293b] p-3 flex justify-between items-center border-b border-gray-700 shrink-0 relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-600/10"></div>
            <div className="flex items-center gap-3 relative z-10">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/50">
                    <Bot size={18} className="text-white" />
                </div>
                <div>
                    <h3 className="font-orbitron font-bold text-white leading-tight">d3as.io</h3>
                    <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <select 
                            value={selectedModel}
                            onChange={(e) => setSelectedModel(e.target.value)}
                            className="bg-transparent text-[10px] text-gray-400 outline-none border-none cursor-pointer hover:text-white"
                        >
                            <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                            <option value="gemini-2.5-flash-lite-latest">Gemini 2.5 Lite</option>
                            <option value="gemini-3-pro-preview">Gemini 3 Pro</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="flex gap-1 relative z-10">
                 <button onClick={onOpenLive} className="p-2 hover:bg-red-500/20 rounded-full text-red-400 hover:text-red-500 transition" title="Live Voice Mode">
                    <Mic size={18} />
                 </button>
                <button onClick={() => setIsOpen(false)} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition">
                    <X size={20} />
                </button>
            </div>
          </div>

          {/* Messages Area with Cyber Background */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 scroll-smooth custom-scrollbar relative">
            {/* Cyber Grid Background */}
            <div className="absolute inset-0 bg-[radial-gradient(#3b82f622_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
            
            {messages.map((msg) => (
              <div key={msg.id} className={`flex relative z-10 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role !== 'user' && (
                    <div className="w-6 h-6 rounded-full bg-blue-600/20 flex items-center justify-center mr-2 mt-1 shrink-0 border border-blue-500/30">
                        <Bot size={14} className="text-blue-400"/>
                    </div>
                )}
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-lg backdrop-blur-sm border ${
                  msg.role === 'user' 
                  ? 'bg-blue-600 text-white border-blue-500 rounded-tr-none' 
                  : 'bg-gray-800/80 text-gray-200 border-gray-700 rounded-tl-none'
                }`}>
                   <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
                   {msg.groundingUrls && msg.groundingUrls.length > 0 && (
                       <div className="mt-2 pt-2 border-t border-gray-600/50 text-xs">
                           <p className="font-bold text-gray-400 mb-1 flex items-center gap-1"><Globe size={10}/> Sources:</p>
                           {msg.groundingUrls.map((url, i) => (
                               <a key={i} href={url} target="_blank" rel="noreferrer" className="block text-blue-400 hover:underline truncate">{url}</a>
                           ))}
                       </div>
                   )}
                   {msg.role === 'model' && (
                       <div className="flex gap-2 mt-2 pt-1">
                           <button onClick={() => handleTTS(msg.text)} className="opacity-50 hover:opacity-100 text-gray-400 hover:text-blue-400 transition" title="Read Aloud">
                               <Volume2 size={14} />
                           </button>
                       </div>
                   )}
                </div>
              </div>
            ))}
            {isLoading && (
                <div className="flex justify-start animate-pulse items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-600/20 flex items-center justify-center border border-blue-500/30">
                        <Bot size={14} className="text-blue-400"/>
                    </div>
                    <div className="bg-gray-800/50 text-blue-400 text-xs font-medium px-3 py-2 rounded-full border border-blue-900/50">
                        d3as.io is thinking...
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Tools Panel */}
          <div className="bg-[#1e293b]/80 backdrop-blur px-3 py-2 border-t border-gray-700 flex gap-2 text-xs overflow-x-auto shrink-0 custom-scrollbar">
             <button 
                onClick={() => setIsThinkingMode(!isThinkingMode)} 
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full border transition-all whitespace-nowrap ${isThinkingMode ? 'bg-purple-600 text-white border-purple-400 shadow-lg shadow-purple-500/20' : 'border-gray-600 text-gray-400 hover:text-white hover:bg-gray-700'}`}
             >
                 <BrainCircuit size={12} /> Deep Think
             </button>
             <button 
                onClick={() => setIsSearchMode(!isSearchMode)} 
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full border transition-all whitespace-nowrap ${isSearchMode ? 'bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-500/20' : 'border-gray-600 text-gray-400 hover:text-white hover:bg-gray-700'}`}
             >
                 <Globe size={12} /> Web Search
             </button>
          </div>
          
          {/* Input Area */}
          <div className="p-3 bg-[#0f172a] border-t border-gray-700 shrink-0">
            {selectedImage && (
                <div className="mb-2 relative w-14 h-14 animate-fade-in group">
                    <img src={selectedImage} alt="Upload" className="w-full h-full object-cover rounded-lg border border-blue-500/50 shadow-lg" />
                    <button onClick={() => setSelectedImage(null)} className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white shadow-sm hover:bg-red-600 transform scale-0 group-hover:scale-100 transition"><X size={10}/></button>
                </div>
            )}
            <div className="flex items-center gap-2 bg-gray-800/50 p-1.5 rounded-full border border-gray-700 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/50 transition-all">
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
              />
              <button onClick={() => fileInputRef.current?.click()} className="text-gray-400 hover:text-blue-400 p-2 rounded-full hover:bg-gray-700/50 transition" title="Upload Image">
                <ImageIcon size={18} />
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask d3as.io..."
                className="flex-1 bg-transparent text-white px-2 outline-none placeholder-gray-500 text-sm"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className={`p-2 rounded-full transition-all ${input.trim() || selectedImage ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:scale-105' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.5)] flex items-center justify-center text-white hover:scale-110 transition-all z-50 border border-white/20"
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>
    </div>
  );
};

export default ChatWidget;
