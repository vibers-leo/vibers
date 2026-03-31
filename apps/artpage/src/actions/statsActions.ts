"use server";

import { db } from "@/lib/firebase";
import { collection, query, orderBy, limit, getDocs, getCountFromServer, doc, setDoc, updateDoc, increment, getDoc } from "firebase/firestore";

// [방문자 수 증가] (누구나 호출 가능 - 내부적으로 처리)
export async function incrementVisitor() {
  try {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const statRef = doc(db, "daily_stats", today);
    
    const docSnap = await getDoc(statRef);
    if (docSnap.exists()) {
      await updateDoc(statRef, { count: increment(1) });
    } else {
      await setDoc(statRef, { date: today, count: 1 });
    }
  } catch (error) {
    console.error("Increment visitor error:", error);
  }
}

import { prisma } from "@/lib/db";

// [대시보드 통계 조회] (관리자용)
export async function getDashboardStats(slug?: string) {
  try {
    // 1. 전체 전시 수 (Firebase)
    // TODO: 필터링이 필요한 경우 slug 기반으로 Firebase 쿼리 수정 필요
    const exhibitionColl = collection(db, "exhibitions");
    const exhibitionSnapshot = await getCountFromServer(exhibitionColl);
    const exhibitionCount = exhibitionSnapshot.data().count;

    // 2. 전체 미디어 수 (Firebase)
    const mediaColl = collection(db, "media_releases");
    const mediaSnapshot = await getCountFromServer(mediaColl);
    const mediaCount = mediaSnapshot.data().count;

    // 3. 최근 30일 방문자 통계 (Firebase)
    const q = query(collection(db, "daily_stats"), orderBy("date", "asc"), limit(30));
    const querySnapshot = await getDocs(q);
    const visitorStats = querySnapshot.docs.map(doc => doc.data());

    // 4. 오늘의 방문자 수 (Firebase)
    const today = new Date().toISOString().split("T")[0];
    const todayStat = visitorStats.find((s: any) => s.date === today);

    // 5. 후원 및 수익 쉐어 (Prisma)
    let supportTotal = 0;
    let revenueShareRatio = 10;

    if (slug) {
      const supportSum = await prisma.support.aggregate({
        where: { site_slug: slug, status: "completed" },
        _sum: { amount: true },
      });
      supportTotal = supportSum._sum.amount || 0;

      const valueSettings = await prisma.valueSettings.findUnique({
        where: { site_slug: slug },
      });
      revenueShareRatio = valueSettings?.revenue_share_ratio || 10;
    }

    return {
      exhibitionCount: exhibitionCount || 0,
      mediaCount: mediaCount || 0,
      todayVisitorCount: todayStat ? (todayStat as any).count : 0,
      visitorStats: visitorStats || [],
      supportTotal,
      revenueShareRatio,
    };
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    return {
      exhibitionCount: 0,
      mediaCount: 0,
      todayVisitorCount: 0,
      visitorStats: [],
      supportTotal: 0,
      revenueShareRatio: 10,
    };
  }
}
