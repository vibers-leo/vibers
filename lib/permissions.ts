export type UserRole = 'super_admin' | 'owner' | 'admin' | 'business' | 'member';

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  super_admin: 100,
  owner: 80,
  admin: 60,
  business: 40,
  member: 20,
};

export const SUPER_ADMIN_EMAILS = [
  'designd@designd.co.kr',
  'juuuno@naver.com',
  'juuuno1116@gmail.com',
  'duscontactus@gmail.com',
  'designdlab@designdlab.co.kr',
];

export function hasRole(userRole: string, minRole: UserRole): boolean {
  return (ROLE_HIERARCHY[userRole as UserRole] ?? 0) >= ROLE_HIERARCHY[minRole];
}

export function canAccessAdmin(role: string): boolean {
  return hasRole(role, 'admin');
}

export function isSuperAdmin(email: string): boolean {
  return SUPER_ADMIN_EMAILS.includes(email);
}

export type Provider = 'google' | 'naver' | 'kakao';

export const PROVIDER_LABELS: Record<Provider, string> = {
  google: 'Google',
  naver: '네이버',
  kakao: '카카오',
};
