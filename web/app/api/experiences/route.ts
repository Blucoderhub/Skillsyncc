import { NextRequest, NextResponse } from 'next/server';
import { db, getExperiencesByProfileId, createExperience, updateExperience, deleteExperience, getProfileByUserId, trackAnalytics } from '@/lib/db';
import { getToken } from '@/lib/auth';
import { z } from 'zod';
import { eq, desc } from 'drizzle-orm';

const experienceSchema = z.object({
  title: z.string().min(1),
  company: z.string().min(1),
  startDate: z.string(),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  description: z.string().min(1),
  achievements: z.array(z.string()).default([]),
  skills: z.array(z.string()).default([]),
});

export async function GET(request: NextRequest) {
  try {
    const token = getToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await getProfileByUserId(token.userId);
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const experiences = await getExperiencesByProfileId(profile.id);
    return NextResponse.json({ success: true, experiences });
  } catch (error) {
    console.error('Get experiences error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = experienceSchema.parse(body);

    const profile = await getProfileByUserId(token.userId);
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const experience = await createExperience(profile.id, validatedData);
    return NextResponse.json({ success: true, experience });
  } catch (error) {
    console.error('Create experience error:', error);
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
    const { id, ...updates } = body;

    const experience = await updateExperience(id, updates);
    return NextResponse.json({ success: true, experience });
  } catch (error) {
    console.error('Update experience error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = getToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Experience ID required' }, { status: 400 });
    }

    await deleteExperience(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete experience error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}