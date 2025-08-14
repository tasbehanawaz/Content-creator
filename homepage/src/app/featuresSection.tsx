'use client';

import { motion } from 'framer-motion';

import { AIAgencyControlFeature } from '@/components/features/AIAgencyControlFeature';
import { AITakesOverFeature } from '@/components/features/AITakesOverFeature';
import AllModelsSection from '@/components/features/AllModelsSection';
import ContextMenuSection from '@/components/features/ContextMenuSection';
import { FeatureCarousel } from '@/components/features/FeatureCarousel';
import { NoiseTexture } from '@/components/features/NoiseTexture';
import { SoundWaveParticles } from '@/components/features/SoundWaveParticles';
import { TiredVsWiredFeature } from '@/components/features/TiredVsWiredFeature';
import { UniversalVoiceControlFeature } from '@/components/features/UniversalVoiceControlFeature';

export default function FeaturesSection() {
  return (
    <div className="w-full flex items-center justify-center bg-transparent">
      <section className="relative max-w-full w-full py-24 flex flex-col items-center justify-center overflow-hidden bg-background border-x border-t border-border/25 shadow-sm shadow-purple-500/5">
        <NoiseTexture />
        <SoundWaveParticles />
        <div className="relative z-10 w-full flex flex-col gap-32">

          {/* Features Carousel: Header */}
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-center mb-6 bg-gradient-to-br from-yellow-400 via-pink-400 to-blue-500 bg-clip-text text-transparent leading-tight">
              Stop Browsing. Start{' '}
              <motion.span
                className="text-primary italic inline font-linebeam relative cursor-pointer"
                initial={{ opacity: 1 }}
                whileHover="hover"
              >
                <motion.span
                  className="relative inline-block"
                  variants={{
                    hover: {
                      x: [0, 2, 0],
                      transition: {
                        duration: 0.5,
                        ease: "easeOut"
                      }
                    }
                  }}
                >
                  Doing
                </motion.span>
                {/* Speed blur effect on hover */}
                <motion.span
                  className="absolute inset-0 text-primary italic inline font-linebeam"
                  initial={{ opacity: 0, x: 0 }}
                  variants={{
                    hover: {
                      opacity: [0, 0.4, 0],
                      x: [0, -15, -30],
                      filter: ['blur(0px)', 'blur(3px)', 'blur(6px)'],
                      transition: {
                        duration: 0.6,
                        ease: "easeOut"
                      }
                    }
                  }}
                >
                  Doing
                </motion.span>
                {/* Trailing speed lines on hover */}
                <motion.div
                  className="absolute inset-0 flex items-center overflow-visible"
                  initial={{ opacity: 0 }}
                >
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute h-[1px] bg-gradient-to-r from-primary/60 to-transparent origin-left"
                      style={{
                        top: `${35 + i * 12}%`,
                        width: '60px',
                        right: '100%'
                      }}
                      initial={{ scaleX: 0, opacity: 0 }}
                      variants={{
                        hover: {
                          scaleX: [0, 1, 1, 0],
                          opacity: [0, 0.6, 0.3, 0],
                          x: [-10, -20, -40, -60],
                          transition: {
                            duration: 0.6,
                            delay: i * 0.05,
                            ease: "easeOut"
                          }
                        }
                      }}
                    />
                  ))}
                </motion.div>
              </motion.span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground text-center mb-12 max-w-4xl leading-relaxed">
              Your voice becomes instant action across any website. No popups. No clutter. Just pure productivity at the speed of speech.
            </p>
          </div>

          {/* Feature Carousel */}
          <FeatureCarousel />

          {/* All Models Section */}
          <AllModelsSection />

          {/* Tired vs Wired Feature */}
          <TiredVsWiredFeature />

          {/* Context Menu Section */}
          <ContextMenuSection />

          {/* AI Takes Over Feature */}
          <AITakesOverFeature />

          {/* Universal Voice Control Feature */}
          <UniversalVoiceControlFeature />

          {/* AI Agency Control Feature */}
          <AIAgencyControlFeature />
        </div>
      </section>
    </div>
  );
}