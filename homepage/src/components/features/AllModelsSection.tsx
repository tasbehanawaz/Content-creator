'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, DollarSign, Sparkles } from 'lucide-react';

const models = [
  {
    id: 'gpt-4',
    name: 'GPT-4',
    provider: 'OpenAI',
    icon: '/logos/openai.svg',
    response: "I'll analyze your requirements and provide a comprehensive solution with detailed explanations and best practices.",
    color: 'from-green-400 to-green-600',
    monthlyPrice: '$20'
  },
  {
    id: 'claude-3.5',
    name: 'Claude 3.5',
    provider: 'Anthropic',
    icon: '/logos/claude.svg',
    response: "Let me help you with that. I'll break this down into clear steps and ensure the solution is both efficient and maintainable.",
    color: 'from-orange-400 to-orange-600',
    monthlyPrice: '$20'
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    provider: 'Google',
    icon: '/logos/google.svg',
    response: "Based on my analysis, here's an optimized approach that leverages the latest techniques and patterns.",
    color: 'from-blue-400 to-blue-600',
    monthlyPrice: '$20'
  },
  {
    id: 'mistral',
    name: 'Mistral',
    provider: 'Mistral AI',
    icon: '/logos/mistral.svg',
    response: "I understand your needs. Here's a solution that balances performance with simplicity.",
    color: 'from-purple-400 to-purple-600',
    monthlyPrice: '$15'
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

function ChatInterface() {
  const [selectedModel, setSelectedModel] = useState(models[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentResponseIndex, setCurrentResponseIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Auto-cycle through models
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentResponseIndex((prev) => (prev + 1) % models.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Update selected model when auto-cycling
  useEffect(() => {
    setSelectedModel(models[currentResponseIndex]);
    setIsTyping(true);
    setTypedText('');
  }, [currentResponseIndex]);

  // Typing animation
  useEffect(() => {
    if (!isTyping) return;

    const response = selectedModel.response;
    let currentIndex = 0;

    const typeInterval = setInterval(() => {
      if (currentIndex < response.length) {
        setTypedText(response.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typeInterval);
      }
    }, 30);

    return () => clearInterval(typeInterval);
  }, [selectedModel, isTyping]);

  const handleModelSelect = (model: typeof models[0]) => {
    setSelectedModel(model);
    setIsDropdownOpen(false);
    setIsTyping(true);
    setTypedText('');
    // Stop auto-cycling when user interacts
    const index = models.findIndex(m => m.id === model.id);
    setCurrentResponseIndex(index);
  };

  return (
    <div className="w-full h-full bg-[#1a1a1a] rounded-xl overflow-hidden shadow-2xl border border-gray-800">
      {/* Header */}
      <div className="bg-[#212121] h-16 flex items-center justify-between px-6 border-b border-gray-800">
        <div className="flex items-center gap-4">
          <div className="text-lg font-semibold text-white">Websonic Chat</div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] px-4 py-2 rounded-lg transition-colors"
            >
              <div className={`w-8 h-8 rounded bg-gradient-to-br ${selectedModel.color} flex items-center justify-center`}>
                {selectedModel.icon && (
                  <Image src={selectedModel.icon} alt={selectedModel.name} width={20} height={20} className="invert" />
                )}
              </div>
              <span className="text-white font-medium">{selectedModel.name}</span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-64 bg-[#2a2a2a] rounded-lg shadow-xl border border-gray-700 overflow-hidden z-50"
                >
                  {models.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => handleModelSelect(model)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#3a3a3a] transition-colors text-left"
                    >
                      <div className={`w-8 h-8 rounded bg-gradient-to-br ${model.color} flex items-center justify-center flex-shrink-0`}>
                        {model.icon && (
                          <Image src={model.icon} alt={model.name} width={20} height={20} className="invert" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-medium">{model.name}</div>
                        <div className="text-gray-400 text-xs">{model.provider}</div>
                      </div>
                      <div className="text-gray-500 text-sm">{model.monthlyPrice}</div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-6 space-y-4 h-[400px] overflow-y-auto">
        {/* User Message */}
        <div className="flex justify-end">
          <div className="bg-[#2d2d2d] rounded-lg px-4 py-3 max-w-[80%]">
            <p className="text-gray-100">Can you help me build a React component that showcases different AI models?</p>
          </div>
        </div>

        {/* AI Response */}
        <div className="flex gap-3">
          <div className={`w-8 h-8 rounded bg-gradient-to-br ${selectedModel.color} flex items-center justify-center flex-shrink-0`}>
            {selectedModel.icon && (
              <Image src={selectedModel.icon} alt={selectedModel.name} width={20} height={20} className="invert" />
            )}
          </div>
          <div className="flex-1">
            <div className="text-sm text-gray-400 mb-1">{selectedModel.name}</div>
            <div className="bg-[#2a2a2a] rounded-lg px-4 py-3">
              <p className="text-gray-100">
                {typedText}
                {isTyping && <span className="inline-block w-0.5 h-4 bg-blue-400 ml-0.5 animate-pulse" />}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-800 p-4">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Ask anything..."
            className="flex-1 bg-[#2a2a2a] text-white placeholder-gray-500 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

function PricingComparison() {
  const totalSeparateCost = models.reduce((sum, model) => {
    const price = parseInt(model.monthlyPrice.replace('$', ''));
    return sum + price;
  }, 0);

  return (
    <motion.div
      className="bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 rounded-2xl p-8 border border-orange-200"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="flex items-center justify-between flex-wrap gap-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Save $55+ Every Month</h3>
          <p className="text-gray-600">Stop overpaying for separate AI subscriptions</p>
        </div>
        <div className="flex items-center gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-400 line-through">${totalSeparateCost}/mo</div>
            <div className="text-sm text-gray-500">Separate subscriptions</div>
          </div>
          <div className="text-4xl">→</div>
          <div className="text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">$20/mo</div>
            <div className="text-sm text-gray-600 font-medium">With Websonic</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function AllModelsSection() {
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
              Best Models. In One Place.
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Why pay $75+ monthly for separate AI subscriptions? Get instant access to GPT-4, Claude 3.5, Gemini Pro, and emerging models for $20/month.
            </p>
          </motion.div>

          {/* Main Demo */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <ChatInterface />
          </motion.div>

          {/* Pricing Comparison */}
          <PricingComparison />

          {/* Feature Pills */}
          <motion.div
            className="flex flex-wrap justify-center gap-4 mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {[
              { icon: Sparkles, text: "Switch models instantly" },
              { icon: DollarSign, text: "75% cheaper than separate subscriptions" },
              { icon: Sparkles, text: "Latest models added automatically" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-2 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-full px-6 py-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <feature.icon className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-gray-300">{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}