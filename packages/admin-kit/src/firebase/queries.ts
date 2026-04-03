// faneasy의 Firebase Admin 인스턴스를 인자로 받아 쿼리 실행
// (패키지 자체는 firebase-admin 직접 초기화 안 함 — 앱이 넘겨줌)

import type { App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

export interface InquiryRow {
  id: string;
  name: string;
  phone: string;
  email: string;
  siteId: string;
  plan: string;
  workflowStatus: string;
  createdAt: string;
  message: string;
}

export interface UserRow {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

export interface OrderRow {
  id: string;
  productId: string;
  buyerName: string;
  buyerEmail: string;
  amount: number;
  status: string;
  createdAt: string;
}

export interface StatsRow {
  siteId: string;
  totalVisits: number;
  todayVisits: number;
  monthVisits: number;
  totalInquiries: number;
}

export async function queryInquiries(app: App, limit = 50): Promise<InquiryRow[]> {
  const db = getFirestore(app);
  const snap = await db.collection('inquiries').orderBy('createdAt', 'desc').limit(limit).get();
  return snap.docs.map(d => {
    const data = d.data();
    return {
      id: d.id,
      name: data.name ?? '',
      phone: data.phone ?? '',
      email: data.email ?? '',
      siteId: data.ownerId ?? data.siteId ?? '',
      plan: data.plan ?? '',
      workflowStatus: data.workflowStatus ?? 'received',
      createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? data.createdAt ?? '',
      message: data.message ?? '',
    };
  });
}

export async function queryUsers(app: App, limit = 100): Promise<UserRow[]> {
  const db = getFirestore(app);
  const snap = await db.collection('users').orderBy('createdAt', 'desc').limit(limit).get();
  return snap.docs.map(d => {
    const data = d.data();
    return {
      id: d.id,
      email: data.email ?? '',
      name: data.name ?? '',
      role: data.role ?? 'user',
      createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? data.createdAt ?? '',
    };
  });
}

export async function queryOrders(app: App, limit = 50): Promise<OrderRow[]> {
  const db = getFirestore(app);
  const snap = await db.collection('orders').orderBy('createdAt', 'desc').limit(limit).get();
  return snap.docs.map(d => {
    const data = d.data();
    return {
      id: d.id,
      productId: data.productId ?? '',
      buyerName: data.buyerName ?? '',
      buyerEmail: data.buyerEmail ?? '',
      amount: data.amount ?? 0,
      status: data.status ?? '',
      createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? data.createdAt ?? '',
    };
  });
}

export async function queryStats(app: App): Promise<StatsRow[]> {
  const db = getFirestore(app);
  const snap = await db.collection('site_stats').get();
  return snap.docs.map(d => {
    const data = d.data();
    return {
      siteId: d.id,
      totalVisits: data.totalVisits ?? 0,
      todayVisits: data.todayVisits ?? 0,
      monthVisits: data.monthVisits ?? 0,
      totalInquiries: data.totalInquiries ?? 0,
    };
  });
}
