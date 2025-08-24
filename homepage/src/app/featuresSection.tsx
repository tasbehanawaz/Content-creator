'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Bot, Palette, Share, Sparkles, Video } from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Design Tools",
      description: "Create stunning visuals with our AI-powered design tools",
      gradient: "from-[#FEC601]/10 via-[#EA7317]/10 to-[#2364AA]/10",
      iconColor: "text-[#FEC601]"
    },
    {
      icon: <Video className="w-6 h-6" />,
      title: "Video Creation",
      description: "Edit and enhance videos with just a few clicks",
      gradient: "from-[#73BFB8]/10 via-[#3DA5D9]/10 to-[#2364AA]/10",
      iconColor: "text-[#73BFB8]"
    },
    {
      icon: <Share className="w-6 h-6" />,
      title: "Social Media",
      description: "Schedule and manage your content across platforms",
      gradient: "from-[#3DA5D9]/10 via-[#73BFB8]/10 to-[#EA7317]/10",
      iconColor: "text-[#3DA5D9]"
    },
    {
      icon: <Bot className="w-6 h-6" />,
      title: "AI Assistant",
      description: "Get content suggestions and writing help instantly",
      gradient: "from-[#EA7317]/10 via-[#FEC601]/10 to-[#73BFB8]/10",
      iconColor: "text-[#EA7317]"
    }
  ];

  return (
    <section className="w-full py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6 max-w-[1200px]"
          >
            <span className="bg-gradient-to-r from-[#2364AA] to-[#73BFB8] bg-clip-text text-transparent inline-block">
              Everything you need to{' '}
            </span>
            <span className="text-[#FEC601] inline-block ml-1">
              create amazing content
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto whitespace-nowrap px-4"
          >
            Powerful tools to help you create, edit, and publish content faster than ever
          </motion.p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative rounded-2xl overflow-hidden backdrop-blur-sm"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-50 group-hover:opacity-70 transition-opacity`} />
              <div className="relative p-8 border border-border/50 rounded-2xl h-full hover:shadow-lg transition-all duration-300">
                <div className={`${feature.iconColor} mb-6 transform group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {feature.description}
                </p>
                <div className={`flex items-center ${feature.iconColor} font-medium`}>
                  Learn more
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}