'use client';

import Link from 'next/link';


export default function Footer() {
  return (
    <footer className="w-full py-6 flex flex-col items-center justify-center text-sm text-muted-foreground font-sans">
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between mx-auto px-4">
        <div className="flex-1 flex items-center justify-start">
          <span className="tracking-widest">©{new Date().getFullYear()} WEBSONIC</span>
        </div>
        <div className="flex-1 flex items-center justify-center gap-6 flex-wrap">
          <Link href="/pricing" className="hover:underline">PRICING ↗</Link>
          <Link href="/blog" className="hover:underline">BLOG ↗</Link>
          <a href="/about-us" className="hover:underline">ABOUT ↗</a>
          <Link href="/privacy" className="hover:underline">PRIVACY ↗</Link>
          <Link href="/terms" className="hover:underline">TERMS ↗</Link>
          <a href="/support" className="hover:underline">SUPPORT ↗</a>
        </div>
        <div className="flex-1 flex items-center justify-end">
          <span className="tracking-widest">BROWSING REIMAGINED</span>
        </div>
      </div>
    </footer>
  );
}