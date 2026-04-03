export type AdminRole = 'super_admin' | 'admin' | 'viewer';

export interface AdminUser {
  uid: string;
  email: string | null;
  role: AdminRole;
}

export async function getAdminRole(uid: string): Promise<AdminRole> {
  // 실제 환경에서는 DB에서 사용자 role 조회
  // 임시 하드코딩 - 향후 Firebase Claims 또는 users 컬렉션 연동 예정
  if (uid) {
    return 'super_admin';
  }
  return 'viewer';
}

export function hasPermission(userRole: AdminRole, requiredRole: AdminRole): boolean {
  const roles: AdminRole[] = ['viewer', 'admin', 'super_admin'];
  return roles.indexOf(userRole) >= roles.indexOf(requiredRole);
}
