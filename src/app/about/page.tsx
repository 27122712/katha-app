'use client';

import React from 'react';
import { Terminal, Wrench, Heart, Globe, Cpu, Shield, Mail, ArrowRight, Sparkles } from 'lucide-react'; 

export default function About() {
  return (
    <div className="bg-white text-slate-900 w-full min-h-screen selection:bg-blue-100 pb-16 pt-6 font-sans antialiased">
      
      {/* COMPACT HERO SECTION */}
      <section className="max-w-4xl mx-auto px-6 pt-12 md:pt-16 pb-10 text-center animate-in fade-in duration-700">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 text-[9px] font-black uppercase rounded-full tracking-widest mb-6 border border-blue-100">
          <Sparkles size={10} /> Established 2026
        </div>
        <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tighter leading-tight text-slate-900">
          Preserving <span className="text-blue-600 italic">Human Connection.</span>
        </h1>
        <p className="text-sm md:text-base text-slate-500 max-w-xl mx-auto font-medium leading-relaxed">
          Katha was founded to ensure no story is silenced by time. 
          We bridge the gap between digital assets and human legacy, ensuring wisdom outlives hardware.
        </p>
      </section>

      {/* TIGHT MISSION GRID */}
      <section className="max-w-5xl mx-auto px-6 py-6 grid md:grid-cols-3 gap-4">
        {[
          {
            icon: <Terminal size={18} />,
            title: "Built on Code",
            desc: "Precision architecture ensuring data accessibility across generations and devices."
          },
          {
            icon: <Cpu size={18} />,
            title: "Engineered Safety",
            desc: "Roots in motherboard-level repair allow us to protect against physical cloud vulnerability."
          },
          {
            icon: <Globe size={18} />,
            title: "Born in India",
            desc: "A homegrown solution protecting digital heritage, from family memories to vital credentials."
          }
        ].map((item, i) => (
          <div key={i} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-all duration-300 group">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors border border-slate-50">
              {item.icon}
            </div>
            <h3 className="font-bold text-xs uppercase tracking-wider mb-2">{item.title}</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
              {item.desc}
            </p>
          </div>
        ))}
      </section>

      {/* FOUNDER'S NOTE - Refined as a sleek dark module */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 md:p-14 relative overflow-hidden shadow-2xl border border-slate-800">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <Shield size={180} />
          </div>
          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-2 mb-6">
                <Wrench className="text-blue-500" size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Founder's Vision</span>
            </div>
            <div className="space-y-6 text-slate-300 text-base md:text-lg leading-relaxed italic font-medium">
              <p>
                "I saw first-hand how easily a lifetime of memories could vanish because of 
                a single locked device or a forgotten password."
              </p>
              <p>
                Katha is the answer. We don't just store files; we build the technical 
                infrastructure for emotional legacy.
              </p>
              <div className="pt-4 not-italic flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-xs">K</div>
                <div>
                    <p className="font-black text-white uppercase tracking-widest text-[10px]">Team Katha</p>
                    <p className="text-blue-400 text-[9px] font-bold uppercase tracking-tighter">Lead Engineers & Visionaries</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT & VALUES - Compact Footer */}
      <section className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-blue-50/50 rounded-[2rem] p-10 border border-blue-100/50 text-center">
            <h3 className="text-xl font-black uppercase tracking-tight mb-2">System Support</h3>
            <p className="text-xs text-slate-500 mb-6 font-medium">Available 24/7 for digital heritage inquiries.</p>
            <a 
              href="mailto:kathasystems@gmail.com" 
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg active:scale-95 group"
            >
              <Mail size={14} /> kathasystems@gmail.com
            </a>
        </div>

        <div className="flex justify-center gap-6 md:gap-12 mt-12 opacity-30">
          {[
            { icon: <Shield size={12} />, label: "Privacy First" },
            { icon: <Wrench size={12} />, label: "Excellence" },
            { icon: <Heart size={12} />, label: "Human Centered" }
          ].map((v, i) => (
            <div key={i} className="flex items-center gap-1.5 font-black text-[8px] uppercase tracking-[0.2em]">
              {v.icon} {v.label}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}