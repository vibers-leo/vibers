/**
 * 소식 인메모리 스토어
 * seed: lib/feed-data.ts 정적 데이터
 * 어드민에서 추가/수정/삭제한 항목은 런타임 메모리에 반영
 * (추후 PostgreSQL or Firestore로 교체 가능)
 */
import { feedItems, type FeedItem } from '@/lib/feed-data';

// 정적 seed를 복사해 초기값으로 사용
const store = new Map<string, FeedItem>(
  feedItems.map((item) => [item.id, { ...item }])
);

export const newsStore = {
  list(): FeedItem[] {
    return Array.from(store.values()).sort((a, b) =>
      b.date.localeCompare(a.date)
    );
  },

  get(id: string): FeedItem | undefined {
    return store.get(id);
  },

  create(item: FeedItem): FeedItem {
    store.set(item.id, item);
    return item;
  },

  update(id: string, patch: Partial<FeedItem>): FeedItem | null {
    const existing = store.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...patch, id };
    store.set(id, updated);
    return updated;
  },

  delete(id: string): boolean {
    return store.delete(id);
  },
};
