"use server"

import { getRedisClient } from '@/lib/redis';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get('sessionId');
  
  if (!sessionId) {
    return NextResponse.json({ valid: false }, { status: 400 });
  }
  
  try {
    const redis = await getRedisClient();
    const sessionData = await redis.get(`session:${sessionId}`);
    
    return NextResponse.json({
      valid: !!sessionData
    });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json(
      { valid: false, error: 'Server error checking session' },
      { status: 500 }
    );
  }
}