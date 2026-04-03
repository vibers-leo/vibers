"use client";

export interface AdminUser {
  id: string | number;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  project?: string;
}

export interface AdminOrder {
  id: string | number;
  customerName: string;
  amount: string | number;
  status: string;
  date: string;
  project?: string;
}

export interface AdminStat {
  name: string;
  방문자: number;
  페이지뷰: number;
}

export interface AdminSummary {
  mau: string;
  pv: string;
  bounceRate: string;
  revenue: string;
}

export interface AdminSeo {
  title: string;
  description: string;
  keywords?: string;
}

export interface AdminLog {
  id: string;
  title: string;
  time: string;
  type: 'error' | 'warning' | 'info';
}

export interface AdminContent {
  id: string | number;
  title: string;
  type: string;
  author: string;
  date: string;
}

export interface AdminDesign {
  primaryColor: string;
  fontFamily: string;
  logoUrl?: string;
}

export interface AdminLanguage {
  code: string;
  name: string;
  isDefault: boolean;
  status: 'active' | 'inactive';
}

export interface AdminCurrency {
  code: string;
  symbol: string;
  name: string;
  isDefault: boolean;
  exchangeRate: number;
}

export interface AdminLegal {
  termsOfService: string;
  privacyPolicy: string;
  updatedAt: string;
}

export interface AdminStrategy {
  monetization: 'Toss' | 'IAP' | 'AdMob' | 'None';
  tier: 1 | 2 | 3;
  deploymentStatus: 'Released' | 'Building' | 'Reviewing' | 'Pending';
  paymentStatus: 'Active' | 'Inactive' | 'Pending';
  priority: 'High' | 'Medium' | 'Low';
}

export interface AdminPopup {
  id: string;
  title: string;
  content: string;
  status: 'active' | 'inactive';
  targetPages: string[];
  startDate: string;
  endDate: string;
}

export interface AdminBanner {
  id: string;
  imageUrl: string;
  link: string;
  position: 'main_top' | 'side' | 'bottom';
  status: 'active' | 'inactive';
}

export interface AdminAppBuild {
  id: string;
  platform: 'ios' | 'android';
  version: string;
  status: 'success' | 'failed' | 'running' | 'pending';
  deployedAt: string;
}

export interface AdminUserGroup {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  isDefault: boolean;
  status: 'active' | 'inactive';
}

export interface SignupField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'select' | 'checkbox';
  required: boolean;
  enabled: boolean;
  options?: string[];
}

export interface AdminSignupSetting {
  fields: SignupField[];
  useSocialLogin: boolean;
  useApproval: boolean;
  termsOfService: string;
  privacyPolicy: string;
}

export abstract class BaseAdminAdapter {
  protected baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  abstract fetchUsers(): Promise<AdminUser[]>;
  abstract fetchOrders(): Promise<AdminOrder[]>;
  abstract fetchStats(): Promise<{ trend: AdminStat[], summary: AdminSummary }>;
  abstract fetchSeoData(): Promise<AdminSeo>;
  abstract updateSeoData(data: AdminSeo): Promise<boolean>;
  abstract fetchRecentLogs(): Promise<AdminLog[]>;
  abstract fetchContent(): Promise<AdminContent[]>;
  abstract fetchDesignData(): Promise<AdminDesign>;
  abstract updateDesignData(data: AdminDesign): Promise<boolean>;
  
  // New methods for expanded settings
  abstract fetchLanguages(): Promise<AdminLanguage[]>;
  abstract fetchCurrencies(): Promise<AdminCurrency[]>;
  
  // Legal & Policies
  abstract fetchLegalData(): Promise<AdminLegal>;
  abstract updateLegalData(data: AdminLegal): Promise<boolean>;

  // Strategy & Monitoring
  abstract fetchStrategyStatus(): Promise<AdminStrategy>;

  // Discovery & Diagnostics
  abstract probe(): Promise<boolean>;

  // Marketing & Apps (Phase 11)
  abstract fetchPopups(): Promise<AdminPopup[]>;
  abstract fetchBanners(): Promise<AdminBanner[]>;
  abstract fetchAppBuilds(): Promise<AdminAppBuild[]>;

  // Member & Policy (Phase 12)
  abstract fetchUserGroups(): Promise<AdminUserGroup[]>;
  abstract updateUserGroup(group: AdminUserGroup): Promise<boolean>;
  abstract fetchSignupSettings(): Promise<AdminSignupSetting>;
  abstract updateSignupSettings(settings: AdminSignupSetting): Promise<boolean>;
  
