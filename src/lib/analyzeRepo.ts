import { AnalysisResult, DimensionScore, RoadmapItem } from "@/types/analysis";
import { RepoAnalysisData } from "./githubApi";
import { formatDistanceToNow } from "date-fns";

function calculateCodeQualityScore(data: RepoAnalysisData): number {
  let score = 0;
  const maxScore = 20;
  
  // Has multiple languages (indicates structured project)
  const languageCount = Object.keys(data.languages).length;
  if (languageCount > 0) score += 3;
  if (languageCount > 2) score += 2;
  
  // Good folder structure
  const goodFolders = ['src', 'lib', 'components', 'utils', 'hooks', 'services', 'types', 'api', 'pages', 'app'];
  const hasFolderStructure = data.folderStructure.some(f => goodFolders.includes(f.toLowerCase()));
  if (hasFolderStructure) score += 5;
  
  // Has config files (indicates setup)
  const hasConfigs = data.contents.some(c => 
    c.name.includes('config') || c.name.includes('.json') || c.name.includes('.yml')
  );
  if (hasConfigs) score += 3;
  
  // Has package.json or similar dependency management
  if (data.hasPackageJson) score += 4;
  
  // Multiple files indicates non-trivial project
  if (data.fileCount > 5) score += 2;
  if (data.fileCount > 15) score += 1;
  
  return Math.min(score, maxScore);
}

function calculateDocumentationScore(data: RepoAnalysisData): number {
  let score = 0;
  const maxScore = 20;
  
  // Has README
  if (data.hasReadme) score += 8;
  
  // Has license
  if (data.hasLicense) score += 4;
  if (data.repo.license) score += 2;
  
  // Has description
  if (data.repo.description && data.repo.description.length > 20) score += 3;
  
  // Has wiki enabled
  if (data.repo.has_wiki) score += 1;
  
  // Has topics/tags
  if (data.repo.topics && data.repo.topics.length > 0) score += 2;
  
  return Math.min(score, maxScore);
}

function calculateTestingScore(data: RepoAnalysisData): number {
  let score = 0;
  const maxScore = 15;
  
  // Has test files/folders
  if (data.hasTests) score += 10;
  
  // Has CI/CD (implies automated testing)
  if (data.hasCICD) score += 5;
  
  return Math.min(score, maxScore);
}

function calculateStructureScore(data: RepoAnalysisData): number {
  let score = 0;
  const maxScore = 15;
  
  // Good folder count (not flat structure)
  if (data.folderStructure.length >= 2) score += 3;
  if (data.folderStructure.length >= 4) score += 3;
  if (data.folderStructure.length >= 6) score += 2;
  
  // Common good structure patterns
  const patterns = ['src', 'public', 'assets', 'components', 'pages', 'lib', 'utils'];
  const matchedPatterns = data.folderStructure.filter(f => 
    patterns.includes(f.toLowerCase())
  ).length;
  score += Math.min(matchedPatterns * 2, 7);
  
  return Math.min(score, maxScore);
}

function calculateGitPracticesScore(data: RepoAnalysisData): number {
  let score = 0;
  const maxScore = 15;
  
  // Number of commits (activity)
  const commitCount = data.commits.length;
  if (commitCount >= 10) score += 3;
  if (commitCount >= 30) score += 2;
  if (commitCount >= 50) score += 2;
  
  // Multiple branches (feature branching)
  if (data.branches.length > 1) score += 3;
  if (data.branches.length > 3) score += 2;
  
  // Multiple contributors (collaboration)
  if (data.contributors.length > 1) score += 2;
  if (data.contributors.length > 3) score += 1;
  
  return Math.min(score, maxScore);
}

