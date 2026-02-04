import { NextRequest, NextResponse } from 'next/server';
import { db, getProfileByUserId, updateProfile, profiles } from '@/lib/db';
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
      const newProfile = await db.insert(profiles).values({
        userId: token.userId,
        firstName: '',
        lastName: '',
        email: token.email,
        phone: '',
        location: '',
        linkedIn: '',
        portfolio: '',
        summary: '',
        aiOptimized: false,
      }).returning();
      
      return NextResponse.json({ success: true, profile: newProfile[0] });
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

    const body = await request.json();
    const updatedProfile = await updateProfile(token.userId, body);
    
    return NextResponse.json({ success: true, profile: updatedProfile });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}