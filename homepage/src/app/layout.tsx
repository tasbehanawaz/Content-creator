import { PropsWithChildren } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { GeistSans } from 'geist/font/sans';

import { Logo } from '@/components/logo';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/utils/cn';
import { Analytics } from '@vercel/analytics/react';

import Footer from './footer';
import { Navigation } from './navigation';
import { PostHogProvider } from './providers';

import '@/styles/globals.css';

// Removed force-dynamic to allow static generation where possible

export const metadata: Metadata = {
  title: 'Websonic',
  description: 'The ultimate AI-powered voice assistant browser extension',
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang='en'>
      <body className={cn('font-sans antialiased bg-background text-foreground', GeistSans.variable)}>
        <ThemeProvider>
          <PostHogProvider>
            <div className='m-auto flex h-full max-w-full flex-col px-4'>
              <AppBar />
              <main className='relative flex-1'>
                <div className='relative h-full'>{children}</div>
              </main>
              <Footer />
            </div>
            <Toaster />
            <Analytics />
          </PostHogProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

function AppBar() {
  return (
    <header className='flex items-center justify-center py-4 max-w-full'>
      <div className='flex items-center justify-between w-[1440px]'>
        {/* Logo on the left */}
        <Logo />

        {/* Navigation links in the middle */}
        <nav className='hidden md:flex items-center gap-6'>
          <Link href='#features' className='text-foreground hover:text-foreground/80 transition-colors'>
            Features
          </Link>
          <Link href='/pricing' className='text-foreground hover:text-foreground/80 transition-colors'>
            Pricing
          </Link>
          <Link href='/blog' className='text-foreground hover:text-foreground/80 transition-colors'>
            Blog
          </Link>
        </nav>

        {/* Buttons on the right */}
        <Navigation />
      </div>
    </header>
  );
}