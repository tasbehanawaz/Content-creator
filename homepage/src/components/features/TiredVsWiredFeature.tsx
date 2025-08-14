'use client';

import { motion } from 'framer-motion';

import WebpageRecorderDemo from './WebpageRecorderDemo';

const tiredVsWiredFeature = {
  title: 'Works Your Way. Every Time.',
  subtitle: 'Hate talking? Type instead. Love shortcuts? Customize everything. Unlike bloated AI tools, Websonic adapts to you—not the other way around.',
  prompt: '"Extract the key concepts from this 45-minute lecture and create study flashcards"',
  response: 'Analyzing lecture and creating flashcards',
  webpage: 'youtube',
  showBothModes: true,
};

export function TiredVsWiredFeature() {
  return (
    <motion.div
      className="flex flex-col items-center w-full"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-center mb-6 bg-gradient-to-br from-yellow-400 via-pink-400 to-blue-500 bg-clip-text text-transparent leading-tight">
        {tiredVsWiredFeature.title}
      </h2>
      <p className="text-xl md:text-2xl text-muted-foreground text-center mb-12 max-w-4xl leading-relaxed">
        {tiredVsWiredFeature.subtitle}
      </p>
      <div className="w-full flex justify-center mt-6">
        <div className="w-full max-w-4xl">
          <WebpageRecorderDemo 
            prompt={tiredVsWiredFeature.prompt} 
            response={tiredVsWiredFeature.response} 
            webpage={tiredVsWiredFeature.webpage} 
            showBothModes={tiredVsWiredFeature.showBothModes} 
          />
        </div>
      </div>
    </motion.div>
  );
}