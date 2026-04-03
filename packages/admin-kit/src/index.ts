/**
 * @vibers/admin-kit v1.0.0
 * Vibers 통합 어드민 — Firebase + NCP + 중앙 어드민 연동
 */

export { detectStack } from './core/detector';
export type { StackInfo, DatabaseInfo, AuthInfo, StorageInfo } from './core/detector';

export { collectReport, pushReport } from './core/reporter';
export type { ProjectReport } from './core/reporter';

export { GET, POST } from './routes/handler';
