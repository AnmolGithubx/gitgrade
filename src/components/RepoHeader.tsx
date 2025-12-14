import { RepoInfo } from "@/types/analysis";
import { Star, GitFork, Clock, Code2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface RepoHeaderProps {
  repoInfo: RepoInfo;
}

export function RepoHeader({ repoInfo }: RepoHeaderProps) {
  return (
    <div className="glass-card p-6 mb-8 opacity-0 animate-fade-in" style={{ animationDelay: '100ms' }}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
            <span>{repoInfo.owner}</span>
            <span>/</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">{repoInfo.name}</h2>
          <p className="text-muted-foreground text-sm max-w-xl">{repoInfo.description}</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 border border-border">
            <Code2 className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">{repoInfo.language}</span>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 border border-border">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium">{repoInfo.stars}</span>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 border border-border">
            <GitFork className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">{repoInfo.forks}</span>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 border border-border">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {formatDistanceToNow(new Date(repoInfo.lastUpdated), { addSuffix: true })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
