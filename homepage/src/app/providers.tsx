'use client';

import { Suspense, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';

function PostHogProviderInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize PostHog on mount
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: '/ingest',
      ui_host: 'https://us.posthog.com',
      defaults: '2025-05-24',
      capture_exceptions: true,
      debug: process.env.NODE_ENV === 'development',
    });
  }, []);

  // Manually capture pageviews when the route changes
  useEffect(() => {
    if (pathname) {
      let url = window.origin + pathname;
      if (searchParams && searchParams.toString()) {
        url = url + '?' + searchParams.toString();
      }
      posthog.capture('$pageview', {
        $current_url: url,
      });
    }
  }, [pathname, searchParams]);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <PostHogProviderInner>{children}</PostHogProviderInner>
    </Suspense>
  );
}

// Custom hook for tracking scroll depth
export function useScrollTracking() {
  useEffect(() => {
    let maxScroll = 0;
    const trackScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );

      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;

        // Track milestone scroll depths
        if (maxScroll >= 25 && maxScroll < 50) {
          posthog.capture('scroll_depth', { depth: 25 });
        } else if (maxScroll >= 50 && maxScroll < 75) {
          posthog.capture('scroll_depth', { depth: 50 });
        } else if (maxScroll >= 75 && maxScroll < 90) {
          posthog.capture('scroll_depth', { depth: 75 });
        } else if (maxScroll >= 90) {
          posthog.capture('scroll_depth', { depth: 90 });
        }
      }
    };

    window.addEventListener('scroll', trackScroll, { passive: true });
    return () => window.removeEventListener('scroll', trackScroll);
  }, []);
}

// Helper function to track events
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    posthog.capture(eventName, properties);
  }
};
