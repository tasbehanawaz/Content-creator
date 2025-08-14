import { NextRequest, NextResponse } from 'next/server';

import { createSupabaseServerClient } from '@/libs/supabase/supabase-server-client';

export async function POST(request: NextRequest) {
  try {
    const { email, full_name, company, use_case, source } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServerClient();

    // Check if email already exists
    const { data: existingEntry } = await supabase
      .from('waitlist')
      .select('email')
      .eq('email', email)
      .single();

    if (existingEntry) {
      return NextResponse.json(
        { error: 'Email already registered for waitlist' },
        { status: 409 }
      );
    }

    // Insert new waitlist entry
    const { data, error } = await supabase
      .from('waitlist')
      .insert({
        email,
        full_name,
        company,
        use_case,
        source: source || 'homepage',
        metadata: {
          referrer: request.headers.get('referer'),
          user_agent: request.headers.get('user-agent'),
        }
      })
      .select()
      .single();

    if (error) {
      console.error('Waitlist signup error:', error);
      return NextResponse.json(
        { error: 'Failed to join waitlist' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: 'Successfully joined waitlist',
        data: {
          email: data.email,
          position: data.priority || 0
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Waitlist API error:', error);

    // More detailed error logging for debugging
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        details: error.stack,
        hint: 'Check your SUPABASE_URL and SUPABASE_ANON_KEY environment variables',
        code: error.name
      });
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}