const GITHUB_API_BASE = 'https://api.github.com';

export interface GitHubRepo {
  name: string;
  full_name: string;
  description: string | null;
  owner: {
    login: string;
    avatar_url: string;
  };
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  size: number;
  default_branch: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  has_wiki: boolean;
  has_issues: boolean;
  license: { name: string } | null;
  topics: string[];
}

export interface GitHubContributor {
  login: string;
  contributions: number;
  avatar_url: string;
}

export interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
}

export interface GitHubContent {
  name: string;
  path: string;
  type: 'file' | 'dir';
  size?: number;
}

export interface GitHubLanguages {
  [language: string]: number;
}

export interface GitHubBranch {
  name: string;
  protected: boolean;
}

export interface RepoAnalysisData {
  repo: GitHubRepo;
  contributors: GitHubContributor[];
  commits: GitHubCommit[];
  contents: GitHubContent[];
  languages: GitHubLanguages;
  branches: GitHubBranch[];
  hasReadme: boolean;
  hasLicense: boolean;
  hasTests: boolean;
  hasCICD: boolean;
  hasPackageJson: boolean;
  fileCount: number;
  folderStructure: string[];
}

function parseRepoUrl(url: string): { owner: string; repo: string } | null {
  // Handle various GitHub URL formats
  const patterns = [
    /github\.com\/([^\/]+)\/([^\/\?#]+)/,
    /^([^\/]+)\/([^\/]+)$/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return { owner: match[1], repo: match[2].replace(/\.git$/, '') };
    }
  }
  return null;
}

async function fetchGitHub<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${GITHUB_API_BASE}${endpoint}`, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
    },
  });
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Repository not found. Make sure it exists and is public.');
    }
    if (response.status === 403) {
      throw new Error('API rate limit exceeded. Please try again later.');
    }
    throw new Error(`GitHub API error: ${response.statusText}`);
  }
  
  return response.json();
}

async function fetchContentsRecursive(owner: string, repo: string, path: string = ''): Promise<GitHubContent[]> {
  try {
    const contents = await fetchGitHub<GitHubContent[]>(`/repos/${owner}/${repo}/contents/${path}`);
    return contents;
  } catch {
    return [];
  }
}

export async function fetchRepoData(repoUrl: string): Promise<RepoAnalysisData> {
  const parsed = parseRepoUrl(repoUrl);
  if (!parsed) {
    throw new Error('Invalid GitHub repository URL');
  }
  
  const { owner, repo } = parsed;
  
  // Fetch all data in parallel for efficiency
  const [repoData, contributors, commits, contents, languages, branches] = await Promise.all([
    fetchGitHub<GitHubRepo>(`/repos/${owner}/${repo}`),
    fetchGitHub<GitHubContributor[]>(`/repos/${owner}/${repo}/contributors?per_page=10`).catch(() => []),
    fetchGitHub<GitHubCommit[]>(`/repos/${owner}/${repo}/commits?per_page=100`).catch(() => []),
    fetchContentsRecursive(owner, repo),
    fetchGitHub<GitHubLanguages>(`/repos/${owner}/${repo}/languages`).catch(() => ({})),
    fetchGitHub<GitHubBranch[]>(`/repos/${owner}/${repo}/branches?per_page=30`).catch(() => []),
  ]);
  
  // Check for specific files
  const fileNames = contents.map(c => c.name.toLowerCase());
  const hasReadme = fileNames.some(f => f.startsWith('readme'));
  const hasLicense = fileNames.some(f => f.includes('license'));
  const hasPackageJson = fileNames.includes('package.json');
  
  // Check for test directories/files
  const hasTests = fileNames.some(f => 
    f.includes('test') || f.includes('spec') || f === '__tests__' || f === 'jest.config.js' || f === 'vitest.config.ts'
  );
  
  // Check for CI/CD
  const hasCICD = fileNames.includes('.github') || fileNames.some(f => 
    f.includes('ci') || f.includes('workflow') || f === '.travis.yml' || f === 'jenkinsfile'
  );
  
  // Get folder structure
  const folders = contents.filter(c => c.type === 'dir').map(c => c.name);
  const files = contents.filter(c => c.type === 'file');
  
  return {
    repo: repoData,
    contributors,
    commits,
    contents,
    languages,
    branches,
    hasReadme,
    hasLicense,
    hasTests,
    hasCICD,
    hasPackageJson,
    fileCount: files.length,
    folderStructure: folders,
  };
}
