"use client";
import { useState } from "react";
import { talkToLegacy } from "@/app/actions";
import { Send, Mic, MicOff, Sparkles } from "lucide-react";

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

// Define the shape of our chat messages
interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function LegacyChat({
  targetUser,
}: {
  targetUser: { name: string; email: string };
}) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  // NEW: Store the whole conversation history
  const [history, setHistory] = useState<Message[]>([]);

  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support speech recognition. Try Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-IN";

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    if (isListening) recognition.stop();
    else recognition.start();
  };

  const handleTalk = async () => {
    if (!input) return;
    setLoading(true);

    // 1. We send the CURRENT history to the action
    const result = await talkToLegacy(targetUser.email, input, history);

    if (result.success) {
      // 2. Append BOTH the user's question and AI's answer to the local state
      const newMessages: Message[] = [
        ...history,
        { role: "user", content: input },
        { role: "assistant", content: result.text || "" }
      ];
      setHistory(newMessages);
    } else {
      alert(result.error);
    }
    
    setLoading(false);
    setInput(""); 
  };

return (
  <div className="w-full space-y-6">
    {/* Header */}
    <div className="flex items-center justify-between px-2">
      <h3 className="text-sm font-black uppercase tracking-widest text-blue-600 flex items-center gap-2">
        <Sparkles size={16} /> Consult the Wisdom of {targetUser.name}
      </h3>
    </div>

    {/* Scrollable Conversation View */}
    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar p-4 bg-slate-50 rounded-[2rem] border border-slate-100">
      {history.length === 0 && (
        <div className="text-center py-10 text-slate-400 italic text-sm">
          The vault is open. What would you like to ask?
        </div>
      )}
      
      {history.map((msg, index) => (
        <div 
          key={index}
          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
        >
          <div className={`max-w-[85%] p-5 rounded-[2rem] shadow-sm ${
            msg.role === 'user' 
              ? 'bg-blue-600 text-white rounded-tr-none' 
              : 'bg-white border border-slate-200 text-slate-700 italic rounded-tl-none'
          }`}>
            {msg.role === 'assistant' && (
              <div className="flex items-center gap-2 mb-2">
                 <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                 <span className="text-[9px] font-black uppercase tracking-widest text-blue-500">Preserved Message</span>
              </div>
            )}
            <p className="text-sm leading-relaxed">{msg.content}</p>
          </div>
        </div>
      ))}
    </div>

    {/* Input Area */}
    <div className="relative flex items-center gap-3 pt-2">
      <div className="relative flex-1 group">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleTalk()}
          placeholder={isListening ? "Listening..." : `Message the Legacy...`}
          className={`w-full bg-slate-100 border border-slate-200 rounded-3xl py-5 pl-8 pr-16 text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all ${
              isListening ? "border-blue-500 ring-4 ring-blue-500/20" : ""
          }`}
        />
        <button
          onClick={toggleListening}
          className={`absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-2xl transition-all ${
            isListening ? "bg-red-500 text-white animate-pulse" : "text-slate-400 hover:text-blue-500"
          }`}
        >
          {isListening ? <MicOff size={20} /> : <Mic size={20} />}
        </button>
      </div>

      <button
        onClick={handleTalk}
        disabled={loading || !input}
        className="p-5 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-200 disabled:opacity-20 transition active:scale-95"
      >
        {loading ? (
          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <Send size={24} />
        )}
      </button>
    </div>
    
    <p className="text-center text-[9px] text-slate-400 font-bold uppercase tracking-[0.3em]">
      Katha Authenticity Engine • Context-Aware Preservation
    </p>
  </div>
);
}