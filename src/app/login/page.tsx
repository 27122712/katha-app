'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { loginUser } from '../actions';
import { Lock, Mail, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [error, setError] = useState('');

  async function handleSubmit(formData: FormData) {
    const result = await loginUser(formData);
    
    if (result?.success) {
      // CRITICAL CHANGE: Pass the data in the URL
      // result.user.email and result.user.name come from your 'loginUser' action
      const targetUrl = `/?email=${encodeURIComponent(result.user.email)}&name=${encodeURIComponent(result.user.name)}`;
      window.location.href = targetUrl; 
    } else {
      setError(result?.error || 'Login failed');
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl p-10 border border-slate-100">
        <div className="text-center mb-8">
          <div className="text-2xl font-black text-blue-600 mb-2">KATHA</div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
          <p className="text-slate-500 text-sm">Log in to access your digital vault</p>
        </div>

        <form action={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-4 text-slate-400" size={18} />
            <input name="email" type="email" placeholder="Email Address" required className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none" />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-4 text-slate-400" size={18} />
            <input name="password" type="password" placeholder="Password" required className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none" />
          </div>
          
          {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}

          <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-200">
            Login <ArrowRight size={18} />
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-slate-500">
          Don't have an account? <Link href="/register" className="text-blue-600 font-bold hover:underline">Register now</Link>
        </p>
      </div>
    </div>
  );
}