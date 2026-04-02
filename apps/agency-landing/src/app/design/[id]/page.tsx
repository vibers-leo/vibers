import TemplateView from '@/components/TemplateView';
import { themes } from '@/lib/themes';
import Link from 'next/link';
import { ArrowLeft, Monitor, Smartphone } from 'lucide-react';

// Generates static params for all 30 themes at build time (optional but good for performance)
export function generateStaticParams() {
  return themes.map((theme) => ({
    id: theme.id.toString(),
  }));
}

interface PageProps {
  params: Promise<{ id: string }>; // Params are now Promises in Next.js 15
}

export default async function DesignPage({ params }: PageProps) {
  const { id } = await params;
  const theme = themes.find((t) => t.id === parseInt(id));

  if (!theme) {
    return <div>Design not found</div>;
  }

  return (
    <div>
      {/* Floating Navigation Interface */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-4 rounded-full bg-black/80 px-6 py-3 text-white backdrop-blur-md shadow-2xl border border-white/10">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-sm font-medium hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          다른 디자인 보기
        </Link>
        <div className="h-4 w-px bg-white/20" />
        <span className="text-sm text-neutral-400">
          Viewing: <span className="text-white font-bold">{theme.name}</span>
        </span>
      </div>

      <TemplateView theme={theme} />
    </div>
  );
}
