"use client";

import React, { useEffect, useState } from 'react';
import { 
  Shield, Cpu, UserCheck, Sparkles, Brain, Clock, ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function HowItWorks() {
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by waiting for the component to mount on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="bg-white text-slate-900 w-full min-h-screen selection:bg-blue-100 font-sans antialiased">
      {/* Animation Definitions */}
      <style>{`
        @keyframes scan {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(200%); }
          100% { transform: translateX(-100%); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes reverse-spin {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-scan { animation: scan 3s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        .animate-reverse-spin { animation: reverse-spin 8s linear infinite; }
      `}</style>

      {/* COMPACT HERO */}
      <header className="max-w-4xl mx-auto px-6 pt-10 pb-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 text-[9px] font-black uppercase rounded-full tracking-widest mb-4">
          <Shield size={10} /> The Katha Protocol
        </div>
        <h1 className="text-3xl md:text-5xl font-black mb-3 tracking-tighter leading-tight">
          A vault for your <span className="text-blue-600 italic px-1">entire digital legacy.</span>
        </h1>
        <p className="text-slate-500 text-xs md:text-sm max-w-xl mx-auto font-medium leading-relaxed">
          Advanced encryption meets refined AI. A multi-layered system designed to ensure your assets survive the test of time.
        </p>
      </header>

      {/* TIGHT 4-STEP GRID */}
      <section className="max-w-5xl mx-auto px-6 py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { step: "1", title: "Secure", desc: "AES-256 encryption for photos and keys.", active: false },
            { step: "2", title: "Curate", desc: "AI-structured Life Timelines.", active: false },
            { step: "3", title: "Preserve", desc: "Metallic-grade long-term storage.", active: false },
            { step: "4", title: "Deliver", desc: "Nominee release on your terms.", active: true },
          ].map((item, i) => (
            <div key={i} className={`p-4 rounded-xl border transition-all duration-300 ${item.active ? 'bg-blue-600 border-blue-500 text-white shadow-md scale-[1.01]' : 'bg-slate-50 border-slate-100'}`}>
              <div className={`w-5 h-5 rounded flex items-center justify-center mb-2 text-[9px] font-black ${item.active ? 'bg-white text-blue-600' : 'bg-slate-900 text-white'}`}>
                {item.step}
              </div>
              <h3 className="font-bold text-[10px] uppercase tracking-wider mb-1">{item.title}</h3>
              <p className={`text-[10px] leading-tight font-medium ${item.active ? 'text-blue-100' : 'text-slate-400'}`}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* INTEGRATED SECURITY & NOMINEE MODULE */}
      <section className="max-w-5xl mx-auto px-6 py-6">
        <div className="grid md:grid-cols-2 gap-4 items-stretch">
          <div className="space-y-3 py-2">
            <span className="text-blue-600 font-black text-[8px] uppercase tracking-widest">Infrastructure</span>
            <h2 className="text-xl font-black tracking-tight">Advanced Protection</h2>
            <div className="grid gap-2">
              <div className="flex gap-3 p-2 rounded-lg bg-slate-50 border border-slate-100">
                <Shield size={14} className="text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-[11px]">Client-Side Encryption</h4>
                  <p className="text-[10px] text-slate-500">We never see your private keys.</p>
                </div>
              </div>
              <div className="flex gap-3 p-2 rounded-lg bg-slate-50 border border-slate-100">
                <Cpu size={14} className="text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-[11px]">Decentralized Storage</h4>
                  <p className="text-[10px] text-slate-500">Fragmented data for total safety.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-900 rounded-3xl p-5 text-white relative overflow-hidden flex flex-col justify-center">
            <div className="relative z-10 space-y-3">
              <div className="flex items-center gap-2">
                <UserCheck size={12} className="text-blue-400"/>
                <h3 className="text-[9px] font-black uppercase tracking-widest">Nominee Protocol</h3>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed font-medium">
                Set triggers for secure asset release to your digital heirs.
              </p>
              <div className="bg-white/5 border border-white/10 rounded-lg p-3 overflow-hidden">
                 <div className="flex justify-between text-[7px] font-black text-blue-400 mb-1 tracking-widest uppercase">
                   <span>Vault: Secure</span>
                   <span>Status: Active</span>
                 </div>
                 <div className="w-full bg-white/10 h-1 rounded-full relative overflow-hidden">
                    <div className="absolute top-0 bottom-0 bg-blue-500 w-1/3 rounded-full animate-scan"></div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SLEEK AI MODULE */}
      <section className="max-w-5xl mx-auto px-6 py-4">
        <div className="bg-slate-900 rounded-3xl p-6 md:p-8 overflow-hidden relative border border-slate-800">
          <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[8px] font-black uppercase rounded-full tracking-widest">
                <Sparkles size={10} className="animate-spin-slow" /> AI Biographer
              </div>
              <h2 className="text-2xl font-black text-white tracking-tighter">Your <span className="text-blue-400 italic">Digital Immortality.</span></h2>
              <div className="space-y-2">
                <div className="flex gap-3 items-center p-2 rounded-lg bg-white/5 border border-white/5">
                  <Brain className="text-blue-400 shrink-0" size={14} />
                  <p className="text-[10px] text-slate-300 font-medium">Automated "Life Timeline" curation.</p>
                </div>
                <div className="flex gap-3 items-center p-2 rounded-lg bg-white/5 border border-white/5">
                  <Clock className="text-blue-400 shrink-0" size={14} />
                  <p className="text-[10px] text-slate-300 font-medium">Schedule video messages for future milestones.</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center relative">
              {/* Circular Animation Container */}
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border border-white/5 flex items-center justify-center relative animate-spin-slow">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-sm"></div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-400 rounded-sm"></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-700 rounded-sm"></div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-900 rounded-sm"></div>
                
                {/* Central Brain with Reverse Rotation to stay upright */}
                <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-600 rounded-full flex items-center justify-center border-4 border-slate-900 shadow-2xl relative z-10 animate-reverse-spin">
                  <Brain size={20} className="text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL COMPACT CTA */}
      <footer className="max-w-xl mx-auto px-6 py-8 text-center space-y-4">
        <p className="text-[11px] font-bold text-slate-400 italic">"The library of a life should never be erased."</p>
        <Link href="/pricing" className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-full font-bold text-[10px] hover:bg-blue-600 transition-all shadow-lg active:scale-95 group">
          Start Your Legacy Plan <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </footer>
    </div>
  );
}