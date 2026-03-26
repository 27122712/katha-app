import React, { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Script from 'next/script'; // 1. Import Script
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* 2. Load the Razorpay SDK globally */}
        <Script 
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className="antialiased selection:bg-blue-100">
        {/* We use Suspense because Navbar uses useSearchParams */}
        <Suspense fallback={<div className="h-16 bg-white border-b border-slate-50" />}>
          <Navbar />
        </Suspense>

        {children}

        <footer className="py-12 border-t border-slate-50 bg-slate-50/30 text-center">
          <p className="text-slate-400 font-mono text-[10px] uppercase tracking-widest">
            Katha.in — 2026 • Made in India 🇮🇳
          </p>
        </footer>
      </body>
    </html>
  );
}