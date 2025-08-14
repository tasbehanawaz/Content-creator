import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import WaitlistForm from '@/components/waitlist-form';

export default function WaitlistPage() {
  return (
    <section className="py-xl m-auto flex h-full max-w-lg items-center">
      <div className="w-full space-y-6">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="mb-4"
        >
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>
        </Button>

        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Join the Websonic Waitlist</h1>
          <p className="text-gray-400">
            Be among the first to experience the future of hands-free browsing
          </p>
        </div>

        <WaitlistForm
          source="waitlist-page"
          buttonText="Get Early Access"
        />

        <p className="text-center text-sm text-gray-500">
          We&apos;ll notify you as soon as Websonic is ready. No spam, ever.
        </p>
      </div>
    </section>
  );
}