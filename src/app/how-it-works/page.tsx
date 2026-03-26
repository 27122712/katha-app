import React from 'react';
import { 
  Lock, Cpu, ShieldCheck, Zap, 
  UserCheck, Calendar, Sparkles, Brain, Clock, Shield
} from 'lucide-react';
import Link from 'next/link';

export default function HowItWorks() {
  return (
    <div className="bg-white text-slate-900 w-full min-h-screen selection:bg-blue-100 pb-20">
      
      {/* HERO SECTION */}
      <div className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight leading-tight text-slate-900">
          A vault for your <span className="text-blue-600 italic">entire digital legacy.</span>
        </h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          We combine metallic-grade security with advanced AI. 
          Your memories and assets are protected by industry-leading encryption at every step.
        </p>
      </div>

      {/* THE 4-STEP JOURNEY */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-4">
          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 relative group">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center mb-6 shadow-lg shadow-blue-200 font-bold">1</div>
            <h3 className="font-bold text-lg mb-3">Secure</h3>
            <p className="text-sm text-slate-500 leading-relaxed">Your photos, crypto keys, and wisdom are instantly protected with multi-layered encryption.</p>
          </div>
          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 relative group">
            <div className="w-10 h-10 bg-slate-900 text-white rounded-lg flex items-center justify-center mb-6 font-bold">2</div>
            <h3 className="font-bold text-lg mb-3">Curate</h3>
            <p className="text-sm text-slate-500 leading-relaxed">Our AI Biographer organizes your scattered data into a meaningful Life Timeline.</p>
          </div>
          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 relative group">
            <div className="w-10 h-10 bg-slate-900 text-white rounded-lg flex items-center justify-center mb-6 font-bold">3</div>
            <h3 className="font-bold text-lg mb-3">Preserve</h3>
            <p className="text-sm text-slate-500 leading-relaxed">Everything is stored in our 3D metallic-grade vault, engineered for long-term safety.</p>
          </div>
          <div className="p-8 rounded-3xl bg-blue-600 text-white relative group shadow-xl shadow-blue-100">
            <div className="w-10 h-10 bg-white text-blue-600 rounded-lg flex items-center justify-center mb-6 font-bold">4</div>
            <h3 className="font-bold text-lg mb-3">Deliver</h3>
            <p className="text-sm text-blue-100 leading-relaxed">Your messages and assets are released to your nominees exactly when you choose.</p>
          </div>
        </div>
      </section>

      {/* SECURITY FOCUS SECTION */}
      <section className="max-w-5xl mx-auto px-6 py-24 border-t border-slate-50 mt-12">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 text-left">
            <div className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase rounded-full">Security Infrastructure</div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Advanced Legacy Protection</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="text-blue-600 mt-1"><Shield size={20}/></div>
                <div>
                  <h4 className="font-bold text-slate-900">Encrypted Storage</h4>
                  <p className="text-sm text-slate-500">All data and passwords are stored using high-grade encryption standards, ensuring your information is safe from unauthorized access.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-blue-600 mt-1"><Cpu size={20}/></div>
                <div>
                  <h4 className="font-bold text-slate-900">Secure Cloud Vault</h4>
                  <p className="text-sm text-slate-500">We use robust cloud security protocols to ensure your 3D vault remains protected and available across decades.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10"><ShieldCheck size={120}/></div>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <UserCheck className="text-blue-400" size={20}/> The Nominee Protocol
            </h3>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
              Katha ensures a seamless transition of your legacy. You set the triggers—whether inactivity or legal verification—and we handle the secure release.
            </p>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
               <div className="flex justify-between text-[10px] font-mono text-blue-400 mb-2 font-bold">
                 <span>VAULT STATUS: SECURE</span>
                 <span>ENCRYPTION: ACTIVE</span>
               </div>
               <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="w-full bg-blue-500 h-full"></div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI INTEGRATION SECTION */}
      <section className="max-w-6xl mx-auto px-6 py-24 bg-slate-900 rounded-[3rem] my-20 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full"></div>
        <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6 text-left px-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase rounded-full tracking-widest">
              <Sparkles size={12} /> Premium AI Integration
            </div>
            <h2 className="text-4xl font-extrabold text-white tracking-tight leading-tight">
              Your <span className="text-blue-400 font-black italic">AI Biographer.</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              Activate your AI Biographer to curate a lifetime of photos into a meaningful story. 
              We preserve your voice and your history for the next generation.
            </p>
            <div className="pt-6 space-y-4">
              <div className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                <Brain className="text-blue-400 shrink-0" size={24} />
                <div>
                  <h4 className="font-bold text-white text-sm">Automated Storytelling</h4>
                  <p className="text-xs text-slate-500 mt-1">Intelligently organizes scattered photos into a glowing "Life Timeline."</p>
                </div>
              </div>
              <div className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                <Clock className="text-blue-400 shrink-0" size={24} />
                <div>
                  <h4 className="font-bold text-white text-sm">Message the Future</h4>
                  <p className="text-xs text-slate-500 mt-1">Schedule video messages for future milestones. Your love, delivered when it matters most.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative flex justify-center">
            <div className="w-full aspect-square max-w-[350px] bg-gradient-to-br from-blue-600/20 to-slate-800 rounded-full border border-white/10 flex items-center justify-center relative shadow-2xl">
              <div className="w-48 h-48 bg-blue-500/20 rounded-full animate-pulse blur-2xl absolute"></div>
              <div className="relative z-10 text-center space-y-4">
                <div className="w-28 h-28 mx-auto bg-blue-600 rounded-full flex items-center justify-center border-4 border-slate-900 shadow-xl">
                  <Brain size={48} className="text-white" />
                </div>
                <div className="bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 inline-block">
                  <span className="text-[10px] font-mono text-blue-400 tracking-tighter uppercase font-bold">AI SYSTEM: ACTIVE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-2xl font-bold mb-6 italic text-slate-400">"Don't leave your story to chance."</h2>
        <Link href="/pricing" className="inline-block bg-slate-900 text-white px-10 py-4 rounded-full font-bold hover:scale-105 transition shadow-xl">
          Start Your Legacy Plan
        </Link>
      </div>
    </div>
  );
}