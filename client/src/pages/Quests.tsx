import { useProblems } from "@/hooks/use-problems";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Swords, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Quests() {
  const { data: problems, isLoading } = useProblems();

  if (isLoading) {
    return (
      <div className="retro-container text-center py-20">
        <p className="font-display text-primary animate-pulse">Scanning Quest Log...</p>
      </div>
    );
  }

  // Group by category (simulating "Regions")
  const categories = Array.from(new Set(problems?.map(p => p.category) || []));

  return (
    <div className="retro-container space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl text-primary drop-shadow-lg">Quest Log</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Choose your path, adventurer. Each quest brings you closer to mastery.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categories.map((category, idx) => (
          <div key={category} className="space-y-4">
            <h2 className="text-xl flex items-center gap-3">
              <Swords className="h-5 w-5 text-secondary" />
              {category} Region
            </h2>
            
            <div className="space-y-3">
              {problems
                ?.filter(p => p.category === category)
                .map((problem, i) => (
                  <Link key={problem.id} href={`/quests/${problem.slug}`}>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={cn(
                        "pixel-card p-4 flex items-center justify-between group cursor-pointer border-l-4",
                        problem.isSolved 
                          ? "border-l-secondary bg-secondary/5" 
                          : "border-l-muted-foreground/30 hover:border-l-primary"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        {problem.isSolved ? (
                          <CheckCircle2 className="h-5 w-5 text-secondary" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        )}
                        <div>
                          <h3 className="font-bold text-sm normal-case group-hover:text-primary transition-colors">
                            {problem.title}
                          </h3>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {problem.difficulty} • {problem.xpReward} XP
                          </span>
                        </div>
                      </div>
                      
                      {problem.isSolved ? (
                        <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">Completed</span>
                      ) : (
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider group-hover:text-primary">Start</span>
                      )}
                    </motion.div>
                  </Link>
                ))}
            </div>
          </div>
        ))}

        {/* Locked Region Example */}
        <div className="space-y-4 opacity-50 pointer-events-none grayscale">
          <h2 className="text-xl flex items-center gap-3">
            <Lock className="h-5 w-5" />
            Advanced Region
          </h2>
          <div className="pixel-card p-8 flex flex-col items-center justify-center text-center gap-4 border-dashed">
            <Lock className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm">Reach Level 5 to unlock this region</p>
          </div>
        </div>
      </div>
    </div>
  );
}
