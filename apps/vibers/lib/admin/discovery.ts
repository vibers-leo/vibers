"use server";

import { AdminSeo, AdminDesign } from './api';

export interface SiteDiscovery {
  online: boolean;
  responseTime: number;
  metadata: Partial<AdminSeo>;
  design: Partial<AdminDesign>;
  techStack: string;
}

/**
 * Utility to probe a public URL and extract basic information.
 * This is useful when the Admin API is not yet fully implemented on the target site.
 */
export async function discoverSite(url: string): Promise<SiteDiscovery> {
  const start = Date.now();
  try {
    const response = await fetch(url, { 
      next: { revalidate: 3600 },
      headers: { 'User-Agent': 'Vibers-Admin-Discovery/1.0' }
    });
    
    const responseTime = Date.now() - start;

    if (!response.ok) {
      return { online: false, responseTime, metadata: {}, design: {}, techStack: 'unknown' };
    }

    const html = await response.text();

    // Basic regex-based extraction (can be improved with a proper parser)
    const title = html.match(/<title>(.*?)<\/title>/)?.[1] || "";
    const description = html.match(/<meta name="description" content="(.*?)"/)?.[1] || "";
    
    // Detect Tech Stack
    let techStack = 'unknown';
    if (html.includes('_next/static')) techStack = 'nextjs';
    if (html.includes('rails')) techStack = 'rails';
    if (html.includes('wp-content')) techStack = 'wordpress';

    return {
      online: true,
      responseTime,
      metadata: { title, description },
      design: {}, // Design might need more complex CSS analysis
      techStack
    };
  } catch (error) {
    console.error("Discovery failed for", url, error);
    return { online: false, responseTime: 0, metadata: {}, design: {}, techStack: 'unknown' };
  }
}

/**
 * Checks if the Admin API endpoint is responsive.
 */
export async function probeAdminApi(apiUrl: string): Promise<boolean> {
  try {
    const response = await fetch(`${apiUrl}/health`, { cache: 'no-store' });
    return response.ok;
  } catch {
    return false;
  }
}
