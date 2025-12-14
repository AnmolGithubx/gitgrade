import { AnalysisResult } from "@/types/analysis";

export function generateMockAnalysis(repoUrl: string): AnalysisResult {
  // Extract repo name from URL
  const urlParts = repoUrl.replace('https://github.com/', '').split('/');
  const owner = urlParts[0] || 'user';
  const name = urlParts[1] || 'repository';
  
  // Generate a pseudo-random score based on repo name
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const baseScore = (hash % 40) + 50; // Score between 50-89
  const score = Math.min(100, baseScore + (name.length % 15));
  
  const level = score >= 80 ? 'Advanced' : score >= 60 ? 'Intermediate' : 'Beginner';
  const badge = score >= 85 ? 'Gold' : score >= 65 ? 'Silver' : 'Bronze';
  
  const summaries = {
    high: `Excellent repository structure with clean, maintainable code. The project demonstrates strong software engineering practices with comprehensive documentation. Minor improvements in test coverage would elevate this to production-grade quality.`,
    medium: `Solid project foundation with consistent code style and reasonable organization. Documentation covers the basics but could be expanded. Adding unit tests and improving commit practices would significantly enhance the codebase.`,
    low: `The project shows potential but needs structural improvements. Code organization could be more modular, and documentation is minimal. Focus on establishing coding standards, adding a comprehensive README, and implementing basic testing.`
  };
  
  const summaryKey = score >= 75 ? 'high' : score >= 55 ? 'medium' : 'low';
  
  const allRoadmapItems = [
    {
      id: '1',
      title: 'Add Comprehensive README',
      description: 'Include project overview, installation steps, usage examples, and contribution guidelines.',
      priority: 'high' as const,
      category: 'documentation' as const,
    },
    {
      id: '2',
      title: 'Implement Unit Tests',
      description: 'Add unit tests for core functions with at least 70% coverage using Jest or Vitest.',
      priority: 'high' as const,
      category: 'testing' as const,
    },
    {
      id: '3',
      title: 'Set Up CI/CD Pipeline',
      description: 'Configure GitHub Actions for automated testing, linting, and deployment.',
      priority: 'medium' as const,
      category: 'ci-cd' as const,
    },
    {
      id: '4',
      title: 'Improve Folder Structure',
      description: 'Organize code into logical modules: components, utils, hooks, services, types.',
      priority: 'medium' as const,
      category: 'structure' as const,
    },
    {
      id: '5',
      title: 'Follow Git Best Practices',
      description: 'Use feature branches, write meaningful commit messages, and create PRs for all changes.',
      priority: 'medium' as const,
      category: 'git' as const,
    },
    {
      id: '6',
      title: 'Add Code Documentation',
      description: 'Document complex functions with JSDoc comments and add inline explanations.',
      priority: 'low' as const,
      category: 'code' as const,
    },
  ];
  
  // Select roadmap items based on score (lower score = more items)
  const numItems = score >= 80 ? 2 : score >= 60 ? 4 : 6;
  const roadmap = allRoadmapItems.slice(0, numItems);
  
  const dimensions: AnalysisResult['dimensions'] = [
    {
      name: 'Code Quality',
      score: Math.min(20, Math.round(score * 0.22)),
      maxScore: 20,
      icon: '💻',
      description: 'Clean code, readability, and best practices',
    },
    {
      name: 'Documentation',
      score: Math.min(20, Math.round(score * 0.18)),
      maxScore: 20,
      icon: '📚',
      description: 'README, comments, and API documentation',
    },
    {
      name: 'Testing',
      score: Math.min(15, Math.round(score * 0.12)),
      maxScore: 15,
      icon: '🧪',
      description: 'Test coverage and testing practices',
    },
    {
      name: 'Project Structure',
      score: Math.min(15, Math.round(score * 0.16)),
      maxScore: 15,
      icon: '📁',
      description: 'Folder organization and modularity',
    },
    {
      name: 'Git Practices',
      score: Math.min(15, Math.round(score * 0.15)),
      maxScore: 15,
      icon: '🔀',
      description: 'Commits, branches, and version control',
    },
    {
      name: 'Real-world Relevance',
      score: Math.min(15, Math.round(score * 0.17)),
      maxScore: 15,
      icon: '🌍',
      description: 'Practical applicability and usefulness',
    },
  ];
  
  return {
    score,
    level,
    badge,
    summary: summaries[summaryKey],
    roadmap,
    dimensions,
    repoInfo: {
      name,
      owner,
      description: `A ${name.replace(/-/g, ' ')} project built with modern technologies.`,
      language: ['TypeScript', 'JavaScript', 'Python', 'Go', 'Rust'][hash % 5],
      stars: (hash * 7) % 500,
      forks: (hash * 3) % 100,
      lastUpdated: new Date(Date.now() - (hash % 30) * 24 * 60 * 60 * 1000).toISOString(),
    },
  };
}
