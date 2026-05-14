"use client";
import React, { useState } from "react";
import Link from "next/link";
// Update your imports to include the new security actions
import {
  loginUser,
  getSecurityQuestion,
  verifySecurityAnswer,
} from "../actions";
import {
  Lock,
  Mail,
  ArrowRight,
  ChevronLeft,
  Loader2,
  KeyRound,
  Sparkles,
} from "lucide-react";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [view, setView] = useState<"login" | "forgot">("login");
  const [loading, setLoading] = useState(false);

  // State for the security challenge
  const [userEmail, setUserEmail] = useState("");
  const [challengeQuestion, setChallengeQuestion] = useState("");
  const [revealedPassword, setRevealedPassword] = useState("");

  // LOGIN HANDLER
  async function handleSubmit(formData: FormData) {
    setError("");
    setLoading(true);
    const result = await loginUser(formData);

    if (result?.success) {
      const targetUrl = `/?email=${encodeURIComponent(result.user.email)}&name=${encodeURIComponent(result.user.name)}`;
      window.location.href = targetUrl;
    } else {
      setError(result?.error || "Login failed");
    }
    setLoading(false);
  }

  // STEP 1: Get the Question
  // STEP 1: Search Records & Verify Email
  async function handleIdentify(formData: FormData) {
    setError("");
    setLoading(true);
    const email = formData.get("email") as string;
    setUserEmail(email); // Save email state to use for the next verification step

    // This strictly fetches the question from your DB records
    const res = await getSecurityQuestion(email);

    if (res.success) {
      setChallengeQuestion(res.question); // UI switches to show the question input
    } else {
      setError(res.error || "Identity not found in the vault.");
    }
    setLoading(false);
  }

// LoginPage.tsx
async function handleVerify(formData: FormData) {
  setError('');
  setLoading(true);
  const answer = formData.get('answer') as string;
  
  const res = await verifySecurityAnswer(userEmail, answer);
  
  // Use optional chaining to prevent "reading property of undefined"
  if (res?.success && res?.user) {
    const targetUrl = `/?email=${encodeURIComponent(res.user.email)}&name=${encodeURIComponent(res.user.name)}`;
    window.location.href = targetUrl; 
  } else {
    setError(res?.error || "The resonance does not match.");
    setLoading(false);
  }
}

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans antialiased">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl p-10 border border-slate-100 transition-all duration-500">
        {view === "login" ? (
          /* --- LOGIN VIEW --- */
          <>
            <div className="text-center mb-8">
              <div className="text-[10px] font-black tracking-[0.3em] text-blue-600 mb-2 uppercase">
                Katha Vault
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Welcome Back
              </h1>
              <p className="text-slate-400 text-xs mt-1">
                Authorized access only
              </p>
            </div>

            <form action={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail
                  className="absolute left-4 top-4 text-slate-400"
                  size={18}
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 outline-none text-sm transition-all"
                />
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-4 text-slate-400"
                    size={18}
                  />
                  <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 outline-none text-sm transition-all"
                  />
                </div>
                <div className="flex justify-end px-1">
                  <button
                    type="button"
                    onClick={() => setView("forgot")}
                    className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-700 transition-colors"
                  >
                    Legacy Challenge?
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-[10px] font-bold text-center bg-red-50 py-2 rounded-lg">
                  {error}
                </p>
              )}

              <button
                disabled={loading}
                type="submit"
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-xl active:scale-95 group disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <>
                    Login{" "}
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <button
              onClick={() => {
                setView("login");
                setChallengeQuestion("");
                setError("");
              }}
              className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 mb-6 transition-colors"
            >
              <ChevronLeft size={14} /> Back to Login
            </button>

            {challengeQuestion ? (
              /* STEP 2: Answer the specific question from DB */
              <form action={handleVerify} className="space-y-4">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                    Security Challenge
                  </h2>
                  <p className="text-slate-400 text-[10px] uppercase font-bold mt-1">
                    Verify your identity
                  </p>
                </div>

                <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 mb-4">
                  <Sparkles size={16} className="text-blue-600 mb-2" />
                  <p className="text-sm font-semibold text-slate-900 italic">
                    "{challengeQuestion}"
                  </p>
                </div>

                <div className="relative">
                  <KeyRound
                    className="absolute left-4 top-4 text-slate-400"
                    size={18}
                  />
                  <input
                    name="answer"
                    type="text"
                    placeholder="Your Secret Answer"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm transition-all focus:border-blue-600"
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-[10px] font-bold text-center bg-red-50 py-2 rounded-lg">
                    {error}
                  </p>
                )}

                <button
                  disabled={loading}
                  type="submit"
                  className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="animate-spin mx-auto" size={16} />
                  ) : (
                    "Unlock Vault"
                  )}
                </button>
              </form>
            ) : (
              /* STEP 1: Identify the Email */
              <form action={handleIdentify} className="space-y-4">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                    Identify Vault
                  </h2>
                  <p className="text-slate-400 text-[10px] uppercase font-bold mt-1">
                    Enter your registered email
                  </p>
                </div>

                <div className="relative">
                  <Mail
                    className="absolute left-4 top-4 text-slate-400"
                    size={18}
                  />
                  <input
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm transition-all focus:border-blue-600"
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-[10px] font-bold text-center bg-red-50 py-2 rounded-lg">
                    {error}
                  </p>
                )}

                <button
                  disabled={loading}
                  type="submit"
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="animate-spin mx-auto" size={16} />
                  ) : (
                    "Search Records"
                  )}
                </button>
              </form>
            )}
          </div>
        )}

        <p className="text-center mt-10 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Digital Heritage Protection •{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            New Account
          </Link>
        </p>
      </div>
    </div>
  );
}
