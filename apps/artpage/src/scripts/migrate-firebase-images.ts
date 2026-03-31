/**
 * Firebase Storage 이미지 → NCP Object Storage 마이그레이션 스크립트
 *
 * 실행 방법:
 *   bun src/scripts/migrate-firebase-images.ts
 *
 * 필수 환경변수 (.env.local):
 *   NCP_ACCESS_KEY, NCP_SECRET_KEY, NCP_BUCKET, NCP_REGION
 *   DATABASE_URL
 */

import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

// 환경변수 체크
const required = ["NCP_ACCESS_KEY", "NCP_SECRET_KEY", "NCP_BUCKET", "DATABASE_URL"];
for (const key of required) {
  if (!process.env[key]) {
    console.error(`❌ 환경변수 ${key} 없음`);
    process.exit(1);
  }
}

const BUCKET = process.env.NCP_BUCKET!;
const REGION = process.env.NCP_REGION ?? "kr-standard";
const ENDPOINT = "https://kr.object.ncloudstorage.com";
const PUBLIC_BASE = `https://${BUCKET}.kr.object.ncloudstorage.com`;

const prisma = new PrismaClient();

// S3 클라이언트 (동적 import)
async function getS3() {
  const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");
  return new S3Client({
    region: REGION,
    endpoint: ENDPOINT,
    credentials: {
      accessKeyId: process.env.NCP_ACCESS_KEY!,
      secretAccessKey: process.env.NCP_SECRET_KEY!,
    },
    forcePathStyle: false,
  });
}

function isFirebaseUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return (
    url.includes("firebasestorage.googleapis.com") ||
    url.includes("storage.googleapis.com")
  );
}

async function migrateUrl(
  s3: Awaited<ReturnType<typeof getS3>>,
  firebaseUrl: string,
  category: string
): Promise<string> {
  const { PutObjectCommand } = await import("@aws-sdk/client-s3");

  const res = await fetch(firebaseUrl);
  if (!res.ok) {
    console.warn(`  ⚠️  다운로드 실패 (${res.status}): ${firebaseUrl.substring(0, 80)}`);
    return firebaseUrl; // 원본 유지
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  const contentType = res.headers.get("content-type") ?? "image/jpeg";
  const ext = contentType.split("/")[1]?.split(";")[0] ?? "jpg";
  const key = `${category}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      ACL: "public-read",
    })
  );

  return `${PUBLIC_BASE}/${key}`;
}

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.log("🚀 Firebase → NCP Object Storage 이미지 마이그레이션 시작");
  console.log(`   버킷: ${BUCKET} / 리전: ${REGION}\n`);

  const s3 = await getS3();
  let totalMigrated = 0;
  let totalSkipped = 0;
  let totalFailed = 0;

  // ── 1. exhibitions ─────────────────────────────────────
  console.log("📁 exhibitions.poster_url 처리 중...");
  const exhibitions = await prisma.exhibitions.findMany({
    where: { poster_url: { not: null } },
    select: { id: true, poster_url: true },
  });

  for (const row of exhibitions) {
    if (!isFirebaseUrl(row.poster_url)) { totalSkipped++; continue; }
    try {
      console.log(`  → [${row.id}] ${row.poster_url?.substring(0, 70)}...`);
      const newUrl = await migrateUrl(s3, row.poster_url!, "exhibitions");
      await prisma.exhibitions.update({ where: { id: row.id }, data: { poster_url: newUrl } });
      console.log(`  ✅ ${newUrl.substring(0, 70)}`);
      totalMigrated++;
    } catch (e) {
      console.error(`  ❌ 실패:`, e);
      totalFailed++;
    }
    await sleep(200);
  }

  // ── 2. media_releases ──────────────────────────────────
  console.log("\n📁 media_releases.image_url 처리 중...");
  const mediaReleases = await prisma.media_releases.findMany({
    where: { image_url: { not: null } },
    select: { id: true, image_url: true },
  });

  for (const row of mediaReleases) {
    if (!isFirebaseUrl(row.image_url)) { totalSkipped++; continue; }
    try {
      console.log(`  → [${row.id}] ${row.image_url?.substring(0, 70)}...`);
      const newUrl = await migrateUrl(s3, row.image_url!, "media");
      await prisma.media_releases.update({ where: { id: row.id }, data: { image_url: newUrl } });
      console.log(`  ✅ ${newUrl.substring(0, 70)}`);
      totalMigrated++;
    } catch (e) {
      console.error(`  ❌ 실패:`, e);
      totalFailed++;
    }
    await sleep(200);
  }

  // ── 3. portfolio ───────────────────────────────────────
  console.log("\n📁 portfolio.image_url 처리 중...");
  const portfolios = await prisma.portfolio.findMany({
    where: { image_url: { not: null } },
    select: { id: true, image_url: true },
  });

  for (const row of portfolios) {
    if (!isFirebaseUrl(row.image_url)) { totalSkipped++; continue; }
    try {
      console.log(`  → [${row.id}] ${row.image_url?.substring(0, 70)}...`);
      const newUrl = await migrateUrl(s3, row.image_url!, "portfolio");
      await prisma.portfolio.update({ where: { id: row.id }, data: { image_url: newUrl } });
      console.log(`  ✅ ${newUrl.substring(0, 70)}`);
      totalMigrated++;
    } catch (e) {
      console.error(`  ❌ 실패:`, e);
      totalFailed++;
    }
    await sleep(200);
  }

  // ── 4. site_settings (og_image_url, logo_url 등) ───────
  console.log("\n📁 site_settings 이미지 처리 중...");
  const settings = await prisma.site_settings.findMany({
    select: { id: true, site_slug: true, og_image_url: true, logo_url: true, footer_logo_url: true },
  });

  for (const row of settings) {
    const updates: Record<string, string> = {};
    for (const field of ["og_image_url", "logo_url", "footer_logo_url"] as const) {
      if (!isFirebaseUrl(row[field])) continue;
      try {
        const newUrl = await migrateUrl(s3, row[field]!, `settings/${row.site_slug}`);
        updates[field] = newUrl;
        console.log(`  ✅ [${row.site_slug}] ${field}: ${newUrl.substring(0, 60)}`);
        totalMigrated++;
      } catch (e) {
        console.error(`  ❌ [${row.site_slug}] ${field} 실패:`, e);
        totalFailed++;
      }
      await sleep(200);
    }
    if (Object.keys(updates).length > 0) {
      await prisma.site_settings.update({ where: { id: row.id }, data: updates });
    }
  }

  // ── 결과 ───────────────────────────────────────────────
  console.log("\n" + "=".repeat(50));
  console.log(`✅ 마이그레이션 완료: ${totalMigrated}개`);
  console.log(`⏭️  스킵 (이미 NCP): ${totalSkipped}개`);
  if (totalFailed > 0) {
    console.log(`❌ 실패: ${totalFailed}개 (Firebase URL 유지됨)`);
  }
  console.log("=".repeat(50));

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
