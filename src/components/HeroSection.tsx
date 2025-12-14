import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Github, ArrowRight, Sparkles, Loader2 } from "lucide-react";

interface HeroSectionProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
}

export function HeroSection({ onAnalyze, isLoading }: HeroSectionProps) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onAnalyze(url.trim());
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/20" />
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
      
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border mb-8 animate-fade-in">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground">AI-Powered Repository Analysis</span>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-fade-in" style={{ animationDelay: '100ms' }}>
          <span className="text-foreground">Evaluate Your</span>
          <br />
          <span className="gradient-text">GitHub Repository</span>
        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 animate-fade-in" style={{ animationDelay: '200ms' }}>
          Transform your repository into a meaningful <strong className="text-foreground">Score + Summary + Personalized Roadmap</strong>. 
          Get honest feedback and actionable improvements from your AI coding mentor.
        </p>

        {/* Input Form */}
        <form 
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto animate-fade-in"
          style={{ animationDelay: '300ms' }}
        >
          <div className="relative flex-1">
            <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="url"
              placeholder="https://github.com/username/repository"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="pl-12 h-14 text-base"
              disabled={isLoading}
            />
          </div>
          <Button 
            type="submit" 
            size="xl" 
            variant="hero"
            disabled={!url.trim() || isLoading}
            className="group"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                Analyze Now
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </Button>
        </form>

        {/* Example links */}
        <div className="mt-8 flex flex-wrap justify-center gap-3 animate-fade-in" style={{ animationDelay: '400ms' }}>
          <span className="text-sm text-muted-foreground">Try examples:</span>
          {[
            'facebook/react',
            'vercel/next.js',
            'microsoft/vscode'
          ].map((repo) => (
            <button
              key={repo}
              onClick={() => setUrl(`https://github.com/${repo}`)}
              className="text-sm text-primary hover:text-primary/80 transition-colors font-mono"
              disabled={isLoading}
            >
              {repo}
            </button>
          ))}
        </div>

        {/* Features */}
        <div className="mt-20 grid md:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: '500ms' }}>
          {[
            {
              icon: '📊',
              title: 'Detailed Scoring',
              description: 'Get a comprehensive score based on 6 key dimensions'
            },
            {
              icon: '📝',
              title: 'Written Summary',
              description: 'Receive honest feedback about your code quality'
            },
            {
              icon: '🗺️',
              title: 'Personalized Roadmap',
              description: 'Actionable steps to improve your repository'
            }
          ].map((feature) => (
            <div key={feature.title} className="glass-card p-6 text-left">
              <span className="text-3xl mb-4 block">{feature.icon}</span>
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
