import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, Calendar, Clock, Gift, Users, Crown, Lock, Zap, Target 
} from "lucide-react";
import { Link } from "wouter";

export default function Challenges() {
  const { user } = useAuth();

  const { data: subscription } = useQuery({
    queryKey: ["/api/subscription"],
    enabled: !!user,
  });

  const isClubMember = subscription?.membershipStatus === "active";

  // Mock challenges (in production, fetch from /api/challenges)
  const currentChallenge = {
    id: 1,
    title: "Build a Weather App",
    description: "Create a responsive weather application using any framework. Show current weather, forecasts, and location search.",
    month: "January 2026",
    prize: "$500 Cash Prize + Featured on Homepage",
    prizeAmount: 500,
    rules: "Must be original work, include source code, deploy a live demo",
    isClubOnly: false,
    isActive: true,
    daysLeft: 8,
    participants: 156,
    endDate: new Date("2026-01-31"),
  };

  const upcomingChallenges = [
    {
      id: 2,
      title: "AI Chat Bot Challenge",
      description: "Build an AI-powered chatbot using any LLM API",
      month: "February 2026",
      prize: "Club-only: 6 Months Free Membership",
      isClubOnly: true,
      startDate: new Date("2026-02-01"),
    },
    {
      id: 3,
      title: "Game Dev Jam",
      description: "Create a browser-based game in one weekend",
      month: "March 2026",
      prize: "$1000 Cash Prize",
      isClubOnly: false,
      startDate: new Date("2026-03-15"),
    },
  ];

  const pastWinners = [
    {
      id: 101,
      challenge: "Holiday Hackathon 2025",
      winner: "Moses James",
      project: "Gift Exchange App",
      prize: "Software Developer at Deloitte",
    },
    {
      id: 102,
      challenge: "Data Viz Challenge",
      winner: "Alan Geirnaert",
      project: "Climate Dashboard",
      prize: "Featured Project + $250",
    },
  ];

  return (
    <div className="retro-container py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-display text-primary">Monthly Challenges</h1>
        </div>
        <p className="text-muted-foreground">
          Compete for prizes, build your portfolio, and showcase your skills
        </p>
      </div>

      {/* Current Challenge */}
      <section className="mb-12">
        <h2 className="text-xl font-display mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          Current Challenge
        </h2>
        <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <Badge className="bg-green-500 mb-2">Active</Badge>
                <CardTitle className="text-2xl">{currentChallenge.title}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {currentChallenge.month}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-lg font-bold text-primary">
                  <Clock className="w-5 h-5" />
                  {currentChallenge.daysLeft} days left
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">{currentChallenge.description}</p>
            
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Gift className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Prize</p>
                  <p className="font-medium text-sm">{currentChallenge.prize}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Users className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Participants</p>
                  <p className="font-medium text-sm">{currentChallenge.participants}+</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Deadline</p>
                  <p className="font-medium text-sm">
                    {currentChallenge.endDate.toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-border bg-card">
              <h4 className="font-medium mb-2">Rules</h4>
              <p className="text-sm text-muted-foreground">{currentChallenge.rules}</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button size="lg" className="w-full md:w-auto" data-testid="button-join-challenge">
              <Target className="w-4 h-4 mr-2" />
              Join Challenge
            </Button>
          </CardFooter>
        </Card>
      </section>

      {/* Upcoming Challenges */}
      <section className="mb-12">
        <h2 className="text-xl font-display mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-muted-foreground" />
          Upcoming Challenges
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {upcomingChallenges.map((challenge) => (
            <Card key={challenge.id} className={challenge.isClubOnly && !isClubMember ? "opacity-75" : ""}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    {challenge.isClubOnly && (
                      <Badge variant="secondary" className="mb-2 gap-1">
                        <Crown className="w-3 h-3" /> Club Only
                      </Badge>
                    )}
                    <CardTitle className="text-lg">{challenge.title}</CardTitle>
                    <p className="text-xs text-muted-foreground">{challenge.month}</p>
                  </div>
                  {challenge.isClubOnly && !isClubMember && (
                    <Lock className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{challenge.description}</p>
                <div className="flex items-center gap-2 text-sm">
                  <Gift className="w-4 h-4 text-primary" />
                  <span>{challenge.prize}</span>
                </div>
              </CardContent>
              <CardFooter>
                {challenge.isClubOnly && !isClubMember ? (
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/pricing">Upgrade to Club</Link>
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" disabled>
                    Starts {challenge.startDate.toLocaleDateString()}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Past Winners */}
      <section>
        <h2 className="text-xl font-display mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Hall of Fame
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {pastWinners.map((winner) => (
            <Card key={winner.id}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-yellow-500/20">
                    <Trophy className="w-6 h-6 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{winner.challenge}</p>
                    <h3 className="font-medium text-lg">{winner.winner}</h3>
                    <p className="text-sm text-muted-foreground">Project: {winner.project}</p>
                    <Badge variant="secondary" className="mt-2">{winner.prize}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {!isClubMember && (
        <Card className="mt-12 border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardContent className="flex items-center justify-between py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/20">
                <Crown className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display text-lg">Access Club-Exclusive Challenges</h3>
                <p className="text-sm text-muted-foreground">
                  Join Club to participate in exclusive challenges with bigger prizes
                </p>
              </div>
            </div>
            <Button asChild>
              <Link href="/pricing">Join Club</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