function calculateRelevanceScore(data: RepoAnalysisData): number {
  let score = 0;
  const maxScore = 15;
  
  // Stars indicate usefulness
  if (data.repo.stargazers_count > 0) score += 2;
  if (data.repo.stargazers_count > 10) score += 2;
  if (data.repo.stargazers_count > 50) score += 2;
  
  // Forks indicate adoption
  if (data.repo.forks_count > 0) score += 2;
  if (data.repo.forks_count > 5) score += 2;
  
  // Recent activity
  const lastPush = new Date(data.repo.pushed_at);
  const daysSinceUpdate = (Date.now() - lastPush.getTime()) / (1000 * 60 * 60 * 24);
  if (daysSinceUpdate < 30) score += 3;
  else if (daysSinceUpdate < 90) score += 2;
  else if (daysSinceUpdate < 180) score += 1;
  
  // Issues enabled (project management)
  if (data.repo.has_issues) score += 1;
  
  // Has description
  if (data.repo.description) score += 1;
  
  return Math.min(score, maxScore);
}

function generateRoadmap(data: RepoAnalysisData, dimensions: DimensionScore[]): RoadmapItem[] {
  const roadmap: RoadmapItem[] = [];
  
  // Documentation improvements
  if (!data.hasReadme) {
    roadmap.push({
      id: 'readme',
      title: 'Add Comprehensive README',
      description: 'Include project overview, installation steps, usage examples, and contribution guidelines.',
      priority: 'high',
      category: 'documentation',
    });
  }
  
  if (!data.hasLicense && !data.repo.license) {
    roadmap.push({
      id: 'license',
      title: 'Add a License File',
      description: 'Choose an appropriate open-source license (MIT, Apache 2.0, etc.) to clarify usage rights.',
      priority: 'medium',
      category: 'documentation',
    });
  }
  
  // Testing improvements
  if (!data.hasTests) {
    roadmap.push({
      id: 'tests',
      title: 'Implement Unit Tests',
      description: 'Add unit tests for core functions using Jest, Vitest, or your language\'s testing framework.',
      priority: 'high',
      category: 'testing',
    });
  }
  
  // CI/CD improvements
  if (!data.hasCICD) {
    roadmap.push({
      id: 'cicd',
      title: 'Set Up CI/CD Pipeline',
      description: 'Configure GitHub Actions for automated testing, linting, and deployment on every push.',
      priority: 'medium',
      category: 'ci-cd',
    });
  }
  
  // Structure improvements
  if (data.folderStructure.length < 3) {
    roadmap.push({
      id: 'structure',
      title: 'Improve Folder Structure',
      description: 'Organize code into logical modules: src/, components/, utils/, types/, services/.',
      priority: 'medium',
      category: 'structure',
    });
  }
  
  // Git practices improvements
  if (data.branches.length <= 1) {
    roadmap.push({
      id: 'branches',
      title: 'Use Feature Branches',
      description: 'Create separate branches for features and bug fixes. Use pull requests for code review.',
      priority: 'medium',
      category: 'git',
    });
  }
  
  // Commit quality
  if (data.commits.length < 10) {
    roadmap.push({
      id: 'commits',
      title: 'Commit More Frequently',
      description: 'Make smaller, more frequent commits with meaningful messages following conventional commit format.',
      priority: 'low',
      category: 'git',
    });
  }
  
  // Topics/tags
  if (!data.repo.topics || data.repo.topics.length === 0) {
    roadmap.push({
      id: 'topics',
      title: 'Add Repository Topics',
      description: 'Add relevant topics/tags to help others discover your project on GitHub.',
      priority: 'low',
      category: 'documentation',
    });
  }
  
  return roadmap.slice(0, 6); // Return top 6 recommendations
}

