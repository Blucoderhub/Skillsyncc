import { Link } from "wouter";
import { motion } from "framer-motion";
import { Terminal, ChevronRight, Zap, Globe, Code2 } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center relative overflow-hidden px-4 py-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="z-10 text-center max-w-4xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block"
          >
            <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary border border-secondary/20 text-xs font-mono mb-4 inline-block">
              v1.0.0 RELEASED
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display leading-tight text-white mb-6">
              Master the <span className="text-primary">Code</span><br />
              <span className="text-secondary">Conquer</span> the Web
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl font-body max-w-2xl mx-auto leading-relaxed">
              Join the ultimate gamified coding adventure. Solve quests, earn XP, battle algorithms, and become a legendary developer.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <a href="/api/login" className="pixel-btn-primary text-sm flex items-center gap-2">
              Start Adventure <ChevronRight className="h-4 w-4" />
            </a>
            <a href="#features" className="pixel-btn bg-muted text-foreground hover:bg-muted/80">
              View Quest Log
            </a>
          </motion.div>
        </div>

        {/* Decorative Grid items */}
        <div className="absolute top-1/4 left-10 hidden lg:block opacity-20">
          <div className="w-24 h-24 border-4 border-primary rounded-lg rotate-12"></div>
        </div>
        <div className="absolute bottom-1/4 right-10 hidden lg:block opacity-20">
          <div className="w-32 h-32 border-4 border-secondary rounded-full -rotate-6"></div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-card/50 border-t border-border">
        <div className="retro-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Terminal,
                title: "Code Quests",
                desc: "Solve real-world coding problems disguised as RPG quests. Level up your skills."
              },
              {
                icon: Zap,
                title: "Instant Feedback",
                desc: "Run your code in our browser-based IDE with instant test case validation."
              },
              {
                icon: Globe,
                title: "Global Hackathons",
                desc: "Join global events and compete with other developers for glory and prizes."
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="pixel-card p-8 bg-background"
              >
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-6">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 bg-background">
        <div className="retro-container flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Code2 className="h-5 w-5 text-secondary" />
            <span className="font-display text-sm text-muted-foreground">BlueCoderHub © 2024</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Twitter</a>
            <a href="#" className="hover:text-primary transition-colors">GitHub</a>
            <a href="#" className="hover:text-primary transition-colors">Discord</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
