import { NextRequest, NextResponse } from 'next/server';
import { db, getProfileByUserId, updateProfile, profiles, trackAnalytics } from '@/lib/db';
import { getToken } from '@/lib/auth';
import { z } from 'zod';

export async function GET(request: NextRequest) {
  try {
    const token = getToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await getProfileByUserId(token.userId);
    if (!profile) {
      // Create default profile if doesn't exist
      const [newProfile] = await db.insert(profiles).values({
        userId: token.userId,
        email: token.email,
        firstName: token.name.split(' ')[0] || '',
        lastName: token.name.split(' ')[1] || '',
        aiOptimized: false,
      } as any).returning();

      return NextResponse.json({ success: true, profile: newProfile });
    }

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = getToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await getProfileByUserId(token.userId);
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const body = await request.json();
    const updatedProfile = await updateProfile(profile.id, body);

    // Track usage
    await trackAnalytics('profile_updated', {}, token.userId);

    return NextResponse.json({ success: true, profile: updatedProfile });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}