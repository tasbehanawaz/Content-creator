import { NextResponse } from 'next/server';

// Webhook endpoint disabled - using file-based blog system only
export async function POST() {
  return NextResponse.json({
    success: false,
    message: 'Webhook sync is disabled. Using file-based blog system.',
  }, { status: 200 });
}