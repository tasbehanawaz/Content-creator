'use client';


import Content from './content';
import FeaturesSection from './featuresSection';
import HeroSection from './heroSection';
import { useScrollTracking } from './providers';
// import Testimonials from './testimonials';

export default function HomePage() {
  useScrollTracking();

  return (
    <main className="w-full min-w-full flex flex-col overflow-hidden">
      <HeroSection />
      <Content />
      <FeaturesSection />
    </main>
  );
}
