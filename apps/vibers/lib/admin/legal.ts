"use server";

import fs from 'fs';
import path from 'path';

export interface EntityInfo {
  companyName: string;
  representative: string;
  businessNumber: string;
  industry: string;
}

/**
 * Reads entity.md from the workspace root and extracts company info for a given project slug.
 */
export async function getEntityInfoBySlug(slug: string): Promise<EntityInfo | null> {
  try {
    const filePath = path.join(process.cwd(), '../../../entity.md'); // Adjust path based on your structure
    // Since we are in dev/nextjs/apps/vibers, we need to go up 3 levels to reach macminim4/entity.md
    
    // Check if file exists, if not try absolute path from found location
    let content = "";
    const absolutePath = "/Users/juuuno/Desktop/macminim4/entity.md";
    
    if (fs.existsSync(absolutePath)) {
      content = fs.readFileSync(absolutePath, 'utf8');
    } else {
      console.error("entity.md not found at", absolutePath);
      return null;
    }

    const sections = content.split('---');
    let targetSection = "";
    
    // Find the section containing the slug
    for (const section of sections) {
      if (section.toLowerCase().includes(`| ${slug.toLowerCase()} |`)) {
        targetSection = section;
        break;
      }
    }

    if (!targetSection) return null;

    // Extract table data using regex
    const companyNameMatch = targetSection.match(/\| \*\*상호\*\* \| (.*) \|/);
    const representativeMatch = targetSection.match(/\| \*\*대표자\*\* \| (.*) \|/);
    const businessNumberMatch = targetSection.match(/\| \*\*사업자등록번호\*\* \| (.*) \|/);
    const industryMatch = targetSection.match(/\| \*\*업종\*\* \| (.*) \|/);

    return {
      companyName: companyNameMatch ? companyNameMatch[1].trim() : "미지정",
      representative: representativeMatch ? representativeMatch[1].trim() : "미지정",
      businessNumber: businessNumberMatch ? businessNumberMatch[1].trim() : "미지정",
      industry: industryMatch ? industryMatch[1].trim() : "미지정",
    };
  } catch (error) {
    console.error("Error parsing entity.md:", error);
    return null;
  }
}
