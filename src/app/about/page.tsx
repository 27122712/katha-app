'use client';

import React from 'react';
import { Terminal, Wrench, Heart, Globe, Cpu, Shield, Mail, ArrowRight } from 'lucide-react'; 

export default function About() {
  return (
    <div className="bg-white text-slate-900 w-full min-h-screen selection:bg-blue-100 pb-20">
      
      {/* HERO SECTION */}
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-16 text-center animate-in fade-in duration-700">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase rounded-full tracking-widest mb-6">
          Established 2026
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight text-slate-900 leading-tight">
          Preserving <span className="text-blue-600">Human Connection</span>
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
          Katha was founded to ensure that no story is ever silenced by technology. 
          We bridge the gap between digital assets and human legacy, ensuring your wisdom outlives the hardware it's stored on.
        </p>
      </section>

      {/* THE MISSION CARDS */}
      <section className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-8">
        <div className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:shadow-xl hover:shadow-slate-100 transition-all duration-500 group">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <Terminal size={24} />
          </div>
          <h3 className="font-bold text-lg mb-3">Built on Code</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Crafted with precision using modern web architecture to ensure 
            your data remains accessible across generations and devices.
          </p>
        </div>

        <div className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:shadow-xl hover:shadow-slate-100 transition-all duration-500 group">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <Cpu size={24} />
          </div>
          <h3 className="font-bold text-lg mb-3">Engineered for Safety</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            With roots in motherboard-level electronics repair, we understand 
            the physical vulnerability of the "cloud" and build to protect it.
          </p>
        </div>

        <div className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:shadow-xl hover:shadow-slate-100 transition-all duration-500 group">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <Globe size={24} />
          </div>
          <h3 className="font-bold text-lg mb-3">Born in India</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            A homegrown solution designed to protect the digital heritage of 
            millions, from family memories to vital digital credentials.
          </p>
        </div>
      </section>

      {/* FOUNDER'S NOTE */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="bg-slate-900 text-white rounded-[3.5rem] p-10 md:p-20 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
            <Heart size={200} />
          </div>
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl font-bold mb-10 flex items-center gap-3">
              <Wrench className="text-blue-500" /> A Note from the Founder
            </h2>
            <div className="space-y-8 text-slate-300 text-xl leading-relaxed italic">
              <p>
                "I've spent years fixing broken motherboards and writing code. 
                I saw first-hand how easily a lifetime of memories could vanish because of 
                a single locked device or a forgotten password."
              </p>
              <p>
                Katha is my answer to that problem. We are building a bridge between 
                technical security and emotional legacy. We don't just store files; 
                we ensure your presence is felt when it matters most.
              </p>
              <div className="pt-6 not-italic">
                <p className="font-black text-white uppercase tracking-widest text-sm">— Team Katha</p>
                <p className="text-blue-400 text-xs font-bold mt-1">Lead Engineers & Visionaries</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT & VALUES */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-blue-50 rounded-[2.5rem] p-12 border border-blue-100 text-center">
            <h3 className="text-2xl font-bold mb-4">Have questions?</h3>
            <p className="text-slate-500 mb-8">We're here to help you secure your digital heritage.</p>
            <a 
              href="mailto:kathasystems@gmail.com" 
              className="inline-flex items-center gap-3 bg-white border border-blue-100 px-8 py-4 rounded-2xl font-bold text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
            >
              <Mail size={20} /> kathasystems@gmail.com
            </a>
        </div>

        <div className="flex justify-center gap-8 md:gap-16 mt-20 opacity-40">
          <div className="flex items-center gap-2 font-black text-[10px] uppercase tracking-[0.2em]">
            <Shield size={14} /> Privacy First
          </div>
          <div className="flex items-center gap-2 font-black text-[10px] uppercase tracking-[0.2em]">
            <Wrench size={14} /> Excellence
          </div>
          <div className="flex items-center gap-2 font-black text-[10px] uppercase tracking-[0.2em]">
            <Heart size={14} /> Human Centered
          </div>
        </div>
      </section>
    </div>
  );
}