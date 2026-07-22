'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

const links = [['/','Home'],['/how-it-works','How it works'],['/pricing','Pricing'],['/about','Our story']];
export default function Navbar() {
  const pathname=usePathname(); const [userName,setUserName]=useState<string|null>(null); const [open,setOpen]=useState(false);
  // Session state lives in localStorage, so it can only be synchronized after mount.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(()=>{ try { const session=localStorage.getItem('katha_session'); if(session)setUserName(JSON.parse(session).name); else if(pathname.startsWith('/admin'))setUserName('Admin'); } catch { localStorage.removeItem('katha_session'); } setOpen(false); },[pathname]);
  const logout=()=>{ localStorage.removeItem('katha_user'); localStorage.removeItem('katha_session'); window.location.href='/'; };
  return <nav className="fixed inset-x-0 top-0 z-50 border-b border-[#17211c]/10 bg-[#fbf8f1]/90 backdrop-blur-xl">
    <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 md:px-8">
      <Link href="/" className="flex items-center gap-3" aria-label="Katha home"><span className="grid h-9 w-9 place-items-center rounded-full bg-[#255c45] text-lg text-white font-display">K</span><span className="text-lg font-bold tracking-[.16em]">KATHA</span></Link>
      <div className="hidden items-center gap-8 md:flex">{links.map(([href,label])=><Link key={href} href={href} className={`text-sm transition ${pathname===href?'font-bold text-[#255c45]':'text-[#17211c]/60 hover:text-[#17211c]'}`}>{label}</Link>)}</div>
      <div className="hidden items-center gap-3 md:flex">{userName?<><span className="max-w-32 truncate text-xs text-[#17211c]/55">Hello, {userName.split(' ')[0]}</span><button onClick={logout} className="rounded-full border border-[#17211c]/15 px-5 py-2.5 text-sm font-semibold hover:bg-white">Log out</button></>:<Link href="/login" className="rounded-full bg-[#17211c] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#255c45]">Enter your vault</Link>}</div>
      <button onClick={()=>setOpen(!open)} className="grid h-10 w-10 place-items-center rounded-full border border-[#17211c]/15 md:hidden" aria-label="Toggle menu">{open?<X size={19}/>:<Menu size={19}/>}</button>
    </div>
    {open&&<div className="border-t border-[#17211c]/10 bg-[#fbf8f1] px-5 py-5 md:hidden"><div className="flex flex-col gap-1">{links.map(([href,label])=><Link key={href} href={href} className="rounded-xl px-4 py-3 text-sm font-semibold hover:bg-white">{label}</Link>)}</div><div className="mt-3 border-t border-[#17211c]/10 pt-4">{userName?<button onClick={logout} className="w-full rounded-full border px-5 py-3 text-sm font-semibold">Log out</button>:<Link href="/login" className="block rounded-full bg-[#17211c] px-5 py-3 text-center text-sm font-semibold text-white">Enter your vault</Link>}</div></div>}
  </nav>;
}
