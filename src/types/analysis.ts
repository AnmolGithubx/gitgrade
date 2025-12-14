export interface AnalysisResult {
  score: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  badge: 'Bronze' | 'Silver' | 'Gold';
  summary: string;
  roadmap: RoadmapItem[];
  dimensions: DimensionScore[];
  repoInfo: RepoInfo;
}

export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: 'documentation' | 'testing' | 'structure' | 'git' | 'code' | 'ci-cd';
}

export interface DimensionScore {
  name: string;
  score: number;
  maxScore: number;
  icon: string;
  description: string;
}

export interface RepoInfo {
  name: string;
  owner: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  lastUpdated: string;
}
