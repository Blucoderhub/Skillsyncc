import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter 
} from "@/components/ui/dialog";
import { 
  Code2, ExternalLink, Github, Plus, Heart, Eye, Star, Folder, Crown 
} from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function Portfolio() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data: subscription } = useQuery({
    queryKey: ["/api/subscription"],
    enabled: !!user,
  });

  const isClubMember = subscription?.membershipStatus === "active";

  // Mock featured projects (in production, fetch from /api/projects)
  const featuredProjects = [
    {
      id: 1,
      title: "Weather Dashboard",
      description: "A beautiful weather app built with React and OpenWeather API",
      tags: ["React", "API", "CSS"],
      likes: 42,
      views: 156,
      demoUrl: "https://example.com",
      repoUrl: "https://github.com/example",
      author: "CodeMaster",
      featured: true,
    },
    {
      id: 2,
      title: "Task Manager",
      description: "Full-stack task management app with authentication",
      tags: ["Node.js", "Express", "MongoDB"],
      likes: 38,
      views: 120,
      demoUrl: "https://example.com",
      author: "DevNinja",
      featured: true,
    },
    {
      id: 3,
      title: "Pixel Art Editor",
      description: "Create retro pixel art directly in the browser",
      tags: ["JavaScript", "Canvas", "CSS"],
      likes: 65,
      views: 230,
      demoUrl: "https://example.com",
      author: "PixelPro",
      featured: true,
    },
  ];

  const myProjects = [
    {
      id: 101,
      title: "My First Website",
      description: "Personal portfolio built with HTML and CSS",
      tags: ["HTML", "CSS"],
      likes: 5,
      views: 23,
      visibility: "public",
    },
  ];

  return (
    <div className="retro-container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Folder className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-display text-primary">Project Showcase</h1>
          </div>
          <p className="text-muted-foreground">
            Build your portfolio and showcase your projects to the community
          </p>
        </div>
        {isClubMember && (
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" data-testid="button-create-project">
                <Plus className="w-4 h-4" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <label className="text-sm font-medium">Project Title</label>
                  <Input placeholder="My Awesome Project" data-testid="input-project-title" />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea 
                    placeholder="Describe your project..." 
                    data-testid="input-project-description" 
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Demo URL (optional)</label>
                  <Input placeholder="https://..." data-testid="input-demo-url" />
                </div>
                <div>
                  <label className="text-sm font-medium">Repository URL (optional)</label>
                  <Input placeholder="https://github.com/..." data-testid="input-repo-url" />
                </div>
                <div>
                  <label className="text-sm font-medium">Tags (comma separated)</label>
                  <Input placeholder="React, Node.js, CSS" data-testid="input-tags" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  toast({ title: "Project created!", description: "Your project has been added to your portfolio." });
                  setIsCreateOpen(false);
                }}>
                  Create Project
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {!isClubMember && (
        <Card className="mb-8 border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardContent className="flex items-center justify-between py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/20">
                <Crown className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display text-lg">Unlimited Project Hosting</h3>
                <p className="text-sm text-muted-foreground">
                  Join Club to host unlimited projects in your portfolio
                </p>
              </div>
            </div>
            <Button asChild>
              <Link href="/pricing">Join Club</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* My Projects */}
      {user && (
        <section className="mb-12">
          <h2 className="text-xl font-display mb-4 flex items-center gap-2">
            <Code2 className="w-5 h-5 text-primary" />
            My Projects
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myProjects.map((project) => (
              <Card key={project.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {project.visibility}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" /> {project.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" /> {project.views}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
            {!isClubMember && myProjects.length >= 1 && (
              <Card className="border-dashed flex items-center justify-center min-h-[200px]">
                <CardContent className="text-center py-8">
                  <Crown className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Upgrade to Club for unlimited projects
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      )}

      {/* Featured Projects */}
      <section>
        <h2 className="text-xl font-display mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500" />
          Featured Projects
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredProjects.map((project) => (
            <Card key={project.id} className="hover-elevate">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  {project.featured && (
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">by {project.author}</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3" /> {project.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" /> {project.views}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="gap-2">
                {project.demoUrl && (
                  <Button size="sm" variant="outline" className="gap-1" asChild>
                    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3 h-3" /> Demo
                    </a>
                  </Button>
                )}
                {project.repoUrl && (
                  <Button size="sm" variant="ghost" className="gap-1" asChild>
                    <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="w-3 h-3" /> Code
                    </a>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
