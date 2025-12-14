import { AnalysisResult } from "@/types/analysis";
import { ScoreDisplay } from "./ScoreDisplay";
import { DimensionCard } from "./DimensionCard";
import { RoadmapItemCard } from "./RoadmapItem";
import { RepoHeader } from "./RepoHeader";
import { MessageSquare, Map, BarChart3 } from "lucide-react";

interface AnalysisResultsProps {
  result: AnalysisResult;
}

export function AnalysisResults({ result }: AnalysisResultsProps) {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12 space-y-8">
      <RepoHeader repoInfo={result.repoInfo} />
      
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Score Section */}
        <div className="lg:col-span-1">
          <ScoreDisplay 
            score={result.score} 
            level={result.level} 
            badge={result.badge} 
          />
        </div>
        
        {/* Summary Section */}
        <div className="lg:col-span-2">
          <div className="glass-card p-6 h-full opacity-0 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Summary</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed text-lg">
              {result.summary}
            </p>
          </div>
        </div>
      </div>

      {/* Dimensions Grid */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-accent/10">
            <BarChart3 className="w-5 h-5 text-accent" />
          </div>
          <h3 className="text-xl font-bold text-foreground">Analysis Breakdown</h3>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {result.dimensions.map((dimension, index) => (
            <DimensionCard 
              key={dimension.name} 
              dimension={dimension} 
              delay={index * 100 + 300}
            />
          ))}
        </div>
      </div>

      {/* Roadmap Section */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/10">
            <Map className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-foreground">Personalized Roadmap</h3>
          <span className="text-sm text-muted-foreground">Click to mark as completed</span>
        </div>
        <div className="space-y-4">
          {result.roadmap.map((item, index) => (
            <RoadmapItemCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
