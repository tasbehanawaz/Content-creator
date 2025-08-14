'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import WebpageRecorderDemo from './WebpageRecorderDemo';

const features = [
  {
    title: "Speak, Don't Type. Watch Magic Happen.",
    subtitle: "Unlike ChatGPT or Claude, you're not stuck in a chat window. Voice-control any website, any workflow, hands-free.",
    prompt: '"Draft a follow-up email to the marketing team about the campaign performance"',
    response: 'Email drafted with your tone and style',
    webpage: 'gmail',
  },
  {
    title: 'Code Anywhere You Like',
    subtitle: 'Unlike Cursor or GitHub Codespaces, you\'re not stuck in a terminal. Voice-code in any browser app, any workflow tool, whenever inspiration strikes.',
    prompt: '"Add error handling and retry logic to this API call function"',
    response: 'Code enhanced with robust error handling',
    webpage: 'n8n',
  },
  {
    title: 'Sit Back. AI Does the Heavy Lifting.',
    subtitle: 'Edit Mode lets AI transform entire documents while you focus on what matters. From drafts to perfection in seconds.',
    prompt: '"I need some research on how AI affects reader engagement in literature, write the next few paragraphs"',
    response: 'Essay Research Added',
    webpage: 'notion',
  },
  {
    title: 'Your Voice Works Everywhere Online',
    subtitle: 'From LinkedIn searches to YouTube summaries, Google Docs to Gmail—speak naturally and watch AI execute perfectly.',
    prompt: '"Find the three most qualified DevOps engineers and draft personalized outreach messages"',
    response: 'Analyzing profiles and creating personalized messages',
    webpage: 'linkedin',
  },

];

export function FeatureCarousel() {
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  // Auto-cycle through features
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setActiveFeatureIndex(prev => (prev + 1) % features.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handleFeatureClick = (targetIndex: number) => {
    if (targetIndex === activeFeatureIndex) return;
    setActiveFeatureIndex(targetIndex);
    // Pause auto-play when user interacts
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const getRelativePosition = (featureIndex: number) => {
    const diff = featureIndex - activeFeatureIndex;
    // Normalize to -1, 0, 1 for left, center, right
    if (diff === 0) return 0; // center
    if (diff === 1 || diff === -(features.length - 1)) return 1; // right
    if (diff === -1 || diff === features.length - 1) return -1; // left
    return diff; // for features further away
  };

  return (
    <motion.div
      className="flex flex-col items-center w-full"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      {/* Cycling feature carousel */}
      <div
        className="w-full max-w-7xl mx-auto px-8"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        <div className="relative flex items-center justify-center h-[600px]">
          {features.map((feature, featureIndex) => {
            const relativePos = getRelativePosition(featureIndex);
            const isActive = relativePos === 0;
            const isVisible = Math.abs(relativePos) <= 1; // Only show center and immediate neighbors

            if (!isVisible) return null;

            return (
              <motion.div
                key={featureIndex}
                className="absolute cursor-pointer w-[70%] max-w-4xl inset-y-0 m-auto h-fit"
                style={{ zIndex: isActive ? 20 : 10 }}
                animate={{
                  x: `${relativePos * 85}%`,
                  scale: isActive ? 1 : 0.65,
                  opacity: isActive ? 1 : 0.5,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 35,
                  mass: 0.8,
                }}
                onClick={() => handleFeatureClick(featureIndex)}
                whileHover={{
                  scale: isActive ? 1.02 : 0.7,
                  opacity: isActive ? 1 : 0.7,
                }}
                whileTap={{
                  scale: isActive ? 0.98 : 0.63,
                }}
              >
                <div className={`bg-gray-900/50 border border-border/50 rounded-2xl backdrop-blur-sm overflow-hidden transition-all duration-500 ${isActive
                  ? 'p-8 shadow-2xl shadow-purple-500/10 border-purple-500/20'
                  : 'p-6 hover:border-gray-600/50'
                  }`}>
                  <h3 className={`font-bold mb-4 bg-gradient-to-br from-yellow-400 via-pink-400 to-blue-500 bg-clip-text text-transparent transition-all duration-500 ${isActive ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl'
                    }`}>
                    {feature.title}
                  </h3>
                  <p className={`text-muted-foreground mb-6 leading-relaxed transition-all duration-500 ${isActive ? 'text-lg md:text-xl' : 'text-sm md:text-base'
                    }`}>
                    {feature.subtitle}
                  </p>
                  <div className="w-full">
                    <WebpageRecorderDemo
                      prompt={feature.prompt}
                      response={feature.response}
                      webpage={feature.webpage}
                      showBothModes={(feature as any).showBothModes}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>


      </div>
    </motion.div>
  );
}