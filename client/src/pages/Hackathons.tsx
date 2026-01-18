import { useHackathons } from "@/hooks/use-hackathons";
import { format } from "date-fns";
import { ExternalLink, Calendar, Tag } from "lucide-react";
import { motion } from "framer-motion";

export default function Hackathons() {
  const { data: hackathons, isLoading } = useHackathons();

  if (isLoading) {
    return (
      <div className="retro-container py-20 text-center">
        <p className="font-display text-primary animate-pulse">Searching global events...</p>
      </div>
    );
  }

  return (
    <div className="retro-container space-y-8">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl text-primary drop-shadow-lg">Global Hackathons</h1>
        <p className="text-muted-foreground">Find your next challenge. Compete. Win.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hackathons?.map((hackathon, i) => (
          <motion.article
            key={hackathon.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="pixel-card overflow-hidden flex flex-col h-full group"
          >
            <div className="h-40 bg-muted relative overflow-hidden">
              <img 
                src={hackathon.imageUrl || "https://images.unsplash.com/photo-1504384308090-c54be3852f92?auto=format&fit=crop&w=800&q=80"} // placeholder tech image
                alt={hackathon.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2 right-2">
                <span className="bg-background/90 text-foreground text-[10px] font-bold px-2 py-1 rounded border border-border uppercase">
                  {hackathon.platform}
                </span>
              </div>
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{hackathon.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">
                {hackathon.description}
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(hackathon.startDate), "MMM d")} - {format(new Date(hackathon.endDate), "MMM d, yyyy")}</span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {hackathon.tags?.slice(0, 3).map(tag => (
                    <span key={tag} className="text-[10px] px-2 py-1 bg-accent/10 text-accent rounded-full border border-accent/20 flex items-center gap-1">
                      <Tag className="h-3 w-3" /> {tag}
                    </span>
                  ))}
                </div>

                <a 
                  href={hackathon.url}
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full pixel-btn-primary flex items-center justify-center gap-2 text-xs py-3 mt-2"
                >
                  Register Now <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
