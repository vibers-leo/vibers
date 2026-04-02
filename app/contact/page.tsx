'use client';

import { useState } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'partnership'>('general');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // TODO: 실제 API 연동 시 Firestore 또는 이메일 발송 구현
      await new Promise(resolve => setTimeout(resolve, 1500));

      console.log('문의 내용:', {
        ...formData,
        type: activeTab,
        timestamp: new Date().toISOString(),
      });

      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        category: '',
        message: '',
      });

      // 3초 후 성공 메시지 자동 닫기
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      console.error('문의 제출 오류:', error);
      alert('문의 제출 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main id="main-content" style={{ isolation: 'isolate', position: 'relative', zIndex: 0 }}>
      {/* Hero Section */}
      <section className="bg-white pt-[100px] md:pt-[120px] pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start gap-4 mb-3">
            <Image
              src="/icons/채팅, 고객센터.png"
              alt="고객센터"
              width={64}
              height={64}
              className="w-16 h-16 object-contain mt-1"
            />
            <h1 className="text-3xl md:text-4xl font-black text-gray-900">고객센터</h1>
          </div>
          <p className="text-base md:text-lg text-gray-600 ml-20">
            언제든지 편하게 연락주세요
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Tabs */}
          <div className="bg-white rounded-3xl p-2 shadow-lg mb-8 inline-flex gap-2 w-full">
            <button
              onClick={() => setActiveTab('general')}
              className={`flex-1 py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 ${
                activeTab === 'general'
                  ? 'bg-brand text-black shadow-md'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              일반 문의
            </button>
            <button
              onClick={() => setActiveTab('partnership')}
              className={`flex-1 py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 ${
                activeTab === 'partnership'
                  ? 'bg-brand text-black shadow-md'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              제휴 문의
            </button>
          </div>

          {/* 성공 메시지 */}
          {submitted && (
            <div className="mb-6 bg-green-50 border-2 border-green-500 rounded-2xl p-6 flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-green-900 text-lg">문의가 성공적으로 접수되었습니다!</p>
                <p className="text-sm text-green-700 mt-1">담당자가 확인 후 빠르게 연락드리겠습니다.</p>
              </div>
            </div>
          )}

          {/* Form Card */}
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Name */}
              <div>
                <label className="block text-lg font-bold text-gray-900 mb-3">
                  이름 *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-brand transition-colors text-base bg-gray-50 focus:bg-white"
                  placeholder="이름을 입력해주세요"
                  required
                  disabled={submitting}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-lg font-bold text-gray-900 mb-3">
                  이메일 *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-brand transition-colors text-base bg-gray-50 focus:bg-white"
                  placeholder="이메일을 입력해주세요"
                  required
                  disabled={submitting}
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-lg font-bold text-gray-900 mb-3">
                  전화번호 *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-brand transition-colors text-base bg-gray-50 focus:bg-white"
                  placeholder="010-1234-5678"
                  required
                  disabled={submitting}
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-lg font-bold text-gray-900 mb-3">
                  {activeTab === 'general' ? '문의 분류 *' : '제휴 유형 *'}
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-brand transition-colors text-base bg-gray-50 focus:bg-white"
                  required
                  disabled={submitting}
                >
                  <option value="">선택해주세요</option>
                  {activeTab === 'general' ? (
                    <>
                      <option value="phone">휴대폰 문의</option>
                      <option value="location">매장 위치 안내</option>
                      <option value="as">A/S 문의</option>
                      <option value="other">기타 문의</option>
                    </>
                  ) : (
                    <>
                      <option value="store">매장 제휴</option>
                      <option value="ad">광고 제휴</option>
                      <option value="other">기타 제휴</option>
                    </>
                  )}
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-lg font-bold text-gray-900 mb-3">
                  문의 내용 *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-brand transition-colors resize-none text-base bg-gray-50 focus:bg-white"
                  rows={8}
                  placeholder="문의 내용을 입력해주세요"
                  required
                  disabled={submitting}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-brand text-black py-5 rounded-2xl font-bold text-xl hover:bg-brand-600 hover:scale-[1.02] transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {submitting ? '전송 중...' : '보내기'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
    <Footer />
    </>
  );
}
