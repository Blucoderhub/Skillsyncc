import { NextResponse } from 'next/server';
import { testConnection } from '@/lib/db';

export async function GET() {
  const isConnected = await testConnection();
  
  return NextResponse.json({
    success: isConnected,
    message: isConnected ? 'Database connected successfully' : 'Database connection failed',
    timestamp: new Date().toISOString()
  });
}
