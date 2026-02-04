import { NextRequest, NextResponse } from 'next/server';
import { db, getResumesByProfileId, createResume, deleteResume, getProfileByUserId, trackAnalytics, resumes as resumesTable } from '@/lib/db';
import { getToken } from '@/lib/auth';
import { z } from 'zod';
import { eq } from 'drizzle-orm';

const resumeSchema = z.object({
  name: z.string().min(1),
  content: z.string().min(1),
  tags: z.array(z.string()).default([]),
  isPrimary: z.boolean().default(false),
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

    const resumes = await getResumesByProfileId(profile.id);
    return NextResponse.json({ success: true, resumes });
  } catch (error) {
    console.error('Get resumes error:', error);
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
    const validatedData = resumeSchema.parse(body);

    const profile = await getProfileByUserId(token.userId);
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // If this is set as primary, unset other resumes
    if (validatedData.isPrimary) {
      await db.update(resumesTable)
        .set({ isPrimary: false } as any)
        .where(eq(resumesTable.profileId, profile.id));
    }

    const resume = await createResume(profile.id, validatedData);

    // Track analytics
    await trackAnalytics('resume_created', {
      name: validatedData.name,
      hasContent: !!validatedData.content,
    }, token.userId);

    return NextResponse.json({ success: true, resume });
  } catch (error) {
    console.error('Create resume error:', error);
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
      return NextResponse.json({ error: 'Resume ID required' }, { status: 400 });
    }

    await deleteResume(id);

    // Track analytics
    await trackAnalytics('resume_deleted', { id }, token.userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete resume error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}