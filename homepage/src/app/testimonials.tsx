
'use client';

import { motion } from 'framer-motion';

const testimonials = [
  {
    quote: "WebZone changed the way I work. Voice commands everywhere!",
    author: "Alex P.",
    company: "Instacart",
    avatar: "/public/logos/microphone.svg"
  },
  {
    quote: "Super smooth, works in all my favorite apps. 10/10.",
    author: "Samira K.",
    company: "OpenAI",
    avatar: "/public/logos/microsoft.svg"
  },
  {
    quote: "The best browser extension for productivity.",
    author: "Jordan L.",
    company: "Figma",
    avatar: "/public/logos/google.svg"
  },
  {
    quote: "AI in every tab is a game changer.",
    author: "Chris T.",
    company: "Notion",
    avatar: "/public/logos/notion.svg"
  },
  {
    quote: "Setup was instant, and it just works.",
    author: "Morgan S.",
    company: "Weights & Biases",
    avatar: "/public/logos/uber.svg"
  },
  {
    quote: "I use WebZone every day. Highly recommended.",
    author: "Taylor R.",
    company: "Varda",
    avatar: "/public/logos/vscode.svg"
  },
  {
    quote: "The voice-to-text is shockingly accurate.",
    author: "Jamie F.",
    company: "Google",
    avatar: "/public/logos/gmail.svg"
  },
  {
    quote: "Love the design and the seamless integration.",
    author: "Riley Q.",
    company: "New Computer",
    avatar: "/public/logos/github.svg"
  },
  {
    quote: "It feels like magic. Can't wait for more features!",
    author: "Casey W.",
    company: "Internet",
    avatar: "/public/logos/microphone.svg"
  },
  {
    quote: "WebZone is hands down my biggest workflow improvement in years",
    author: "Steven T.",
    company: "Dub",
    avatar: "/public/logos/integration.svg"
  },
  {
    quote: "I love writing code and WebZone is a necessity. Steps ahead of my brain.",
    author: "Andrew M.",
    company: "Notion",
    avatar: "/public/logos/docs.svg"
  },
  {
    quote: "WebZone is so good, and literally gets better every couple of weeks.",
    author: "Morgan M.",
    company: "Weights & Biases",
    avatar: "/public/logos/privacy.svg"
  }
];

function TestimonialCard({ testimonial, index }: { testimonial: any; index: number }) {
  return (
    <div className="mb-6 min-h-fit w-full">
      <div className="group relative flex flex-col gap-16 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 md:gap-18 md:rounded-2.5xl md:px-6 md:py-6.5 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_4px_32px_rgba(236,72,153,0.12)]">
        {/* Animated background on hover */}
        <div className="absolute bottom-0 left-0 hidden w-full opacity-0 transition-opacity duration-300 group-hover:opacity-20 lg:block">
          <svg
            className="absolute -left-[72%] bottom-0 overflow-visible aspect-[2/1] w-[250%] translate-y-1/2 blur-[56px] saturate-150"
            fill="none"
            viewBox="0 0 701 467"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g className="transform-gpu">
              <motion.path
                animate={{
                  transform: [
                    "matrix(1,0,0,1,0,0)",
                    "matrix(1,0,0,1,32,-32)",
                    "matrix(1,0,0,1,0,0)"
                  ]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                d="M407.64 132.674 511.646 108l81.075 17.082V326.27H419.103l-31.111-98.696 19.648-94.9Z"
                fill="#548A05"
              />
              <motion.path
                animate={{
                  transform: [
                    "matrix(1,0,0,1,0,0)",
                    "matrix(1,0,0,1,-32,32)",
                    "matrix(1,0,0,1,0,0)"
                  ]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                d="m357.667 186.498 72.448-19.143 56.475 13.253v156.09H365.651l-21.671-76.572 13.687-73.628Z"
                fill="#F28C1F"
              />
              <motion.path
                animate={{
                  transform: [
                    "matrix(1,0,0,1,0,0)",
                    "matrix(1,0,0,1,16,-24)",
                    "matrix(1,0,0,1,0,0)"
                  ]
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                d="m243.752 200.799 86.172-18.321 67.174 12.683v149.388H253.249l-25.776-73.284 16.279-70.466Z"
                fill="#A41F7E"
              />
            </g>
          </svg>
        </div>

        {/* Quote */}
        <p className="text-sm leading-[1.125rem] md:text-base md:leading-[1.375rem] relative text-gray-300 transition-colors duration-300 group-hover:text-white">
          {testimonial.quote}
        </p>

        {/* Author section */}
        <div className="relative mt-auto flex items-center gap-3">
          <div className="size-[2.6875rem] md:size-[3.25rem] rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden border border-zinc-700">
            <div className="w-6 h-6 bg-gradient-to-r from-pink-200 via-blue-200 to-yellow-200 rounded-full"></div>
          </div>
          <div>
            <p className="text-base leading-[1.125rem] md:text-lg md:leading-[1.5rem] flex items-center text-white transition-colors duration-300">
              {testimonial.author}
            </p>
            <p className="text-base leading-[1.125rem] md:text-lg md:leading-[1.5rem] text-gray-400 transition-colors duration-300 group-hover:text-gray-300">
              {testimonial.company}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TestimonialColumn({ testimonials, direction = 'up', speed = 50 }: {
  testimonials: any[];
  direction?: 'up' | 'down';
  speed?: number;
}) {
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <div className="h-full overflow-hidden w-[350px] flex-shrink-0">
      <motion.div
        className="flex flex-col w-full"
        animate={{
          y: direction === 'up' ? ['0%', '-50%'] : ['-50%', '0%']
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: 'linear'
        }}
      >
        {duplicatedTestimonials.map((testimonial, index) => (
          <TestimonialCard key={index} testimonial={testimonial} index={index} />
        ))}
      </motion.div>
    </div>
  );
}

export default function Testimonials() {
  const column1 = testimonials.slice(0, 4);
  const column2 = testimonials.slice(4, 8);
  const column3 = testimonials.slice(8, 12);

  return (
    <section className="overflow-hidden py-16 bg-black">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-3xl font-bold mb-12 bg-gradient-to-br from-yellow-400 via-pink-400 to-blue-500 bg-clip-text text-transparent">
          What our users say
        </h2>

        <div className="relative h-[600px] -mx-4">
          <div className="absolute left-1/2 flex h-full origin-top -translate-x-1/2 justify-center gap-6">
            <div className="h-full overflow-hidden">
              <TestimonialColumn testimonials={column1} direction="up" speed={60} />
            </div>
            <div className="h-full overflow-hidden">
              <TestimonialColumn testimonials={column2} direction="down" speed={50} />
            </div>
            <div className="h-full overflow-hidden">
              <TestimonialColumn testimonials={column3} direction="up" speed={70} />
            </div>
          </div>

          {/* Gradient overlays for fade effect */}
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black to-transparent pointer-events-none z-10" />
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black to-transparent pointer-events-none z-10" />
        </div>
      </div>
    </section>
  );
}