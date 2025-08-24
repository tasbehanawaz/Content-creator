'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function HeroSection() {
  return (
    <div className="w-full flex items-center justify-center bg-transparent overflow-hidden">
      <section className="relative max-w-[80rem] w-full px-6 md:px-8 min-h-[85vh] flex flex-col items-center justify-center pt-16 bg-background mx-auto">
        <div className="relative z-10 w-full flex flex-col items-center">
          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', bounce: 0.5, duration: 1, delay: 0.3 }}
            className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-center max-w-[1200px] tracking-tight"
          >
            <span className="bg-gradient-to-br from-[#FEC601] via-[#EA7317] to-[#2364AA] bg-clip-text text-transparent inline-block">
              Create Content That
            </span>
            {' '}
            <span className="text-[#FEC601] inline-block">
              Stands Out
            </span>
          </motion.h1>

          {/* Subheading - With our accent colors */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-8 text-xl md:text-2xl text-center max-w-2xl"
          >
            Direct your <span className="text-[#73BFB8]">AI assistant</span> to turn your ideas into content, or{' '}
            <span className="text-[#3DA5D9]">create it yourself</span> with intuitive tools.
          </motion.p>

          {/* CTA Section - Using our yellow primary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center gap-6 mt-12"
          >
            <Button
              size="lg"
              variant="primary"
              className="h-14 px-8 text-lg font-medium bg-[#FEC601] hover:bg-[#FEC601]/90 rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              <span>Start Creating</span>
              <ArrowRight className="ml-2 size-5 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="h-14 px-8 text-lg font-medium border-2 rounded-full hover:bg-[#FEC601]/5"
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </motion.div>

          {/* Preview/Demo Section - With our gradient */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-16 w-full max-w-5xl mx-auto rounded-2xl border border-[#FEC601]/20 bg-background/50 backdrop-blur-sm shadow-2xl overflow-hidden"
          >
            <div className="aspect-video w-full relative bg-gradient-to-br from-[#FEC601]/10 via-[#EA7317]/10 to-[#2364AA]/10">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-muted-foreground">Preview Content Here</span>
              </div>
            </div>
          </motion.div>

          {/* Stats Section - With gradient text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.2 }}
            className="flex items-center gap-16 mt-16"
          >
            {[
              { number: '10M+', label: 'Content Created' },
              { number: '50+', label: 'AI Templates' },
              { number: '100k+', label: 'Active Users' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl font-bold bg-gradient-to-r from-[#FEC601] to-[#EA7317] bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}