'use client';

import { motion } from 'framer-motion';
import { Brush, Code, FileText, Laptop, MessageSquare, Presentation, Video } from 'lucide-react';

// Content types we support
const contentTypes = [
  {
    icon: <Video className="w-8 h-8" />,
    title: "Video Content",
    description: "Create engaging video content with AI-powered editing and effects",
    bgColor: "from-[#FEC601]/10 to-[#EA7317]/10",
    iconColor: "text-[#FEC601]"
  },
  {
    icon: <FileText className="w-8 h-8" />,
    title: "Blog Posts",
    description: "Generate and optimize blog content with AI assistance",
    bgColor: "from-[#73BFB8]/10 to-[#2364AA]/10",
    iconColor: "text-[#73BFB8]"
  },
  {
    icon: <MessageSquare className="w-8 h-8" />,
    title: "Social Media",
    description: "Craft engaging posts for all your social platforms",
    bgColor: "from-[#3DA5D9]/10 to-[#73BFB8]/10",
    iconColor: "text-[#3DA5D9]"
  }
];

// AI Templates showcase
const aiTemplates = [
  {
    icon: <Presentation className="w-8 h-8" />,
    title: "Content Strategy",
    description: "AI-powered content planning and ideation",
    bgColor: "from-[#EA7317]/10 to-[#FEC601]/10",
    iconColor: "text-[#EA7317]"
  },
  {
    icon: <Brush className="w-8 h-8" />,
    title: "Design Assistant",
    description: "Generate and enhance visuals with AI",
    bgColor: "from-[#2364AA]/10 to-[#3DA5D9]/10",
    iconColor: "text-[#2364AA]"
  },
  {
    icon: <Code className="w-8 h-8" />,
    title: "Technical Writing",
    description: "Create documentation and technical content easily",
    bgColor: "from-[#73BFB8]/10 to-[#EA7317]/10",
    iconColor: "text-[#73BFB8]"
  }
];

function ContentCard({ item, index }: { item: any; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group relative rounded-2xl overflow-hidden"
    >
      <div className={`p-8 bg-gradient-to-br ${item.bgColor} border border-border/50 rounded-2xl backdrop-blur-sm
        hover:shadow-lg transition-all duration-300 h-full`}
      >
        <div className={`${item.iconColor} mb-6 transform group-hover:scale-110 transition-transform duration-300`}>
          {item.icon}
        </div>
        <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
        <p className="text-muted-foreground">{item.description}</p>
      </div>
    </motion.div>
  );
}

export default function ContentCreationSection() {
  return (
    <div className="w-full flex items-center justify-center bg-transparent">
      <section className="relative max-w-[80rem] w-full px-6 md:px-8 py-24 bg-background mx-auto">
        <div className="relative z-10 w-full flex flex-col items-center">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-[#2364AA] to-[#73BFB8] bg-clip-text text-transparent inline-block">
                Create Any Type of
              </span>
              {' '}
              <span className="text-[#FEC601] inline-block">
                Content with AI
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From ideation to publishing, our AI-powered tools help you create content that engages your audience
            </p>
          </motion.div>

          {/* Content Types Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mb-16">
            {contentTypes.map((type, index) => (
              <ContentCard key={type.title} item={type} index={index} />
            ))}
          </div>

          {/* AI Templates Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl font-bold mb-4">
              <span className="bg-gradient-to-r from-[#EA7317] to-[#FEC601] bg-clip-text text-transparent">
                AI Templates
              </span>
            </h3>
            <p className="text-lg text-muted-foreground mb-8">
              Start with our pre-built templates or create your own
            </p>
          </motion.div>

          {/* AI Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {aiTemplates.map((template, index) => (
              <ContentCard key={template.title} item={template} index={index} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}