'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Bold, CheckCircle, Italic, Loader2, MoreHorizontal, Paperclip, Send, Smile, Sparkles, Underline } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { trackEvent } from './providers';

const mainHeading = 'Browse at the Speed of Sound';

const appIcons = [
  { src: '/logos/google.svg', label: 'Gmail' },
  { src: '/logos/notion.svg', label: 'Notion' },
  { src: '/logos/docs.svg', label: 'Google Docs' },
  { src: '/logos/n8n.svg', label: 'N8N' },
  { src: '/logos/vscode.svg', label: 'VS Code' },
  { src: '/logos/google.svg', label: 'Google' },
  { src: '/logos/github.svg', label: 'GitHub' },
];

const promptText = 'Hi Sonic! Please go through unread emails on this tab and respond based on my calendar';
const emailText = `Hi,\n\nThanks for following up on this. I\'m free this Thursday at 9:30 am. Does that work for you?\n\nRegards,\nKen`;

const trustedByLogos = [
  {
    logo: '/logos/copilot-color.svg',
    text: '/logos/copilot-text.svg',
    alt: 'Microsoft Copilot'
  },
  {
    logo: '/logos/notion.svg',
    text: '/logos/notion-text.svg',
    alt: 'Notion AI'
  },
  {
    logo: '/logos/gemini-color.svg',
    text: '/logos/gemini-text.svg',
    alt: 'Google Gemini'
  },
  {
    logo: '/logos/grammarly-color.svg',
    text: '/logos/grammarly-text.svg',
    alt: 'Grammarly'
  }
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
  const [isActive, setIsActive] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const particleIdRef = useRef(0);

  // Auto-disable after 1 minute to prevent memory issues
  useEffect(() => {
    const disableTimer = setTimeout(() => {
      setIsActive(false);
      setParticles([]); // Clear all particles
    }, 60000); // 1 minute

    return () => clearTimeout(disableTimer);
  }, []);

  // Clean up old particles
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setParticles(prev => prev.filter(p => Date.now() - p.timestamp < 3000));
    }, 100);
    return () => clearInterval(interval);
  }, [isActive]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !isActive) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    // Add small particle on hover
    const newParticle: Particle = {
      id: `hover-${particleIdRef.current++}`,
      x,
      y,
      timestamp: Date.now(),
      size: 'small'
    };
    setParticles(prev => [...prev, newParticle]);
  }, [isActive]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !isActive) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Add multiple large particles on click
    const newParticles: Particle[] = Array.from({ length: 3 }, (_, i) => ({
      id: `click-${particleIdRef.current++}-${i}`,
      x,
      y,
      timestamp: Date.now() + i * 100,
      size: 'large' as const
    }));
    setParticles(prev => [...prev, ...newParticles]);
  }, [isActive]);

  // Don't render anything if particles are disabled
  if (!isActive) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-auto"
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full border border-primary/30 pointer-events-none"
            style={{
              left: particle.x,
              top: particle.y,
              x: '-50%',
              y: '-50%',
            }}
            initial={{
              width: particle.size === 'small' ? 20 : 40,
              height: particle.size === 'small' ? 20 : 40,
              opacity: particle.size === 'small' ? 0.3 : 0.5
            }}
            animate={{
              width: particle.size === 'small' ? 60 : 200,
              height: particle.size === 'small' ? 60 : 200,
              opacity: 0
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: particle.size === 'small' ? 0.8 : 2,
              ease: "easeOut"
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

const VoiceWaveform = () => {
  const bars = Array.from({ length: 80 });
  return (
    <div className="flex items-end justify-center gap-[2px] h-12 w-full mx-auto">
      {bars.map((_, i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded bg-foreground/80"
          initial={{ scaleY: 0.3 }}
          animate={{
            scaleY: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            repeatType: 'loop',
            delay: i * 0.018,
            ease: 'easeInOut',
          }}
          style={{ height: '100%' }}
        />
      ))}
    </div>
  );
};

function Typewriter({ text, onDone, className = "text-lg tracking-tight text-muted-foreground text-center min-h-[28px] font-sans" }: { text: string, onDone?: () => void, className?: string }) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i === text.length) {
        clearInterval(interval);
        if (onDone) onDone();
      }
    }, 28);
    return () => clearInterval(interval);
  }, [text, onDone]);
  return <span className={className}>{displayed}</span>;
}

