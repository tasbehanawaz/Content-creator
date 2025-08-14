'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { Keyboard, Mic, Play } from 'lucide-react';

import SpeechWaveform from './SpeechWaveform';

// Get transcription text - prefer passed prompt over default mapping
const getTranscriptionText = (webpage: string, prompt?: string): string => {
  // If a prompt is provided, clean it up and use it (remove quotes)
  if (prompt) {
    return prompt.replace(/^["']|["']$/g, '');
  }

  // Fallback to default transcriptions for specific webpages
  const transcriptions = {
    vscode: "Write a function to calculate the fibonacci sequence",
    youtube: "Create a cheat sheet for this JavaScript tutorial and save it to Notion",
    docs: "Propose a few ideas on how to make this blog post more practical and make the edits",
    notion: "I need some research on how AI affects reader engagement in literature, write the next few paragraphs",
    linkedin: "Find the three most qualified DevOps engineers and draft personalized outreach messages",
    gmail: "Draft an email to the marketing team about Q3 campaign results using my usual style",
    chatgpt: "Which AI model would work best for this coding task? Switch to Claude if needed",
    n8n: "Add error handling and retry logic to this API call function",
    default: "Write a function to calculate the fibonacci sequence"
  };

  return transcriptions[webpage as keyof typeof transcriptions] || transcriptions.default;
};

function WebpageRecorderDemo({ webpage, prompt, response, showBothModes }: { webpage: string; prompt: string; response: string; showBothModes?: boolean }) {
  const [state, setState] = useState<'webpage' | 'recording' | 'response'>('webpage');
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text');
  const [typedText, setTypedText] = useState('');
  const [transcribedText, setTranscribedText] = useState('');
  const [aiGeneratedText, setAiGeneratedText] = useState('');

  useEffect(() => {
    if (isPaused) return;

    const initialTimer = setTimeout(() => {
      if (!isPaused) {
        setState('recording');
        setIsRecording(true);
      }
    }, 3000);

    const interval = setInterval(() => {
      if (!isPaused) {
        setState(currentState => {
          if (currentState === 'webpage' || currentState === 'response') {
            setIsRecording(true);
            // For showBothModes, alternate between text and voice
            if (showBothModes) {
              setInputMode(prev => prev === 'text' ? 'voice' : 'text');
              setTypedText('');
            }
            return 'recording';
          } else {
            setIsRecording(false);
            return 'response';
          }
        });
      }
    }, 4000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [isPaused, showBothModes]);

  // Typing animation effect
  useEffect(() => {
    if (state === 'recording' && inputMode === 'text' && !isPaused) {
      const chars = prompt.split('');
      let currentIndex = 0;

      const typeInterval = setInterval(() => {
        if (currentIndex < chars.length) {
          setTypedText(prev => prev + chars[currentIndex]);
          currentIndex++;
        } else {
          clearInterval(typeInterval);
        }
      }, 50);

      return () => clearInterval(typeInterval);
    }
  }, [state, inputMode, isPaused, prompt]);

  // Transcription animation effect for voice mode
  useEffect(() => {
    if (state === 'recording' && inputMode === 'voice' && isRecording && !isPaused) {
      const transcriptionText = getTranscriptionText(webpage, prompt);
      const chars = transcriptionText.split('');
      let currentIndex = 0;

      // Reset transcription when starting new recording
      setTranscribedText('');

      const transcribeInterval = setInterval(() => {
        if (currentIndex < chars.length) {
          setTranscribedText(prev => prev + chars[currentIndex]);
          currentIndex++;
        } else {
          clearInterval(transcribeInterval);
        }
      }, 80); // Slightly slower than typing for more realistic speech-to-text feel

      return () => clearInterval(transcribeInterval);
    } else if (state !== 'recording' || inputMode !== 'voice') {
      // Reset transcription when not in voice recording mode
      setTranscribedText('');
    }
  }, [state, inputMode, isRecording, isPaused, webpage, prompt]);

  // AI text generation effect for Notion
  useEffect(() => {
    if (state === 'response' && webpage === 'notion' && !isPaused) {
      const aiText = `However, recent studies indicate that AI tools may actually enhance rather than diminish reader engagement in contemporary literature. Research conducted by the Digital Humanities Lab at Stanford University suggests that readers show 23% higher engagement rates when interacting with AI-enhanced narratives.

Furthermore, the personalization capabilities of AI systems allow for dynamic story adaptation based on reader preferences and reading patterns. This creates what scholars term "responsive literature" - texts that evolve in real-time to maintain optimal reader engagement levels.

The implications for traditional narrative structures are profound. AI-assisted authors can now experiment with non-linear storytelling techniques that would have been impossible to execute effectively in conventional print media.`;

      const chars = aiText.split('');
      let currentIndex = 0;

      setAiGeneratedText('');

      const typeInterval = setInterval(() => {
        if (currentIndex < chars.length) {
          setAiGeneratedText(prev => prev + chars[currentIndex]);
          currentIndex++;
        } else {
          clearInterval(typeInterval);
        }
      }, 30); // Faster typing for AI generation

      return () => clearInterval(typeInterval);
    } else if (state !== 'response' || webpage !== 'notion') {
      setAiGeneratedText('');
    }
  }, [state, webpage, isPaused]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setIsPaused(false);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPaused(true);
  };

  const renderWebpage = () => {
    switch (webpage) {
      case 'youtube':
        return (
          <div className="w-full h-full bg-card rounded-xl overflow-hidden shadow-2xl border border-border">
            <div className="bg-card h-16 flex items-center justify-between px-6 border-b border-border">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <Image src="/logos/youtube.svg" alt="YouTube" width={32} height={32} />
                  <span className="text-lg font-semibold text-card-foreground">YouTube</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-muted rounded-full px-4 py-2 w-96">
                  <Image src="/logos/search.svg" alt="Search" width={20} height={20} className="mr-2" />
                  <span className="text-muted-foreground text-sm">JavaScript tutorial for beginners</span>
                </div>
                <div className="w-10 h-10 bg-muted rounded-full"></div>
                <div className="w-10 h-10 bg-muted rounded-full"></div>
                <div className="w-10 h-10 bg-muted rounded-full"></div>
                <div className="w-10 h-10 bg-muted rounded-full"></div>
              </div>
            </div>
            <div className="flex h-full">
              <div className="flex-1 p-6">
                <div className="bg-muted h-80 rounded-xl mb-6 flex items-center justify-center relative overflow-hidden">
                  <div className="text-muted-foreground text-center z-10">
                    <div className="text-xl font-semibold mb-2">JavaScript Course for Beginners</div>
                    <div className="text-sm">Programming with Mosh • 14.2M views • 2 years ago</div>
                    <div className="mt-4 flex items-center justify-center gap-4">
                      <div className="w-16 h-2 bg-muted-foreground/30 rounded"></div>
                      <span className="text-xs">17:40 / 48:16</span>
                    </div>
                  </div>
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center z-20"
                    animate={{
                      scale: [1, 1.05, 1],
                      opacity: [0.8, 1, 0.8],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <div className="w-20 h-20 bg-foreground/80 rounded-full flex items-center justify-center shadow-2xl">
                      <Play className="w-10 h-10 text-background ml-1" />
                    </div>
                  </motion.div>
                </div>
                <div className="space-y-4">
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                  <div className="flex gap-4 mt-6">
                    <div className="w-20 h-8 bg-muted rounded"></div>
                    <div className="w-20 h-8 bg-muted rounded"></div>
                    <div className="w-20 h-8 bg-muted rounded"></div>
                  </div>
                </div>
              </div>
              <div className="w-80 bg-gray-50 p-4 border-l border-gray-200">
                <div className="space-y-4">
                  <div className="h-24 bg-muted rounded-lg flex items-center p-3">
                    <div className="w-16 h-12 bg-muted-foreground/30 rounded mr-3"></div>
                    <div className="flex-1">
                      <div className="h-3 bg-muted-foreground/30 rounded w-full mb-1"></div>
                      <div className="h-2 bg-muted-foreground/30 rounded w-2/3"></div>
                    </div>
                  </div>
                  <div className="h-24 bg-muted rounded-lg flex items-center p-3">
                    <div className="w-16 h-12 bg-muted-foreground/30 rounded mr-3"></div>
                    <div className="flex-1">
                      <div className="h-3 bg-muted-foreground/30 rounded w-full mb-1"></div>
                      <div className="h-2 bg-muted-foreground/30 rounded w-2/3"></div>
                    </div>
                  </div>
                  <div className="h-24 bg-muted rounded-lg flex items-center p-3">
                    <div className="w-16 h-12 bg-muted-foreground/30 rounded mr-3"></div>
                    <div className="flex-1">
                      <div className="h-3 bg-muted-foreground/30 rounded w-full mb-1"></div>
                      <div className="h-2 bg-muted-foreground/30 rounded w-2/3"></div>
                    </div>
                  </div>
                  <div className="h-24 bg-muted rounded-lg flex items-center p-3">
                    <div className="w-16 h-12 bg-muted-foreground/30 rounded mr-3"></div>
                    <div className="flex-1">
                      <div className="h-3 bg-muted-foreground/30 rounded w-full mb-1"></div>
                      <div className="h-2 bg-muted-foreground/30 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'docs':
        return (
          <div className="w-full h-full bg-card rounded-xl overflow-hidden shadow-2xl border border-border">
            <div className="bg-card h-16 flex items-center justify-between px-6 border-b border-border">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <Image src="/logos/docs.svg" alt="Google Docs" width={32} height={32} />
                  <span className="text-lg font-semibold text-card-foreground">Google Docs</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-20 h-8 bg-muted rounded"></div>
                <div className="w-20 h-8 bg-muted rounded"></div>
                <div className="w-10 h-10 bg-muted rounded-full"></div>
              </div>
            </div>
            <div className="p-8">
              <div className="space-y-4">
                <div className="text-2xl font-bold text-card-foreground">The Future of Artificial Intelligence in Education</div>
                <div className="text-muted-foreground leading-relaxed">
                  <p className="mb-3">Artificial Intelligence (AI) has emerged as a transformative force in education, revolutionizing how students learn and educators teach. This technology offers unprecedented opportunities to personalize learning experiences, making education more accessible and effective for diverse student populations.</p>
                  <p className="mb-3">One of the most significant advantages of AI in education is its ability to provide personalized learning paths. Traditional classroom settings often follow a one-size-fits-all approach, which may not cater to individual learning styles and paces. AI-powered systems can analyze student performance data, identify learning gaps, and adapt content accordingly.</p>
                  <p className="mb-3">Furthermore, AI can assist educators by automating administrative tasks, allowing them to focus more on student interaction and creative teaching methods. From grading assignments to tracking attendance, AI tools can handle routine tasks efficiently.</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'linkedin':
        return (
          <div className="w-full h-full bg-white rounded-xl overflow-hidden shadow-2xl border border-gray-200">
            {/* LinkedIn Header */}
            <div className="bg-white h-14 flex items-center justify-between px-6 border-b border-gray-200">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <Image src="/logos/linkedin.svg" alt="LinkedIn" width={28} height={28} />
                  <span className="text-lg font-semibold text-gray-900">LinkedIn</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-gray-50 rounded-md px-3 py-1.5 w-80">
                  <Image src="/logos/search.svg" alt="Search" width={16} height={16} className="mr-2 opacity-60" />
                  <span className="text-gray-600 text-sm">DevOps Engineer</span>
                </div>
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-medium">ME</div>
              </div>
            </div>

            {/* Search Results Header */}
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">People</h2>
                  <p className="text-sm text-gray-600">847 results</p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-full hover:bg-gray-50">All filters</button>
                  <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-full hover:bg-gray-50">Locations</button>
                  <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-full hover:bg-gray-50">Current company</button>
                </div>
              </div>
            </div>

            {/* People Results */}
            <div className="p-6 space-y-4 overflow-y-auto">
              {/* Result 1 - Featured candidate */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">MR</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">Michael Rodriguez</h3>
                        <p className="text-gray-700 text-sm font-medium">Senior DevOps Engineer</p>
                      </div>
                      <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-full text-sm font-medium hover:bg-blue-50">Connect</button>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">Netflix • San Francisco Bay Area</p>
                    <p className="text-gray-600 text-sm mb-3">8+ years building scalable cloud infrastructure. AWS, Kubernetes, Docker, Terraform expert. Previously at Google and Uber.</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>• 500+ connections</span>
                      <span>• 2nd degree connection</span>
                      <span className="text-green-600">• Available for opportunities</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Result 2 */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">JK</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">Jessica Kim</h3>
                        <p className="text-gray-700 text-sm font-medium">Lead DevOps Engineer</p>
                      </div>
                      <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-full text-sm font-medium hover:bg-blue-50">Connect</button>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">Microsoft • Seattle, WA</p>
                    <p className="text-gray-600 text-sm mb-3">Infrastructure automation specialist. Azure, Jenkins, GitLab CI/CD, monitoring at enterprise scale. Open source contributor.</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>• 1,000+ connections</span>
                      <span>• 3rd degree connection</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Result 3 */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">AS</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">Alex Singh</h3>
                        <p className="text-gray-700 text-sm font-medium">DevOps Architecture Lead</p>
                      </div>
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200">Message</button>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">Amazon Web Services • Austin, TX</p>
                    <p className="text-gray-600 text-sm mb-3">Leading DevOps transformation for Fortune 500 companies. Specializes in containerization, microservices, and site reliability engineering.</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>• 1,500+ connections</span>
                      <span>• 1st degree connection</span>
                      <span className="text-blue-600">• Recently active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'gmail':
        return (
          <div className="w-full h-full bg-card rounded-xl overflow-hidden shadow-2xl border border-border">
            <div className="bg-card h-16 flex items-center justify-between px-6 border-b border-border">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <Image src="/logos/google.svg" alt="Gmail" width={32} height={32} />
                  <span className="text-lg font-semibold text-card-foreground">Gmail</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-20 h-8 bg-muted rounded"></div>
                <div className="w-10 h-10 bg-muted rounded-full"></div>
              </div>
            </div>
            <div className="p-6">
              <div className="bg-card border border-border rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-card-foreground">To:</span>
                    <span className="text-muted-foreground">marketing@company.com</span>
                  </div>
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    className="w-full border-b border-border pb-2 text-card-foreground outline-none"
                    value="Q3 Campaign Results"
                    readOnly
                  />
                </div>
                <div className="space-y-2 text-muted-foreground">
                  <p>Hi team,</p>
                  <p>I wanted to share the Q3 campaign results with everyone. The performance exceeded our expectations across all key metrics.</p>
                  <p>Looking forward to discussing our Q4 strategy based on these insights.</p>
                  <p>Best regards,<br />Sarah</p>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-4 h-4 bg-primary rounded-full animate-pulse"></div>
                    <span className="italic">Formatted in your usual style for marketing team emails</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'chatgpt':
        return (
          <div className="w-full h-full bg-[#1a1a1a] rounded-xl overflow-hidden shadow-2xl border border-gray-800">
            <div className="bg-[#212121] h-16 flex items-center justify-between px-6 border-b border-gray-800">
              <div className="flex items-center gap-4">
                <div className="text-lg font-semibold text-white">ChatGPT</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-[#2a2a2a] px-4 py-2 rounded-lg flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                    <Image src="/logos/openai.svg" alt="GPT-4" width={16} height={16} className="invert" />
                  </div>
                  <span className="text-white text-sm">GPT-4</span>
                  <div className="w-4 h-4 text-gray-400">▼</div>
                </div>
                <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-[#2a2a2a] rounded-lg p-4 max-w-[80%] ml-auto">
                <p className="text-gray-100">Help me optimize this React component for better performance</p>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                  <Image src="/logos/openai.svg" alt="GPT-4" width={20} height={20} className="invert" />
                </div>
                <div className="bg-[#2a2a2a] rounded-lg p-4 flex-1">
                  <p className="text-gray-100 mb-3">I&apos;ll help you optimize that React component. Here are several performance improvements...</p>
                  <div className="bg-[#1a1a1a] rounded p-3 text-xs text-gray-300 font-mono">
                    <div>const MemoizedComponent = React.memo(MyComponent);</div>
                    <div>{`// Use useCallback for event handlers`}</div>
                    <div>const handleClick = useCallback(() =&gt; ...</div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-orange-500/10 to-pink-500/10 rounded-lg p-4 border border-orange-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-orange-300">Model Selection Available</span>
                </div>
                <div className="flex gap-2">
                  {[
                    { name: 'Claude', color: 'from-orange-400 to-orange-600' },
                    { name: 'Gemini', color: 'from-blue-400 to-blue-600' },
                    { name: 'Mistral', color: 'from-purple-400 to-purple-600' }
                  ].map((model) => (
                    <div key={model.name} className={`px-3 py-1 rounded-full bg-gradient-to-r ${model.color} text-white text-xs font-medium`}>
                      {model.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 'vscode':
        return (
          <div className="w-full h-full bg-card rounded-xl overflow-hidden shadow-2xl border border-border">
            <div className="bg-[#1e1e1e] h-16 flex items-center justify-between px-6 border-b border-gray-800">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <Image src="/logos/vscode.svg" alt="VSCode" width={32} height={32} />
                  <span className="text-lg font-semibold text-foreground">VSCode.dev</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-muted-foreground text-sm">fibonacci.js</div>
                <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
              </div>
            </div>
            <div className="flex h-full bg-[#1e1e1e]">
              <div className="w-64 bg-[#252526] p-4 border-r border-gray-800">
                <div className="text-muted-foreground text-xs uppercase mb-3">Explorer</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 p-1 bg-[#37373d] rounded">
                    <div className="w-4 h-4 bg-blue-500 rounded-sm"></div>
                    <span className="text-foreground/90 text-sm">fibonacci.js</span>
                  </div>
                  <div className="flex items-center gap-2 p-1 hover:bg-[#2a2a2a] rounded">
                    <div className="w-4 h-4 bg-gray-600 rounded-sm"></div>
                    <span className="text-muted-foreground text-sm">index.html</span>
                  </div>
                  <div className="flex items-center gap-2 p-1 hover:bg-[#2a2a2a] rounded">
                    <div className="w-4 h-4 bg-gray-600 rounded-sm"></div>
                    <span className="text-muted-foreground text-sm">styles.css</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col">
                <div className="flex-1 p-6 font-mono text-sm leading-relaxed">
                  <div className="text-muted-foreground">{`// Function to calculate fibonacci sequence`}</div>
                  <div className="mt-2">
                    <span className="text-blue-400">function</span>
                    <span className="text-foreground/90"> </span>
                    <span className="text-yellow-300">fibonacci</span>
                    <span className="text-foreground/90">(</span>
                    <span className="text-orange-300">n</span>
                    <span className="text-foreground/90">) {'{'}</span>
                  </div>
                  <div className="ml-4">
                    <span className="text-blue-400">if</span>
                    <span className="text-foreground/90"> (</span>
                    <span className="text-orange-300">n</span>
                    <span className="text-foreground/90"> {'<='} </span>
                    <span className="text-green-300">1</span>
                    <span className="text-foreground/90">) </span>
                    <span className="text-blue-400">return</span>
                    <span className="text-foreground/90"> </span>
                    <span className="text-orange-300">n</span>
                    <span className="text-foreground/90">;</span>
                  </div>
                  <div className="ml-4 mt-2">
                    <span className="text-blue-400">let</span>
                    <span className="text-foreground/90"> </span>
                    <span className="text-orange-300">prev</span>
                    <span className="text-foreground/90"> = </span>
                    <span className="text-green-300">0</span>
                    <span className="text-foreground/90">, </span>
                    <span className="text-orange-300">curr</span>
                    <span className="text-foreground/90"> = </span>
                    <span className="text-green-300">1</span>
                    <span className="text-foreground/90">;</span>
                  </div>
                  <div className="ml-4">
                    <span className="text-blue-400">for</span>
                    <span className="text-foreground/90"> (</span>
                    <span className="text-blue-400">let</span>
                    <span className="text-foreground/90"> </span>
                    <span className="text-orange-300">i</span>
                    <span className="text-foreground/90"> = </span>
                    <span className="text-green-300">2</span>
                    <span className="text-foreground/90">; </span>
                    <span className="text-orange-300">i</span>
                    <span className="text-foreground/90"> {'<='} </span>
                    <span className="text-orange-300">n</span>
                    <span className="text-foreground/90">; </span>
                    <span className="text-orange-300">i</span>
                    <span className="text-foreground/90">++) {'{'}</span>
                  </div>
                  <div className="ml-8">
                    <span className="text-blue-400">const</span>
                    <span className="text-foreground/90"> </span>
                    <span className="text-orange-300">next</span>
                    <span className="text-foreground/90"> = </span>
                    <span className="text-orange-300">prev</span>
                    <span className="text-foreground/90"> + </span>
                    <span className="text-orange-300">curr</span>
                    <span className="text-foreground/90">;</span>
                  </div>
                  <div className="ml-8">
                    <span className="text-orange-300">prev</span>
                    <span className="text-foreground/90"> = </span>
                    <span className="text-orange-300">curr</span>
                    <span className="text-foreground/90">;</span>
                  </div>
                  <div className="ml-8">
                    <span className="text-orange-300">curr</span>
                    <span className="text-foreground/90"> = </span>
                    <span className="text-orange-300">next</span>
                    <span className="text-foreground/90">;</span>
                  </div>
                  <div className="ml-4">
                    <span className="text-foreground/90">{'}'}</span>
                  </div>
                  <div className="ml-4 mt-2">
                    <span className="text-blue-400">return</span>
                    <span className="text-foreground/90"> </span>
                    <span className="text-orange-300">curr</span>
                    <span className="text-foreground/90">;</span>
                  </div>
                  <div className="text-foreground/90">{'}'}</div>
                </div>
                <div className="bg-[#1e1e1e] border-t border-gray-800 p-4">
                  <div className="text-muted-foreground text-xs mb-1">TERMINAL</div>
                  <div className="font-mono text-sm text-green-400">✓ Function created successfully</div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'notion':
        return (
          <div className="w-full h-full bg-white rounded-xl overflow-hidden shadow-2xl border border-gray-200">
            {/* Notion header */}
            <div className="bg-white h-14 flex items-center justify-between px-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <Image src="/logos/notion.svg" alt="Notion" width={24} height={24} />
                <span className="text-gray-700 text-sm font-medium">Literary Analysis Essay - Due Tomorrow</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-xs text-gray-500">Share</div>
                <div className="text-xs text-gray-500">Updates</div>
                <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">SM</div>
              </div>
            </div>

            {/* Notion content */}
            <div className="p-8 bg-white">
              {/* Title */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">The Evolution of Artificial Intelligence in Modern Literature</h1>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span>Sarah M.</span>
                  </div>
                  <span>•</span>
                  <span>Last edited 2 minutes ago</span>
                </div>
              </div>

              {/* Essay content */}
              <div className="prose prose-lg max-w-none">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Introduction</h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  The intersection of artificial intelligence and literature represents one of the most fascinating developments in contemporary academic discourse. As AI technologies continue to evolve and permeate various aspects of human creativity, their impact on literary creation, analysis, and interpretation has become increasingly significant.
                </p>

                <p className="text-gray-700 leading-relaxed mb-6">
                  This essay explores how artificial intelligence is reshaping the landscape of modern literature, examining both the opportunities and challenges it presents to writers, readers, and literary scholars. From AI-assisted writing tools to algorithmic poetry generation, the boundaries between human and machine creativity are becoming increasingly blurred.
                </p>

                <h2 className="text-xl font-semibold text-gray-800 mb-4">The Rise of AI in Creative Writing</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Contemporary authors have begun incorporating AI tools into their creative processes in unprecedented ways. These technologies serve not merely as spell-checkers or grammar assistants, but as collaborative partners in the ideation and development of narrative structures.
                </p>

                {/* Dynamic content area - shows cursor during recording, AI text during response */}
                <div className="text-gray-700 leading-relaxed">
                  {state === 'response' && aiGeneratedText ? (
                    <div>
                      <p className="mb-4">{aiGeneratedText}</p>
                      <span className="inline-block w-0.5 h-5 bg-blue-500 animate-pulse"></span>
                    </div>
                  ) : (
                    <span className="inline-block w-0.5 h-5 bg-blue-500 animate-pulse ml-1"></span>
                  )}
                </div>

                {/* Rest of essay placeholder */}
                <div className="mt-8 space-y-4">
                  <h2 className="text-xl font-semibold text-gray-800">Impact on Reader Experience</h2>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>

                  <h2 className="text-xl font-semibold text-gray-800 mt-8">Conclusion</h2>
                  <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/5"></div>
                </div>
              </div>

              {/* Notion-style toolbar at bottom */}
              <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-2 flex items-center gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="text-sm">+</span>
                  <span className="text-xs">Add a block</span>
                </div>
                <div className="w-px h-4 bg-gray-300"></div>
                <div className="flex items-center gap-1">
                  <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center text-xs">B</div>
                  <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center text-xs">I</div>
                  <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center text-xs">U</div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'n8n':
        return (
          <div className="w-full h-full bg-[#f9f9f9] rounded-xl overflow-hidden shadow-2xl border border-border">
            <div className="bg-white h-16 flex items-center justify-between px-6 border-b border-gray-200">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <Image src="/logos/n8n.svg" alt="n8n" width={32} height={32} />
                  <span className="text-lg font-semibold text-gray-800">n8n</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">Workflow Editor</div>
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              </div>
            </div>

            <div className="flex h-full">
              {/* Left sidebar - Node palette */}
              <div className="w-64 bg-white border-r border-gray-200 p-4">
                <div className="text-sm font-medium text-gray-700 mb-3">Core Nodes</div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 bg-blue-50 rounded hover:bg-blue-100 cursor-pointer">
                    <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                      <span className="text-white text-xs">⚡</span>
                    </div>
                    <span className="text-sm">Code</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <div className="w-6 h-6 bg-gray-400 rounded flex items-center justify-center">
                      <span className="text-white text-xs">🌐</span>
                    </div>
                    <span className="text-sm">HTTP Request</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <div className="w-6 h-6 bg-gray-400 rounded flex items-center justify-center">
                      <span className="text-white text-xs">📊</span>
                    </div>
                    <span className="text-sm">Set</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <div className="w-6 h-6 bg-gray-400 rounded flex items-center justify-center">
                      <span className="text-white text-xs">🔄</span>
                    </div>
                    <span className="text-sm">Switch</span>
                  </div>
                </div>
              </div>

              {/* Main canvas area */}
              <div className="flex-1 bg-gray-50 relative overflow-hidden">
                {/* Canvas background pattern */}
                <div className="absolute inset-0" style={{
                  backgroundImage: 'radial-gradient(circle, #ddd 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }}></div>

                {/* Flow nodes */}
                <div className="absolute inset-0 p-8">
                  {/* Start node */}
                  <div className="absolute top-20 left-20">
                    <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md">
                      Start
                    </div>
                  </div>

                  {/* Code node - highlighted as active */}
                  <div className="absolute top-20 left-60">
                    <div className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg border-2 border-blue-300">
                      Code
                    </div>
                  </div>

                  {/* HTTP Request node */}
                  <div className="absolute top-20 left-96">
                    <div className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow-md">
                      HTTP Request
                    </div>
                  </div>

                  {/* Connection lines */}
                  <svg className="absolute inset-0 pointer-events-none">
                    <line x1="120" y1="32" x2="180" y2="32" stroke="#666" strokeWidth="2" markerEnd="url(#arrowhead)" />
                    <line x1="220" y1="32" x2="280" y2="32" stroke="#666" strokeWidth="2" markerEnd="url(#arrowhead)" />
                    <defs>
                      <marker id="arrowhead" markerWidth="10" markerHeight="7"
                        refX="9" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#666" />
                      </marker>
                    </defs>
                  </svg>
                </div>

                {/* Code editor panel */}
                <div className="absolute bottom-0 left-0 right-0 h-80 bg-white border-t border-gray-200 shadow-lg">
                  <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="font-medium text-gray-800">Code Node - JavaScript</span>
                    </div>
                    <div className="text-sm text-gray-500">Function Editor</div>
                  </div>

                  <div className="p-4 font-mono text-sm bg-gray-900 text-gray-100 h-full overflow-hidden">
                    <div className="space-y-1">
                      <div className="text-gray-400">{`// Enhanced API call with error handling and retry logic`}</div>
                      <div className="mt-2">
                        <span className="text-purple-400">async function</span>
                        <span className="text-white"> </span>
                        <span className="text-yellow-300">makeApiCall</span>
                        <span className="text-white">(</span>
                        <span className="text-orange-300">url</span>
                        <span className="text-white">, </span>
                        <span className="text-orange-300">options</span>
                        <span className="text-white"> = {`{}`}) {`{`}</span>
                      </div>
                      <div className="ml-4">
                        <span className="text-purple-400">const</span>
                        <span className="text-white"> </span>
                        <span className="text-orange-300">maxRetries</span>
                        <span className="text-white"> = </span>
                        <span className="text-green-300">3</span>
                        <span className="text-white">;</span>
                      </div>
                      <div className="ml-4">
                        <span className="text-purple-400">const</span>
                        <span className="text-white"> </span>
                        <span className="text-orange-300">retryDelay</span>
                        <span className="text-white"> = </span>
                        <span className="text-green-300">1000</span>
                        <span className="text-white">;</span>
                      </div>
                      <div className="mt-2 ml-4">
                        <span className="text-purple-400">for</span>
                        <span className="text-white"> (</span>
                        <span className="text-purple-400">let</span>
                        <span className="text-white"> </span>
                        <span className="text-orange-300">attempt</span>
                        <span className="text-white"> = </span>
                        <span className="text-green-300">1</span>
                        <span className="text-white">; </span>
                        <span className="text-orange-300">attempt</span>
                        <span className="text-white"> {`<=`} </span>
                        <span className="text-orange-300">maxRetries</span>
                        <span className="text-white">; </span>
                        <span className="text-orange-300">attempt</span>
                        <span className="text-white">++) {`{`}</span>
                      </div>
                      <div className="ml-8">
                        <span className="text-purple-400">try</span>
                        <span className="text-white"> {`{`}</span>
                      </div>
                      <div className="ml-12">
                        <span className="text-purple-400">const</span>
                        <span className="text-white"> </span>
                        <span className="text-orange-300">response</span>
                        <span className="text-white"> = </span>
                        <span className="text-purple-400">await</span>
                        <span className="text-white"> </span>
                        <span className="text-yellow-300">fetch</span>
                        <span className="text-white">(</span>
                        <span className="text-orange-300">url</span>
                        <span className="text-white">, </span>
                        <span className="text-orange-300">options</span>
                        <span className="text-white">);</span>
                      </div>
                      <div className="ml-12">
                        <span className="text-purple-400">return</span>
                        <span className="text-white"> </span>
                        <span className="text-orange-300">response</span>
                        <span className="text-white">;</span>
                      </div>
                      <div className="ml-8">
                        <span className="text-white">{`}`} </span>
                        <span className="text-purple-400">catch</span>
                        <span className="text-white"> (</span>
                        <span className="text-orange-300">error</span>
                        <span className="text-white">) {`{`}</span>
                      </div>
                      <div className="ml-12 text-gray-400">{`// Retry logic with exponential backoff`}</div>
                      <div className="ml-8 text-white">{`}`}</div>
                      <div className="ml-4 text-white">{`}`}</div>
                      <div className="text-white">{`}`}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="w-full h-full bg-card rounded-xl overflow-hidden shadow-2xl border border-border">
            <div className="bg-card h-16 flex items-center justify-between px-6 border-b border-border">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <Image
                    src="/logo.png"
                    width={32}
                    height={32}
                    alt="Websonic logo"
                    className="rounded"
                  />
                  <span className="text-lg font-semibold text-card-foreground">Websonic</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-muted rounded-full"></div>
                <div className="w-10 h-10 bg-muted rounded-full"></div>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 text-card-foreground">Output Mode Selection</h3>
                <div className="flex gap-4 justify-center">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center w-32 hover:bg-blue-100 transition-colors">
                    <div className="w-12 h-12 bg-blue-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                      <div className="w-6 h-6 bg-white rounded-full"></div>
                    </div>
                    <div className="text-sm font-medium text-blue-900">Voice Output</div>
                    <div className="text-xs text-blue-700 mt-1">Audio responses</div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center w-32 hover:bg-green-100 transition-colors">
                    <div className="w-12 h-12 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                      <div className="w-6 h-6 bg-white rounded"></div>
                    </div>
                    <div className="text-sm font-medium text-green-900">Text Mode</div>
                    <div className="text-xs text-green-700 mt-1">Written responses</div>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center w-32 hover:bg-purple-100 transition-colors">
                    <div className="w-12 h-12 bg-purple-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                      <div className="w-6 h-6 bg-white rounded"></div>
                    </div>
                    <div className="text-sm font-medium text-purple-900">Edit Mode</div>
                    <div className="text-xs text-purple-700 mt-1">Direct editing</div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
            </div>
          </div>
        );
    }
  };

  const renderRecorderUI = () => (
    <motion.div
      className="absolute top-4 right-4 z-10"
      initial={{ opacity: 0, scale: 0.9, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {showBothModes && inputMode === 'text' ? (
        <div className="bg-background/90 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-border/50 min-w-[320px]">
          <div className="flex items-center gap-3 mb-3">
            <Keyboard className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-muted-foreground font-medium">Tired mode • Type your command</span>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700/30">
            <div className="text-sm text-muted-foreground font-mono">
              {typedText}
              <span className="inline-block w-0.5 h-4 bg-blue-400 ml-0.5 animate-pulse"></span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-background/90 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-border/50 min-w-[360px]">
          <div className="flex flex-col gap-4">
            {/* Transcription text */}
            <div className="min-h-[24px] px-2">
              <div className="text-sm text-foreground font-medium overflow-hidden whitespace-nowrap">
                {transcribedText}
                {isRecording && (
                  <span className="inline-block w-0.5 h-4 bg-orange-400 ml-1 animate-pulse"></span>
                )}
              </div>
            </div>

            {/* Waveform */}
            <div className="rounded-xl px-6 py-4 flex items-center justify-center" style={{ background: '#353535', border: '1px solid #494949' }}>
              <SpeechWaveform
                webpage={webpage}
                isRecording={isRecording}
                className="w-64 h-7"
              />
            </div>

            {/* Mic icon at bottom */}
            <div className="flex justify-center">
              <div className="w-8 h-8 bg-orange-400/20 rounded-full flex items-center justify-center">
                <Mic className="w-4 h-4 text-orange-400" />
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );

  const renderResponseUI = () => (
    <motion.div
      className="absolute top-4 right-4 bg-gradient-to-br from-pink-100/80 via-yellow-100/80 to-blue-100/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-orange-300/40 p-6 w-80 z-10"
      initial={{ opacity: 0, scale: 0.9, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse shadow-lg shadow-orange-500/50"></div>
          <span className="text-sm font-semibold text-card-foreground">Websonic Response</span>
        </div>
      </div>

      <div className="bg-card/50 backdrop-blur-sm border border-orange-200/40 rounded-xl p-4">
        <div className="text-sm text-card-foreground">
          {webpage === 'vscode' && (
            <div>
              <div className="font-semibold mb-3 text-orange-600 flex items-center gap-2">
                <span className="text-lg">✅</span>
                Code written successfully
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <div>• Fibonacci function created</div>
                <div>• Optimized iterative approach</div>
                <div>• Ready to run in VSCode.dev</div>
              </div>
            </div>
          )}
          {webpage === 'youtube' && (
            <div>
              <div className="font-semibold mb-3 text-orange-600 flex items-center gap-2">
                <span className="text-lg">✅</span>
                Cheatsheet added to Notion
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <div>• Key Python concepts from video</div>
                <div>• Important formulas and definitions</div>
                <div>• Best practices and tips</div>
              </div>
            </div>
          )}
          {webpage === 'docs' && (
            <div>
              <div className="font-semibold mb-3 text-orange-600 flex items-center gap-2">
                <span className="text-lg">📝</span>
                AI Suggestions
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <div>• Add practical examples to introduction</div>
                <div>• Clarify main argument in second paragraph</div>
                <div>• Consider restructuring conclusion</div>
              </div>
            </div>
          )}
          {webpage === 'notion' && (
            <div>
              <div className="font-semibold mb-3 text-orange-600 flex items-center gap-2">
                <span className="text-lg">✍️</span>
                Essay Research Added
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <div>• Found 3 key studies on AI-reader interaction</div>
                <div>• Added 4 new paragraphs with citations</div>
                <div>• Enhanced argument flow and transitions</div>
              </div>
            </div>
          )}
          {webpage === 'linkedin' && (
            <div>
              <div className="font-semibold mb-3 text-orange-600 flex items-center gap-2">
                <span className="text-lg">🎯</span>
                Top DevOps Engineers Found
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <div>• <span className="font-medium text-card-foreground">Michael Rodriguez</span> - Netflix, 8+ years</div>
                <div>• <span className="font-medium text-card-foreground">Jessica Kim</span> - Microsoft, Lead DevOps</div>
                <div>• <span className="font-medium text-card-foreground">Alex Singh</span> - AWS, Architecture Lead</div>
                <div>• Personalized outreach messages ready</div>
              </div>
            </div>
          )}
          {webpage === 'n8n' && (
            <div>
              <div className="font-semibold mb-3 text-orange-600 flex items-center gap-2">
                <span className="text-lg">⚡</span>
                Code Enhanced Successfully
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <div>• Added error handling and retry logic</div>
                <div>• Implemented exponential backoff</div>
                <div>• Function ready for production use</div>
              </div>
            </div>
          )}
          {webpage === 'default' && (
            <div className="text-xs text-muted-foreground">
              Response generated based on your request...
            </div>
          )}
          {webpage === 'chatgpt' && (
            <div>
              <div className="font-semibold mb-3 text-orange-600 flex items-center gap-2">
                <span className="text-lg">🤖</span>
                Model Switched Successfully
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <div>• Accessing Claude 3.5 for this task</div>
                <div>• Better reasoning capabilities activated</div>
                <div>• Cost: $0 extra with Websonic</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      className="relative w-full h-[500px] rounded-xl overflow-hidden cursor-pointer group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="absolute inset-0 z-0">
        {renderWebpage()}
      </div>

      {isPaused && !isHovered && (
        <motion.div
          className="absolute top-4 left-4 z-20"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-gradient-to-r from-orange-500/90 to-orange-600/90 backdrop-blur-sm rounded-lg px-4 py-2 text-sm text-white font-medium shadow-lg border border-orange-400/30 flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            Hover to interact
          </div>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {state === 'recording' && !isPaused && (
          <motion.div
            key="recording"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{
              duration: 0.5,
              ease: [0.32, 0.72, 0, 1],
              opacity: { duration: 0.3 }
            }}
          >
            {renderRecorderUI()}
          </motion.div>
        )}

        {state === 'response' && !isPaused && (
          <motion.div
            key="response"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{
              duration: 0.5,
              ease: [0.32, 0.72, 0, 1],
              opacity: { duration: 0.3 }
            }}
          >
            {renderResponseUI()}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default WebpageRecorderDemo;