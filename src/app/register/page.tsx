'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // For redirecting after success
import { registerUser } from '../actions';
import { User, Mail, Lock, Sparkles, Quote, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMsg({ type: '', text: '' });

    const formData = new FormData(event.currentTarget);
    const result = await registerUser(formData);

    if (result.success) {
      setMsg({ type: 'success', text: 'Legacy Seeded! Redirecting to login...' });
      // Clear form and redirect after a short delay
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } else {
      setMsg({ type: 'error', text: result.error || 'Registration failed' });
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 py-20">
      <div className="max-w-xl w-full bg-white rounded-[2.5rem] shadow-xl p-10 border border-slate-100">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Create Account</h1>
        <p className="text-slate-500 text-sm mb-8">Start securing your digital heritage today.</p>

        <form onSubmit={onFormSubmit} className="space-y-6">
          {/* --- BASIC INFO --- */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <User className="absolute left-4 top-4 text-slate-400" size={18} />
              <input name="name" type="text" placeholder="Full Name" required className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition" />
            </div>
            <div className="relative">
              <Mail className="absolute left-4 top-4 text-slate-400" size={18} />
              <input name="email" type="email" placeholder="Email Address" required className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition" />
            </div>
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-4 text-slate-400" size={18} />
            <input name="password" type="password" placeholder="Create Password" required className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition" />
          </div>

          {/* --- SOUL SEEDING SECTION --- */}
          <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100 space-y-4">
             <div className="flex items-center gap-2 mb-2">
                <Sparkles className="text-blue-600" size={20} />
                <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider">Soul Seeding</h3>
             </div>
             
             <div className="space-y-3">
               <p className="text-[11px] text-blue-600 font-bold uppercase tracking-widest">Your Personality</p>
               <textarea 
                 name="traits" 
                 required
                 placeholder="How would your loved ones describe you?" 
                 className="w-full p-4 bg-white border border-blue-100 rounded-2xl outline-none text-sm min-h-[100px] focus:ring-2 focus:ring-blue-500 transition"
               />
             </div>

             <div className="space-y-3">
               <p className="text-[11px] text-blue-600 font-bold uppercase tracking-widest">Your Life Philosophy</p>
               <div className="relative">
                 <Quote className="absolute left-4 top-4 text-blue-300" size={18} />
                 <textarea 
                   name="philosophy" 
                   required
                   placeholder="What advice should your legacy carry forward?" 
                   className="w-full pl-12 pr-4 py-4 bg-white border border-blue-100 rounded-2xl outline-none text-sm min-h-[100px] focus:ring-2 focus:ring-blue-500 transition"
                 />
               </div>
             </div>
          </div>
          
          {msg.text && (
            <div className={`p-4 rounded-xl text-center text-xs font-bold ${msg.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
              {msg.text}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold hover:bg-slate-800 transition shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {loading && <Loader2 className="animate-spin" size={20} />}
            {loading ? 'Seeding Legacy...' : 'Register & Seed My Legacy'}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-slate-500">
          Already have an account? <Link href="/login" className="text-blue-600 font-bold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}