import { pgTable, text, timestamp, boolean, integer, jsonb, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  subscriptionTier: varchar('subscription_tier', { length: 50 }).default('free'),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Professional Profiles table
export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  firstName: varchar('first_name', { length: 255 }),
  lastName: varchar('last_name', { length: 255 }),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  location: varchar('location', { length: 255 }),
  linkedIn: varchar('linked_in', { length: 500 }),
  portfolio: varchar('portfolio', { length: 500 }),
  summary: text('summary'),
  aiOptimized: boolean('ai_optimized').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Experiences table
export const experiences = pgTable('experiences', {
  id: uuid('id').primaryKey().defaultRandom(),
  profileId: uuid('profile_id').references(() => profiles.id).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  company: varchar('company', { length: 255 }).notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date'),
  current: boolean('current').default(false),
  description: text('description').notNull(),
  achievements: jsonb('achievements').$type<string[]>(),
  skills: jsonb('skills').$type<string[]>(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Skills table
export const skills = pgTable('skills', {
  id: uuid('id').primaryKey().defaultRandom(),
  profileId: uuid('profile_id').references(() => profiles.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  category: varchar('category', { length: 100 }).default('technical'),
  proficiency: integer('proficiency').default(3), // 1-5 scale
  yearsOfExperience: integer('years_of_experience'),
  verified: boolean('verified').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// Job Descriptions table
export const jobDescriptions = pgTable('job_descriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  url: varchar('url', { length: 1000 }).notNull(),
  platform: varchar('platform', { length: 100 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  company: varchar('company', { length: 255 }).notNull(),
  location: varchar('location', { length: 255 }),
  description: text('description').notNull(),
  requirements: jsonb('requirements').$type<string[]>(),
  preferredQualifications: jsonb('preferred_qualifications').$type<string[]>(),
  skills: jsonb('skills').$type<string[]>(),
  salary: varchar('salary', { length: 100 }),
  remote: boolean('remote'),
  extractedAt: timestamp('extracted_at').defaultNow(),
});

// Applications table
export const applications = pgTable('applications', {
  id: uuid('id').primaryKey().defaultRandom(),
  profileId: uuid('profile_id').references(() => profiles.id).notNull(),
  jobId: uuid('job_id').references(() => jobDescriptions.id),
  jobTitle: varchar('job_title', { length: 255 }).notNull(),
  company: varchar('company', { length: 255 }).notNull(),
  platform: varchar('platform', { length: 100 }).notNull(),
  status: varchar('status', { length: 50 }).default('draft'), // draft, applied, interview, offer, rejected
  appliedAt: timestamp('applied_at'),
  resumeVersionId: uuid('resume_version_id'),
  notes: text('notes'),
  interviewDate: timestamp('interview_date'),
  outcome: varchar('outcome', { length: 50 }),

  // Founders Edition Features
  technicalSynergyScore: integer('technical_synergy_score'),
  aiMatchExplanation: text('ai_match_explanation'),
  outreachStatus: varchar('outreach_status', { length: 50 }).default('pending'), // pending, sent, followed_up

  aiGenerated: boolean('ai_generated').default(false),
  responseTime: integer('responseTime'), // days
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Resume Versions table
export const resumes = pgTable('resumes', {
  id: uuid('id').primaryKey().defaultRandom(),
  profileId: uuid('profile_id').references(() => profiles.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  content: text('content').notNull(),
  fileUrl: varchar('file_url', { length: 1000 }),
  fileType: varchar('file_type', { length: 50 }).default('txt'),
  atsScore: integer('ats_score'),
  optimizedForJob: uuid('optimized_for_job'), // References job ID
  tags: jsonb('tags').$type<string[]>(),
  isPrimary: boolean('is_primary').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// STAR Stories table
export const starStories = pgTable('star_stories', {
  id: uuid('id').primaryKey().defaultRandom(),
  profileId: uuid('profile_id').references(() => profiles.id).notNull(),
  title: varchar('title', { length: 255 }),
  situation: text('situation').notNull(),
  task: text('task').notNull(),
  action: text('action').notNull(),
  result: text('result').notNull(),
  tags: jsonb('tags').$type<string[]>(),
  industry: varchar('industry', { length: 100 }),
  company: varchar('company', { length: 255 }),
  role: varchar('role', { length: 255 }),
  usage: integer('usage'), // How many times used
  effectiveness: integer('effectiveness'), // 1-5 rating
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Analytics table
export const analytics = pgTable('analytics', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  event: varchar('event', { length: 100 }).notNull(), // login, application_created, profile_updated, etc.
  data: jsonb('data'), // Event-specific data
  sessionId: varchar('session_id', { length: 255 }),
  userAgent: varchar('user_agent', { length: 500 }),
  ipAddress: varchar('ip_address', { length: 45 }),
  timestamp: timestamp('timestamp').defaultNow(),
});

// User Settings table
export const settings = pgTable('settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  autoSync: boolean('auto_sync').default(true),
  notifications: boolean('notifications').default(true),
  theme: varchar('theme', { length: 20 }).default('dark'),
  language: varchar('language', { length: 10 }).default('en'),
  aiProvider: varchar('ai_provider', { length: 50 }).default('openai'),
  apiKey: varchar('api_key', { length: 500 }), // Encrypted
  extensionInstalled: boolean('extension_installed').default(false),
  dailyApplicationLimit: integer('daily_application_limit').default(10),
  autoApply: boolean('auto_apply').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

export const insertProfileSchema = createInsertSchema(profiles);
export const selectProfileSchema = createSelectSchema(profiles);

export const insertExperienceSchema = createInsertSchema(experiences);
export const selectExperienceSchema = createSelectSchema(experiences);

export const insertSkillSchema = createInsertSchema(skills);
export const selectSkillSchema = createSelectSchema(skills);

export const insertApplicationSchema = createInsertSchema(applications);
export const selectApplicationSchema = createSelectSchema(applications);

export const insertResumeSchema = createInsertSchema(resumes);
export const selectResumeSchema = createSelectSchema(resumes);

export const insertStarStorySchema = createInsertSchema(starStories);
export const selectStarStorySchema = createSelectSchema(starStories);

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;

export type Experience = typeof experiences.$inferSelect;
export type NewExperience = typeof experiences.$inferInsert;

export type Skill = typeof skills.$inferSelect;
export type NewSkill = typeof skills.$inferInsert;

export type Application = typeof applications.$inferSelect;
export type NewApplication = typeof applications.$inferInsert;

export type Resume = typeof resumes.$inferSelect;
export type NewResume = typeof resumes.$inferInsert;

export type StarStory = typeof starStories.$inferSelect;
export type NewStarStory = typeof starStories.$inferInsert;

export type Analytics = typeof analytics.$inferSelect;
export type NewAnalytics = typeof analytics.$inferInsert;

export type Settings = typeof settings.$inferSelect;
export type NewSettings = typeof settings.$inferInsert;