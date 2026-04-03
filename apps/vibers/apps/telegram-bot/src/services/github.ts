/**
 * GitHub API Service
 * 저장소 관리, 파일 업로드, 커밋 생성
 */

export interface GitHubUser {
  login: string;
  name: string;
  email: string;
  avatar_url: string;
}

export interface GitHubRepo {
  name: string;
  full_name: string;
  description: string;
  private: boolean;
  html_url: string;
  default_branch: string;
}

export interface CodeFile {
  path: string;
  content: string;
}

export interface PushResult {
  success: boolean;
  commitHash?: string;
  url?: string;
  error?: string;
}

const GITHUB_API_BASE = 'https://api.github.com';

/**
 * Get current user info
 */
export async function getCurrentUser(token: string): Promise<GitHubUser | null> {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    return (await response.json()) as GitHubUser;
  } catch (error) {
    console.error('Failed to get GitHub user:', error);
    return null;
  }
}

/**
 * List user repositories
 */
export async function listRepositories(token: string, limit: number = 10): Promise<GitHubRepo[]> {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/user/repos?sort=updated&per_page=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    return (await response.json()) as GitHubRepo[];
  } catch (error) {
    console.error('Failed to list repositories:', error);
    throw error;
  }
}

/**
 * Create or update a file in repository
 */
async function createOrUpdateFile(
  token: string,
  owner: string,
  repo: string,
  filePath: string,
  content: string,
  message: string,
  branch: string = 'main'
): Promise<any> {
  const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${filePath}`;

  // First, try to get existing file to get its SHA (needed for updates)
  let sha: string | undefined;
  try {
    const getResponse = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (getResponse.ok) {
      const existingFile = (await getResponse.json()) as { sha: string };
      sha = existingFile.sha;
    }
  } catch (e) {
    // File doesn't exist, will create new
  }

  // Create or update file
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      content: Buffer.from(content).toString('base64'),
      branch,
      ...(sha && { sha }),
    }),
  });

  if (!response.ok) {
    const error = (await response.json()) as { message: string };
    throw new Error(`Failed to create/update file: ${error.message}`);
  }

  return (await response.json()) as Record<string, any>;
}

/**
 * Push multiple files to GitHub repository
 */
export async function pushFilesToRepo(
  token: string,
  owner: string,
  repo: string,
  files: CodeFile[],
  commitMessage: string = 'Update from Vibers Bot',
  branch: string = 'main'
): Promise<PushResult> {
  try {
    if (files.length === 0) {
      return {
        success: false,
        error: 'No files to push',
      };
    }

    // Push files one by one (for simplicity)
    // In production, use Git Data API for atomic commits
    let lastCommit: any;

    for (const file of files) {
      console.log(`Pushing ${file.path}...`);
      lastCommit = await createOrUpdateFile(
        token,
        owner,
        repo,
        file.path,
        file.content,
        commitMessage,
        branch
      );
    }

    return {
      success: true,
      commitHash: lastCommit?.commit?.sha,
      url: lastCommit?.commit?.html_url || `https://github.com/${owner}/${repo}`,
    };
  } catch (error: any) {
    console.error('Failed to push files:', error);
    return {
      success: false,
      error: error.message || 'Unknown error',
    };
  }
}

/**
 * Get repository info
 */
export async function getRepository(
  token: string,
  owner: string,
  repo: string
): Promise<GitHubRepo | null> {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      throw new Error(`Repository not found: ${response.status}`);
    }

    return (await response.json()) as GitHubRepo;
  } catch (error) {
    console.error('Failed to get repository:', error);
    return null;
  }
}

/**
 * Create a new repository
 */
export async function createRepository(
  token: string,
  name: string,
  description: string = '',
  isPrivate: boolean = false
): Promise<GitHubRepo | null> {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/user/repos`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        description,
        private: isPrivate,
        auto_init: true,
      }),
    });

    if (!response.ok) {
      const error = (await response.json()) as { message?: string };
      throw new Error(error.message || 'Failed to create repository');
    }

    return (await response.json()) as GitHubRepo;
  } catch (error) {
    console.error('Failed to create repository:', error);
    return null;
  }
}
