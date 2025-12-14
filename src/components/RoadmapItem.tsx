import { RoadmapItem as RoadmapItemType } from "@/types/analysis";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, ArrowRight } from "lucide-react";
import { useState } from "react";

interface RoadmapItemProps {
  item: RoadmapItemType;
  index: number;
}

const categoryIcons: Record<string, string> = {
  documentation: "📝",
  testing: "🧪",
  structure: "📁",
  git: "🔀",
  code: "💻",
  "ci-cd": "⚙️",
};

const priorityStyles = {
  high: "border-l-red-400 bg-red-500/5",
  medium: "border-l-yellow-400 bg-yellow-500/5",
  low: "border-l-green-400 bg-green-500/5",
};

export function RoadmapItemCard({ item, index }: RoadmapItemProps) {
  const [isCompleted, setIsCompleted] = useState(false);

  return (
    <div 
      className={cn(
        "glass-card p-5 border-l-4 opacity-0 animate-slide-in-right transition-all duration-300 cursor-pointer hover:scale-[1.01]",
        priorityStyles[item.priority],
        isCompleted && "opacity-60"
      )}
      style={{ animationDelay: `${index * 100 + 400}ms` }}
      onClick={() => setIsCompleted(!isCompleted)}
    >
      <div className="flex items-start gap-4">
        <button 
          className="mt-1 text-primary transition-transform hover:scale-110"
          onClick={(e) => {
            e.stopPropagation();
            setIsCompleted(!isCompleted);
          }}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-score-high" />
          ) : (
            <Circle className="w-5 h-5" />
          )}
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{categoryIcons[item.category]}</span>
            <h4 className={cn(
              "font-semibold text-foreground transition-all",
              isCompleted && "line-through text-muted-foreground"
            )}>
              {item.title}
            </h4>
          </div>
          <p className={cn(
            "text-sm text-muted-foreground",
            isCompleted && "line-through"
          )}>
            {item.description}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className={cn(
            "text-xs px-2 py-1 rounded-full font-medium capitalize",
            item.priority === 'high' && "bg-red-500/20 text-red-400",
            item.priority === 'medium' && "bg-yellow-500/20 text-yellow-400",
            item.priority === 'low' && "bg-green-500/20 text-green-400"
          )}>
            {item.priority}
          </span>
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}
