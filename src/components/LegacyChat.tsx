"use client";
import { useState, useEffect } from "react";
import { talkToLegacy, checkPremiumStatus } from "@/app/actions";
import { Send, Mic, MicOff, Sparkles, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

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
  const [history, setHistory] = useState<Message[]>([]);
  const [dbChatCount, setDbChatCount] = useState(0); // Add this state
  
  // NEW: State for paywall logic
  const [isPremium, setIsPremium] = useState(false);
  const [userEmail, setUserEmail] = useState("");

useEffect(() => {
  const checkStatus = async () => {
    const savedSession = localStorage.getItem('katha_session');
    if (savedSession) {
      const user = JSON.parse(savedSession);
      setUserEmail(user.email);
      const res = await checkPremiumStatus(user.email);
      if (res.success) {
        setIsPremium(res.isPremium ?? false);
        // @ts-ignore (if you add chat_count to the response)
        setDbChatCount(res.chatCount || 0); 
      }
    }
  };
  checkStatus();
}, []);

  // NEW: Count only 'user' messages
// Combined count of previous chats + current session chats
const totalChatsUsed = dbChatCount + history.filter(m => m.role === 'user').length;
const isLimitReached = !isPremium && totalChatsUsed >= 2;

  const toggleListening = () => {
    if (isLimitReached) return; // Block voice if limit reached
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
    // 1. Double check locally before even trying to call the server
    if (!input || isLimitReached) return;
    
    setLoading(true);

    try {
      // 2. Call the updated talkToLegacy action
      const result = await talkToLegacy(targetUser.email, input, history);

      if (result.success) {
        // 3. Update the chat history locally if the message was allowed
        const newMessages: Message[] = [
          ...history,
          { role: "user", content: input },
          { role: "assistant", content: result.text || "" }
        ];
        setHistory(newMessages);
      } 
      // 4. Handle the specific Paywall error from the Database
      else if (result.error === "FREE_LIMIT_REACHED") {
        alert("You've reached the free conversation limit. Upgrade to Premium to continue seeding your legacy!");
        // Optional: Force the page to refresh or redirect to pricing
        // window.location.href = '/pricing';
      } 
      else {
        // Handle other errors (API issues, etc.)
        alert(result.error || "The connection to the legacy was interrupted.");
      }
    } catch (err) {
      alert("System error. Please try again later.");
    } finally {
      setLoading(false);
      setInput(""); 
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-sm font-black uppercase tracking-widest text-blue-600 flex items-center gap-2">
          <Sparkles size={16} /> Consult the Wisdom of {targetUser.name}
        </h3>
        {!isPremium && (
          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
            {userMessageCount}/2 Free Chats
          </span>
        )}
      </div>

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

      {/* --- INPUT AREA WITH PAYWALL --- */}
      <div className="relative pt-2">
        {isLimitReached ? (
          // Paywall Banner replacing the input
          <div className="bg-slate-900 p-6 rounded-3xl border border-blue-500/30 flex flex-col items-center text-center space-y-4 animate-in zoom-in-95 duration-500">
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Lock size={20} />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Free Limit Reached</p>
              <p className="text-slate-400 text-[10px] mt-1 italic">Unlock unlimited conversations with your digital legacy.</p>
            </div>
            <Link 
              href="/pricing" 
              className="w-full bg-blue-600 text-white py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-500 transition shadow-lg"
            >
              Get Full Access <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          // Standard Input Area
          <div className="flex items-center gap-3">
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
        )}
      </div>
      
      <p className="text-center text-[9px] text-slate-400 font-bold uppercase tracking-[0.3em]">
        Katha Authenticity Engine • Context-Aware Preservation
      </p>
    </div>
  );
}