'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BarChart,
  Calendar,
  FileText,
  GitPullRequest,
  History,
  Link2,
  Mail,
  ShoppingCart,
  Sparkles,
  X
} from 'lucide-react';

const contextExamples = [
  {
    id: 'gmail',
    name: 'Gmail',
    icon: '/logos/gmail.svg',
    title: 'Meeting Request from Sarah Chen',
    subtitle: 'Can we sync up next week to discuss Q4 planning?',
    context: 'Email about scheduling a meeting',
    actions: [
      { icon: Calendar, label: 'Pick a meeting time', color: 'from-blue-400 to-blue-600' },
      { icon: X, label: 'Politely decline', color: 'from-red-400 to-red-600' },
      { icon: Mail, label: 'Draft a follow-up', color: 'from-green-400 to-green-600' }
    ]
  },
  {
    id: 'amazon',
    name: 'Amazon',
    icon: '/logos/amazon.svg',
    title: 'Sony WH-1000XM5 Wireless Headphones',
    subtitle: '$349.99 - Premium Noise Cancelling',
    context: 'Product page for electronics',
    actions: [
      { icon: ShoppingCart, label: 'Compare alternatives', color: 'from-orange-400 to-orange-600' },
      { icon: BarChart, label: 'Summarize reviews', color: 'from-purple-400 to-purple-600' },
      { icon: History, label: 'Track price history', color: 'from-indigo-400 to-indigo-600' }
    ]
  },
  {
    id: 'github',
    name: 'GitHub',
    icon: '/logos/github.svg',
    title: 'PR #1847: Add dark mode support',
    subtitle: 'muqsitnawaz wants to merge 12 commits into main',
    context: 'Pull request for code review',
    actions: [
      { icon: GitPullRequest, label: 'Review this PR', color: 'from-green-400 to-green-600' },
      { icon: FileText, label: 'Explain changes', color: 'from-blue-400 to-blue-600' },
      { icon: Link2, label: 'Find related issues', color: 'from-purple-400 to-purple-600' }
    ]
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

function ContextDemo() {
  const [activeExample, setActiveExample] = useState(0);
  const [showActions, setShowActions] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-cycle through examples
  useEffect(() => {
    if (isPaused) return;

    const cycleInterval = setInterval(() => {
      setActiveExample((prev) => (prev + 1) % contextExamples.length);
      setShowActions(false);
    }, 4000);

    const actionTimeout = setTimeout(() => {
      setShowActions(true);
    }, 1500);

    return () => {
      clearInterval(cycleInterval);
      clearTimeout(actionTimeout);
    };
  }, [activeExample, isPaused]);

  const currentExample = contextExamples[activeExample];

  const renderWebpage = () => {
    switch (currentExample.id) {
      case 'gmail':
        return (
          <div className="w-full h-full bg-card rounded-xl overflow-hidden shadow-2xl border border-border">
            <div className="bg-card h-16 flex items-center justify-between px-6 border-b border-border">
              <div className="flex items-center gap-3">
                <Image src="/logos/gmail.svg" alt="Gmail" width={32} height={32} />
                <span className="text-lg font-semibold text-card-foreground">Gmail</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-20 h-8 bg-muted rounded"></div>
                <div className="w-10 h-10 bg-muted rounded-full"></div>
              </div>
            </div>
            <div className="p-6">
              <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      SC
                    </div>
                    <div>
                      <div className="font-semibold text-card-foreground">{currentExample.title}</div>
                      <div className="text-sm text-muted-foreground">sarah.chen@company.com</div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">2 hours ago</div>
                </div>
                <div className="text-card-foreground">
                  <p className="mb-3">Hi there,</p>
                  <p className="mb-3">{currentExample.subtitle}</p>
                  <p className="mb-3">I have some exciting updates about our product roadmap that I&apos;d love to share with you. Would you be available for a 30-minute call sometime next week?</p>
                  <p>Best regards,<br />Sarah</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'amazon':
        return (
          <div className="w-full h-full bg-card rounded-xl overflow-hidden shadow-2xl border border-border">
            <div className="bg-card h-16 flex items-center justify-between px-6 border-b border-border">
              <div className="flex items-center gap-3">
                <Image src="/logos/amazon.svg" alt="Amazon" width={100} height={30} />
              </div>
              <div className="flex items-center gap-4">
                <div className="w-32 h-10 bg-muted rounded-full"></div>
                <div className="w-20 h-8 bg-muted rounded"></div>
              </div>
            </div>
            <div className="flex p-6">
              <div className="w-1/3 pr-6">
                <div className="bg-muted h-64 rounded-lg flex items-center justify-center">
                  <div className="text-muted-foreground">Product Image</div>
                </div>
                <div className="flex gap-2 mt-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-16 h-16 bg-muted rounded"></div>
                  ))}
                </div>
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-card-foreground mb-2">{currentExample.title}</h1>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex text-yellow-500">
                    {'★★★★☆'}
                  </div>
                  <span className="text-sm text-muted-foreground">4.5 (2,847 reviews)</span>
                </div>
                <div className="text-3xl font-bold text-card-foreground mb-4">{currentExample.subtitle}</div>
                <div className="space-y-2 text-muted-foreground">
                  <p>✓ Industry-leading noise cancellation</p>
                  <p>✓ 30-hour battery life</p>
                  <p>✓ Premium comfort with soft fit leather</p>
                  <p>✓ Speak-to-chat technology</p>
                </div>
                <div className="flex gap-4 mt-6">
                  <button className="bg-yellow-400 text-black px-6 py-2 rounded-lg font-semibold">
                    Add to Cart
                  </button>
                  <button className="bg-orange-400 text-white px-6 py-2 rounded-lg font-semibold">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'github':
        return (
          <div className="w-full h-full bg-card rounded-xl overflow-hidden shadow-2xl border border-border">
            <div className="bg-card h-16 flex items-center justify-between px-6 border-b border-border">
              <div className="flex items-center gap-3">
                <Image src="/logos/github.svg" alt="GitHub" width={32} height={32} />
                <span className="text-lg font-semibold text-card-foreground">GitHub</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-20 h-8 bg-muted rounded"></div>
                <div className="w-10 h-10 bg-muted rounded-full"></div>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-card-foreground mb-2">{currentExample.title}</h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Open</span>
                  <span>{currentExample.subtitle}</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-card-foreground">Conversation</span>
                    <span className="text-sm text-muted-foreground">12 comments</span>
                  </div>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-card-foreground">Commits</span>
                    <span className="text-sm text-muted-foreground">12</span>
                  </div>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-card-foreground">Files changed</span>
                    <span className="text-sm text-muted-foreground">23</span>
                  </div>
                  <div className="text-sm text-green-600">+847 additions</div>
                  <div className="text-sm text-red-600">-234 deletions</div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Website mockup */}
        <motion.div
          key={currentExample.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          {renderWebpage()}
        </motion.div>

        {/* Context menu */}
        <AnimatePresence>
          {showActions && (
            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 30
              }}
              className="absolute top-24 right-8 z-20"
            >
              <div className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-purple-500/20 p-1">
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-white">WebSonic Actions</span>
                  </div>

                  <div className="space-y-2">
                    {currentExample.actions.map((action, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center gap-3 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg p-3 transition-all group"
                      >
                        <div className={`w-8 h-8 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <action.icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm text-gray-200 font-medium">{action.label}</span>
                      </motion.button>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-700/50">
                    <p className="text-xs text-gray-400 italic">
                      {currentExample.context}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation dots */}
      <div className="flex items-center justify-center gap-3 mt-8">
        {contextExamples.map((example, index) => (
          <button
            key={example.id}
            onClick={() => {
              setActiveExample(index);
              setShowActions(false);
              setTimeout(() => setShowActions(true), 1500);
            }}
            className={`transition-all duration-300 ${index === activeExample
                ? 'w-8 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full'
                : 'w-3 h-3 bg-gray-600 hover:bg-gray-500 rounded-full'
              }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function ContextMenuSection() {
  return (
    <div className="w-full flex items-center justify-center bg-transparent">
      <section className="relative max-w-full w-full py-24 flex flex-col items-center justify-center overflow-hidden bg-background border-x border-t border-border/25 shadow-sm shadow-purple-500/5">
        <NoiseTexture />

        <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
          {/* Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-br from-yellow-400 via-pink-400 to-blue-500 bg-clip-text text-transparent leading-tight">
              AI That Actually Understands What You&apos;re Doing
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Websonic reads the room. Get intelligent suggestions that match your exact context—from scheduling meetings in Gmail to analyzing code changes in GitHub. No more copy-paste gymnastics.
            </p>
          </motion.div>

          {/* Demo */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <ContextDemo />
          </motion.div>

          {/* Feature highlights */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {[
              {
                title: "Reads Context, Not Just Text",
                description: "Understands the entire page context to provide intelligent, relevant actions",
                icon: Sparkles
              },
              {
                title: "Zero Learning Curve",
                description: "Intuitive actions that make sense immediately—no manual or tutorials needed",
                icon: Calendar
              },
              {
                title: "Actions That Actually Make Sense",
                description: "No more generic responses. Get precise actions tailored to what you're actually doing",
                icon: Link2
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                <feature.icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}