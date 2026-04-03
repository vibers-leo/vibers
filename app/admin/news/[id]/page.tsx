import NewsForm from '../NewsForm';
import { newsStore } from '@/lib/news-store';

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = newsStore.get(id);

  if (!item) {
    return (
      <div className="p-6">
        <p className="text-neutral-400">소식을 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">소식 수정</h1>
        <p className="text-sm text-neutral-400 mt-0.5">{item.title}</p>
      </div>
      <NewsForm mode="edit" initial={item} />
    </div>
  );
}
