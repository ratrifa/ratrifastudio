/**
 * GitHub API Integration
 * Functions untuk fetch repository commits dengan private repo support
 */

import {
  Commit,
  GitHubCommitResponse,
  GitHubRepoInfo,
  FetchCommitsResult,
} from "./commit-types";

/**
 * Get authorization headers untuk GitHub API requests
 * Supports public dan private repositories dengan GITHUB_TOKEN
 */
function getGitHubAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Accept": "application/vnd.github.v3+json",
  };

  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers["Authorization"] = `token ${token}`;
  }

  return headers;
}

/**
 * Parse GitHub repository URL
 * Supports format: https://github.com/owner/repo
 */
function parseGitHubUrl(url: string): GitHubRepoInfo {
  try {
    const normalizedUrl = url.trim().toLowerCase();

    // Match pattern: github.com/owner/repo
    const match = normalizedUrl.match(
      /(?:https?:\/\/)?(?:www\.)?github\.com\/([^/]+)\/([^/\s?]+)/
    );

    if (!match || !match[1] || !match[2]) {
      return {
        owner: "",
        repo: "",
        isValid: false,
      };
    }

    return {
      owner: match[1],
      repo: match[2].replace(".git", ""), // Remove .git suffix jika ada
      isValid: true,
    };
  } catch (error) {
    return {
      owner: "",
      repo: "",
      isValid: false,
    };
  }
}

/**
 * Format commit data dari GitHub API response
 */
function formatCommitData(apiCommit: GitHubCommitResponse): Commit {
  const sha = apiCommit.sha;
  const shortSha = sha.substring(0, 7);

  return {
    sha,
    shortSha,
    message: apiCommit.commit.message,
    author: {
      name: apiCommit.commit.author.name || "Unknown",
      email: apiCommit.commit.author.email || "",
      avatarUrl: apiCommit.author?.avatar_url,
      login: apiCommit.author?.login, // GitHub username
    },
    date: new Date(apiCommit.commit.author.date),
    htmlUrl: apiCommit.html_url,
  };
}

/**
 * Fetch commits dari GitHub repository
 * Support public dan private repositories
 *
 * @param repoUrl - GitHub repository URL
 * @param limit - Maximum commits to fetch (default: 5, max: 100)
 * @param filterAuthor - Filter commits by GitHub author login (optional)
 * @returns Promise<FetchCommitsResult>
 */
export async function fetchRepositoryCommits(
  repoUrl: string,
  limit: number = 5,
  filterAuthor?: string
): Promise<FetchCommitsResult> {
  // Validate input
  if (!repoUrl || typeof repoUrl !== "string") {
    return {
      success: false,
      error: "Invalid repository URL provided",
      commits: [],
    };
  }

  // Parse GitHub URL
  const repoInfo = parseGitHubUrl(repoUrl);
  if (!repoInfo.isValid) {
    return {
      success: false,
      error: "Invalid GitHub repository URL format",
      commits: [],
    };
  }

  try {
    // Limit maksimal 100 untuk GitHub API
    const actualLimit = Math.min(Math.max(limit, 1), 100);

    const apiUrl = `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}/commits?per_page=${actualLimit}`;

    const headers = getGitHubAuthHeaders();

    const response = await fetch(apiUrl, {
      headers,
      // Cache response untuk 1 jam
      next: { revalidate: 3600 },
    });

    // Handle HTTP errors
    if (!response.ok) {
      if (response.status === 404) {
        return {
          success: false,
          error: "Repository not found. Check URL atau akses permissions.",
          commits: [],
        };
      }

      if (response.status === 403) {
        return {
          success: false,
          error: "GitHub API rate limit exceeded. Coba lagi nanti.",
          commits: [],
        };
      }

      if (response.status === 401) {
        return {
          success: false,
          error: "GitHub authentication failed. Check GITHUB_TOKEN.",
          commits: [],
        };
      }

      return {
        success: false,
        error: `GitHub API error: ${response.statusText}`,
        commits: [],
      };
    }

    // Parse response
    const data: GitHubCommitResponse[] = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      return {
        success: true,
        commits: [],
        totalCount: 0,
      };
    }

    // Format commits
    let commits: Commit[] = data.map((commit) => formatCommitData(commit));

    // Filter by author jika filterAuthor diberikan
    if (filterAuthor) {
      commits = commits.filter(
        (commit) => commit.author.login?.toLowerCase() === filterAuthor.toLowerCase()
      );
    }

    return {
      success: true,
      commits,
      totalCount: commits.length,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return {
      success: false,
      error: `Failed to fetch commits: ${errorMessage}`,
      commits: [],
    };
  }
}

/**
 * Get repository info dari URL (tanpa fetch commits)
 * Useful untuk validation atau info display
 */
export function getRepositoryInfo(repoUrl: string): GitHubRepoInfo {
  return parseGitHubUrl(repoUrl);
}
