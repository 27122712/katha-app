"use client";

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { Check, ShieldCheck, Crown, Loader2, Lock, X, ArrowRight, Shield, Zap, MessageSquare, HardDrive, AlertCircle } from 'lucide-react';
import Script from 'next/script';
import { checkPremiumStatus, upgradeToPremium, loginUser } from '../actions'; 

export default function Pricing() {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState('');
  const [verifyPass, setVerifyPass] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  
  // TOAST STATE
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });

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

  // CUSTOM TOAST TRIGGER
  const triggerToast = (msg: string) => {
    setToast({ message: msg, visible: true });
    setTimeout(() => setToast({ message: '', visible: false }), 4000);
  };

  const handleStartVerification = () => {
    const savedSession = localStorage.getItem('katha_session');
    if (!savedSession) {
      triggerToast("Please login first to authorize vault upgrades.");
      return;
    }
    setShowVerify(true);
  };

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
      triggerToast("Verification failed. Incorrect credentials.");
    }
    setIsVerifying(false);
  };

  const triggerRazorpay = (user: any) => {
    if (!(window as any).Razorpay) return;
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: 2900, 
      currency: "INR",
      name: "KATHA",
      description: "Premium Legacy Access",
      handler: async function (response: any) {
        setProcessing(true);
        const updateRes = await upgradeToPremium(user.email);
        if (updateRes.success) {
          setIsPremium(true);
          triggerToast("Vault Upgrade Successful.");
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
        <Loader2 className="animate-spin text-blue-600 mb-2" size={20} />
        <p className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-300">Syncing Vault</p>
      </div>
    );
  }

  return (
    <div className="bg-white text-slate-900 w-full min-h-screen selection:bg-blue-100 pb-8 pt-6 md:pt-10 font-sans antialiased relative">
      <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" />

      {/* CUSTOM ANIMATED TOASTER */}
      <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[200] transition-all duration-500 ease-out ${toast.visible ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0 pointer-events-none'}`}>
        <div className="bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-3 min-w-[280px]">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <AlertCircle size={14} className="text-white"/>
          </div>
          <p className="text-[10px] font-bold tracking-wide">{toast.message}</p>
          <button onClick={() => setToast({ ...toast, visible: false })} className="ml-auto text-slate-500 hover:text-white">
            <X size={14}/>
          </button>
        </div>
      </div>

      {/* VERIFICATION MODAL */}
      {showVerify && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setShowVerify(false)}></div>
          <div className="bg-white w-full max-w-[300px] rounded-[2rem] p-6 relative z-10 shadow-2xl border border-slate-100">
            <button onClick={() => setShowVerify(false)} className="absolute top-4 right-4 text-slate-300 hover:text-slate-900"><X size={16}/></button>
            <div className="text-center mb-4">
              <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-2"><Lock size={16}/></div>
              <h3 className="text-[11px] font-black tracking-widest uppercase">Security Auth</h3>
            </div>
            <form onSubmit={handleVerifyAndPay} className="space-y-2.5">
              <input type="email" required placeholder="Gmail" className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl text-[10px] focus:ring-1 focus:ring-blue-600/20" value={verifyEmail} onChange={(e) => setVerifyEmail(e.target.value)}/>
              <input type="password" required placeholder="Password" className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl text-[10px] focus:ring-1 focus:ring-blue-600/20" value={verifyPass} onChange={(e) => setVerifyPass(e.target.value)}/>
              <button type="submit" disabled={isVerifying} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-[9px] uppercase tracking-widest shadow-md active:scale-95 transition-all">{isVerifying ? 'Verifying...' : 'Verify & Pay ₹29'}</button>
            </form>
          </div>
        </div>
      )}

      {/* COMPACT HEADER */}
      <header className="max-w-4xl mx-auto px-6 text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 text-[8px] font-black uppercase rounded-full tracking-widest mb-2 border border-blue-100">
          <Shield size={10} /> Metallic-Grade Security Protocol
        </div>
        <h1 className="text-2xl md:text-4xl font-black mb-1 tracking-tighter leading-tight">
          Choose Your <span className="text-blue-600 italic">Timeline.</span>
        </h1>
        <p className="text-slate-400 font-bold tracking-[0.1em] uppercase text-[7px] md:text-[8px]">Select the depth of your digital preservation</p>
      </header>

      {/* TWO-COLUMN LAYOUT */}
      <div className="max-w-4xl mx-auto px-6 grid md:grid-cols-2 gap-4 items-start">
        {/* FREE VERSION */}
        <div className="bg-slate-50/50 rounded-[1.5rem] p-6 border border-slate-100 h-full flex flex-col">
          <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-3">Baseline Access</div>
          <h3 className="text-lg font-black mb-3 uppercase">Katha Free</h3>
          <ul className="space-y-2 mb-6 flex-grow">
            <li className="flex items-center gap-2 text-[10px] font-bold text-slate-700">
              <MessageSquare size={10} className="text-blue-500"/> 2 AI Chats Free
            </li>
            <li className="flex items-center gap-2 text-[10px] font-bold text-slate-700">
              <HardDrive size={10} className="text-blue-500"/> Secure File Storage
            </li>
            {['Manual Timeline Control', 'Standard Encryption'].map((f, i) => (
              <li key={i} className="flex items-center gap-2 text-[10px] font-semibold text-slate-400">
                <Check size={10} className="text-slate-200"/> {f}
              </li>
            ))}
          </ul>
          <div className="py-2 text-center bg-white/50 border border-slate-100 rounded-xl text-[8px] font-black uppercase tracking-widest text-slate-400">
            Currently Enrolled
          </div>
        </div>

        {/* PREMIUM VERSION */}
        <div className={`rounded-[1.5rem] p-6 relative overflow-hidden transition-all duration-500 border-2 ${isPremium ? 'border-green-500 bg-green-50/10' : 'border-blue-600 bg-white shadow-xl shadow-blue-50'}`}>
          <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-[7px] font-black tracking-widest text-white ${isPremium ? 'bg-green-500' : 'bg-blue-600'}`}>
            {isPremium ? 'ACTIVE' : 'BEST VALUE'}
          </div>
          <div className="flex items-center gap-2 mb-3">
             <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isPremium ? 'bg-green-100 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                {isPremium ? <Crown size={14}/> : <Zap size={14}/>}
             </div>
             <h3 className="font-black text-xs uppercase tracking-wider">Premium Soul</h3>
          </div>
          <div className="flex items-baseline gap-1 mb-4 border-b border-slate-50 pb-3">
            <span className="text-3xl font-black tracking-tighter">₹29</span>
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">/ Month</span>
          </div>
          <ul className="space-y-2 mb-6">
            <li className="flex items-center gap-2 text-[10px] font-bold text-slate-900">
              <Check size={10} className="text-blue-600 stroke-[3]"/> Unlimited AI Chats (Self & Files)
            </li>
            <li className="flex items-center gap-2 text-[10px] font-bold text-slate-900">
              <Check size={10} className="text-blue-600 stroke-[3]"/> Unlimited File Uploads
            </li>
            {["Scheduled Legacy Delivery", "Priority Nominee Handover"].map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-[10px] font-bold text-slate-700">
                <Check size={10} className="text-blue-600 stroke-[3]"/> {feature}
              </li>
            ))}
          </ul>
          {isPremium ? (
            <div className="w-full py-3 rounded-xl bg-green-50 text-green-600 font-black text-[8px] uppercase tracking-widest flex items-center justify-center gap-2 border border-green-100">
              <ShieldCheck size={12}/> Active Legacy
            </div>
          ) : (
            <button onClick={handleStartVerification} disabled={processing} className="w-full py-3 rounded-xl bg-slate-900 text-white font-black text-[8px] uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-2 group">
              {processing ? <Loader2 size={12} className="animate-spin"/> : 'Initialize Upgrade'}
              {!processing && <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform"/>}
            </button>
          )}
        </div>
      </div>

      <footer className="max-w-xl mx-auto px-6 mt-8 text-center">
        <p className="text-[7px] font-bold text-slate-300 uppercase tracking-[0.2em] flex items-center justify-center gap-2">
          <Shield size={10}/> Zero-Knowledge Architecture • Secured via Razorpay
        </p>
      </footer>
    </div>
  );
}