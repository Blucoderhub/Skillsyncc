import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import { registerChatRoutes } from "./replit_integrations/chat";
import { registerImageRoutes } from "./replit_integrations/image";
import { registerAudioRoutes } from "./replit_integrations/audio";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // 1. Setup Auth
  await setupAuth(app);
  registerAuthRoutes(app);
  
  // 2. Setup AI Integrations
  registerChatRoutes(app);
  registerImageRoutes(app);
  registerAudioRoutes(app);

  // 3. Application Routes

  // Problems List
  app.get(api.problems.list.path, async (req: any, res) => {
    const problems = await storage.getAllProblems();
    
    // Check if user is authenticated to show solved status
    if (req.isAuthenticated && req.isAuthenticated() && req.user?.claims?.sub) {
      const userId = req.user.claims.sub;
      const problemsWithStatus = await Promise.all(
        problems.map(async (problem) => {
          const submissions = await storage.getUserSubmissions(userId, problem.id);
          const isSolved = submissions.some(s => s.status === "Passed");
          return { ...problem, isSolved };
        })
      );
      return res.json(problemsWithStatus);
    }
    
    res.json(problems.map(p => ({ ...p, isSolved: false })));
  });

  // Problem Get
  app.get(api.problems.get.path, async (req: any, res) => {
    const problem = await storage.getProblemBySlug(req.params.slug);
    if (!problem) return res.status(404).json({ message: "Problem not found" });
    
    // Check solved status if authenticated
    let isSolved = false;
    if (req.isAuthenticated && req.isAuthenticated() && req.user?.claims?.sub) {
      const userId = req.user.claims.sub;
      const submissions = await storage.getUserSubmissions(userId, problem.id);
      isSolved = submissions.some(s => s.status === "Passed");
    }
    
    res.json({ ...problem, isSolved });
  });

  // Submit Code
  app.post(api.problems.submit.path, isAuthenticated, async (req, res) => {
    const problemId = parseInt(req.params.id);
    const userId = (req.user as any).claims.sub;
    const { code, language } = req.body;

    const problem = await storage.getProblemById(problemId);
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    // Mock Execution Logic
    // In production, send to Piston or similar
    const passed = Math.random() > 0.3; // 70% chance to pass for mock
    const output = passed 
      ? "Tests Passed: 5/5\nExecution Time: 0.05s" 
      : "Error: AssertionError: expected 5 to equal 6\nTests Passed: 2/5";

    // Save submission
    await storage.createSubmission(userId, {
      problemId,
      code,
      status: passed ? "Passed" : "Failed",
    });

    // Update Progress if passed
    let xpEarned = 0;
    if (passed) {
      const prevSubmissions = await storage.getUserSubmissions(userId, problemId);
      const alreadySolved = prevSubmissions.some(s => s.status === "Passed");
      
      if (!alreadySolved) {
        xpEarned = problem.xpReward;
        await storage.updateUserProgress(userId, xpEarned);
      }
    }

    res.json({
      success: true,
      output,
      passed,
      xpEarned,
      nextProblemSlug: "next-problem-slug-placeholder" // Logic to find next order
    });
  });

  // User Stats
  app.get(api.user.stats.path, isAuthenticated, async (req, res) => {
    const userId = (req.user as any).claims.sub;
    let stats = await storage.getUserProgress(userId);
    
    if (!stats) {
      stats = await storage.initializeUserProgress(userId);
    }
    
    res.json(stats);
  });

  // Hackathons
  app.get(api.hackathons.list.path, async (req, res) => {
    const hacks = await storage.getAllHackathons();
    res.json(hacks);
  });

  // Seed Data (Safe to call on every startup, checks inside)
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const problems = [
    {
      slug: "hello-world-python",
      title: "The Legend of Python: Hello World",
      description: "Your adventure begins here. Print 'Hello, World!' to the console to awaken the ancient spirits of code.",
      difficulty: "Easy",
      category: "Python",
      starterCode: "def solve():\n    # Write your code here\n    pass",
      testCases: [{ input: "", expected: "Hello, World!" }],
      xpReward: 100,
      order: 1
    },
    {
      slug: "sum-of-two",
      title: "The Binary Caverns: Sum of Two",
      description: "Deep in the caverns, you encounter two number spirits. Return their sum to pass the gate.",
      difficulty: "Easy",
      category: "Algorithms",
      starterCode: "def sum(a, b):\n    return 0",
      testCases: [{ input: "1, 2", expected: "3" }],
      xpReward: 150,
      order: 2
    },
    {
      slug: "web-scraper-basics",
      title: "The Data Harvest",
      description: "Extract the title from an HTML string. The villagers need information!",
      difficulty: "Medium",
      category: "Web",
      starterCode: "def extract_title(html):\n    return ''",
      testCases: [{ input: "<html><title>Test</title></html>", expected: "Test" }],
      xpReward: 300,
      order: 3
    }
  ];

  const hacks = [
    {
      title: "Global AI Hackathon 2026",
      description: "Build the future of AI in this 48-hour global event.",
      url: "https://globalai.hackathon.com",
      startDate: new Date("2026-02-15"),
      endDate: new Date("2026-02-17"),
      platform: "Devpost",
      tags: ["AI", "Machine Learning", "Python"]
    },
    {
      title: "Web3 World Cup",
      description: "Decentralized apps for the new world.",
      url: "https://web3.hackathon.com",
      startDate: new Date("2026-03-01"),
      endDate: new Date("2026-03-03"),
      platform: "Hack2Skill",
      tags: ["Blockchain", "Solidity", "Web3"]
    },
    {
      title: "Green Tech Summit",
      description: "Coding for a sustainable future.",
      url: "https://greentech.hackathon.com",
      startDate: new Date("2026-04-10"),
      endDate: new Date("2026-04-12"),
      platform: "Devfolio",
      tags: ["Sustainability", "IoT", "Hardware"]
    }
  ];

  await storage.seedProblems(problems);
  await storage.seedHackathons(hacks);
}
