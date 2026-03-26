'use client';

import React, { useState, useEffect } from 'react';
import { Check, ShieldCheck, Crown, Loader2, Lock, X } from 'lucide-react';
import Link from 'next/link';
import { checkPremiumStatus, upgradeToPremium, loginUser } from '../actions'; 

export default function Pricing() {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  
  // VERIFICATION STATES
  const [showVerify, setShowVerify] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState('');
  const [verifyPass, setVerifyPass] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      const savedSession = localStorage.getItem('katha_session');
      if (savedSession) {
        const user = JSON.parse(savedSession);
        const res = await checkPremiumStatus(user.email);
        if (res.success) setIsPremium(res.isPremium ?? false);
      }
      setLoading(false);
    };
    checkStatus();
  }, []);

  // STEP 1: VALIDATE USER CREDENTIALS
  const handleStartVerification = () => {
    const savedSession = localStorage.getItem('katha_session');
    if (!savedSession) {
      alert("Please login first to upgrade your legacy.");
      window.location.href = '/login';
      return;
    }
    setShowVerify(true);
  };

  // STEP 2: CHECK DB AND TRIGGER RAZORPAY
  const handleVerifyAndPay = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);

    const formData = new FormData();
    formData.append('email', verifyEmail);
    formData.append('password', verifyPass);

    const authRes = await loginUser(formData);

    if (authRes.success) {
      setShowVerify(false);
      triggerRazorpay(authRes.user);
    } else {
      alert("Invalid credentials. Please enter your correct Gmail and Password.");
    }
    setIsVerifying(false);
  };

  const triggerRazorpay = (user: any) => {
    if (!(window as any).Razorpay) {
      alert("Razorpay SDK is still loading.");
      return;
    }

    const options = {
      key: "rzp_test_XXXXXXXXXXXXXX", // YOUR KEY
      amount: 2900, 
      currency: "INR",
      name: "KATHA",
      description: "Lifetime Digital Legacy Access",
      handler: async function (response: any) {
        setProcessing(true);
        const updateRes = await upgradeToPremium(user.email);
        if (updateRes.success) {
          setIsPremium(true);
          alert("Payment Successful! Your Digital Soul is now Premium.");
        } else {
          alert("Payment received, but failed to update status.");
        }
        setProcessing(false);
      },
      prefill: { name: user.name, email: user.email },
      theme: { color: "#2563eb" },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-400">Syncing Plans...</p>
      </div>
    );
  }

  return (
    <div className="bg-white text-slate-900 w-full min-h-screen selection:bg-blue-100 pb-16 pt-24 relative">
      
      {/* VERIFICATION MODAL */}
      {showVerify && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowVerify(false)}></div>
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 relative z-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <button onClick={() => setShowVerify(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"><X size={20}/></button>
            
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Lock size={20}/>
              </div>
              <h3 className="text-xl font-bold">Security Check</h3>
              <p className="text-xs text-slate-500 mt-1">Re-verify your credentials to proceed with the payment.</p>
            </div>

            <form onSubmit={handleVerifyAndPay} className="space-y-4">
              <input 
                type="email" required placeholder="Gmail Address" 
                className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={verifyEmail} onChange={(e) => setVerifyEmail(e.target.value)}
              />
              <input 
                type="password" required placeholder="Password" 
                className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={verifyPass} onChange={(e) => setVerifyPass(e.target.value)}
              />
              <button 
                type="submit" disabled={isVerifying}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-blue-700 transition disabled:opacity-50"
              >
                {isVerifying ? 'Verifying...' : 'Verify & Pay ₹29'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* PRICING UI */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Your <span className="text-blue-600">Digital Legacy</span></h1>
        <p className="text-slate-500 font-bold tracking-widest uppercase text-[10px]">One small step for you, a giant leap for your story</p>
      </div>

      <div className="max-w-md mx-auto px-6">
        <div className={`border-2 p-8 rounded-[3rem] relative overflow-hidden transition-all duration-500 ${isPremium ? 'border-green-500 bg-green-50/30' : 'border-blue-600 shadow-2xl shadow-blue-100 bg-blue-50/20 ring-4 ring-blue-600/5'}`}>
          <div className={`absolute top-6 right-[-35px] text-white text-[8px] font-black px-10 py-1 rotate-45 shadow-sm ${isPremium ? 'bg-green-500' : 'bg-blue-600'}`}>{isPremium ? 'ACTIVE' : 'BEST VALUE'}</div>
          
          <div className="flex items-center gap-3 mb-4">
             {isPremium ? <Crown className="text-green-600" size={24}/> : <ShieldCheck className="text-blue-600" size={24}/>}
             <h3 className={`font-bold text-xl ${isPremium ? 'text-green-700' : 'text-blue-600'}`}>Katha Premium</h3>
          </div>

          <div className="text-4xl font-black mb-6">₹29 <span className="text-sm font-normal text-slate-400">/ one-time</span></div>
          
          <ul className="space-y-4 mb-10 text-sm">
            <li className="flex items-center gap-3 font-bold text-slate-900"><Check size={18} className="text-blue-600"/> AI Biographer (Voice & Story)</li>
            <li className="flex items-center gap-3 font-bold text-slate-900"><Check size={18} className="text-blue-600"/> Time Capsule (Future Messages)</li>
            <li className="flex items-center gap-3 text-slate-700"><Check size={18} className="text-blue-600"/> High-Resolution Photo Backup</li>
            <li className="flex items-center gap-3 text-slate-700"><Check size={18} className="text-blue-600"/> 24/7 Priority Legacy Support</li>
          </ul>
          
          {isPremium ? (
            <div className="w-full py-4 rounded-2xl bg-green-500 text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-green-100 cursor-default">
              <ShieldCheck size={16}/> You already have Premium
            </div>
          ) : (
            <button 
              onClick={handleStartVerification}
              disabled={processing}
              className="w-full py-4 rounded-2xl bg-blue-600 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 transition active:scale-95 disabled:opacity-50"
            >
              {processing ? 'Upgrading...' : 'Unlock Premium'}
            </button>
          )}
        </div>
      </div>

      <p className="text-center mt-12 text-slate-400 text-[10px] font-medium tracking-wide">Secure Payments via Razorpay • 256-bit Encryption</p>
    </div>
  );
}