import { Check, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { getProducts } from '@/features/pricing/controllers/get-products';

import { PricingCard } from './price-card';

export async function PricingSection({ isPricingPage }: { isPricingPage?: boolean }) {
  const products = await getProducts();
  const HeadingLevel = isPricingPage ? 'h1' : 'h2';

  return (
    <section id="pricing" className="relative bg-gradient-to-br from-[#fbc2eb]/40 via-[#a6c1ee]/30 to-transparent py-20 px-2">
      <div className="mx-auto flex max-w-screen-xl flex-col gap-8 px-4 py-14 md:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <h4 className="text-xl font-bold tracking-tight text-black dark:text-white">Pricing</h4>
          <h2 className="text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#fbc2eb] via-[#a6c1ee] to-[#60a5fa] sm:text-6xl">
            Simple pricing for everyone.
          </h2>
          <p className="mt-6 text-xl leading-8 text-black/80 dark:text-white">
            Choose an <strong>affordable plan</strong> that&apos;s packed with the best features for engaging your audience, creating customer loyalty, and driving sales.
          </p>
        </div>

        <div className="flex w-full items-center justify-center space-x-2">
          <button
            type="button"
            role="switch"
            aria-checked="false"
            className="peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input"
            title="Toggle annual pricing"
          >
            <span className="pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform translate-x-0" />
          </button>
          <span>Annual</span>
          <span className="inline-block whitespace-nowrap rounded-full bg-black px-2.5 py-1 text-[11px] font-semibold uppercase leading-5 tracking-wide text-white dark:bg-white dark:text-black">
            2 MONTHS FREE <Sparkles className="inline w-3 h-3 ml-1" />
          </span>
        </div>

        <div className="mx-auto grid w-full justify-center sm:grid-cols-2 lg:grid-cols-4 flex-col gap-6">
          {products.map((product) => (
            <PricingCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
