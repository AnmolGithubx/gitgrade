import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ScoreDisplayProps {
  score: number;
  level: string;
  badge: string;
}

export function ScoreDisplay({ score, level, badge }: ScoreDisplayProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    setIsRevealed(true);
    const duration = 1500;
    const steps = 60;
    const increment = score / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setDisplayScore(score);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.round(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score]);

  const getScoreColor = () => {
    if (score >= 80) return "text-score-high";
    if (score >= 60) return "text-score-medium";
    return "text-score-low";
  };

  const getGradient = () => {
    if (score >= 80) return "from-green-400 to-emerald-500";
    if (score >= 60) return "from-yellow-400 to-orange-500";
    return "from-red-400 to-rose-500";
  };

  const getBadgeEmoji = () => {
    if (badge === 'Gold') return '🥇';
    if (badge === 'Silver') return '🥈';
    return '🥉';
  };

  return (
    <div className={cn(
      "glass-card p-8 text-center transition-all duration-700",
      isRevealed ? "opacity-100 scale-100" : "opacity-0 scale-90"
    )}>
      <div className="relative inline-flex items-center justify-center mb-6">
        {/* Background glow */}
        <div className={cn(
          "absolute inset-0 rounded-full blur-2xl opacity-30 bg-gradient-to-r",
          getGradient()
        )} style={{ transform: 'scale(1.5)' }} />
        
        {/* Score circle */}
        <div className="relative">
          <svg className="w-48 h-48 transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-secondary"
            />
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="url(#scoreGradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 88}`}
              strokeDashoffset={`${2 * Math.PI * 88 * (1 - displayScore / 100)}`}
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(var(--accent))" />
              </linearGradient>
            </defs>
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={cn(
              "text-6xl font-bold font-mono transition-colors",
              getScoreColor()
            )}>
              {displayScore}
            </span>
            <span className="text-muted-foreground text-sm mt-1">/ 100</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-center gap-3">
          <span className="text-3xl">{getBadgeEmoji()}</span>
          <span className={cn(
            "text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent",
            getGradient()
          )}>
            {badge}
          </span>
        </div>
        
        <div className="inline-block px-4 py-2 rounded-full bg-secondary/50 border border-border">
          <span className="text-sm text-muted-foreground">Level: </span>
          <span className="text-sm font-semibold text-foreground">{level}</span>
        </div>
      </div>
    </div>
  );
}
