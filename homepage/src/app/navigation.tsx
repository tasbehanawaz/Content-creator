'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { IoMenu } from 'react-icons/io5';

import { AccountMenu } from '@/components/account-menu';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTrigger } from '@/components/ui/sheet';
import { createSupabaseBrowserClient } from '@/libs/supabase/supabase-browser-client';
import type { User } from '@supabase/supabase-js';

import { signOut } from './(auth)/auth-actions';

export function Navigation() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    // Get initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Show nothing while loading to prevent layout shift
  if (loading) {
    return <div className='w-[120px]' />;
  }

  return (
    <div className='relative flex items-center gap-6'>
      {user ? (
        <AccountMenu signOut={signOut} />
      ) : (
        <>
          <div className='hidden lg:flex items-center gap-4'>
            <Button
              variant='primary'
              className='flex-shrink-0 h-10 px-6 text-sm font-medium'
              asChild
            >
              <Link href='/waitlist'>
                <motion.span
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  Get started
                </motion.span>
              </Link>
            </Button>
          </div>
          <Sheet>
            <SheetTrigger className='block lg:hidden'>
              <IoMenu size={28} />
            </SheetTrigger>
            <SheetContent className='w-full bg-background'>
              <SheetHeader>
                <Logo />
                <SheetDescription className='py-8 space-y-6'>
                  <nav className='flex flex-col gap-4'>
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
                  <div className='flex flex-col gap-4 pt-4'>
                    <Button
                      variant='primary'
                      className='flex-shrink-0 h-10 px-6 text-sm font-medium'
                      asChild
                    >
                      <Link href='/waitlist'>Get started</Link>
                    </Button>
                  </div>
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </>
      )}
    </div>
  );
}