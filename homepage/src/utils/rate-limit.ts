import { NextRequest, NextResponse } from 'next/server';

interface RateLimitConfig {
  interval: number; // Time window in milliseconds
  uniqueTokenPerInterval: number; // Max requests per interval
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// Simple in-memory store (resets on server restart)
// For production, consider using Redis or Upstash
const store: RateLimitStore = {};

export function rateLimit(config: RateLimitConfig) {
  return async function rateLimitMiddleware(
    req: NextRequest,
    handler: () => Promise<NextResponse>
  ): Promise<NextResponse> {
    const identifier = getIdentifier(req);
    const now = Date.now();
    
    // Clean up old entries
    cleanupStore(now);
    
    // Initialize or get existing rate limit data
    if (!store[identifier]) {
      store[identifier] = {
        count: 0,
        resetTime: now + config.interval,
      };
    }
    
    const rateLimitData = store[identifier];
    
    // Reset if interval has passed
    if (now > rateLimitData.resetTime) {
      rateLimitData.count = 0;
      rateLimitData.resetTime = now + config.interval;
    }
    
    // Check rate limit
    if (rateLimitData.count >= config.uniqueTokenPerInterval) {
      return new NextResponse(
        JSON.stringify({
          error: 'Too many requests',
          message: `Rate limit exceeded. Try again in ${Math.ceil(
            (rateLimitData.resetTime - now) / 1000
          )} seconds.`,
        }),
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': config.uniqueTokenPerInterval.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitData.resetTime.toString(),
            'Retry-After': Math.ceil(
              (rateLimitData.resetTime - now) / 1000
            ).toString(),
          },
        }
      );
    }
    
    // Increment counter
    rateLimitData.count++;
    
    // Call the handler
    const response = await handler();
    
    // Add rate limit headers to response
    response.headers.set(
      'X-RateLimit-Limit',
      config.uniqueTokenPerInterval.toString()
    );
    response.headers.set(
      'X-RateLimit-Remaining',
      (config.uniqueTokenPerInterval - rateLimitData.count).toString()
    );
    response.headers.set('X-RateLimit-Reset', rateLimitData.resetTime.toString());
    
    return response;
  };
}

function getIdentifier(req: NextRequest): string {
  // Try to get IP from various headers (works with Vercel)
  const forwardedFor = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  const ip = forwardedFor?.split(',')[0] || realIp || 'anonymous';
  
  // You could also use user ID for authenticated routes
  // const userId = await getUserIdFromRequest(req);
  // return userId || ip;
  
  return ip;
}

// Clean up old entries to prevent memory leak
function cleanupStore(now: number) {
  const cutoff = now - 60 * 60 * 1000; // Remove entries older than 1 hour
  
  for (const key in store) {
    if (store[key].resetTime < cutoff) {
      delete store[key];
    }
  }
}

// Preset configurations
export const rateLimits = {
  api: rateLimit({
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 30, // 30 requests per minute
  }),
  auth: rateLimit({
    interval: 15 * 60 * 1000, // 15 minutes
    uniqueTokenPerInterval: 5, // 5 attempts per 15 minutes
  }),
  expensive: rateLimit({
    interval: 60 * 60 * 1000, // 1 hour
    uniqueTokenPerInterval: 10, // 10 requests per hour
  }),
};