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
  }).returning();
  return user;
}

export async function getUserById(id: string) {
  const user = await db.select().from(users).where(eq(users.id, id)).limit(1);
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
  }).returning();
  return profile;
}

export async function updateProfile(id: string, updates: any) {
  const [profile] = await db.update(profiles)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(profiles.id, id))
    .returning();
  return profile;
}

export async function getProfileByUserId(userId: string) {
  const profile = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);
  return profile[0];
}

// Experience Operations
export async function createExperience(profileId: string, experienceData: any) {
  const [experience] = await db.insert(experiences).values({
    profileId,
    ...experienceData
  }).returning();
  return experience;
}

export async function updateExperience(id: string, updates: any) {
  const [experience] = await db.update(experiences)
    .set(updates)
    .where(eq(experiences.id, id))
    .returning();
  return experience;
}

export async function deleteExperience(id: string) {
  await db.delete(experiences).where(eq(experiences.id, id));
}

export async function getExperiencesByProfileId(profileId: string) {
  return await db.select().from(experiences).where(eq(experiences.profileId, profileId));
}

// Skills Operations
export async function createSkill(profileId: string, skillName: string, category?: string) {
  const [skill] = await db.insert(skills).values({
    profileId,
    name: skillName,
    category: category || 'technical'
  }).returning();
  return skill;
}

export async function deleteSkill(id: string) {
  await db.delete(skills).where(eq(skills.id, id));
}

export async function getSkillsByProfileId(profileId: string) {
  return await db.select().from(skills).where(eq(skills.profileId, profileId));
}

// Application Operations
export async function createApplication(profileId: string, applicationData: any) {
  const [application] = await db.insert(applications).values({
    profileId,
    ...applicationData
  }).returning();
  return application;
}

export async function updateApplication(id: string, updates: any) {
  const [application] = await db.update(applications)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(applications.id, id))
    .returning();
  return application;
}

export async function getApplicationsByProfileId(profileId: string, limit = 50) {
  return await db.select()
    .from(applications)
    .where(eq(applications.profileId, profileId))
    .orderBy(desc(applications.appliedAt))
    .limit(limit);
}

// Resume Operations
export async function createResume(profileId: string, resumeData: any) {
  const [resume] = await db.insert(resumes).values({
    profileId,
    ...resumeData
  }).returning();
  return resume;
}

export async function getResumesByProfileId(profileId: string) {
  return await db.select().from(resumes).where(eq(resumes.profileId, profileId));
}

export async function deleteResume(id: string) {
  await db.delete(resumes).where(eq(resumes.id, id));
}

// STAR Story Operations
export async function createStarStory(profileId: string, storyData: any) {
  const [story] = await db.insert(starStories).values({
    profileId,
    ...storyData
  }).returning();
  return story;
}

export async function updateStarStory(id: string, updates: any) {
  const [story] = await db.update(starStories)
    .set(updates)
    .where(eq(starStories.id, id))
    .returning();
  return story;
}

export async function deleteStarStory(id: string) {
  await db.delete(starStories).where(eq(starStories.id, id));
}

export async function getStarStoriesByProfileId(profileId: string) {
  return await db.select().from(starStories).where(eq(starStories.profileId, profileId));
}

// Analytics Operations
export async function trackAnalytics(event: string, data: any, userId?: string) {
  await db.insert(analytics).values({
    userId,
    event,
    data,
    timestamp: new Date()
  });
}

export async function getAnalyticsByUserId(userId: string, limit = 100) {
  return await db.select()
    .from(analytics)
    .where(eq(analytics.userId, userId))
    .orderBy(desc(analytics.timestamp))
    .limit(limit);
}

// Settings Operations
export async function getUserSettings(userId: string) {
  const settings = await db.select().from(settings).where(eq(settings.userId, userId)).limit(1);
  return settings[0];
}

export async function updateUserSettings(userId: string, settingsData: any) {
  const [settings] = await db.update(settings)
    .set(settingsData)
    .where(eq(settings.userId, userId))
    .returning();
  return settings;
}

export async function createUserSettings(userId: string) {
  const [settings] = await db.insert(settings).values({
    userId,
    autoSync: true,
    notifications: true,
    theme: 'dark'
  }).returning();
  return settings;
}