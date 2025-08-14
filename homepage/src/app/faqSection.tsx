'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

import { trackEvent } from './providers';

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

const faqs = [
  {
    question: "What browsers does Websonic support?",
    answer: "Websonic works with all Chromium-based browsers including Chrome, Edge, Brave, and Opera. Firefox support is coming soon."
  },
  {
    question: "How does voice control work?",
    answer: "Simply activate Websonic with a hotkey or wake word, then speak your command. Our AI understands natural language and can perform complex actions like 'Reply to all unread emails' or 'Find the cheapest flights to Tokyo next month'."
  },
  {
    question: "Is my data private?",
    answer: "Yes! Voice processing happens locally on your device whenever possible. We only send data to our servers for complex commands, and we never store your browsing history or personal information."
  },
  {
    question: "Can I use Websonic with my existing tools?",
    answer: "Absolutely! Websonic integrates with popular tools like Gmail, Notion, Google Docs, GitHub, and thousands more. If it works in your browser, Websonic can control it."
  },
  {
    question: "What's the difference between Free and Pro?",
    answer: "The free plan gives you 100 voice commands per month to try Websonic. Pro users get unlimited commands, advanced automation features, multi-tab control, and priority support."
  },
  {
    question: "How do I create custom voice shortcuts?",
    answer: "Pro users can create custom shortcuts by recording a series of actions and assigning a voice command. For example, 'morning routine' could open your email, calendar, and news sites in different tabs."
  },
  {
    question: "Does Websonic work offline?",
    answer: "Basic voice recognition works offline for simple commands. Complex AI-powered actions require an internet connection."
  },
  {
    question: "Can I use Websonic in multiple languages?",
    answer: "Currently, Websonic supports English with more languages coming soon. Join our waitlist to be notified when your language is available."
  }
];

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      viewport={{ once: true }}
      className="border-b border-border/50"
    >
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          trackEvent('faq_item_clicked', { question, isOpen: !isOpen });
        }}
        className="w-full py-6 flex items-center justify-between text-left hover:text-primary transition-colors"
      >
        <span className="text-lg font-medium text-foreground pr-8">{question}</span>
        <ChevronDown
          className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <p className="text-muted-foreground pb-6 pr-12">{answer}</p>
      </motion.div>
    </motion.div>
  );
}

export default function FAQSection() {
  return (
    <div className="w-full flex items-center justify-center bg-transparent">
      <section className="relative max-w-[80rem] w-full px-6 md:px-8 py-20 flex flex-col items-center justify-center overflow-hidden bg-background mx-auto border-x border-t border-border/25 shadow-sm shadow-purple-500/5">
        <NoiseTexture />

        <div className="relative z-10 w-full max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-br from-yellow-400 via-pink-400 to-blue-500 bg-clip-text text-transparent">
                Frequently asked questions
              </span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              Everything you need to know about Websonic
            </p>
          </motion.div>

          {/* FAQ Items */}
          <div className="divide-y-0">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                index={index}
              />
            ))}
          </div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <p className="text-muted-foreground mb-4">
              Still have questions?
            </p>
            <a href="mailto:support@websonic.ai" className="text-primary hover:underline">
              Contact our support team
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}