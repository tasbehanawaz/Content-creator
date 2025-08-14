'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Check, FileText, Globe, Mic, Send, Shield, Sparkles, X } from 'lucide-react';

export default function ComparisonTable() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 1.3 }}
      className="w-full max-w-6xl"
    >
      <div className="text-center mb-12">
        <h3 className="text-2xl font-bold text-foreground mb-4"><span className="text-primary font-linebeam">Us</span> vs. them</h3>
        <p className="text-muted-foreground text-lg">100% money-back guarantee, no questions asked.</p>
      </div>

      <div className="overflow-x-auto bg-background rounded-lg border border-gray-700/50 backdrop-blur-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-600">
              <th className="p-4 text-left"></th>
              <th className="p-4 border-x border-gray-600 w-[100px]">
                <div className="flex justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                      <Image
                        src="/logos/websonic-color.png"
                        alt="Websonic"
                        width={32}
                        height={32}
                        className="h-8 w-8"
                      />
                    </div>
                    <span className="text-foreground font-semibold text-xs">Websonic</span>
                  </div>
                </div>
              </th>
              <th className="border-l border-gray-600 p-2 w-[100px]">
                <div className="flex justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <Image
                      src="/logos/chrome-color.svg"
                      alt="Chrome"
                      width={32}
                      height={32}
                      className="h-8 w-8 p-1 grayscale"
                    />
                    <span className="text-muted-foreground text-xs">Chrome</span>
                  </div>
                </div>
              </th>
              <th className="border-l border-gray-600 p-2 w-[100px]">
                <div className="flex justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <Image
                      src="/logos/maxai-color.png"
                      alt="Max AI"
                      width={32}
                      height={32}
                      className="h-8 w-8 p-1"
                    />
                    <span className="text-muted-foreground text-xs">Max AI</span>
                  </div>
                </div>
              </th>
              <th className="border-l border-gray-600 p-2 w-[100px]">
                <div className="flex justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <Image
                      src="/logos/perplexity-color.png"
                      alt="Perplexity"
                      width={32}
                      height={32}
                      className="h-8 w-8 p-1"
                    />
                    <span className="text-muted-foreground text-xs">Perplexity</span>
                  </div>
                </div>
              </th>
              <th className="border-l border-gray-600 p-2 w-[100px]">
                <div className="flex justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <Image
                      src="/logos/copilot-color.svg"
                      alt="Microsoft Copilot"
                      width={32}
                      height={32}
                      className="h-8 w-8 p-1 grayscale"
                    />
                    <span className="text-muted-foreground text-xs">Copilot</span>
                  </div>
                </div>
              </th>
              <th className="border-l border-gray-600 p-2 w-[100px]">
                <div className="flex justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <Image
                      src="/logos/gemini-color.svg"
                      alt="Google Gemini"
                      width={32}
                      height={32}
                      className="h-8 w-8 p-1"
                    />
                    <span className="text-muted-foreground text-xs">Gemini</span>
                  </div>
                </div>
              </th>
              <th className="border-l border-gray-600 p-2 w-[100px]">
                <div className="flex justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <Image
                      src="/logos/siri-color.svg"
                      alt="Siri/Alexa"
                      width={32}
                      height={32}
                      className="h-8 w-8 p-1 grayscale"
                    />
                    <span className="text-muted-foreground text-xs">Siri/Alexa</span>
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-gray-700 bg-primary/5">
              <td className="px-3 py-3">
                <div className="flex items-center gap-2">
                  <Mic className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-sm font-semibold text-foreground">Voice-first interface</span>
                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">Major Differentiator</span>
                </div>
              </td>
              <td className="border-x border-gray-600 py-0">
                <div className="flex h-full w-full items-center justify-center">
                  <Check className="w-5 h-5 text-green-500" />
                </div>
              </td>
              <td className="border-l border-gray-600 py-0">
                <div className="flex h-full w-full items-center justify-center">
                  <X className="w-5 h-5 text-red-500" />
                </div>
              </td>
              <td className="border-l border-gray-600 py-0">
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-xs text-orange-400">Pro Only</span>
                </div>
              </td>
              <td className="border-l border-gray-600 py-0">
                <div className="flex h-full w-full items-center justify-center">
                  <X className="w-5 h-5 text-red-500" />
                </div>
              </td>
              <td className="border-l border-gray-600 py-0">
                <div className="flex h-full w-full items-center justify-center">
                  <X className="w-5 h-5 text-red-500" />
                </div>
              </td>
              <td className="border-l border-gray-600 py-0">
                <div className="flex h-full w-full items-center justify-center">
                  <Check className="w-5 h-5 text-green-500" />
                </div>
              </td>
              <td className="border-l border-gray-600 py-0">
                <div className="flex h-full w-full items-center justify-center">
                  <Check className="w-5 h-5 text-green-500" />
                </div>
              </td>
            </tr>
            <tr className="border-t border-gray-700 bg-primary/5">
              <td className="px-3 py-3">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-sm font-semibold text-foreground">Third-party Integrations</span>
                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">Ease of use</span>
                </div>
              </td>
              <td className="border-x border-gray-600 py-0">
                <div className="flex h-full w-full items-center justify-center">
                  <Check className="w-5 h-5 text-green-500" />
                </div>
              </td>
              <td className="border-l border-gray-600 py-0">
                <div className="flex h-full w-full items-center justify-center">
                  <X className="w-5 h-5 text-red-500" />
                </div>
              </td>
              <td className="border-l border-gray-600 py-0">
                <div className="flex h-full w-full items-center justify-center">
                  <X className="w-5 h-5 text-red-500" />
                </div>
              </td>
              <td className="border-l border-gray-600 py-0">
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-xs text-orange-400">API Only</span>
                </div>
              </td>
              <td className="border-l border-gray-600 py-0">
                <div className="flex h-full w-full items-center justify-center">
                  <X className="w-5 h-5 text-red-500" />
                </div>
              </td>
              <td className="border-l border-gray-600 py-0">
                <div className="flex h-full w-full items-center justify-center">
                  <X className="w-5 h-5 text-red-500" />
                </div>
              </td>
              <td className="border-l border-gray-600 py-0">
                <div className="flex h-full w-full items-center justify-center">
                  <X className="w-5 h-5 text-red-500" />
                </div>
              </td>
            </tr>
            <tr className="border-t border-gray-700 bg-primary/5">
              <td className="px-3 py-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-sm font-semibold text-foreground">Auto-memory creation</span>
                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">Next-Gen</span>
                </div>
              </td>
              <td className="border-x border-gray-600 py-0">
                <div className="flex h-full w-full items-center justify-center">
                  <Check className="w-5 h-5 text-green-500" />
                </div>
              </td>
              <td className="border-l border-gray-600 py-0">
                <div className="flex h-full w-full items-center justify-center">
                  <X className="w-5 h-5 text-red-500" />
                </div>
              </td>
              <td className="border-l border-gray-600 py-0">
                <div className="flex h-full w-full items-center justify-center">
                  <X className="w-5 h-5 text-red-500" />
                </div>
              </td>
              <td className="border-l border-gray-600 py-0">
                <div className="flex h-full w-full items-center justify-center">
                  <X className="w-5 h-5 text-red-500" />
                </div>
              </td>
              <td className="border-l border-gray-600 py-0">
                <div className="flex h-full w-full items-center justify-center">
                  <X className="w-5 h-5 text-red-500" />
                </div>
              </td>
              <td className="border-l border-gray-600 py-0">
                <div className="flex h-full w-full items-center justify-center">
                  <X className="w-5 h-5 text-red-500" />
                </div>
              </td>
              <td className="border-l border-gray-600 py-0">
                <div className="flex h-full w-full items-center justify-center">
                  <X className="w-5 h-5 text-red-500" />
                </div>
              </td>
            </tr>
            <tr className="border-t border-gray-700">
              <td className="px-3 py-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm font-semibold text-muted-foreground">Context-aware adaptive menus</span>
                </div>
              </td>
              <td className="border-x border-gray-600 py-0">
                <div className="flex h-full w-full items-center justify-center">
                  <Check className="w-5 h-5 text-green-500" />
                </div>
              </td>
              <td className="border-l border-gray-600 py-0">
                <div className="flex h-full w-full items-center justify-center">
                  <X className="w-5 h-5 text-red-500" />
                </div>
              </td>
              <td className="border-l border-gray-600 py-0">
                <div className="flex h-full w-full items-center justify-center">
                  <X className="w-5 h-5 text-red-500" />
                </div>
              </td>
              <td className="border-l border-gray-600 py-0">
                <div className="flex h-full w-full items-center justify-center">
                  <X className="w-5 h-5 text-red-500" />
                </div>
              </td>
              <td className="border-l border-gray-600 py-0">
                <div className="flex h-full w-full items-center justify-center">
                  <X className="w-5 h-5 text-red-500" />
                </div>
              </td>
              <td className="border-l border-gray-600 py-0">
                <div className="flex h-full w-full items-center justify-center">
                  <X className="w-5 h-5 text-red-500" />
                </div>
              </td>
              <td className="border-l border-gray-600 py-0">
                <div className="flex h-full w-full items-center justify-center">
                  <X className="w-5 h-5 text-red-500" />
                </div>
              </td>
            </tr>
            <tr className="border-t border-gray-700">
              <td className="px-3 py-3">
                <div className="flex items-center gap-2">
                  <Send className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm font-semibold text-muted-foreground">Default web search</span>
                </div>
              </td>
              <td className="border-x border-gray-600 py-0">
                <div className="flex h-full w-full items-center justify-center">
                  <Check className="w-5 h-5 text-green-500" />
                </div>
              </td>
              <td className="border-l border-gray-600 py-0">
                <div className="flex h-full w-full items-center justify-center">
                  <X className="w-5 h-5 text-red-500" />
                </div>
              </td>
              <td className="border-l border-gray-600 py-0">
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-xs text-orange-400">Limited</span>
                </div>
              </td>
              <td className="border-l border-gray-600 py-0">
                <div className="flex h-full w-full items-center justify-center">
                  <Check className="w-5 h-5 text-green-500" />
                </div>
              </td>
              <td className="border-l border-gray-600 py-0">
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-xs text-orange-400">Basic</span>
                </div>
              </td>
              <td className="border-l border-gray-600 py-0">
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-xs text-orange-400">Basic</span>
                </div>
              </td>
              <td className="border-l border-gray-600 py-0">
                <div className="flex h-full w-full items-center justify-center">
                  <X className="w-5 h-5 text-red-500" />
                </div>
              </td>
            </tr>
            <tr className="border-t border-gray-700">
              <td className="px-3 py-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm font-semibold text-muted-foreground">Website-grouped conversations</span>
                </div>
              </td>
              <td className="border-x border-gray-600 py-0">
                <div className="flex h-full w-full items-center justify-center">
                  <Check className="w-5 h-5 text-green-500" />
                </div>
              </td>
              <td className="border-l border-gray-600 py-0">
                <div className="flex h-full w-full items-center justify-center">
                  <X className="w-5 h-5 text-red-500" />
                </div>
              </td>
              <td className="border-l border-gray-600 py-0">
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-xs text-orange-400">Basic</span>
                </div>
              </td>
              <td className="border-l border-gray-600 py-0">
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-xs text-orange-400">Basic</span>
                </div>
              </td>
              <td className="border-l border-gray-600 py-0">
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-xs text-orange-400">Basic</span>
                </div>
              </td>
              <td className="border-l border-gray-600 py-0">
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-xs text-orange-400">Basic</span>
                </div>
              </td>
              <td className="border-l border-gray-600 py-0">
                <div className="flex h-full w-full items-center justify-center">
                  <X className="w-5 h-5 text-red-500" />
                </div>
              </td>
            </tr>
            <tr className="border-t border-gray-700">
              <td className="px-3 py-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm font-semibold text-muted-foreground">Privacy-focused (local processing)</span>
                </div>
              </td>
              <td className="border-x border-gray-600 py-0">
                <div className="flex h-full w-full items-center justify-center">
                  <Check className="w-5 h-5 text-green-500" />
                </div>
              </td>
              <td className="border-l border-gray-600 py-0">
                <div className="flex h-full w-full items-center justify-center">
                  <X className="w-5 h-5 text-red-500" />
                </div>
              </td>
              <td className="border-l border-gray-600 py-0">
                <div className="flex h-full w-full items-center justify-center">
                  <X className="w-5 h-5 text-red-500" />
                </div>
              </td>
              <td className="border-l border-gray-600 py-0">
                <div className="flex h-full w-full items-center justify-center">
                  <X className="w-5 h-5 text-red-500" />
                </div>
              </td>
              <td className="border-l border-gray-600 py-0">
                <div className="flex h-full w-full items-center justify-center">
                  <X className="w-5 h-5 text-red-500" />
                </div>
              </td>
              <td className="border-l border-gray-600 py-0">
                <div className="flex h-full w-full items-center justify-center">
                  <X className="w-5 h-5 text-red-500" />
                </div>
              </td>
              <td className="border-l border-gray-600 py-0">
                <div className="flex h-full w-full items-center justify-center">
                  <X className="w-5 h-5 text-red-500" />
                </div>
              </td>
            </tr>
            <tr className="border-t border-gray-700">
              <td className="px-3 py-3">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm font-semibold text-muted-foreground">Cross-tab browser control</span>
                </div>
              </td>
              <td className="border-x border-gray-600 py-0">
                <div className="flex h-full w-full items-center justify-center">
                  <Check className="w-5 h-5 text-green-500" />
                </div>
              </td>
              <td className="border-l border-gray-600 py-0">
                <div className="flex h-full w-full items-center justify-center">
                  <X className="w-5 h-5 text-red-500" />
                </div>
              </td>
              <td className="border-l border-gray-600 py-0">
                <div className="flex h-full w-full items-center justify-center">
                  <X className="w-5 h-5 text-red-500" />
                </div>
              </td>
              <td className="border-l border-gray-600 py-0">
                <div className="flex h-full w-full items-center justify-center">
                  <X className="w-5 h-5 text-red-500" />
                </div>
              </td>
              <td className="border-l border-gray-600 py-0">
                <div className="flex h-full w-full items-center justify-center">
                  <X className="w-5 h-5 text-red-500" />
                </div>
              </td>
              <td className="border-l border-gray-600 py-0">
                <div className="flex h-full w-full items-center justify-center">
                  <X className="w-5 h-5 text-red-500" />
                </div>
              </td>
              <td className="border-l border-gray-600 py-0">
                <div className="flex h-full w-full items-center justify-center">
                  <X className="w-5 h-5 text-red-500" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}