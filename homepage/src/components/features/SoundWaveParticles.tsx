'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: string;
  x: number;
  y: number;
  timestamp: number;
  size: 'small' | 'large';
}

export const SoundWaveParticles = () => {
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