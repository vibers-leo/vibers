/**
 * arthyun Firestore → artpage PostgreSQL 포트폴리오 마이그레이션
 *
 * Firestore "portfolios" 컬렉션을 읽어서
 * PostgreSQL "Portfolio" 테이블에 site_slug='arthyun'으로 복사한다.
 * 원본 Firestore 데이터는 삭제하지 않는다(copy only).
 *
 * 실행:
 *   npx tsx scripts/migrate-firestore-portfolios.ts
 *
 * 필요 환경변수 (.env.migration 또는 직접 export):
 *   DATABASE_URL — PostgreSQL 연결 문자열
 *   arthyun Firebase 환경변수는 아래 하드코딩 (public 키라 안전)
 */

import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import pg from "pg";

// ── arthyun Firebase 설정 (NEXT_PUBLIC_ 키 — 공개 키) ──
const firebaseConfig = {
  apiKey: "AIzaSyCUEYHCGRsP7fbaAZHbTj9qItTu0Fsmyyw",
  authDomain: "arthyun-5b255.firebaseapp.com",
  projectId: "arthyun-5b255",
  storageBucket: "arthyun-5b255.firebasestorage.app",
  messagingSenderId: "335528703084",
  appId: "1:335528703084:web:e256efebb77ec1bf03d449",
};

// ── PostgreSQL 연결 ──
const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://vibers:vibers2026secure@49.50.138.93:5433/vibers_main";

interface FirestorePortfolio {
  id: string; // Firestore doc ID
  title?: string;
  client?: string;
  location?: string;
  completion_date?: string;
  category?: string;
  description?: string;
  thumbnail_url?: string;
  is_visible?: boolean;
  created_at?: string;
}

async function main() {
  console.log("=== arthyun Firestore → PostgreSQL 포트폴리오 마이그레이션 ===\n");

  // 1. Firestore 읽기
  const app = initializeApp(firebaseConfig, "arthyun-migration");
  const db = getFirestore(app);
  const snapshot = await getDocs(collection(db, "portfolios"));

  const portfolios: FirestorePortfolio[] = [];
  snapshot.forEach((doc) => {
    portfolios.push({ id: doc.id, ...doc.data() } as FirestorePortfolio);
  });

  console.log(`Firestore에서 ${portfolios.length}개 포트폴리오 발견\n`);

  if (portfolios.length === 0) {
    console.log("마이그레이션할 데이터가 없습니다. 종료.");
    process.exit(0);
  }

  // 데이터 미리보기
  for (const p of portfolios) {
    console.log(`  - [${p.id}] ${p.title || "(제목 없음)"} | ${p.category || "-"} | ${p.created_at || "-"}`);
  }
  console.log();

  // 2. PostgreSQL 연결
  const client = new pg.Client({ connectionString: DATABASE_URL });
  await client.connect();
  console.log("PostgreSQL 연결 완료\n");

  // 3. 삽입
  let inserted = 0;
  let skipped = 0;

  for (const p of portfolios) {
    const title = p.title || "(제목 없음)";
    // Firestore description을 그대로, client/completion_date 정보도 description에 포함
    const descParts: string[] = [];
    if (p.description) descParts.push(p.description);
    if (p.client) descParts.push(`클라이언트: ${p.client}`);
    if (p.completion_date) descParts.push(`완료일: ${p.completion_date}`);
    const description = descParts.join("\n") || null;

    const image_url = p.thumbnail_url || null;
    const category = p.category || null;
    const is_featured = false;
    const sort_order = 0;
    const created_at = p.created_at ? new Date(p.created_at) : new Date();

    try {
      await client.query(
        `INSERT INTO "Portfolio" (id, site_slug, title, description, image_url, category, is_featured, sort_order, created_at, updated_at)
         VALUES (gen_random_uuid(), 'arthyun', $1, $2, $3, $4, $5, $6, $7, NOW())`,
        [title, description, image_url, category, is_featured, sort_order, created_at]
      );
      inserted++;
      console.log(`  ✓ "${title}" 삽입 완료`);
    } catch (err: any) {
      skipped++;
      console.error(`  ✗ "${title}" 실패: ${err.message}`);
    }
  }

  await client.end();

  console.log(`\n=== 완료: ${inserted}개 삽입, ${skipped}개 실패 ===`);
}

main().catch((err) => {
  console.error("마이그레이션 오류:", err);
  process.exit(1);
});
