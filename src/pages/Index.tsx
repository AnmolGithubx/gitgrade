import { useState } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { AnalysisResults } from "@/components/AnalysisResults";
import { fetchRepoData } from "@/lib/githubApi";
import { analyzeRepository } from "@/lib/analyzeRepo";
import { AnalysisResult } from "@/types/analysis";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async (url: string) => {
    // Validate URL format
    if (!url.includes('github.com/') && !url.match(/^[^\/]+\/[^\/]+$/)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid GitHub repository URL or owner/repo format",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Fetch real data from GitHub API
      const repoData = await fetchRepoData(url);
      
      // Analyze the repository
      const analysis = analyzeRepository(repoData);
      setResult(analysis);
      
      toast({
        title: "Analysis Complete!",
        description: `${repoData.repo.full_name} scored ${analysis.score}/100`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to analyze the repository";
      toast({
        title: "Analysis Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setResult(null);
  };

  return (
    <main className="min-h-screen bg-background">
      <Header showBackButton={!!result} onBack={handleBack} />
      
      <div className="pt-16">
        {result ? (
          <AnalysisResults result={result} />
        ) : (
          <HeroSection onAnalyze={handleAnalyze} isLoading={isLoading} />
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Built for <span className="text-primary font-semibold">UnsaidTalks GitGrade Hackathon</span> • AI + Code Analysis + Developer Profiling
          </p>
        </div>
      </footer>
    </main>
  );
};

export default Index;
