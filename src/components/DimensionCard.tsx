import { DimensionScore } from "@/types/analysis";
import { cn } from "@/lib/utils";

interface DimensionCardProps {
  dimension: DimensionScore;
  delay: number;
}

export function DimensionCard({ dimension, delay }: DimensionCardProps) {
  const percentage = (dimension.score / dimension.maxScore) * 100;
  
  const getBarColor = () => {
    if (percentage >= 80) return "bg-gradient-to-r from-green-400 to-emerald-500";
    if (percentage >= 60) return "bg-gradient-to-r from-yellow-400 to-orange-500";
    return "bg-gradient-to-r from-red-400 to-rose-500";
  };

  return (
    <div 
      className="glass-card p-5 opacity-0 animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{dimension.icon}</span>
          <div>
            <h4 className="font-semibold text-foreground">{dimension.name}</h4>
            <p className="text-xs text-muted-foreground">{dimension.description}</p>
          </div>
        </div>
        <div className="text-right">
          <span className="font-mono font-bold text-foreground">{dimension.score}</span>
          <span className="text-muted-foreground text-sm">/{dimension.maxScore}</span>
        </div>
      </div>
      
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div 
          className={cn("h-full rounded-full transition-all duration-1000 ease-out", getBarColor())}
          style={{ 
            width: `${percentage}%`,
            transitionDelay: `${delay}ms`
          }}
        />
      </div>
    </div>
  );
}