  // 공통 유틸리티 (인증 헤더 등)
  protected async request(path: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      throw new Error(`API Request failed: ${response.statusText}`);
    }
    
    return response.json();
  }
}

// RemoteProjectAdapter - Generic adapter for ANY project that implements the Vibers Admin API
export class RemoteProjectAdapter extends BaseAdminAdapter {
  private apiKey: string = process.env.NEXT_PUBLIC_VIBERS_ADMIN_KEY || 'vibers-internal-secret';

  protected async request(path: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'x-vibers-apikey': this.apiKey,
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Remote API Request failed: ${response.statusText} (${path})`);
    }
    
    return response.json();
  }

  async fetchUsers(): Promise<AdminUser[]> {
    return this.request('/api/vibers/admin/users');
  }

  async fetchOrders(): Promise<AdminOrder[]> {
    return this.request('/api/vibers/admin/orders');
  }

  async fetchStats(): Promise<{ trend: AdminStat[], summary: AdminSummary }> {
    return this.request('/api/vibers/admin/stats');
  }

  async fetchSeoData(): Promise<AdminSeo> {
    return this.request('/api/vibers/admin/seo');
  }

  async updateSeoData(data: AdminSeo): Promise<boolean> {
    await this.request('/api/vibers/admin/seo', { method: 'POST', body: JSON.stringify(data) });
    return true;
  }

  async fetchRecentLogs(): Promise<AdminLog[]> {
    return this.request('/api/vibers/admin/logs');
  }

  async fetchContent(): Promise<AdminContent[]> {
    return this.request('/api/vibers/admin/content');
  }

  async fetchDesignData(): Promise<AdminDesign> {
    return this.request('/api/vibers/admin/design');
  }

  async updateDesignData(data: AdminDesign): Promise<boolean> {
    await this.request('/api/vibers/admin/design', { method: 'POST', body: JSON.stringify(data) });
    return true;
  }

  async fetchLanguages(): Promise<AdminLanguage[]> {
    return this.request('/api/vibers/admin/settings/languages');
  }

  async fetchCurrencies(): Promise<AdminCurrency[]> {
    return this.request('/api/vibers/admin/settings/currencies');
  }

  async fetchLegalData(): Promise<AdminLegal> {
    return this.request('/api/vibers/admin/settings/legal');
  }

  async updateLegalData(data: AdminLegal): Promise<boolean> {
    await this.request('/api/vibers/admin/settings/legal', { method: 'POST', body: JSON.stringify(data) });
    return true;
  }

  async fetchStrategyStatus(): Promise<AdminStrategy> {
    return this.request('/api/vibers/admin/strategy');
  }

  async probe(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/vibers/admin/health`, { 
        cache: 'no-store', 
        signal: AbortSignal.timeout(3000),
        headers: { 'x-vibers-apikey': this.apiKey }
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  async fetchPopups(): Promise<AdminPopup[]> { return this.request('/api/vibers/admin/marketing/popups'); }
  async fetchBanners(): Promise<AdminBanner[]> { return this.request('/api/vibers/admin/marketing/banners'); }
  async fetchAppBuilds(): Promise<AdminAppBuild[]> { return this.request('/api/vibers/admin/builds'); }

  async fetchUserGroups(): Promise<AdminUserGroup[]> { return this.request('/api/vibers/admin/members/groups'); }
  async updateUserGroup(group: AdminUserGroup): Promise<boolean> {
    await this.request('/api/vibers/admin/members/groups', { method: 'POST', body: JSON.stringify(group) });
    return true;
  }
  async fetchSignupSettings(): Promise<AdminSignupSetting> { return this.request('/api/vibers/admin/members/signup'); }
  async updateSignupSettings(settings: AdminSignupSetting): Promise<boolean> {
    await this.request('/api/vibers/admin/members/signup', { method: 'POST', body: JSON.stringify(settings) });
    return true;
  }
}

// Vibers (계발자들) 전용 어댑터 - 내부 API 연동
export class VibersAdapter extends BaseAdminAdapter {
  async fetchUsers(): Promise<AdminUser[]> {
    const res = await fetch('/api/admin/users', { cache: 'no-store' });
    return res.ok ? res.json() : [];
  }
  async fetchOrders(): Promise<AdminOrder[]> {
    const res = await fetch('/api/admin/orders', { cache: 'no-store' });
    return res.ok ? res.json() : [];
  }
  async fetchStats(): Promise<{ trend: AdminStat[], summary: AdminSummary }> {
    const res = await fetch('/api/admin/stats', { cache: 'no-store' });
    if (res.ok) return res.json();
    return {
      trend: [],
      summary: { mau: "0", pv: "0", bounceRate: "0%", revenue: "₩ 0" }
    };
  }
  async fetchSeoData(): Promise<AdminSeo> {
    const res = await fetch('/api/admin/seo', { cache: 'no-store' });
    return res.ok ? res.json() : { title: "Vibers", description: "" };
  }
  async updateSeoData(data: AdminSeo): Promise<boolean> {
    const res = await fetch('/api/admin/seo', { method: 'POST', body: JSON.stringify(data) });
    return res.ok;
  }
  async fetchRecentLogs(): Promise<AdminLog[]> {
    const res = await fetch('/api/admin/logs', { cache: 'no-store' });
    return res.ok ? res.json() : [];
  }
  async fetchContent(): Promise<AdminContent[]> { return []; }
  async fetchDesignData(): Promise<AdminDesign> {
    return { primaryColor: "#E11D48", fontFamily: "Pretendard" };
  }
  async updateDesignData(): Promise<boolean> { return true; }
  async fetchLanguages(): Promise<AdminLanguage[]> {
    return [{ code: 'ko', name: '한국어', isDefault: true, status: 'active' }];
  }
  async fetchCurrencies(): Promise<AdminCurrency[]> {
    return [{ code: 'KRW', symbol: '₩', name: '대한민국 원', isDefault: true, exchangeRate: 1 }];
  }
  async fetchLegalData(): Promise<AdminLegal> {
    return { termsOfService: "Vibers TOS", privacyPolicy: "Vibers Privacy", updatedAt: "2026-03-29" };
  }
  async updateLegalData(): Promise<boolean> { return true; }
  async fetchStrategyStatus(): Promise<AdminStrategy> {
    return { monetization: 'Toss', tier: 2, deploymentStatus: 'Released', paymentStatus: 'Active', priority: 'High' };
  }
  async probe(): Promise<boolean> {
    try {
      const res = await fetch('/api/admin/health', { cache: 'no-store' });
      return res.ok;
    } catch {
      return false;
    }
  }

  async fetchPopups(): Promise<AdminPopup[]> {
    const res = await fetch('/api/admin/marketing/popups', { cache: 'no-store' });
    return res.ok ? res.json() : [];
  }
  async fetchBanners(): Promise<AdminBanner[]> {
    const res = await fetch('/api/admin/marketing/banners', { cache: 'no-store' });
    return res.ok ? res.json() : [];
  }
  async fetchAppBuilds(): Promise<AdminAppBuild[]> {
    const res = await fetch('/api/admin/builds', { cache: 'no-store' });
    return res.ok ? res.json() : [];
  }

  async fetchUserGroups(): Promise<AdminUserGroup[]> {
    const res = await fetch('/api/admin/members/groups', { cache: 'no-store' });
    return res.ok ? res.json() : [];
  }
  async updateUserGroup(group: AdminUserGroup): Promise<boolean> {
    const res = await fetch('/api/admin/members/groups', { method: 'POST', body: JSON.stringify(group) });
    return res.ok;
  }
  async fetchSignupSettings(): Promise<AdminSignupSetting> {
    const res = await fetch('/api/admin/members/signup', { cache: 'no-store' });
    if (res.ok) return res.json();
    return { fields: [], useSocialLogin: false, useApproval: false, termsOfService: "", privacyPolicy: "" };
  }
  async updateSignupSettings(settings: AdminSignupSetting): Promise<boolean> {
    const res = await fetch('/api/admin/members/signup', { method: 'POST', body: JSON.stringify(settings) });
    return res.ok;
  }
}

// 어댑터 팩토리
export function getAdapterForProject(slug: string, apiUrl: string): BaseAdminAdapter {
  // Vibers (중앙 어드민 자체)는 VibersAdapter (내부 API) 사용
  if (slug === 'vibers' || slug === 'total') {
    return new VibersAdapter(apiUrl);
  }
  
  // 그 외 모든 프로젝트는 RemoteProjectAdapter를 사용하여 원격 통신
  return new RemoteProjectAdapter(apiUrl);
}
