'use client';
export const dynamic = 'force-dynamic';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Play, ArrowRight, Lock, 
  Sparkles, Database, Upload, Shield, Clock, MessageSquare, ShieldCheck, BrainCircuit, LogOut, FileText, Eye, Download
} from 'lucide-react';
import { uploadToVault, getUserVault } from './actions'; 
import LegacyChat from '@/components/LegacyChat';
import MindSeeder from '@/components/VoiceEnrollment'; 

function HomeContent() {
  const [user, setUser] = useState<{name: string, email: string} | null>(null);
  const [files, setFiles] = useState<any[]>([]);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const searchParams = useSearchParams();
  const [isMuted, setIsMuted] = useState(true);

  // 1. SESSION & DATA SYNC
  const loadVault = async (email: string) => {
    const res = await getUserVault(email);
    if (res.success) {
      setFiles(res.files);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('katha_session');
    localStorage.removeItem('katha_user');
    setUser(null);
    window.location.href = '/'; 
  };

  useEffect(() => {
    const emailFromUrl = searchParams.get('email');
    const nameFromUrl = searchParams.get('name');

    if (emailFromUrl && nameFromUrl) {
      const newUser = { 
        name: decodeURIComponent(nameFromUrl), 
        email: decodeURIComponent(emailFromUrl) 
      };
      setUser(newUser);
      localStorage.setItem('katha_session', JSON.stringify(newUser));
      loadVault(newUser.email);
      
      const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
      window.history.pushState({ path: newUrl }, '', newUrl);
    } else {
      const savedSession = localStorage.getItem('katha_session');
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        setUser(parsed);
        loadVault(parsed.email);
      }
    }
  }, [searchParams]);

  // 2. UPLOAD HANDLER
  async function handleUpload(formData: FormData) {
    if (!user) {
      alert("Session expired. Please login again.");
      return;
    }
    setIsUploading(true);
    setUploadStatus('Encrypting...');
    try {
      const result = await uploadToVault(formData, user.email); 
      if (result.success) {
        setUploadStatus(`Success: ${result.fileName} vaulted.`);
        loadVault(user.email); 
      } else {
        setUploadStatus('');
        alert(result.error || "Upload failed");
      }
    } catch (err) {
      alert("Connection error. Is the server running?");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <main className="bg-white text-slate-900 w-full min-h-screen selection:bg-blue-100">
      
      {user ? (
        /* --- LOGGED IN: DASHBOARD LAYOUT --- */
        <section className="max-w-7xl mx-auto px-6 py-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex justify-between items-center mb-10">
            <div className="flex gap-4">
              {user.email === 'kathasystems@gmail.com' && (
                <Link href="/admin" className="flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-2 rounded-xl text-blue-600 font-bold text-sm hover:bg-blue-600 hover:text-white transition shadow-sm">
                  <ShieldCheck size={18} /> Admin Control
                </Link>
              )}
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 text-slate-400 hover:text-red-500 font-bold text-sm transition">
              <LogOut size={18} /> Exit Vault
            </button>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden border border-slate-800">
                <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none text-blue-500">
                  <BrainCircuit size={150} />
                </div>
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase rounded-full tracking-widest mb-6">
                    <Lock size={12} /> Digital Mind Active
                  </div>
                  <h2 className="text-2xl font-bold mb-8">Seed your Legacy</h2>
                  <div className="mb-8"><MindSeeder email={user.email} /></div>
                  <form action={handleUpload} className="space-y-6">
                    <div className="border-2 border-dashed border-slate-700 rounded-3xl p-8 text-center hover:border-blue-500 hover:bg-white/[0.02] transition-all group">
                      <input type="file" name="file" id="vault-file" className="hidden" required onChange={(e) => setUploadStatus(e.target.files?.[0]?.name || '')} />
                      <label htmlFor="vault-file" className="cursor-pointer flex flex-col items-center">
                        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition shadow-lg">
                          <Upload size={20} className="text-white" />
                        </div>
                        <p className="font-bold text-sm truncate max-w-[200px]">{uploadStatus ? uploadStatus : "Archive a Memory"}</p>
                        <p className="text-[10px] text-slate-500 mt-1 italic tracking-widest uppercase font-bold">Max 5MB</p>
                      </label>
                    </div>
                    <button type="submit" disabled={isUploading} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-500 transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50">
                      {isUploading ? 'Securing...' : 'Seal to Vault'} <ArrowRight size={18} />
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-8">
              <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm min-h-[300px]">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Archived Memories</h3>
                  <Database size={16} className="text-slate-200" />
                </div>
                {files.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {files.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-blue-200 transition-all">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="p-2 bg-white rounded-xl text-blue-600 shadow-sm flex-shrink-0">
                            <FileText size={18} />
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-sm font-bold text-slate-700 truncate">{file.file_name}</p>
                            <p className="text-[10px] text-slate-400 font-medium italic truncate">
                              {file.ai_summary || "Memory being processed..."}
                            </p>
                          </div>
                        </div>
                        {/* UPDATED ACTION BUTTONS FOR SECURE API */}
                        <div className="flex gap-2">
                          <a 
                            href={`/api/vault/${file.file_name}`} 
                            target="_blank" 
                            className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition"
                          >
                            <Eye size={16} />
                          </a>
                          <a 
                            href={`/api/vault/${file.file_name}?download=true`} 
                            download={file.file_name}
                            className="p-2 hover:bg-green-100 text-green-600 rounded-lg transition"
                          >
                            <Download size={16} />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-slate-300">
                     <Sparkles size={40} className="mb-4 opacity-20" />
                     <p className="text-xs font-bold uppercase tracking-widest italic text-center">Your vault is currently empty.<br/>Upload a file to begin.</p>
                  </div>
                )}
              </div>
              <div className="bg-slate-50 rounded-[3rem] p-8 border border-slate-100 shadow-sm">
                <LegacyChat targetUser={user} />
              </div>
            </div>
          </div>
        </section>
      ) : (
        /* --- LOGGED OUT: HERO SECTION --- */
        <header className="max-w-6xl mx-auto px-6 pt-32 pb-16 text-center animate-in fade-in duration-700">
          
          <div className="space-y-4 mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase rounded-full tracking-widest shadow-inner">
              <Shield size={12}/> metallic-grade memory security
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tighter text-slate-900 max-w-4xl mx-auto">
              Preserve your <span className="text-blue-600 italic">wisdom</span> forever.
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-8 font-medium leading-relaxed">
              Katha is a digital bridge to the future—preserving your thoughts and memories for the generations that follow.
            </p>
          </div>

          <div className="flex justify-center mb-20">
            <Link href="/login" className="bg-slate-900 text-white px-10 py-4 rounded-full font-bold text-sm hover:bg-slate-800 transition-all flex items-center gap-2.5 shadow-2xl shadow-slate-300 transform hover:scale-105 active:scale-95">
              Secure Your Legacy <ArrowRight size={18} />
            </Link>
          </div>
          
          {/* CLEAN CINEMATIC VIDEO */}
          <div className="max-w-4xl mx-auto bg-slate-900 rounded-[3rem] aspect-video flex items-center justify-center border-4 border-slate-100 shadow-3xl relative overflow-hidden group">
            <video 
              autoPlay 
              muted={isMuted} 
              loop 
              playsInline 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            >
              <source src="/img_videos/demo.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className="absolute bottom-8 right-8 z-20 bg-black/20 backdrop-blur-xl border border-white/10 p-3 rounded-full text-white hover:bg-black/40 transition-all active:scale-90 flex items-center gap-2"
            >
              {isMuted ? (
                <>
                  <Clock size={14} className="animate-pulse" /> 
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] pr-1">Enable Sound</span>
                </>
              ) : (
                <>
                  <Sparkles size={14} className="text-blue-400" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] pr-1">Audio Live</span>
                </>
              )}
            </button>

            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
          </div>
        </header>
      )}

      {/* INTERACTIVE AI SECTION */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 shadow-inner">
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-2xl rounded-bl-none shadow-sm max-w-[80%] border border-slate-100">
                  <p className="text-sm text-slate-600 italic">"What was the most important lesson you learned in 2026?"</p>
                </div>
                <div className="bg-blue-600 p-4 rounded-2xl rounded-br-none shadow-sm max-w-[80%] ml-auto text-white">
                  <p className="text-sm">"That year taught me that stories are the only things we truly leave behind..."</p>
                </div>
                <div className="bg-white p-4 rounded-2xl rounded-bl-none shadow-sm max-w-[80%] border border-slate-100 flex items-center gap-2">
                  <Sparkles size={16} className="text-blue-600 animate-pulse" />
                  <p className="text-sm text-slate-400 italic">AI Biographer is typing...</p>
                </div>
              </div>
            </div>
            <div className="absolute -top-6 -right-6 w-20 h-20 bg-blue-100 rounded-full blur-2xl opacity-50"></div>
          </div>
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase rounded-full">
              <MessageSquare size={12} /> Interactive Legacy
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight">Your <span className="text-blue-600">Thought Heirloom.</span></h2>
            <p className="text-slate-500 text-lg leading-relaxed">
              Our AI learns the "Why" behind your choices. By seeding your mind with your philosophy, you ensure your guidance stays accessible forever. Don't just store files—talk to your future.
            </p>
          </div>
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section className="bg-slate-50 py-20 border-y border-slate-100 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 text-red-500 font-bold text-[10px] uppercase tracking-widest mb-4">
            <Lock size={14} /> Access Denied
          </div>
          <h2 className="text-3xl font-bold mb-6 text-slate-900">The End of Erasure</h2>
          <p className="text-xl text-slate-500 italic leading-relaxed">
            "Every person is a library. When they pass, the library burns. Katha is the fireproof vault that preserves your digital heritage."
          </p>
        </div>
      </section>

      {/* SOLUTION SECTION */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white"><Shield size={24} /></div>
            <h2 className="text-3xl font-bold text-slate-900">Secure. Private. Yours.</h2>
            <p className="text-slate-500 leading-relaxed">We protect your legacy with advanced encryption. Your data is stored in a high-security environment designed to last for decades.</p>
            <ul className="space-y-3 text-sm font-bold text-slate-700">
              <li className="flex items-center gap-2"><Lock size={16} className="text-blue-600"/> Multi-layered AES-256 encryption.</li>
              <li className="flex items-center gap-2"><Shield size={16} className="text-blue-600"/> Metallic-grade cloud vault protection.</li>
            </ul>
          </div>
          <div className="bg-blue-50 rounded-[2rem] p-12 flex items-center justify-center border border-blue-100 relative">
             <div className="w-32 h-40 bg-blue-600 rounded-xl shadow-2xl flex items-center justify-center relative z-10"><Lock size={48} className="text-white" /></div>
             <div className="absolute -bottom-4 -right-4 w-32 h-40 bg-blue-400 rounded-xl blur-sm opacity-20"></div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="p-20 text-center text-slate-400 font-mono text-xs uppercase tracking-[0.3em]">Opening Vault...</div>}>
      <HomeContent />
    </Suspense>
  );
}