'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface CompactWaveformProps {
  isActive?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'green' | 'blue' | 'purple' | 'red';
}

export default function CompactWaveform({
  isActive = false,
  className = '',
  size = 'md',
  color = 'green'
}: CompactWaveformProps) {
  const [levels, setLevels] = useState([0.3, 0.7, 0.4, 0.8, 0.5]);

  const sizeConfig = {
    sm: { width: '2px', maxHeight: 12, gap: '1px' },
    md: { width: '3px', maxHeight: 16, gap: '1.5px' },
    lg: { width: '4px', maxHeight: 20, gap: '2px' }
  };

  const colorConfig = {
    green: {
      active: 'rgba(34, 197, 94, 0.8)',
      inactive: 'rgba(156, 163, 175, 0.4)',
      glow: 'rgba(34, 197, 94, 0.3)'
    },
    blue: {
      active: 'rgba(59, 130, 246, 0.8)',
      inactive: 'rgba(156, 163, 175, 0.4)',
      glow: 'rgba(59, 130, 246, 0.3)'
    },
    purple: {
      active: 'rgba(147, 51, 234, 0.8)',
      inactive: 'rgba(156, 163, 175, 0.4)',
      glow: 'rgba(147, 51, 234, 0.3)'
    },
    red: {
      active: 'rgba(239, 68, 68, 0.8)',
      inactive: 'rgba(156, 163, 175, 0.4)',
      glow: 'rgba(239, 68, 68, 0.3)'
    }
  };

  const config = sizeConfig[size];
  const colors = colorConfig[color];

  // Animate levels when active
  useEffect(() => {
    if (!isActive) {
      setLevels([0.2, 0.3, 0.2, 0.3, 0.2]);
      return;
    }

    const interval = setInterval(() => {
      setLevels(prev => prev.map(() =>
        0.3 + Math.random() * 0.7
      ));
    }, 100);

    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div
      className={`flex items-end justify-center ${className}`}
      style={{ gap: config.gap }}
    >
      {levels.map((level, index) => (
        <motion.div
          key={index}
          className="rounded-full"
          style={{
            width: config.width,
            background: isActive ? colors.active : colors.inactive,
            minHeight: '4px',
            boxShadow: isActive ? `0 0 8px ${colors.glow}` : 'none',
          }}
          animate={{
            height: `${level * config.maxHeight + 4}px`,
          }}
          transition={{
            type: "spring",
            stiffness: isActive ? 400 : 200,
            damping: isActive ? 25 : 30,
            mass: 0.3,
          }}
        />
      ))}
    </div>
  );
}
