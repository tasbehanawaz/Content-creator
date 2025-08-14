'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const appIcons = [
  { src: '/logos/gmail.svg', label: 'Gmail' },
  { src: '/logos/notion.svg', label: 'Notion' },
  { src: '/logos/docs.svg', label: 'Google Docs' },
  { src: '/logos/n8n.svg', label: 'N8N' },
  { src: '/logos/vscode.svg', label: 'VS Code' },
  { src: '/logos/google.svg', label: 'Google' },
  { src: '/logos/github.svg', label: 'GitHub' },
];

const NoiseTexture = () => (
  <svg
    className="absolute inset-0 w-full h-full pointer-events-none z-0"
    style={{ opacity: 0.13, mixBlendMode: 'overlay' }}
    width="100%" height="100%"
  >
    <filter id="noiseFilter">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
    </filter>
    <rect width="100%" height="100%" filter="url(#noiseFilter)" />
  </svg>
);

interface Particle {
  id: string;
  x: number;
  y: number;
  timestamp: number;
  size: 'small' | 'large';
}

const SoundWaveParticles = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const particleIdRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => prev.filter(p => Date.now() - p.timestamp < 3000));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    const newParticle: Particle = {
      id: `hover-${particleIdRef.current++}`,
      x,
      y,
      timestamp: Date.now(),
      size: 'small'
    };
    setParticles(prev => [...prev, newParticle]);
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      onMouseMove={handleMouseMove}
    >
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute pointer-events-none"
          style={{
            left: particle.x,
            top: particle.y,
          }}
          initial={{
            scale: 0,
            opacity: 0.8,
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0.8, 0.4, 0],
          }}
          transition={{
            duration: 1.5,
            ease: "easeOut",
          }}
        >
          <div
            className={`bg-gradient-to-r from-primary/20 to-blue-400/20 rounded-full ${particle.size === 'small' ? 'w-2 h-2' : 'w-4 h-4'
              }`}
          />
        </motion.div>
      ))}
    </div>
  );
};

function AppIconsSection() {
  return (
    <section className="w-full flex flex-col items-center justify-center py-8">
      <div className="flex items-center justify-center gap-6 mb-4 group">
        {appIcons.map((app, index) => {
          return (
            <motion.div
              key={index}
              className="flex flex-col items-center cursor-pointer relative"
              initial={{ y: 30, opacity: 0 }}
              whileHover={{
                scale: 1.15,
                y: -8,
                zIndex: 20,
                transition: {
                  type: "spring",
                  stiffness: 400,
                  damping: 10
                }
              }}
              animate={{
                y: 0,
                opacity: 1,
                transition: {
                  duration: 0.6,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }
              }}
            >
              <motion.div
                className="bg-card/50 backdrop-blur-sm rounded-2xl p-4 border border-border/50 relative shadow-lg hover:shadow-2xl transition-all duration-300"
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(255,255,255,0.15)", // Keep as white overlay for both themes
                  borderColor: "rgba(255,255,255,0.3)", // Keep as white overlay for both themes
                  boxShadow: "0 20px 40px rgba(0,0,0,0.3), 0 0 20px rgba(255,255,255,0.1)", // Keep shadow consistent
                  transition: { duration: 0.3 }
                }}
              >
                <motion.div
                  className="relative"
                  whileHover={{
                    rotate: [0, -5, 5, 0],
                    transition: { duration: 0.6, ease: "easeInOut" }
                  }}
                >
                  <Image src={app.src} alt={app.label} width={48} height={48} className="object-contain" />
                </motion.div>
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 to-blue-400/20 opacity-0"
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
              <motion.div
                className="mt-3 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3, duration: 0.4 }}
              >
                <span className="text-sm text-muted-foreground font-medium">{app.label}</span>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

export default function ManyApps() {
  return (
    <div className="w-full flex items-center justify-center bg-transparent">
      <section className="relative max-w-[80rem] w-full px-6 md:px-8 py-16 flex flex-col items-center justify-center overflow-hidden bg-background mx-auto border-x border-t border-border/25 shadow-sm shadow-purple-500/5">
        <NoiseTexture />
        <SoundWaveParticles />
        <div className="relative z-10 w-full flex flex-col items-center">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, type: 'spring', bounce: 0.4 }}
          >
            <h3 className="bg-gradient-to-br from-yellow-400 via-pink-400 to-blue-500 bg-clip-text text-3xl md:text-4xl font-bold text-transparent font-sans mb-4">
              Use with many apps
            </h3>
          </motion.div>
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6, type: 'spring', bounce: 0.4 }}
          >
            <p className="text-xl md:text-2xl text-foreground/90 font-semibold font-sans mb-4">
              Voice commands work everywhere you browse
            </p>
            <p className="text-lg text-muted-foreground font-sans max-w-3xl mx-auto leading-relaxed">
              Whether you&apos;re checking emails, writing documents, or managing projects,
              Websonic understands your voice and works seamlessly across all your favorite applications.
            </p>
          </motion.div>
          <AppIconsSection />
        </div>
      </section>
    </div>
  );
}