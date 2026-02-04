import { NextRequest, NextResponse } from 'next/server';
import { db, getUserSettings, updateUserSettings, createUserSettings, trackAnalytics, settings as settingsTable } from '@/lib/db';
import { getToken } from '@/lib/auth';
import { z } from 'zod';

const settingsSchema = z.object({
  autoSync: z.boolean().default(true),
  notifications: z.boolean().default(true),
  theme: z.enum(['light', 'dark']).default('dark'),
  language: z.string().default('en'),
  aiProvider: z.enum(['openai', 'anthropic', 'local']).default('openai'),
  apiKey: z.string().optional(),
  extensionInstalled: z.boolean().default(false),
  dailyApplicationLimit: z.number().min(1).max(50).default(10),
  autoApply: z.boolean().default(false),
});

export async function GET(request: NextRequest) {
  try {
    const token = getToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let settings = await getUserSettings(token.userId);

    // Create default settings if don't exist
    if (!settings) {
      settings = await createUserSettings(token.userId);
    }

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('Get settings error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = getToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = settingsSchema.parse(body);

    const settings = await updateUserSettings(token.userId, validatedData);

    // Track analytics
    await trackAnalytics('settings_updated', validatedData, token.userId);

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('Update settings error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}