function generateSummary(data: RepoAnalysisData, totalScore: number, dimensions: DimensionScore[]): string {
  const parts: string[] = [];
  
  // Overall assessment
  if (totalScore >= 80) {
    parts.push("Excellent repository with strong software engineering practices.");
  } else if (totalScore >= 65) {
    parts.push("Solid project foundation with good organization.");
  } else if (totalScore >= 50) {
    parts.push("Decent project structure with room for improvement.");
  } else {
    parts.push("This repository needs some work to meet professional standards.");
  }
  
  // Strengths
  const strengths: string[] = [];
  dimensions.forEach(d => {
    const percentage = (d.score / d.maxScore) * 100;
    if (percentage >= 70) {
      strengths.push(d.name.toLowerCase());
    }
  });
  if (strengths.length > 0) {
    parts.push(`Strong points: ${strengths.join(', ')}.`);
  }
  
  // Areas to improve
  const weaknesses: string[] = [];
  dimensions.forEach(d => {
    const percentage = (d.score / d.maxScore) * 100;
    if (percentage < 50) {
      weaknesses.push(d.name.toLowerCase());
    }
  });
  if (weaknesses.length > 0) {
    parts.push(`Needs improvement: ${weaknesses.join(', ')}.`);
  }
  
  // Activity note
  const lastPush = new Date(data.repo.pushed_at);
  const daysSinceUpdate = (Date.now() - lastPush.getTime()) / (1000 * 60 * 60 * 24);
  if (daysSinceUpdate < 7) {
    parts.push("Active development with recent commits.");
  } else if (daysSinceUpdate > 180) {
    parts.push("Consider resuming development or archiving if no longer maintained.");
  }
  
  return parts.join(' ');
}

export function analyzeRepository(data: RepoAnalysisData): AnalysisResult {
  // Calculate all dimension scores
  const codeQualityScore = calculateCodeQualityScore(data);
  const documentationScore = calculateDocumentationScore(data);
  const testingScore = calculateTestingScore(data);
  const structureScore = calculateStructureScore(data);
  const gitPracticesScore = calculateGitPracticesScore(data);
  const relevanceScore = calculateRelevanceScore(data);
  
  const dimensions: DimensionScore[] = [
    {
      name: 'Code Quality',
      score: codeQualityScore,
      maxScore: 20,
      icon: '💻',
      description: 'Clean code, readability, and best practices',
    },
    {
      name: 'Documentation',
      score: documentationScore,
      maxScore: 20,
      icon: '📚',
      description: 'README, comments, and API documentation',
    },
    {
      name: 'Testing',
      score: testingScore,
      maxScore: 15,
      icon: '🧪',
      description: 'Test coverage and testing practices',
    },
    {
      name: 'Project Structure',
      score: structureScore,
      maxScore: 15,
      icon: '📁',
      description: 'Folder organization and modularity',
    },
    {
      name: 'Git Practices',
      score: gitPracticesScore,
      maxScore: 15,
      icon: '🔀',
      description: 'Commits, branches, and version control',
    },
    {
      name: 'Real-world Relevance',
      score: relevanceScore,
      maxScore: 15,
      icon: '🌍',
      description: 'Practical applicability and usefulness',
    },
  ];
  
  // Calculate total score
  const totalScore = dimensions.reduce((sum, d) => sum + d.score, 0);
  
  // Determine level and badge
  const level = totalScore >= 80 ? 'Advanced' : totalScore >= 60 ? 'Intermediate' : 'Beginner';
  const badge = totalScore >= 85 ? 'Gold' : totalScore >= 65 ? 'Silver' : 'Bronze';
  
  // Generate roadmap
  const roadmap = generateRoadmap(data, dimensions);
  
  // Generate summary
  const summary = generateSummary(data, totalScore, dimensions);
  
  return {
    score: totalScore,
    level,
    badge,
    summary,
    roadmap,
    dimensions,
    repoInfo: {
      name: data.repo.name,
      owner: data.repo.owner.login,
      description: data.repo.description || 'No description provided',
      language: data.repo.language || 'Unknown',
      stars: data.repo.stargazers_count,
      forks: data.repo.forks_count,
      lastUpdated: data.repo.pushed_at,
    },
  };
}
