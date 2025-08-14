'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle, Loader2, User } from 'lucide-react';

import { trackEvent } from '@/app/providers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface WaitlistFormProps {
  source?: string;
  showExtendedForm?: boolean;
  buttonText?: string;
  className?: string;
}

export default function WaitlistForm({
  source = 'homepage',
  showExtendedForm = false,
  buttonText = 'Join waitlist',
  className = ''
}: WaitlistFormProps) {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [useCase, setUseCase] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'email' | 'congrats' | 'complete'>('email');
  const [isOnWaitlist, setIsOnWaitlist] = useState(false);
  const [error, setError] = useState('');

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          source
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join waitlist');
      }

      trackEvent('waitlist_signup_email', {
        source
      });

      setIsOnWaitlist(true);
      setStep('congrats');
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/waitlist/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          full_name: fullName
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to complete profile');
      }

      trackEvent('waitlist_profile_complete', {
        source,
        hasFullName: !!fullName
      });

      setStep('complete');
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExtendedSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          full_name: fullName,
          company,
          use_case: useCase,
          source
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join waitlist');
      }

      trackEvent('waitlist_signup', {
        source,
        hasFullName: !!fullName,
        hasCompany: !!company,
        hasUseCase: !!useCase
      });

      setIsOnWaitlist(true);
      setStep('complete');
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Final success state
  if (step === 'complete') {
    return (
      <div className={`flex items-center gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/20 ${className}`}>
        <CheckCircle className="w-5 h-5 text-green-500" />
        <p className="text-green-400">Perfect! Check your email for confirmation. We&apos;ll be in touch soon.</p>
      </div>
    );
  }

  // Congratulations step - ask for name
  if (step === 'congrats' && !showExtendedForm) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <p className="text-green-400 font-medium">🎉 Congrats! You&apos;re on the waitlist.</p>
        </div>

        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">Finish your profile</h3>
          <p className="text-sm text-gray-400">Help us personalize your experience</p>
        </div>

        <form onSubmit={handleProfileComplete} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              What&apos;s your name?
            </Label>
            <Input
              id="fullName"
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={isLoading || !fullName}
              className="flex-1 group"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Completing...
                </>
              ) : (
                <>
                  Complete Profile
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setStep('complete')}
              disabled={isLoading}
            >
              Skip
            </Button>
          </div>
        </form>
      </div>
    );
  }

  // Extended form (original 4-field form for some use cases)
  if (showExtendedForm) {
    return (
      <form onSubmit={handleExtendedSubmit} className={`space-y-4 ${className}`}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            type="text"
            placeholder="Acme Inc."
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="useCase">How would you use Websonic?</Label>
          <Textarea
            id="useCase"
            placeholder="Tell us about your use case..."
            value={useCase}
            onChange={(e) => setUseCase(e.target.value)}
            disabled={isLoading}
            rows={3}
          />
        </div>

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        <Button
          type="submit"
          disabled={isLoading || !email}
          className="w-full group"
          size="lg"
          onClick={isOnWaitlist ? (e) => e.preventDefault() : undefined}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Joining...
            </>
          ) : isOnWaitlist ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              On The List
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </>
          ) : (
            <>
              {buttonText}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </Button>
      </form>
    );
  }

  // Initial email step
  return (
    <form onSubmit={handleEmailSubmit} className={`space-y-4 ${className}`}>
      <div className="flex gap-2">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
          className="flex-1"
        />
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      <Button
        type="submit"
        disabled={isLoading || !email}
        className="w-full group"
        onClick={isOnWaitlist ? (e) => e.preventDefault() : undefined}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Joining...
          </>
        ) : isOnWaitlist ? (
          <>
            <CheckCircle className="mr-2 h-4 w-4" />
            On The List
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </>
        ) : (
          <>
            {buttonText}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </Button>
    </form>
  );
}