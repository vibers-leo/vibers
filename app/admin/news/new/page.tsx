import NewsForm from '../NewsForm';

export default function NewNewsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">새 소식 작성</h1>
        <p className="text-sm text-neutral-400 mt-0.5">
          랜딩 페이지 소식 피드에 새 항목을 추가합니다
        </p>
      </div>
      <NewsForm mode="create" />
    </div>
  );
}
