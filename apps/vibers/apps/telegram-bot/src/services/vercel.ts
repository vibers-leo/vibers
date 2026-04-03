/**
 * Vercel deployment service
 */

export interface VercelDeployment {
  id: string;
  url: string;
  state: string;
  created: number;
  readyState: 'READY' | 'BUILDING' | 'ERROR' | 'QUEUED' | 'CANCELED';
}

const VERCEL_API_BASE = 'https://api.vercel.com';

/**
 * Deploy a GitHub repository to Vercel
 */
export async function deployToVercel(
  vercelToken: string,
  githubRepo: string,
  owner: string
): Promise<VercelDeployment> {
  const response = await fetch(`${VERCEL_API_BASE}/v13/deployments`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${vercelToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: githubRepo.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      gitSource: {
        type: 'github',
        repo: `${owner}/${githubRepo}`,
        ref: 'main',
      },
    }),
  });

  if (!response.ok) {
    const error = (await response.json()) as { error?: { message?: string } };
    throw new Error(`Vercel deployment failed: ${error.error?.message || response.statusText}`);
  }

  const data = (await response.json()) as {
    id: string;
    url: string;
    state: string;
    created: number;
    readyState: 'READY' | 'BUILDING' | 'ERROR' | 'QUEUED' | 'CANCELED';
  };

  return {
    id: data.id,
    url: `https://${data.url}`,
    state: data.state,
    created: data.created,
    readyState: data.readyState,
  };
}

/**
 * Get deployment status
 */
export async function getDeploymentStatus(
  vercelToken: string,
  deploymentId: string
): Promise<VercelDeployment> {
  const response = await fetch(`${VERCEL_API_BASE}/v13/deployments/${deploymentId}`, {
    headers: {
      Authorization: `Bearer ${vercelToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get deployment status: ${response.statusText}`);
  }

  const data = (await response.json()) as {
    id: string;
    url: string;
    state: string;
    created: number;
    readyState: 'READY' | 'BUILDING' | 'ERROR' | 'QUEUED' | 'CANCELED';
  };

  return {
    id: data.id,
    url: `https://${data.url}`,
    state: data.state,
    created: data.created,
    readyState: data.readyState,
  };
}

/**
 * List recent deployments for a project
 */
export async function listDeployments(
  vercelToken: string,
  projectName: string
): Promise<VercelDeployment[]> {
  const response = await fetch(`${VERCEL_API_BASE}/v6/deployments?projectId=${projectName}&limit=5`, {
    headers: {
      Authorization: `Bearer ${vercelToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to list deployments: ${response.statusText}`);
  }

  const data = (await response.json()) as {
    deployments: Array<{
      uid: string;
      url: string;
      state: string;
      created: number;
      readyState: 'READY' | 'BUILDING' | 'ERROR' | 'QUEUED' | 'CANCELED';
    }>;
  };

  return data.deployments.map((d) => ({
    id: d.uid,
    url: `https://${d.url}`,
    state: d.state,
    created: d.created,
    readyState: d.readyState,
  }));
}
