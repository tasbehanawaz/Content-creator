'use client';

import FAQSection from './faqSection';
import FeaturesSection from './featuresSection';
import HeroSection from './heroSection';
import ManyApps from './manyApps';
import PricingSection from './pricingSection';
import { useScrollTracking } from './providers';
// import Testimonials from './testimonials';

export default function HomePage() {
  useScrollTracking();

  return (
    <main className="w-full min-w-full flex flex-col overflow-hidden">
      <HeroSection />
      <ManyApps />
      {/* <ClientsSection /> */}
      <FeaturesSection />
      <PricingSection />
      {/* <Testimonials /> */}
      <FAQSection />
    </main>
  );
}
