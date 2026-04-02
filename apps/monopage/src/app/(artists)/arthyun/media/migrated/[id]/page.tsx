import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function MigratedPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Fetch Post
  let post: any = null;
  try {
    const docRef = doc(db, "migrated_posts", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      post = docSnap.data();
    }
  } catch (error) {
    console.error("Migrated post fetch error:", error);
  }

  if (!post) {
    notFound();
  }

  // Clean Content
  const cleanContent = post.content
    .replace(/\[vc_row\]/g, '<div class="row">')
    .replace(/\[\/vc_row\]/g, '</div>')
    .replace(/\[vc_column\]/g, '<div class="col">')
    .replace(/\[\/vc_column\]/g, '</div>')
    .replace(/\[.*?\]/g, ''); 

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-32 md:py-40">
      
      {/* Meta Header */}
      <div className="text-center mb-16">
        <span className="text-xs text-[#E85C4A] font-bold tracking-widest uppercase mb-4 block">
            ARCHIVE / {post.type === 'post' ? 'MEDIA' : 'PORTFOLIO'}
        </span>
        <h1 className="text-3xl md:text-5xl font-heading font-bold tracking-wider uppercase leading-tight mb-6">
            {post.title}
        </h1>
        <p className="text-gray-400 font-heading tracking-widest text-sm">
            {new Date(post.date).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Content */}
      <div 
        className="prose prose-lg max-w-4xl mx-auto text-gray-600 leading-loose break-words"
        dangerouslySetInnerHTML={{ __html: cleanContent }}
      />
      
      {/* Navigation */}
      <div className="max-w-4xl mx-auto mt-20 pt-10 border-t border-gray-100 flex justify-between items-center text-xs tracking-widest text-gray-400">
        <div className="cursor-not-allowed opacity-50 flex items-center gap-2">
            <span>&larr;</span> PREV POST
        </div>
        <a href="/media" className="font-bold text-black hover:opacity-50 transition-opacity uppercase border border-black px-6 py-3">
            Back to List
        </a>
        <div className="cursor-not-allowed opacity-50 flex items-center gap-2">
            NEXT POST <span>&rarr;</span>
        </div>
      </div>

    </div>
  );
}