function EmailBox({ onTypingDone, slideKey }: { onTypingDone: () => void, slideKey: number }) {
  const [displayedText, setDisplayedText] = useState('');
  const [editableText, setEditableText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showIndicator, setShowIndicator] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Reset state when slideKey changes
    setDisplayedText('');
    setEditableText('');
    setIsTyping(true);
    setShowIndicator(true);

    let i = 0;
    const interval = setInterval(() => {
      const newText = emailText.slice(0, i + 1);
      setDisplayedText(newText);
      setEditableText(newText);
      i++;
      if (i === emailText.length) {
        clearInterval(interval);
        setIsTyping(false);
        onTypingDone();
        // Fade out indicator after turning green
        setTimeout(() => setShowIndicator(false), 500);
      }
    }, 30);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slideKey]); // Only re-run when slideKey changes, not onTypingDone

  const applyFormat = (format: string) => {
    if (!textareaRef.current || isTyping) return;

    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;

    if (start === end) return; // No selection

    const selectedText = editableText.substring(start, end);
    let formattedText = '';

    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'underline':
        formattedText = `__${selectedText}__`;
        break;
      default:
        return;
    }

    const newText = editableText.substring(0, start) + formattedText + editableText.substring(end);
    setEditableText(newText);

    // Restore selection after formatting
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(start, start + formattedText.length);
      }
    }, 0);
  };

  return (
    <div className="mt-6 w-full rounded-lg bg-card shadow-lg border border-border p-4 relative">
      {/* Status Indicator */}
      {showIndicator && (
        <motion.div
          className={`absolute top-4 right-4 w-3 h-3 rounded-full ${isTyping ? 'bg-primary' : 'bg-green-500'
            } shadow-lg`}
          initial={{ opacity: 0, scale: 0 }}
          animate={isTyping ? {
            opacity: [1, 0.4, 1],
            scale: [1, 0.9, 1],
          } : {
            opacity: [1, 0],
            scale: [1, 0.8],
          }}
          transition={isTyping ? {
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          } : {
            duration: 0.5,
            delay: 0.5
          }}
        />
      )}

      <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
        <span className="font-semibold">Starlink</span>
        <span className="text-muted-foreground/70">(no-reply@starlink.com)</span>
      </div>
      <textarea
        ref={textareaRef}
        className="w-full bg-transparent resize-none outline-none text-card-foreground text-sm font-sans min-h-[120px] mb-2"
        value={isTyping ? displayedText : editableText}
        onChange={(e) => !isTyping && setEditableText(e.target.value)}
        readOnly={isTyping}
        placeholder="Generated email response"
      />
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => applyFormat('bold')}
            disabled={isTyping}
            className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Bold"
          >
            <Bold size={18} className="text-muted-foreground" />
          </button>
          <button
            onClick={() => applyFormat('italic')}
            disabled={isTyping}
            className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Italic"
          >
            <Italic size={18} className="text-muted-foreground" />
          </button>
          <button
            onClick={() => applyFormat('underline')}
            disabled={isTyping}
            className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Underline"
          >
            <Underline size={18} className="text-muted-foreground" />
          </button>
          <div className="w-px h-5 bg-gray-300 mx-1" />
          <button
            disabled={isTyping}
            className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Attach file"
          >
            <Paperclip size={18} className="text-muted-foreground" />
          </button>
          <button
            disabled={isTyping}
            className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Insert emoji"
          >
            <Smile size={18} className="text-muted-foreground" />
          </button>
          <button
            disabled={isTyping}
            className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="More options"
          >
            <MoreHorizontal size={18} className="text-muted-foreground" />
          </button>
        </div>
        <button className="flex items-center gap-1 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-1.5 rounded-full text-sm font-semibold">
          <Send size={16} />
          Send
        </button>
      </div>
    </div>
  );
}

const slides = [
  'waveform',
  'prompt',
  'email',
];

