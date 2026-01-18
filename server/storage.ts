import { db } from "./db";
import { 
  problems, submissions, userProgress, hackathons,
  type Problem, type Submission, type UserProgress, type Hackathon,
  type InsertSubmission
} from "@shared/schema";
import { eq, desc, sql } from "drizzle-orm";

export interface IStorage {
  // Problems
  getAllProblems(): Promise<Problem[]>;
  getProblemBySlug(slug: string): Promise<Problem | undefined>;
  getProblemById(id: number): Promise<Problem | undefined>;
  
  // Submissions
  createSubmission(userId: string, submission: InsertSubmission): Promise<Submission>;
  getUserSubmissions(userId: string, problemId: number): Promise<Submission[]>;
  
  // Progress
  getUserProgress(userId: string): Promise<UserProgress | undefined>;
  updateUserProgress(userId: string, xpGain: number): Promise<UserProgress>;
  initializeUserProgress(userId: string): Promise<UserProgress>;
  
  // Hackathons
  getAllHackathons(): Promise<Hackathon[]>;
  seedHackathons(hackathonsData: any[]): Promise<void>; // Simple seeding
  seedProblems(problemsData: any[]): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getAllProblems(): Promise<Problem[]> {
    return await db.select().from(problems).orderBy(problems.order);
  }

  async getProblemBySlug(slug: string): Promise<Problem | undefined> {
    const [problem] = await db.select().from(problems).where(eq(problems.slug, slug));
    return problem;
  }

  async getProblemById(id: number): Promise<Problem | undefined> {
    const [problem] = await db.select().from(problems).where(eq(problems.id, id));
    return problem;
  }

  async createSubmission(userId: string, submission: InsertSubmission): Promise<Submission> {
    const [sub] = await db.insert(submissions).values({ ...submission, userId }).returning();
    return sub;
  }

  async getUserSubmissions(userId: string, problemId: number): Promise<Submission[]> {
    return await db.select()
      .from(submissions)
      .where(sql`${submissions.userId} = ${userId} AND ${submissions.problemId} = ${problemId}`)
      .orderBy(desc(submissions.createdAt));
  }

  async getUserProgress(userId: string): Promise<UserProgress | undefined> {
    const [progress] = await db.select().from(userProgress).where(eq(userProgress.userId, userId));
    return progress;
  }

  async initializeUserProgress(userId: string): Promise<UserProgress> {
    const [progress] = await db.insert(userProgress)
      .values({ userId, level: 1, xp: 0, streak: 1 })
      .onConflictDoNothing()
      .returning();
    return progress || await this.getUserProgress(userId) as UserProgress;
  }

  async updateUserProgress(userId: string, xpGain: number): Promise<UserProgress> {
    const current = await this.getUserProgress(userId);
    if (!current) return this.initializeUserProgress(userId);

    const newXp = (current.xp || 0) + xpGain;
    const newLevel = Math.floor(newXp / 100) + 1; // Simple level formula

    const [updated] = await db.update(userProgress)
      .set({ 
        xp: newXp, 
        level: newLevel, 
        lastActive: new Date(),
        solvedCount: sql`${userProgress.solvedCount} + 1`
      })
      .where(eq(userProgress.userId, userId))
      .returning();
    return updated;
  }

  async getAllHackathons(): Promise<Hackathon[]> {
    return await db.select().from(hackathons).orderBy(desc(hackathons.startDate));
  }

  async seedHackathons(hackathonsData: any[]): Promise<void> {
    if ((await this.getAllHackathons()).length > 0) return;
    await db.insert(hackathons).values(hackathonsData);
  }

  async seedProblems(problemsData: any[]): Promise<void> {
    if ((await this.getAllProblems()).length > 0) return;
    await db.insert(problems).values(problemsData);
  }
}

export const storage = new DatabaseStorage();
