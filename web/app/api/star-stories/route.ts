import { NextRequest, NextResponse } from 'next/server';
import { db, getStarStoriesByProfileId, createStarStory, updateStarStory, deleteStarStory } from '@/lib/db';
import { getToken } from '@/lib/auth';
import { z } from 'zod';

const starStorySchema = z.object({
  title: z.string().optional(),
  situation: z.string().min(1),
  task: z.string().min(1),
  action: z.string().min(1),
  result: z.string().min(1),
  tags: z.array(z.string()).default([]),
  industry: z.string().optional(),
  company: z.string().optional(),
  role: z.string().optional(),
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

    const starStories = await getStarStoriesByProfileId(profile.id);
    return NextResponse.json({ success: true, starStories });
  } catch (error) {
    console.error('Get STAR stories error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = starStorySchema.parse(body);

    const profile = await getProfileByUserId(token.userId);
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const starStory = await createStarStory(profile.id, validatedData);
    
    // Track analytics
    await trackAnalytics('star_story_created', {
      tags: validatedData.tags,
      industry: validatedData.industry,
    }, token.userId);

    return NextResponse.json({ success: true, starStory });
  } catch (error) {
    console.error('Create STAR story error:', error);
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
    const { id, ...updates } = body;

    const starStory = await updateStarStory(id, updates);
    
    // Track analytics
    await trackAnalytics('star_story_updated', updates, token.userId);

    return NextResponse.json({ success: true, starStory });
  } catch (error) {
    console.error('Update STAR story error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
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
      return NextResponse.json({ error: 'STAR Story ID required' }, { status: 400 });
    }

    await deleteStarStory(id);
    
    // Track analytics
    await trackAnalytics('star_story_deleted', { id }, token.userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete STAR story error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}