export default function HeroSection() {
  const [slide, setSlide] = useState(0);
  const [typewriterDone, setTypewriterDone] = useState(false);
  const [emailTypewriterDone, setEmailTypewriterDone] = useState(false);
  const [typewriterKey, setTypewriterKey] = useState(0);
  const [emailKey, setEmailKey] = useState(0);
  const [hasCompletedCycle, setHasCompletedCycle] = useState(false);
  const [showWaitlistForm, setShowWaitlistForm] = useState(false);

  // Waitlist form state
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'email' | 'congrats' | 'complete'>('email');
  const [isOnWaitlist, setIsOnWaitlist] = useState(false);
  const [error, setError] = useState('');

  const handleEmailSubmit = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          source: 'hero-inline'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join waitlist');
      }

      trackEvent('waitlist_signup_email', {
        source: 'hero-inline'
      });

      setIsOnWaitlist(true);
      setStep('congrats');
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileComplete = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/waitlist/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          full_name: fullName
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to complete profile');
      }

      trackEvent('waitlist_profile_complete', {
        source: 'hero-inline',
        hasFullName: !!fullName
      });

      setIsOnWaitlist(true);
      setStep('complete');
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (hasCompletedCycle) return; // Stop auto-advancing after first cycle

    let timeout: NodeJS.Timeout;
    if (slide === 0) {
      timeout = setTimeout(() => setSlide(1), 3000); // increased delay for waveform
    } else if (slide === 1) {
      setTypewriterDone(false);
      setTypewriterKey(prev => prev + 1);
    } else if (slide === 2) {
      setEmailTypewriterDone(false);
      setEmailKey(prev => prev + 1);
    }
    return () => clearTimeout(timeout);
  }, [slide, hasCompletedCycle]);

  useEffect(() => {
    if (hasCompletedCycle) return;

    let timeout: NodeJS.Timeout;
    if (slide === 1 && typewriterDone) {
      timeout = setTimeout(() => setSlide(2), 4000); // increased pause after typewriter
    }
    return () => clearTimeout(timeout);
  }, [slide, typewriterDone, hasCompletedCycle]);

  useEffect(() => {
    if (hasCompletedCycle) return;

    let timeout: NodeJS.Timeout;
    if (slide === 2 && emailTypewriterDone) {
      timeout = setTimeout(() => setHasCompletedCycle(true), 500); // Wait only 0.5 seconds after email is typed
    }
    return () => clearTimeout(timeout);
  }, [slide, emailTypewriterDone, hasCompletedCycle]);

  const handleSlideChange = (newSlide: number) => {
    setSlide(newSlide);
    if (newSlide === 1) {
      setTypewriterDone(false);
      setTypewriterKey(prev => prev + 1);
    } else if (newSlide === 2) {
      setEmailTypewriterDone(false);
      setEmailKey(prev => prev + 1);
    }
  };

  return (
    <div className="w-full flex items-center justify-center bg-transparent">
      <section id="hero" className="relative max-w-[80rem] w-full px-6 md:px-8 min-h-[70vh] flex flex-col items-center justify-start pt-16 overflow-hidden bg-background mx-auto border-x border-border/25 shadow-sm shadow-purple-500/5">
        <NoiseTexture />
        <SoundWaveParticles />
        <div className="relative z-10 w-full flex flex-col items-center py-12">

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', bounce: 0.5, duration: 1, delay: 0.3 }}
            className="py-6 text-3xl font-bold leading-none tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl font-sans text-center"
          >
            <span className="bg-gradient-to-br from-yellow-400 via-pink-400 to-blue-500 bg-clip-text text-transparent">Browse, at the speed of {' '}</span>
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
                sound.
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
                sound.
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
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mb-8 text-lg tracking-tight text-muted-foreground md:text-xl text-balance text-center max-w-3xl"
          >
            The world&apos;s first truly <span className="text-foreground font-semibold">hands-free</span> browser AI. <span className="text-primary italic">Speech to Action</span>, not just speech to text.
          </motion.p>

          {/* Voice Animation Carousel with AnimatePresence */}
          <div className="w-full max-w-4xl mb-12 min-h-[260px] flex items-center justify-center relative" style={{ minHeight: 260 }}>
            <AnimatePresence mode="wait">
              {/* Waveform */}
              {slide === 0 && (
                <motion.div
                  key="waveform"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                  className="w-full max-w-3xl flex flex-col items-center"
                >
                  <VoiceWaveform />
                </motion.div>
              )}

              {/* Transcription of user's command */}
              {slide === 1 && (
                <motion.div
                  key="prompt"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                  className="w-full max-w-3xl flex flex-col items-center"
                >
                  <div className="mt-8 space-y-4 w-full">
                    <div className={`text-lg tracking-tight text-muted-foreground min-h-[28px] font-sans ${!typewriterDone ? 'text-left' : 'text-left'}`}>
                      <span className="text-foreground font-bold">You: {' '}</span>
                      {!typewriterDone ? (
                        <Typewriter
                          key={`${typewriterKey}-1`}
                          text="Hey Sonic! Check unread emails on this tab and respond based on my calendar availability"
                          onDone={() => setTypewriterDone(true)}
                          className="text-muted-foreground italic inline"
                        />
                      ) : (
                        <span className="text-muted-foreground italic">
                          Hey Sonic! Check <span className="text-foreground font-semibold italic">unread emails</span> on this tab and respond based on my <span className="text-foreground font-semibold italic">calendar availability</span>
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Email response */}
              {slide === 2 && (
                <motion.div
                  key="email"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                  className="w-full max-w-3xl flex flex-col items-center"
                >
                  <EmailBox onTypingDone={() => setEmailTypewriterDone(true)} slideKey={emailKey} />
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* Waitlist Counter / Email Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="flex items-center gap-2 mt-8 mb-4"
          >
            {!showWaitlistForm ? (
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 cursor-pointer hover:bg-primary/15 transition-colors duration-200"
                onClick={() => {
                  setShowWaitlistForm(true);
                  trackEvent('hero_waitlist_clicked', { location: 'hero', source: 'waitlist_counter' });
                }}
              >
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-sm text-muted-foreground">
                  <span className="text-primary font-semibold">1,247</span> people on the waitlist
                </span>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 min-w-[280px] relative overflow-hidden ${isOnWaitlist ? 'ring-shine-animation' : ''
                  }`}
                style={{
                  '--shine-color': 'rgba(59, 130, 246, 0.5)'
                } as React.CSSProperties}
              >
                {isOnWaitlist && (
                  <div className="absolute inset-0 rounded-full animate-shine-ring pointer-events-none"></div>
                )}
                <input
                  type="email"
                  placeholder={isOnWaitlist ? "You're on the list!" : "Enter your email"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent text-sm text-muted-foreground placeholder-muted-foreground/50 outline-none flex-1"
                  autoFocus={!isOnWaitlist}
                  readOnly={isOnWaitlist}
                />
              </motion.div>
            )}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Button
              variant="outline"
              size="lg"
              className="group h-12 px-8 text-base font-medium border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground relative overflow-hidden"
              onClick={() => trackEvent('hero_explore_clicked', { location: 'hero' })}
            >
              <motion.span
                className="flex items-center gap-2 relative z-10"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Sparkles className="w-4 h-4" />
                Explore Websonic
              </motion.span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                whileHover={{
                  opacity: 1,
                  scale: 1.1,
                  transition: { duration: 0.3 }
                }}
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 rounded-lg"
                animate={{
                  opacity: [0.3, 0.8, 0.3],
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />
            </Button>

            <Button
              size="lg"
              variant="primary"
              className="group h-12 px-8 text-base font-medium"
              disabled={showWaitlistForm && (!email || isLoading)}
              onClick={!showWaitlistForm ? () => {
                setShowWaitlistForm(true);
                trackEvent('hero_waitlist_clicked', { location: 'hero' });
              } : isOnWaitlist ? undefined : handleEmailSubmit}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Joining...
                </>
              ) : isOnWaitlist ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  <span>Joined waitlist</span>
                  <ArrowRight className="ml-2 size-5 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
                </>
              ) : (
                <>
                  <span>{!showWaitlistForm ? 'Get Early Access' : 'Join Waitlist'}</span>
                  <ArrowRight className="ml-2 size-5 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </motion.div>

          {/* Error Messages */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-4"
              >
                <p className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg p-3 max-w-md">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Trusted By Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1 }}
            className="w-full max-w-5xl mt-20"
          >
            <p className="text-center text-sm text-muted-foreground mb-8 uppercase tracking-wider">Designed to Replace</p>
            <div className="flex items-center justify-center gap-12 flex-wrap">
              {trustedByLogos.map((company, index) => (
                <motion.div
                  key={company.alt}
                  className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 0.6, y: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                >
                  <Image
                    src={company.logo}
                    alt={`${company.alt} logo`}
                    width={32}
                    height={32}
                    className="h-6 w-6"
                    style={{ filter: 'brightness(0) saturate(100%) invert(72%) sepia(9%) saturate(281%) hue-rotate(185deg) brightness(88%) contrast(85%)' }}
                  />
                  {company.text !== company.logo && (
                    <Image
                      src={company.text}
                      alt={company.alt}
                      width={100}
                      height={32}
                      className="h-6 w-auto"
                      style={{ filter: 'brightness(0) saturate(100%) invert(72%) sepia(9%) saturate(281%) hue-rotate(185deg) brightness(88%) contrast(85%)' }}
                    />
                  )}
                  {company.text === company.logo && (
                    <span className="text-muted-foreground text-lg font-medium">{company.alt}</span>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}