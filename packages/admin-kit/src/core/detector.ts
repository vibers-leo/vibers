/**
 * @vibers/admin-kit — 스택 자동 감지
 * 프로젝트의 package.json + 환경변수를 읽어 스택/DB/인증 정보를 감지한다.
 */

export interface StackInfo {
  framework: 'nextjs' | 'express' | 'unknown';
  frameworkVersion: string | null;
  database: DatabaseInfo[];
  auth: AuthInfo[];
  storage: StorageInfo[];
  projectName: string;
  nodeVersion: string;
}

export interface DatabaseInfo {
  type: 'firebase-firestore' | 'firebase-realtime' | 'postgresql' | 'mysql' | 'mongodb' | 'unknown';
  connected: boolean;
  label: string;
}

export interface AuthInfo {
  type: 'firebase-auth' | 'nextauth' | 'custom-jwt' | 'unknown';
  provider: string[];
  label: string;
}

export interface StorageInfo {
  type: 'firebase-storage' | 'ncp-object' | 's3' | 'unknown';
  bucket: string | null;
  label: string;
}

/** 현재 프로젝트의 package.json 읽기 */
function readPackageJson(rootDir: string): Record<string, any> {
  try {
    const fs = require('fs');
    const path = require('path');
    const raw = fs.readFileSync(path.join(rootDir, 'package.json'), 'utf-8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

/** 환경변수에서 Firebase 설정 감지 */
function detectFirebase(): { firestore: boolean; realtime: boolean; auth: boolean; storage: boolean; projectId: string | null } {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || null;
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET;

  return {
    firestore: !!apiKey,
    realtime: !!process.env.FIREBASE_DATABASE_URL,
    auth: !!apiKey,
    storage: !!storageBucket,
    projectId,
  };
}

/** 환경변수에서 PostgreSQL 감지 */
function detectPostgres(): boolean {
  return !!(
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.NCP_DB_HOST ||
    process.env.PG_HOST
  );
}

/** NCP Object Storage 감지 */
function detectNcpStorage(): { detected: boolean; bucket: string | null } {
  const bucket = process.env.NCP_BUCKET_NAME || null;
  return {
    detected: !!(process.env.NCP_ACCESS_KEY && process.env.NCP_SECRET_KEY),
    bucket,
  };
}

/** 메인 감지 함수 */
export function detectStack(rootDir: string = process.cwd()): StackInfo {
  const pkg = readPackageJson(rootDir);
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };

  // Framework
  const nextVersion = deps['next'] ?? null;
  const framework = nextVersion ? 'nextjs' : deps['express'] ? 'express' : 'unknown';

  // Firebase
  const firebase = detectFirebase();
  const database: DatabaseInfo[] = [];
  const auth: AuthInfo[] = [];
  const storage: StorageInfo[] = [];

  if (firebase.firestore) {
    database.push({
      type: 'firebase-firestore',
      connected: true,
      label: `Firestore${firebase.projectId ? ` (${firebase.projectId})` : ''}`,
    });
  }
  if (firebase.realtime) {
    database.push({ type: 'firebase-realtime', connected: true, label: 'Firebase Realtime DB' });
  }
  if (detectPostgres()) {
    database.push({
      type: 'postgresql',
      connected: true,
      label: process.env.NCP_DB_HOST ? 'NCP PostgreSQL' : 'PostgreSQL',
    });
  }

  // Auth
  if (firebase.auth) {
    const providers: string[] = ['email'];
    if (process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) {
      if (deps['firebase']) providers.push('google');
    }
    auth.push({ type: 'firebase-auth', provider: providers, label: 'Firebase Auth' });
  }
  if (deps['next-auth'] || deps['next-auth']) {
    auth.push({ type: 'nextauth', provider: ['oauth'], label: 'NextAuth.js' });
  }

  // Storage
  const ncp = detectNcpStorage();
  if (ncp.detected) {
    storage.push({ type: 'ncp-object', bucket: ncp.bucket, label: `NCP Object Storage${ncp.bucket ? ` (${ncp.bucket})` : ''}` });
  }
  if (firebase.storage) {
    storage.push({ type: 'firebase-storage', bucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? null, label: 'Firebase Storage' });
  }

  return {
    framework: framework as StackInfo['framework'],
    frameworkVersion: nextVersion,
    database,
    auth,
    storage,
    projectName: pkg.name ?? 'unknown',
    nodeVersion: process.version,
  };
}
