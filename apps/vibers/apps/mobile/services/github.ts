/**
 * vibers-mobile/services/github.ts
 * 
 * [The Git-Commit Bridge]
 * 모바일 앱에서 직접 깃허브 저장소를 생성하고 커밋/푸시를 수행하는 서비스입니다.
 */

export interface GitHubCommitParams {
    token: string;
    repo: string;
    owner: string;
    files: Array<{ path: string; content: string }>;
    message: string;
}

export const getCurrentUser = async (token: string) => {
    const res = await fetch(`${GITHUB_API_BASE}/user`, {
        headers: { Authorization: `token ${token}` }
    });
    if (!res.ok) return null;
    return await res.json();
};

const GITHUB_API_BASE = "https://api.github.com";

export const syncToGitHub = async ({ token, repo, owner, files, message }: GitHubCommitParams) => {
    console.log(`🐙 GitHub Syncing to ${owner}/${repo}...`);

    try {
        // 0. Ensure Repo Exists
        await ensureRepoExists(token, repo);

        // 1. Get the current branch (main) head
        const headRes = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/git/refs/heads/main`, {
            headers: { Authorization: `token ${token}` }
        });
        
        let baseTreeSha: string | null = null;
        let parentCommitSha: string | null = null;

        if (headRes.ok) {
            const headData = await headRes.json();
            parentCommitSha = headData.object.sha;
            
            const commitRes = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/git/commits/${parentCommitSha}`, {
                headers: { Authorization: `token ${token}` }
            });
            const commitData = await commitRes.json();
            baseTreeSha = commitData.tree.sha;
        }

        // 2. Create Tree with multiple files
        const treeItems = files.map(file => ({
            path: file.path,
            mode: "100644",
            type: "blob",
            content: file.content
        }));

        const treeRes = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/git/trees`, {
            method: "POST",
            headers: { 
                Authorization: `token ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                base_tree: baseTreeSha,
                tree: treeItems
            })
        });
        const treeData = await treeRes.json();
        const newTreeSha = treeData.sha;

        // 3. Create Commit
        const commitRes = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/git/commits`, {
            method: "POST",
            headers: { 
                Authorization: `token ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: message || "feat: vibers auto-build",
                tree: newTreeSha,
                parents: parentCommitSha ? [parentCommitSha] : []
            })
        });
        const commitData = await commitRes.json();
        const newCommitSha = commitData.sha;

        // 4. Update Reference (or Create if first time)
        const refMethod = parentCommitSha ? "PATCH" : "POST";
        const refUrl = parentCommitSha 
            ? `${GITHUB_API_BASE}/repos/${owner}/${repo}/git/refs/heads/main`
            : `${GITHUB_API_BASE}/repos/${owner}/${repo}/git/refs`;
        
        const refBody = parentCommitSha 
            ? { sha: newCommitSha, force: true }
            : { ref: "refs/heads/main", sha: newCommitSha };

        const finalRes = await fetch(refUrl, {
            method: refMethod,
            headers: { 
                Authorization: `token ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(refBody)
        });

        if (!finalRes.ok) throw new Error("Failed to update GitHub reference");

        return {
            success: true,
            url: `https://github.com/${owner}/${repo}`,
            commitHash: newCommitSha.substring(0, 7)
        };

    } catch (error) {
        console.error("❌ GitHub Sync Error:", error);
        throw error;
    }
};

/**
 * 프로젝트별 프라이빗 저장소가 있는지 확인하고 없으면 생성합니다.
 */
export const ensureRepoExists = async (token: string, repoName: string) => {
    try {
        // Get user info to get owner name
        const userRes = await fetch(`${GITHUB_API_BASE}/user`, {
            headers: { Authorization: `token ${token}` }
        });
        const userData = await userRes.json();
        const owner = userData.login;

        const res = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repoName}`, {
            headers: { Authorization: `token ${token}` }
        });

        if (res.status === 404) {
            console.log(`🔨 Creating new repo: ${repoName}...`);
            const createRes = await fetch(`${GITHUB_API_BASE}/user/repos`, {
                method: "POST",
                headers: { 
                    Authorization: `token ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: repoName,
                    private: true,
                    auto_init: true // README를 생성하여 초기 커밋 생성
                })
            });
            return createRes.ok;
        }
        return true;
    } catch (e) {
        console.error("Repo check error", e);
        return false;
    }
};
