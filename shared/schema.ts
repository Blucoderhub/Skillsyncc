import { pgTable, text, serial, integer, boolean, timestamp, jsonb, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Export Auth & Chat models from integrations
export * from "./models/auth";
export * from "./models/chat";

import { users } from "./models/auth";

// --- GAMIFICATION & LEARNING ---

export const problems = pgTable("problems", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  difficulty: text("difficulty").notNull(), // 'Easy', 'Medium', 'Hard'
  category: text("category").notNull(), // 'Python', 'Web', 'Algorithms'
  starterCode: text("starter_code").notNull(),
  testCases: jsonb("test_cases").$type<{input: string, expected: string}[]>().notNull(),
  xpReward: integer("xp_reward").notNull().default(10),
  order: integer("order").notNull(), // For linear progression
});

export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(), // References auth.users.id (which is varchar)
  problemId: integer("problem_id").notNull().references(() => problems.id),
  code: text("code").notNull(),
  status: text("status").notNull(), // 'Passed', 'Failed'
  createdAt: timestamp("created_at").defaultNow(),
});

export const userProgress = pgTable("user_progress", {
  userId: text("user_id").primaryKey(), // References auth.users.id
  level: integer("level").default(1),
  xp: integer("xp").default(0),
  streak: integer("streak").default(0),
  lastActive: timestamp("last_active").defaultNow(),
  solvedCount: integer("solved_count").default(0),
});

export const hackathons = pgTable("hackathons", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  url: text("url").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  platform: text("platform").notNull(), // 'Devpost', 'Hack2Skill', etc.
  imageUrl: text("image_url"),
  tags: text("tags").array(),
});

// --- RELATIONS ---
export const submissionsRelations = relations(submissions, ({ one }) => ({
  problem: one(problems, {
    fields: [submissions.problemId],
    references: [problems.id],
  }),
}));

// --- SCHEMAS ---
export const insertProblemSchema = createInsertSchema(problems).omit({ id: true });
export const insertSubmissionSchema = createInsertSchema(submissions).omit({ id: true, createdAt: true });
export const insertHackathonSchema = createInsertSchema(hackathons).omit({ id: true });

// --- TYPES ---
export type Problem = typeof problems.$inferSelect;
export type InsertProblem = z.infer<typeof insertProblemSchema>;
export type Submission = typeof submissions.$inferSelect;
export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
export type UserProgress = typeof userProgress.$inferSelect;
export type Hackathon = typeof hackathons.$inferSelect;

// --- API TYPES ---
export type ProblemResponse = Problem & { isSolved?: boolean };
export type SubmitCodeRequest = { code: string; language: string };
export type SubmitCodeResponse = { 
  success: boolean; 
  output: string; 
  passed: boolean; 
  xpEarned?: number;
  nextProblemSlug?: string; 
};
