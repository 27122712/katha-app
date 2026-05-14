"use client";
export const dynamic = "force-dynamic";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Play,
  ArrowRight,
  Lock,
  Sparkles,
  Database,
  Upload,
  Shield,
  Clock,
  MessageSquare,
  ShieldCheck,
  BrainCircuit,
  LogOut,
  FileText,
  Eye,
  Download,
  Activity,
  History
} from "lucide-react";
import { uploadToVault, getUserVault } from "./actions";
import LegacyChat from "@/components/LegacyChat";
import MindSeeder from "@/components/VoiceEnrollment";

function HomeContent() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [files, setFiles] = useState<any[]>([]);
  const [uploadStatus, setUploadStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const searchParams = useSearchParams();
  const [isMuted, setIsMuted] = useState(true);

  const loadVault = async (email: string) => {
    const res = await getUserVault(email);
    if (res.success) setFiles(res.files);
  };

  const handleLogout = () => {
    localStorage.removeItem("katha_session");
    setUser(null);
    window.location.href = "/";
  };

  useEffect(() => {
    const emailFromUrl = searchParams.get("email");
    const nameFromUrl = searchParams.get("name");

    if (emailFromUrl && nameFromUrl) {
      const newUser = { name: decodeURIComponent(nameFromUrl), email: decodeURIComponent(emailFromUrl) };
      setUser(newUser);
      localStorage.setItem("katha_session", JSON.stringify(newUser));
      loadVault(newUser.email);
      window.history.pushState({}, "", window.location.pathname);
    } else {
      const savedSession = localStorage.getItem("katha_session");
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        setUser(parsed);
        loadVault(parsed.email);
      }
    }
  }, [searchParams]);

  async function handleUpload(formData: FormData) {
    if (!user) return alert("Session expired.");
    setIsUploading(true);
    setUploadStatus("Encrypting...");
    try {
      const result = await uploadToVault(formData, user.email);
      if (result.success) {
        setUploadStatus(`Success: ${result.fileName}`);
        loadVault(user.email);
      } else {
        setUploadStatus("");
        alert(result.error || "Upload failed");
      }
    } catch (err) {
      alert("Connection error.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <main className="bg-[#F8FAFC] text-slate-900 w-full min-h-screen selection:bg-blue-100 font-sans">
      {user ? (
        /* --- DASHBOARD VIEW --- */
        <section className="max-w-7xl mx-auto px-6 pt-24 pb-12 animate-in fade-in slide-in-from-bottom-2 duration-1000">
  
  {/* Header Section: Integrated with consistent padding */}
  <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 gap-6 border-b border-slate-100 pb-8">
    <div>
      <div className="flex items-center gap-2 mb-2">
        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Vault Session Active</span>
      </div>
      <h1 className="text-4xl font-black tracking-tight text-slate-900">
        Welcome back, <span className="text-blue-600">{user.name.split(' ')[0]}</span>
      </h1>
      <p className="text-slate-500 text-sm font-medium mt-1">Your digital legacy is synchronized and secure.</p>
    </div>
    
    <div className="flex items-center gap-6 bg-white p-2 px-4 rounded-2xl border border-slate-100 shadow-sm">
      {user.email === "kathasystems@gmail.com" && (
        <Link href="/admin" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-600 hover:text-blue-700 transition">
          <ShieldCheck size={14} /> Admin Panel
        </Link>
      )}
      <div className="w-px h-4 bg-slate-200" />
      <button onClick={handleLogout} className="flex items-center gap-2 text-slate-400 hover:text-red-500 font-bold text-xs uppercase tracking-widest transition">
        <LogOut size={14} /> Exit Vault
      </button>
    </div>
  </div>

          <div className="grid lg:grid-cols-12 gap-10">
            
            {/* Sidebar: Control Center */}
            <div className="lg:col-span-4 space-y-8">
              <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] relative overflow-hidden">
                <div className="absolute -right-10 -top-10 opacity-10 text-blue-400">
                  <BrainCircuit size={200} />
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-8">
                    <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">System Online</span>
                  </div>

                  <h2 className="text-xl font-bold mb-2">Seed Your Mind</h2>
                  <p className="text-slate-400 text-xs mb-6 leading-relaxed">Record your voice to help the AI understand your unique perspective.</p>
                  
                  <MindSeeder email={user.email} />

                  <div className="my-8 border-t border-slate-800" />

                  <form action={handleUpload} className="space-y-4">
                    <label htmlFor="vault-file" className="group cursor-pointer block border-2 border-dashed border-slate-700 rounded-3xl p-6 text-center hover:border-blue-500 hover:bg-blue-500/5 transition-all">
                      <input type="file" name="file" id="vault-file" className="hidden" onChange={(e) => setUploadStatus(e.target.files?.[0]?.name || "")} />
                      <Upload size={24} className="mx-auto mb-3 text-slate-500 group-hover:text-blue-400 group-hover:scale-110 transition" />
                      <p className="text-sm font-bold truncate px-2">{uploadStatus || "Archive a Memory"}</p>
                      <p className="text-[9px] text-slate-500 mt-1 uppercase font-bold tracking-tighter">Document / Image / Audio</p>
                    </label>
                    
                    <button type="submit" disabled={isUploading} className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white py-4 rounded-2xl font-bold transition-all shadow-lg flex items-center justify-center gap-3">
                      {isUploading ? <Activity size={18} className="animate-spin" /> : <Lock size={18} />}
                      {isUploading ? "Encrypting..." : "Seal to Vault"}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Main Content: Memories & Chat */}
            <div className="lg:col-span-8 space-y-10">
              
              {/* Memory List */}
              <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><History size={18}/></div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Vaulted Assets</h3>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full">{files.length} items</span>
                </div>

                {files.length > 0 ? (
                  <div className="grid gap-3 max-h-[440px] overflow-y-auto pr-4 custom-scrollbar">
                    {files.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-transparent hover:border-blue-100 hover:bg-white hover:shadow-md transition-all group">
                        <div className="flex items-center gap-4 overflow-hidden">
                          <div className="p-3 bg-white rounded-xl text-slate-400 group-hover:text-blue-600 shadow-sm transition">
                            <FileText size={20} />
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-sm font-bold text-slate-800 truncate">{file.file_name}</p>
                            <p className="text-[11px] text-slate-400 italic truncate font-medium">
                              {file.ai_summary || "AI is indexing this memory..."}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-1 ml-4">
                          <a href={file.file_url} target="_blank" className="p-2.5 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-xl transition"><Eye size={16} /></a>
                          <a href={`${file.file_url}?download=1`} className="p-2.5 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded-xl transition"><Download size={16} /></a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center">
                    <Sparkles size={48} className="mx-auto mb-4 text-slate-200" />
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 italic">Your legacy is a blank canvas.</p>
                  </div>
                )}
              </div>

              {/* Chat Interface */}
              <div className="bg-slate-100/50 backdrop-blur-sm rounded-[2.5rem] p-1 border border-slate-200 overflow-hidden shadow-inner">
                <LegacyChat targetUser={user} />
              </div>

            </div>
          </div>
        </section>
      ) : (
        /* --- HERO VIEW --- */
        <div className="overflow-x-hidden">
          <header className="max-w-6xl mx-auto px-6 pt-32 pb-24 text-center">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white border border-slate-200 text-slate-500 text-[10px] font-black uppercase rounded-full tracking-widest shadow-sm mb-10">
              <Shield size={12} className="text-blue-600" /> Military-Grade Archival Security
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black leading-[0.95] tracking-tighter text-slate-900 mb-10">
              Don't let your <br />
              <span className="text-blue-600 italic">wisdom</span> fade.
            </h1>
            
            <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
              Katha is a digital sanctuary for your mind—preserving your essence, 
              philosophy, and memories for the people who matter most.
            </p>

            <Link href="/login" className="inline-flex items-center gap-3 bg-slate-900 text-white px-12 py-5 rounded-full font-bold hover:bg-blue-600 hover:-translate-y-1 transition-all duration-300 shadow-2xl">
              Secure Your Legacy <ArrowRight size={20} />
            </Link>

            {/* Video Preview */}
            <div className="mt-24 max-w-5xl mx-auto relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-[4rem] opacity-10 blur-2xl group-hover:opacity-20 transition duration-1000"></div>
              <div className="relative bg-slate-900 rounded-[3rem] aspect-video border-[12px] border-white shadow-2xl overflow-hidden">
                <video autoPlay muted={isMuted} loop playsInline className="w-full h-full object-cover opacity-80">
                  <source src="/img_videos/demo.mp4" type="video/mp4" />
                </video>
                <button 
                  onClick={() => setIsMuted(!isMuted)} 
                  className="absolute bottom-6 right-6 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition"
                >
                  {isMuted ? "Sound Off" : "Audio Active"}
                </button>
              </div>
            </div>
          </header>

          {/* Social Proof / Philosophy */}
          <section className="bg-slate-900 py-32 text-white">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <Lock className="mx-auto mb-8 text-blue-500" size={40} />
              <h2 className="text-4xl font-bold mb-8 tracking-tight">The Library of You.</h2>
              <p className="text-xl text-slate-400 italic leading-relaxed font-serif">
                "Every person is a living library. Usually, when they pass, the library burns. 
                Katha is the fireproof vault for your digital heritage."
              </p>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center text-xs font-black uppercase tracking-[0.5em] text-slate-400 animate-pulse">Initializing Vault...</div>}>
      <HomeContent />
    </Suspense>
  );
}