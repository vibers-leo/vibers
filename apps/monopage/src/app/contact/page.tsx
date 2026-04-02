"use client";

import { useState } from "react";
import PlatformHeader from "../(platform)/components/PlatformHeader";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Loader2, CheckCircle, Send } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ContactPage() {
  const { locale } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "general", // general, design, dev, partnership
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Firebase에 저장
      await addDoc(collection(db, "inquiries"), {
        ...formData,
        status: "pending", // pending, processing, done
        createdAt: serverTimestamp(),
      });

      setSubmitted(true);
      setFormData({ name: "", email: "", category: "general", message: "" });
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white flex flex-col">
      <PlatformHeader />
      
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-32 md:py-48 max-w-2xl mx-auto w-full">
        
        {/* Header Title */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-serif font-medium mb-6 text-black">
            {locale === 'ko' ? "무엇이든 물어보세요" : "Get in Touch"}
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed max-w-lg mx-auto">
            {locale === 'ko' 
              ? "프로젝트 의뢰, 협업 제안, 혹은 단순한 궁금증까지.\n모노페이지 팀은 언제나 열려있습니다."
              : "Project requests, partnership proposals, or simple questions.\n모노페이지 team is always open."}
          </p>
        </div>

        {submitted ? (
            // Success Message
            <div className="bg-gray-50 rounded-3xl p-12 text-center w-full animate-fade-in-up border border-gray-100">
                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={32} />
                </div>
                <h3 className="text-2xl font-serif mb-4">
                    {locale === 'ko' ? "문의가 접수되었습니다." : "Message Sent Successfully."}
                </h3>
                <p className="text-gray-500 mb-8">
                    {locale === 'ko' ? "빠른 시일 내에 답변 드리겠습니다." : "We will get back to you shortly."}
                </p>
                <button 
                    onClick={() => setSubmitted(false)}
                    className="text-sm font-bold underline underline-offset-4 decoration-gray-300 hover:decoration-black transition-all"
                >
                    {locale === 'ko' ? "다른 문의 남기기" : "Send another message"}
                </button>
            </div>
        ) : (
            // Contact Form
            <form onSubmit={handleSubmit} className="w-full space-y-8 animate-fade-in-down delay-100">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Name</label>
                        <input 
                            type="text" 
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full h-14 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                            placeholder={locale === 'ko' ? "성함을 입력하세요" : "Your Name"}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Email</label>
                        <input 
                            type="email" 
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="w-full h-14 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                            placeholder={locale === 'ko' ? "이메일 주소" : "name@example.com"}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Category</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {['general', 'design', 'dev', 'partnership'].map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setFormData({...formData, category: cat})}
                                className={`h-12 rounded-xl text-sm font-medium border transition-all ${
                                    formData.category === cat 
                                    ? 'bg-black text-white border-black' 
                                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
                                }`}
                            >
                                {cat === 'general' && (locale === 'ko' ? '일반 문의' : 'General')}
                                {cat === 'design' && (locale === 'ko' ? '디자인 의뢰' : 'Design')}
                                {cat === 'dev' && (locale === 'ko' ? '기능 개발' : 'Development')}
                                {cat === 'partnership' && (locale === 'ko' ? '제휴/협업' : 'Partnership')}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Message</label>
                    <textarea 
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full p-4 h-40 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all resize-none"
                        placeholder={locale === 'ko' ? "문의 내용을 자유롭게 적어주세요." : "How can we help you?"}
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full h-16 bg-black text-white rounded-xl font-medium text-lg hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin" />
                            Sending...
                        </>
                    ) : (
                        <>
                            <Send size={20} />
                            {locale === 'ko' ? "문의 보내기" : "Send Message"}
                        </>
                    )}
                </button>
            </form>
        )}

      </main>
    </div>
  );
}
