import { NextRequest, NextResponse } from 'next/server';
import { db, getSkillsByProfileId, createSkill, deleteSkill, getProfileByUserId, trackAnalytics } from '@/lib/db';
import { getToken } from '@/lib/auth';
import { z } from 'zod';

const skillSchema = z.object({
  name: z.string().min(1),
  category: z.string().default('technical'),
  proficiency: z.number().min(1).max(5).default(3),
  yearsOfExperience: z.number().optional(),
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

    const skills = await getSkillsByProfileId(profile.id);
    return NextResponse.json({ success: true, skills });
  } catch (error) {
    console.error('Get skills error:', error);
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
    const validatedData = skillSchema.parse(body);

    const profile = await getProfileByUserId(token.userId);
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const skill = await createSkill(profile.id, validatedData.name, validatedData.category);
    
    // Track analytics
    await trackAnalytics('skill_created', {
      name: validatedData.name,
      category: validatedData.category,
    }, token.userId);

    return NextResponse.json({ success: true, skill });
  } catch (error) {
    console.error('Create skill error:', error);
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
      return NextResponse.json({ error: 'Skill ID required' }, { status: 400 });
    }

    await deleteSkill(id);
    
    // Track analytics
    await trackAnalytics('skill_deleted', { id }, token.userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete skill error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}