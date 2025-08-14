import { NextResponse } from 'next/server';

// Database sync is disabled - using file-based blog system only
export async function POST() {
  return NextResponse.json({
    success: false,
    message: 'Database sync is disabled. Using file-based blog system.',
  }, { status: 200 });
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'File-based blog system active. No database sync required.',
    lastSync: null,
  });
}