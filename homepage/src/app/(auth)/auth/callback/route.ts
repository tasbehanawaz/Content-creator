// ref: https://github.com/vercel/next.js/blob/canary/examples/with-supabase/app/auth/callback/route.ts

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { createSupabaseServerClient } from '@/libs/supabase/supabase-server-client';
import { getURL } from '@/utils/get-url';
import { rateLimits } from '@/utils/rate-limit';

const siteUrl = getURL();

export async function GET(request: NextRequest) {
  return rateLimits.auth(request, async () => {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');

    if (code) {
      const supabase = await createSupabaseServerClient();
      await supabase.auth.exchangeCodeForSession(code);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user?.id) {
        return NextResponse.redirect(`${siteUrl}/login`);
      }

      // Redirect to home page after successful authentication
      return NextResponse.redirect(`${siteUrl}`);
    }

    return NextResponse.redirect(siteUrl);
  });
}