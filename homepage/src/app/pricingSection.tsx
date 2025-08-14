'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';

import ComparisonTable from '@/components/ComparisonTable';
import { Button } from '@/components/ui/button';

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

const pricingPlans = [
  {
    name: 'Starter',
    price: '$0',
    period: 'forever',
    description: 'Perfect for trying out Websonic - completely free, no credit card required',
    features: [
      '10 voice commands per month',
      'Basic browser automation',
      'Single tab control',
      'Community support',
      'All AI models included',
      'No usage tracking or data selling',
      'No surprise charges ever'
    ],
    cta: 'Start Free',
    popular: false
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/month',
    description: 'Full transparency: $19/month, billed monthly. No annual lock-in required.',
    features: [
      '1,000 voice commands per month',
      'Advanced automation workflows',
      'Multi-tab orchestration',
      'Priority support (24h response)',
      'All AI models + future releases',
      'Custom voice shortcuts',
      'Basic API access (500 requests/month)',
      'Cancel anytime, keep access until billing ends'
    ],
    cta: 'Join Waitlist',
    popular: true
  },
  {
    name: 'Max',
    price: '$100',
    period: '/month',
    description: 'For power users and teams who need unlimited everything',
    features: [
      'Unlimited voice commands',
      'Unlimited automation workflows',
      'Multi-tab orchestration',
      'White-glove support (2h response)',
      'All AI models + beta access',
      'Custom voice shortcuts & workflows',
      'Full API access (unlimited requests)',
      'Priority feature requests',
      'Cancel anytime, keep access until billing ends'
    ],
    cta: 'Contact Sales',
    popular: false
  }
];

export default function PricingSection() {
  return (
    <div className="w-full flex items-center justify-center bg-transparent">
      <section className="relative max-w-[80rem] w-full px-6 md:px-8 py-20 flex flex-col items-center justify-center overflow-hidden bg-black mx-auto border-x border-t border-gray-700/25 shadow-sm shadow-purple-500/5">
        <NoiseTexture />

        <div className="relative z-10 w-full">
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
                Finally, <span className="font-black">honest pricing</span>
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-8">
              Unlike other AI extensions that hide costs and lock features behind paywalls, we believe in complete transparency. <span className="font-bold text-white">No complicated credit systems.</span> <span className="font-bold text-white">No confusing tokens.</span> What you see is what you pay.
            </p>

            {/* Trust indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-12">
              <div className="flex items-center justify-center gap-2 text-green-400 bg-green-400/10 rounded-lg px-4 py-2">
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">No hidden fees</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-green-400 bg-green-400/10 rounded-lg px-4 py-2">
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">Cancel anytime</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-green-400 bg-green-400/10 rounded-lg px-4 py-2">
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">30-day money back</span>
              </div>
            </div>
          </motion.div>

          {/* Comparison Table */}
          <div className="flex justify-center mb-16">
            <ComparisonTable />
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative rounded-2xl p-8 ${plan.popular
                  ? 'bg-gradient-to-b from-primary/20 to-primary/5 border-2 border-primary/50'
                  : 'bg-gray-900/50 border border-gray-700/50'
                  }`}
              >
                {plan.popular && (
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                    <div className="bg-primary text-black text-sm font-bold px-4 py-1 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      MOST POPULAR
                    </div>
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400">{plan.period}</span>
                  </div>
                  <p className="text-gray-400">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  variant={plan.popular ? "primary" : "outline"}
                  className={`w-full h-12 text-base font-medium ${!plan.popular && 'border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                >
                  <Link
                    href={plan.name === 'Teams' ? 'mailto:sales@websonic.ai?subject=Teams%20Plan%20Inquiry' : '/waitlist'}
                    onClick={() => trackEvent('pricing_plan_clicked', {
                      plan: plan.name,
                      price: plan.price,
                      isPopular: plan.popular,
                      location: 'pricing_section'
                    })}
                  >
                    {plan.cta}
                  </Link>
                </Button>
              </motion.div>
            ))}
          </div>

          {/* Transparency Promise */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">Our Transparency Promise</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div>
                  <h4 className="text-lg font-semibold text-blue-400 mb-2">What we DON&apos;T do:</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 mt-1">✗</span>
                      <span>Complicated credit systems</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 mt-1">✗</span>
                      <span>Hidden subscription fees</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 mt-1">✗</span>
                      <span>Lock you into annual contracts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 mt-1">✗</span>
                      <span>Confusing token systems</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 mt-1">✗</span>
                      <span>Sell your data to third parties</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-green-400 mb-2">What we DO guarantee:</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                      <span>Price shown = price paid</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                      <span>30-day money-back guarantee</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                      <span>All AI models included in price</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                      <span>Your data stays private</span>
                    </li>
                  </ul>
                </div>
              </div>
              <p className="text-gray-400 mt-6 text-sm">
                Questions about pricing? Email us at <span className="text-blue-400">pricing@websonic.ai</span> - we&apos;ll give you a straight answer.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}