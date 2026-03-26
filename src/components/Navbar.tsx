'use client';

import Link from 'next/link';
import Image from 'next/image'; // <--- 1. ADD THIS IMPORT
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function Navbar() {
  const [userName, setUserName] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const nameFromUrl = searchParams.get('name');
    
    if (nameFromUrl) {
      const decodedName = decodeURIComponent(nameFromUrl);
      setUserName(decodedName);
      localStorage.setItem('katha_user', decodedName); 
    } else {
      const savedName = localStorage.getItem('katha_user');
      const savedSession = localStorage.getItem('katha_session');
      
      if (savedName) {
        setUserName(savedName);
      } else if (savedSession) {
        const parsed = JSON.parse(savedSession);
        setUserName(parsed.name);
      } else if (pathname.startsWith('/admin')) {
        setUserName('Admin');
      }
    }
  }, [searchParams, pathname]);

  const handleLogout = () => {
    localStorage.removeItem('katha_user');
    localStorage.removeItem('katha_session'); 
    setUserName(null);
    window.location.href = '/'; 
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        
        {/* LOGO SECTION */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image 
            src="/img_videos/katha_logo.jpeg" 
            alt="Katha Infinity Logo" 
            width={30} 
            height={30} 
            className="rounded-full group-hover:rotate-[360deg] transition-transform duration-1000 border border-slate-100"
          />
          <span className="text-xl font-extrabold tracking-tight text-slate-950">
            KATHA
          </span>
        </Link>
        
        {/* NAVIGATION LINKS */}
        <div className="hidden md:flex gap-8 text-[12px] font-bold text-slate-500 uppercase tracking-widest">
          <Link href="/" className="hover:text-blue-600 transition">Home</Link>
          <Link href="/how-it-works" className="hover:text-blue-600 transition">How it works</Link>
          <Link href="/pricing" className="hover:text-blue-600 transition">Pricing</Link>
          <Link href="/about" className="hover:text-blue-600 transition">About Us</Link>
        </div>

        {/* AUTH BUTTONS */}
        {userName ? (
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hi, {userName}</span>
            <button 
              onClick={handleLogout}
              className="bg-red-50 text-red-600 text-xs font-bold px-5 py-2 rounded-full hover:bg-red-600 hover:text-white transition border border-red-100"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link href="/login" className="bg-slate-900 text-white text-xs font-bold px-5 py-2 rounded-full hover:bg-slate-800 transition shadow-lg shadow-slate-200">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}