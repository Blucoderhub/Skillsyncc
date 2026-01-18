import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Code2, Swords, Trophy, LogOut, Terminal, Map } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navigation() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Map },
    { href: "/quests", label: "Quests", icon: Swords },
    { href: "/hackathons", label: "Hackathons", icon: Trophy },
    { href: "/ide", label: "IDE", icon: Code2 },
  ];

  if (!user) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="retro-container py-3 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-primary p-2 rounded-lg group-hover:rotate-12 transition-transform">
            <Terminal className="h-6 w-6 text-white" />
          </div>
          <span className="font-display text-lg text-primary tracking-tighter hidden sm:block">
            BlueCoder<span className="text-secondary">Hub</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-4">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md font-display text-[10px] sm:text-xs transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span className="hidden md:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs font-bold text-foreground">{user.firstName || 'Player'}</span>
            <span className="text-[10px] text-secondary">Lvl. 1 Novice</span>
          </div>
          <button
            onClick={() => logout()}
            className="p-2 text-muted-foreground hover:text-destructive transition-colors"
            title="Log out"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
