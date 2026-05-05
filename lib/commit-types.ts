/**
 * GitHub Commit Types
 * TypeScript interfaces untuk GitHub API responses dan commit data
 */

/**
 * Commit data yang ditampilkan di UI
 */
export interface Commit {
  sha: string;
  shortSha: string;
  message: string;
  author: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
  date: Date;
  htmlUrl: string;
}

/**
 * GitHub API commit response (dari REST API)
 */
export interface GitHubCommitResponse {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      email: string;
      date: string;
    };
  };
  author?: {
    avatar_url: string;
    login: string;
    html_url: string;
  };
  html_url: string;
}

/**
 * Parsed GitHub repository info
 */
export interface GitHubRepoInfo {
  owner: string;
  repo: string;
  isValid: boolean;
}

/**
 * Fetch commits result dengan error handling
 */
export interface FetchCommitsResult {
  success: boolean;
  commits?: Commit[];
  error?: string;
  totalCount?: number;
}
