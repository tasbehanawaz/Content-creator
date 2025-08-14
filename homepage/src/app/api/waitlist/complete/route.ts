import { NextRequest, NextResponse } from 'next/server';

import WaitlistConfirmationEmail from '@/features/emails/waitlist-confirmation';
import { resendClient } from '@/libs/resend/resend-client';
import { createSupabaseServerClient } from '@/libs/supabase/supabase-server-client';

export async function POST(request: NextRequest) {
  try {
    const { email, full_name } = await request.json();

    if (!email || !full_name) {
      return NextResponse.json(
        { error: 'Email and full name are required' },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServerClient();

    // Check if email exists in waitlist
    const { data: existingEntry, error: fetchError } = await supabase
      .from('waitlist')
      .select('*')
      .eq('email', email)
      .single();

    if (fetchError || !existingEntry) {
      return NextResponse.json(
        { error: 'Email not found in waitlist' },
        { status: 404 }
      );
    }

    // Update the waitlist entry with full name
    const { data, error } = await supabase
      .from('waitlist')
      .update({
        full_name,
        updated_at: new Date().toISOString()
      })
      .eq('email', email)
      .select()
      .single();

    if (error) {
      console.error('Waitlist update error:', error);
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      );
    }

    // Send confirmation email (optional - only if RESEND_API_KEY is configured)
    let emailSent = false;
    if (resendClient) {
      try {
        await resendClient.emails.send({
          from: 'Websonic <hello@websonic.ai>',
          to: [email],
          subject: 'Welcome to the Websonic waitlist!',
          react: WaitlistConfirmationEmail({ fullName: full_name }),
        });
        emailSent = true;
      } catch (emailError) {
        console.error('Email sending error:', emailError);
        // Don't fail the request if email fails, just log it
      }
    } else {
      console.log('RESEND_API_KEY not configured, skipping email');
    }

    return NextResponse.json(
      {
        message: 'Profile completed successfully',
        data: {
          email: data.email,
          full_name: data.full_name,
          email_sent: emailSent
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Waitlist complete API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}