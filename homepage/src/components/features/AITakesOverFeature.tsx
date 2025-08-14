'use client';

import { motion } from 'framer-motion';

import WebpageRecorderDemo from './WebpageRecorderDemo';

const feature = {
  title: 'Watch AI Transform Your Work in Real-Time',
  subtitle: 'Edit Mode is like having a senior colleague take over. See changes happen live, stay in control, ship faster than ever.',
  prompt: '"Make this blog post more engaging: add statistics, improve the hook, and create a compelling call-to-action"',
  response: 'Enhancing content with data and engagement tactics',
  webpage: 'docs',
};

export function AITakesOverFeature() {
  return (
    <motion.div
      className="flex flex-col items-center w-full"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, type: 'spring', bounce: 0.4, delay: 0.2 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-center mb-6 bg-gradient-to-br from-yellow-400 via-pink-400 to-blue-500 bg-clip-text text-transparent leading-tight">
        {feature.title}
      </h2>
      <p className="text-xl md:text-2xl text-muted-foreground text-center mb-12 max-w-4xl leading-relaxed">
        {feature.subtitle}
      </p>
      <div className="w-full flex justify-center mt-6">
        <div className="w-full max-w-4xl">
          <WebpageRecorderDemo 
            prompt={feature.prompt} 
            response={feature.response} 
            webpage={feature.webpage} 
          />
        </div>
      </div>
    </motion.div>
  );
}