import { NextRequest, NextResponse } from 'next/server';
import { db, getApplicationsByProfileId, createApplication, updateApplication, getProfileByUserId, trackAnalytics } from '@/lib/db';
import { getToken } from '@/lib/auth';
import { z } from 'zod';
import { eq, desc } from 'drizzle-orm';

const applicationSchema = z.object({
  jobTitle: z.string().min(1),
  company: z.string().min(1),
  platform: z.string().min(1),
  status: z.enum(['draft', 'applied', 'interview', 'offer', 'rejected']).default('draft'),
  notes: z.string().optional(),
  jobUrl: z.string().url().optional(),
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

    const applications = await getApplicationsByProfileId(profile.id);
    return NextResponse.json({ success: true, applications });
  } catch (error) {
    console.error('Get applications error:', error);
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
    const validatedData = applicationSchema.parse(body);

    const profile = await getProfileByUserId(token.userId);
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const application = await createApplication(profile.id, {
      ...validatedData,
      appliedAt: validatedData.status === 'applied' ? new Date() : null,
      aiGenerated: false,
    });

    // Track analytics
    await trackAnalytics('application_created', {
      platform: validatedData.platform,
      company: validatedData.company,
    }, token.userId);

    return NextResponse.json({ success: true, application });
  } catch (error) {
    console.error('Create application error:', error);
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

    const application = await updateApplication(id, updates);
    
    // Track analytics
    await trackAnalytics('application_updated', updates, token.userId);

    return NextResponse.json({ success: true, application });
  } catch (error) {
    console.error('Update application error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}