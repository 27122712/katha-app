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
      const newUser = {
        name: decodeURIComponent(nameFromUrl),
        email: decodeURIComponent(emailFromUrl),
      };
      setUser(newUser);
      localStorage.setItem("katha_session", JSON.stringify(newUser));
      loadVault(newUser.email);
      window.history.replaceState({}, "", window.location.pathname);
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
    if (!user) return;
    setIsUploading(true);
    setUploadStatus("Encrypting...");
    try {
      const result = await uploadToVault(formData, user.email);
      if (result.success) {
        setUploadStatus(`Saved: ${result.fileName}`);
        loadVault(user.email);
      } else {
        alert(result.error);
      }
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <main className="bg-white text-slate-900 w-full min-h-screen selection:bg-blue-100 antialiased font-sans">
      {user ? (
        /* --- TIGHT DASHBOARD VIEW --- */
        <section className="max-w-6xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold tracking-tight">Katha Vault</h1>
            <div className="flex gap-3">
              {user.email === "kathasystems@gmail.com" && (
                <Link href="/admin" className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-lg text-blue-600 font-bold text-xs hover:bg-blue-100 transition">
                  <ShieldCheck size={14} /> Admin
                </Link>
              )}
              <button onClick={handleLogout} className="flex items-center gap-1.5 text-slate-400 hover:text-red-500 font-bold text-xs transition">
                <LogOut size={14} /> Exit
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-5">
            {/* Left: Input */}
            <div className="lg:col-span-4 space-y-5">
              <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden border border-slate-800">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <Lock size={12} className="text-blue-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Digital Mind Active</span>
                  </div>
                  <div className="mb-4">
                    <MindSeeder email={user.email} />
                  </div>
                  <form action={handleUpload} className="space-y-4">
                    <div className="border border-dashed border-slate-700 rounded-2xl p-6 text-center hover:bg-white/[0.02] transition-all group">
                      <input type="file" name="file" id="v-file" className="hidden" onChange={(e) => setUploadStatus(e.target.files?.[0]?.name || "")} />
                      <label htmlFor="v-file" className="cursor-pointer flex flex-col items-center">
                        <Upload size={20} className="text-blue-500 mb-2" />
                        <p className="font-bold text-xs truncate max-w-full">{uploadStatus || "Archive a Memory"}</p>
                      </label>
                    </div>
                    <button disabled={isUploading} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-500 transition flex items-center justify-center gap-2">
                      {isUploading ? "Securing..." : "Seal to Vault"} <ArrowRight size={14} />
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Right: Files & Chat */}
            <div className="lg:col-span-8 space-y-5">
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm min-h-[300px]">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Database size={14} /> Archived Memories
                  </h3>
                </div>
                <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                  {files.length > 0 ? files.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-200 transition-all">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <FileText size={18} className="text-blue-600 flex-shrink-0" />
                        <div className="overflow-hidden">
                          <p className="text-xs font-bold text-slate-700 truncate">{file.file_name}</p>
                          <p className="text-[10px] text-slate-400 italic truncate">{file.ai_summary || "Processing..."}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <a href={file.file_url} target="_blank" className="p-1.5 hover:bg-blue-100 text-blue-600 rounded-lg"><Eye size={14} /></a>
                        <a href={`${file.file_url}?download=1`} className="p-1.5 hover:bg-green-100 text-green-600 rounded-lg"><Download size={14} /></a>
                      </div>
                    </div>
                  )) : (
                    <p className="text-center text-[10px] text-slate-300 font-bold uppercase mt-10">Vault Empty</p>
                  )}
                </div>
              </div>
              <div className="bg-slate-50 rounded-3xl p-4 border border-slate-100">
                <LegacyChat targetUser={user} />
              </div>
            </div>
          </div>
        </section>
      ) : (
        /* --- REDUCED HERO SECTION (Based on image_ae52bd.jpg) --- */
        <header className="max-w-5xl mx-auto px-6 pt-16 pb-12 text-center animate-in fade-in duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 text-[9px] font-black uppercase rounded-full tracking-widest mb-6">
            <Shield size={10} /> metallic-grade memory security
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight text-slate-900 mb-4">
            Preserve your <span className="text-blue-600 italic">wisdom</span> forever.
          </h1>
          <p className="text-base text-slate-500 max-w-xl mx-auto mb-8 font-medium leading-relaxed">
            Katha is a digital bridge to the future—preserving your thoughts and memories for the generations that follow.
          </p>
          <div className="mb-12">
            <Link href="/login" className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-slate-800 transition-all flex items-center gap-2 w-fit mx-auto shadow-xl">
              Secure Your Legacy <ArrowRight size={16} />
            </Link>
          </div>

          <div className="max-w-4xl mx-auto bg-slate-900 rounded-[2rem] aspect-video border-4 border-slate-100 shadow-2xl relative overflow-hidden group">
            <video autoPlay muted={isMuted} loop playsInline className="absolute inset-0 w-full h-full object-cover">
              <source src="/img_videos/demo.mp4" type="video/mp4" />
            </video>
            <button onClick={() => setIsMuted(!isMuted)} className="absolute bottom-4 right-4 z-20 bg-black/30 backdrop-blur-lg border border-white/10 px-3 py-1.5 rounded-full text-white text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-black/50 transition-all">
              {isMuted ? <Clock size={12} /> : <Sparkles size={12} />}
              {isMuted ? "Enable Sound" : "Audio Live"}
            </button>
          </div>
        </header>
      )}

      {/* COMPACT AI SECTION */}
      <section className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
          <div className="space-y-3">
            <div className="bg-white p-3 rounded-xl rounded-bl-none shadow-sm max-w-[85%] border border-slate-100 text-xs text-slate-600">
              "What was the most important lesson you learned in 2026?"
            </div>
            <div className="bg-blue-600 p-3 rounded-xl rounded-br-none shadow-sm max-w-[85%] ml-auto text-xs text-white">
              "That stories are the only things we truly leave behind..."
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="text-blue-600 text-[10px] font-black uppercase tracking-widest">Interactive Legacy</div>
          <h2 className="text-3xl font-bold tracking-tight leading-tight">Your <span className="text-blue-600">Thought Heirloom.</span></h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Our AI learns the "Why" behind your choices. Seed your mind with philosophy to ensure your guidance stays accessible.
          </p>
        </div>
      </section>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-[10px] font-black uppercase text-slate-300 tracking-widest">Opening Vault...</div>}>
      <HomeContent />
    </Suspense>
  );
}