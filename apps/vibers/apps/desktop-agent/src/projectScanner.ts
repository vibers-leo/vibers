// Inspired by veryterm: https://github.com/verylabs/veryterm/src/main/index.ts
import fs from 'fs';
import path from 'path';
import os from 'os';

export interface ProjectInfo {
  type: string | null;
  serverCommand: string | null;
}

export interface Project {
  id: string;
  name: string;
  path: string;
  type: string | null;
  serverCommand: string | null;
}

/**
 * Detect project type and server command from project directory
 */
export async function detectProjectType(projectPath: string): Promise<ProjectInfo> {
  const exists = (f: string) => fs.existsSync(path.join(projectPath, f));
  const readFile = (f: string) => {
    try {
      return fs.readFileSync(path.join(projectPath, f), 'utf-8');
    } catch {
      return '';
    }
  };

  try {
    // Node.js / package.json based
    if (exists('package.json')) {
      const pkg = JSON.parse(readFile('package.json'));
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };

      // Frameworks (specific first)
      if (deps['next']) return { type: 'next', serverCommand: 'npm run dev' };
      if (deps['@remix-run/react'] || deps['@remix-run/node'])
        return { type: 'remix', serverCommand: 'npm run dev' };
      if (deps['astro']) return { type: 'astro', serverCommand: 'npm run dev' };
      if (deps['gatsby']) return { type: 'gatsby', serverCommand: 'npm run develop' };
      if (deps['nuxt']) return { type: 'nuxt', serverCommand: 'npm run dev' };
      if (deps['@angular/core']) return { type: 'angular', serverCommand: 'ng serve' };
      if (deps['svelte'] || deps['@sveltejs/kit'])
        return { type: 'svelte', serverCommand: 'npm run dev' };
      if (deps['vite']) return { type: 'vite', serverCommand: 'npm run dev' };
      if (deps['react-scripts']) return { type: 'cra', serverCommand: 'npm start' };

      // Mobile
      if (deps['expo']) return { type: 'expo', serverCommand: 'npx expo start' };
      if (deps['react-native']) return { type: 'react-native', serverCommand: 'npm start' };

      // Electron
      if (deps['electron'])
        return { type: 'electron', serverCommand: pkg.scripts?.dev ? 'npm run dev' : null };

      // Server frameworks
      if (deps['@nestjs/core']) return { type: 'nestjs', serverCommand: 'npm run start:dev' };
      if (deps['fastify']) return { type: 'fastify', serverCommand: 'npm run dev' };
      if (deps['hono']) return { type: 'hono', serverCommand: 'npm run dev' };
      if (deps['express'])
        return {
          type: 'express',
          serverCommand: pkg.scripts?.dev ? 'npm run dev' : 'npm start'
        };
      if (deps['koa'])
        return { type: 'koa', serverCommand: pkg.scripts?.dev ? 'npm run dev' : 'npm start' };

      // Generic Node.js
      if (pkg.scripts?.dev) return { type: 'node', serverCommand: 'npm run dev' };
      if (pkg.scripts?.start) return { type: 'node', serverCommand: 'npm start' };

      return { type: 'node', serverCommand: null };
    }

    // Python
    if (exists('requirements.txt') || exists('setup.py') || exists('pyproject.toml')) {
      if (exists('manage.py')) return { type: 'django', serverCommand: 'python manage.py runserver' };
      if (exists('app.py')) return { type: 'flask', serverCommand: 'python app.py' };
      return { type: 'python', serverCommand: null };
    }

    // Ruby / Rails
    if (exists('Gemfile')) {
      const gemfile = readFile('Gemfile');
      if (gemfile.includes('rails')) return { type: 'rails', serverCommand: 'bin/rails server' };
      if (gemfile.includes('sinatra')) return { type: 'sinatra', serverCommand: 'ruby app.rb' };
      return { type: 'ruby', serverCommand: null };
    }

    // Go
    if (exists('go.mod')) return { type: 'go', serverCommand: 'go run .' };

    // Rust
    if (exists('Cargo.toml')) return { type: 'rust', serverCommand: 'cargo run' };

    // Generic git repository
    if (exists('.git')) return { type: 'git', serverCommand: null };

    return { type: null, serverCommand: null };
  } catch (error) {
    console.error(`Error detecting project type for ${projectPath}:`, error);
    return { type: null, serverCommand: null };
  }
}

/**
 * Scan common project directories for dev projects
 */
export async function scanProjects(): Promise<Project[]> {
  const projects: Project[] = [];
  const homeDir = os.homedir();

  // Common project directories
  const searchDirs = [
    path.join(homeDir, 'dev'),
    path.join(homeDir, 'projects'),
    path.join(homeDir, 'workspace'),
    path.join(homeDir, 'code'),
    path.join(homeDir, 'Documents', 'dev'),
    path.join(homeDir, 'Documents', 'projects'),
  ];

  // Add custom directories based on platform
  if (process.platform === 'win32') {
    searchDirs.push('d:/dev', 'c:/dev', 'd:/projects', 'c:/projects');
  }

  for (const dir of searchDirs) {
    if (!fs.existsSync(dir)) continue;

    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        if (!entry.isDirectory()) continue;

        const projectPath = path.join(dir, entry.name);
        const projectInfo = await detectProjectType(projectPath);

        // Only include if it has a recognized type or is a git repo
        if (projectInfo.type) {
          projects.push({
            id: `${dir}_${entry.name}`,
            name: entry.name,
            path: projectPath,
            type: projectInfo.type,
            serverCommand: projectInfo.serverCommand
          });
        }
      }
    } catch (error) {
      console.error(`Error scanning directory ${dir}:`, error);
    }
  }

  return projects;
}
