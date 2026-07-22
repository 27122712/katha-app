import React,{Suspense} from 'react';
import Navbar from '@/components/Navbar';
import Script from 'next/script';
import './globals.css';

export const metadata={title:'Katha — Keep your stories close',description:'A private home for your memories, wisdom, and voice.'};
export default function RootLayout({children}:{children:React.ReactNode}){
 return <html lang="en"><head><Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="beforeInteractive"/></head><body className="antialiased"><Suspense fallback={<div className="h-18 bg-[#fbf8f1]"/>}><Navbar/></Suspense>{children}<footer className="border-t border-white/10 bg-[#17211c] px-6 py-10 text-center text-[#fbf8f1]"><p className="text-xs tracking-[.14em] text-white/55">KATHA · STORIES OUTLIVE US · MADE IN INDIA</p></footer></body></html>;
}
