import { useUserStats } from "@/hooks/use-user-stats";
import { useProblems } from "@/hooks/use-problems";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Trophy, Flame, Target, ChevronRight, Star, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useUserStats();
  const { data: problems, isLoading: problemsLoading } = useProblems();

  if (statsLoading || problemsLoading) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="font-display text-primary animate-pulse">Loading User Data...</p>
        </div>
      </div>
    );
  }

  // Calculate level progress
  const currentLevelXP = stats?.xp || 0;
  const xpForNextLevel = (stats?.level || 1) * 100;
  const progressPercent = Math.min((currentLevelXP / xpForNextLevel) * 100, 100);

  const nextQuest = problems?.find(p => !p.isSolved) || problems?.[0];

  return (
    <main className="retro-container space-y-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main XP Card */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 pixel-card p-6 bg-gradient-to-br from-card to-card/50 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Trophy className="w-32 h-32 text-primary" />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-xl mb-4 flex items-center gap-2">
              <span className="text-primary">Level {stats?.level || 1}</span>
              <span className="text-sm text-muted-foreground font-body normal-case">Architect</span>
            </h2>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono mb-1">
                <span>XP: {currentLevelXP}</span>
                <span>Next: {xpForNextLevel}</span>
              </div>
              <div className="h-4 bg-muted rounded-full overflow-hidden border border-border">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-primary to-accent relative"
                >
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)50%,rgba(255,255,255,0.15)75%,transparent_75%,transparent)] bg-[length:20px_20px] animate-[slide_1s_linear_infinite]"></div>
                </motion.div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Solve {Math.ceil((xpForNextLevel - currentLevelXP) / 10)} more problems to level up!
              </p>
            </div>
          </div>
        </motion.div>

        {/* Streak Card */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="pixel-card p-6 flex flex-col justify-center items-center text-center bg-background border-secondary/20"
        >
          <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
            <Flame className="w-8 h-8 text-secondary" />
          </div>
          <h3 className="text-3xl font-display text-secondary mb-1">{stats?.streak || 0}</h3>
          <p className="text-sm text-muted-foreground uppercase tracking-widest">Day Streak</p>
        </motion.div>
      </div>

      {/* Next Objective */}
      <section>
        <h3 className="text-lg mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-accent" />
          Current Objective
        </h3>
        {nextQuest ? (
          <Link href={`/quests/${nextQuest.slug}`}>
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="pixel-card p-6 bg-accent/5 border-accent/20 cursor-pointer group flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className={cn(
                    "text-[10px] px-2 py-0.5 rounded font-mono uppercase border",
                    nextQuest.difficulty === "Easy" ? "bg-green-500/10 text-green-500 border-green-500/20" :
                    nextQuest.difficulty === "Medium" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" :
                    "bg-red-500/10 text-red-500 border-red-500/20"
                  )}>
                    {nextQuest.difficulty}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">{nextQuest.category}</span>
                </div>
                <h4 className="text-xl group-hover:text-accent transition-colors normal-case font-bold">{nextQuest.title}</h4>
                <p className="text-muted-foreground text-sm mt-1 line-clamp-1">{nextQuest.description}</p>
              </div>
              <div className="h-10 w-10 bg-background rounded-lg border-2 border-border flex items-center justify-center group-hover:border-accent transition-colors">
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-accent" />
              </div>
            </motion.div>
          </Link>
        ) : (
          <div className="pixel-card p-6 text-center text-muted-foreground">
            All quests completed! Wait for updates.
          </div>
        )}
      </section>

      {/* Recent Activity / Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Problems Solved", value: stats?.solvedCount || 0, icon: Star, color: "text-yellow-400" },
          { label: "Global Rank", value: "#42", icon: Trophy, color: "text-purple-400" },
          { label: "Total XP", value: stats?.xp || 0, icon: Zap, color: "text-blue-400" },
          { label: "Badges", value: "3", icon: Lock, color: "text-pink-400" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="pixel-card p-4 flex flex-col items-center justify-center text-center gap-2"
          >
            <stat.icon className={cn("w-5 h-5", stat.color)} />
            <span className="text-2xl font-display">{stat.value}</span>
            <span className="text-[10px] text-muted-foreground uppercase">{stat.label}</span>
          </motion.div>
        ))}
      </div>
    </main>
  );
}

// Helper icons
function Zap(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}
