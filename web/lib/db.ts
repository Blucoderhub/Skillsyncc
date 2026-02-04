import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { eq, desc, asc } from 'drizzle-orm';
import {
  users,
  profiles,
  experiences,
  skills,
  applications,
  jobDescriptions,
  resumes,
  starStories,
  analytics,
  settings
} from './schema';

export {
  users,
  profiles,
  experiences,
  skills,
  applications,
  jobDescriptions,
  resumes,
  starStories,
  analytics,
  settings
};

export const db = drizzle(sql);

// Database connection test
export async function testConnection() {
  try {
    await db.select().from(users).limit(1);
    console.log('✅ Database connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

// User Operations
export async function createUser(email: string, name: string) {
  const [user] = await db.insert(users).values({
    email,
    name,
    subscriptionTier: 'free'
  } as any).returning();
  return user;
}

export async function getUserById(id: string) {
  const user = await db.select().from(users).where(eq(users.id, id as any)).limit(1);
  return user[0];
}

export async function getUserByEmail(email: string) {
  const user = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return user[0];
}

// Profile Operations
export async function createProfile(userId: string, profileData: any) {
  const [profile] = await db.insert(profiles).values({
    userId,
    ...profileData
  } as any).returning();
  return profile;
}

export async function updateProfile(id: string, updates: any) {
  const [profile] = await db.update(profiles)
    .set({ ...updates, updatedAt: new Date() } as any)
    .where(eq(profiles.id, id as any))
    .returning();
  return profile;
}

export async function getProfileByUserId(userId: string) {
  const profile = await db.select().from(profiles).where(eq(profiles.userId, userId as any)).limit(1);
  return profile[0];
}

// Experience Operations
export async function createExperience(profileId: string, experienceData: any) {
  const [experience] = await db.insert(experiences).values({
    profileId,
    ...experienceData
  } as any).returning();
  return experience;
}

export async function updateExperience(id: string, updates: any) {
  const [experience] = await db.update(experiences)
    .set(updates as any)
    .where(eq(experiences.id, id as any))
    .returning();
  return experience;
}

export async function deleteExperience(id: string) {
  await db.delete(experiences).where(eq(experiences.id, id as any));
}

export async function getExperiencesByProfileId(profileId: string) {
  return await db.select().from(experiences).where(eq(experiences.profileId, profileId as any));
}

// Skills Operations
export async function createSkill(profileId: string, skillName: string, category?: string) {
  const [skill] = await db.insert(skills).values({
    profileId,
    name: skillName,
    category: category || 'technical'
  } as any).returning();
  return skill;
}

export async function deleteSkill(id: string) {
  await db.delete(skills).where(eq(skills.id, id as any));
}

export async function getSkillsByProfileId(profileId: string) {
  return await db.select().from(skills).where(eq(skills.profileId, profileId as any));
}

// Application Operations
export async function createApplication(profileId: string, applicationData: any) {
  const [application] = await db.insert(applications).values({
    profileId,
    ...applicationData
  } as any).returning();
  return application;
}

export async function updateApplication(id: string, updates: any) {
  const [application] = await db.update(applications)
    .set({ ...updates, updatedAt: new Date() } as any)
    .where(eq(applications.id, id as any))
    .returning();
  return application;
}

export async function getApplicationsByProfileId(profileId: string, limit = 50) {
  return await db.select()
    .from(applications)
    .where(eq(applications.profileId, profileId as any))
    .orderBy(desc(applications.appliedAt))
    .limit(limit);
}

// Resume Operations
export async function createResume(profileId: string, resumeData: any) {
  const [resume] = await db.insert(resumes).values({
    profileId,
    ...resumeData
  } as any).returning();
  return resume;
}

export async function getResumesByProfileId(profileId: string) {
  return await db.select().from(resumes).where(eq(resumes.profileId, profileId as any));
}

export async function deleteResume(id: string) {
  await db.delete(resumes).where(eq(resumes.id, id as any));
}

// STAR Story Operations
export async function createStarStory(profileId: string, storyData: any) {
  const [story] = await db.insert(starStories).values({
    profileId,
    ...storyData
  } as any).returning();
  return story;
}

export async function updateStarStory(id: string, updates: any) {
  const [story] = await db.update(starStories)
    .set(updates as any)
    .where(eq(starStories.id, id as any))
    .returning();
  return story;
}

export async function deleteStarStory(id: string) {
  await db.delete(starStories).where(eq(starStories.id, id as any));
}

export async function getStarStoriesByProfileId(profileId: string) {
  return await db.select().from(starStories).where(eq(starStories.profileId, profileId as any));
}

// Analytics Operations
export async function trackAnalytics(event: string, data: any, userId?: string) {
  await db.insert(analytics).values({
    userId,
    event,
    data,
    timestamp: new Date()
  } as any);
}

export async function getAnalyticsByUserId(userId: string, limit = 100) {
  return await db.select()
    .from(analytics)
    .where(eq(analytics.userId, userId as any))
    .orderBy(desc(analytics.timestamp))
    .limit(limit);
}

// Settings Operations
export async function getUserSettings(userId: string) {
  const result = await db.select().from(settings).where(eq(settings.userId, userId as any)).limit(1);
  return result[0];
}

export async function updateUserSettings(userId: string, settingsData: any) {
  const [updatedSettings] = await db.update(settings)
    .set(settingsData as any)
    .where(eq(settings.userId, userId as any))
    .returning();
  return updatedSettings;
}

export async function createUserSettings(userId: string) {
  const [newSettings] = await db.insert(settings).values({
    userId,
    autoSync: true,
    notifications: true,
    theme: 'dark'
  } as any).returning();
  return newSettings;
}