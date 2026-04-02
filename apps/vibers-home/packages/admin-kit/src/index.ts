// @vibers/admin-kit public API

export type AdminRole = 'viewer' | 'admin' | 'super_admin';

export interface ProjectHealthStatus {
  slug: string;
  status: 'healthy' | 'warning' | 'error';
  version: string;
}
