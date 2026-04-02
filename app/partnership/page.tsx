'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';

export default function PartnershipPage() {
  const [formData, setFormData] = useState({
    inquiryType: '',
    name: '',
    phone: '',
    region: '',
    subject: '',
    message: '',
    privacyAgreed: false,
    smsAgreed: false,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.privacyAgreed) {
      alert('개인정보 수집 및 이용에 동의해주세요.');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          type: 'partnership',
        }),
      });

      const result = await response.json();
      if (result.success) {
        alert('문의가 접수되었습니다. 빠른 시일 내 연락드리겠습니다.');
        setFormData({
          inquiryType: '',
          name: '',
          phone: '',
          region: '',
          subject: '',
          message: '',
          privacyAgreed: false,
          smsAgreed: false,
        });
      } else {
        alert('문의 접수에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      alert('오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main style={{ isolation: 'isolate', position: 'relative', zIndex: 0 }}>
        {/* Hero */}
        <section className="bg-white pt-[100px] md:pt-[120px] pb-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-start gap-4">
              <Image
                src="/icons/대화.png"
                alt="문의하기"
                width={96}
                height={96}
                className="w-20 h-20 md:w-24 md:h-24 object-contain flex-shrink-0"
              />
              <div className="flex-1">
                <p className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 mb-2">Partnership</p>
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-2" style={{ wordBreak: 'keep-all' }}>문의하기</h1>
                <p className="text-base md:text-lg text-gray-600" style={{ wordBreak: 'keep-all' }}>
                  세모폰과 함께 성장하세요
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 문의 폼 - 좌우 레이아웃 */}
        <section className="bg-gray-50 py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <Image
              src="/icons/접수.png"
              alt="접수"
              width={96}
              height={96}
              className="w-20 h-20 md:w-24 md:h-24 object-contain mx-auto mb-6"
            />
            <h2 className="text-3xl md:text-4xl font-black text-center mb-16 tracking-tight" style={{ wordBreak: 'keep-all' }}>협업문의</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
              {/* 왼쪽: 협업 소개 + 캐릭터 이미지 */}
              <div className="flex items-start justify-center md:sticky md:top-24">
                <div className="relative w-full max-w-lg">
                  {/* 함께 만드는 미래 - 캐릭터 위 */}
                  <div className="text-center mb-8">
                    <Image
                      src="/icons/협력.png"
                      alt="협력"
                      width={80}
                      height={80}
                      className="w-16 h-16 md:w-20 md:h-20 object-contain mx-auto mb-4"
                    />
                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight mb-4" style={{ wordBreak: 'keep-all' }}>
                      함께 만드는 미래
                    </h2>
                    <p className="text-base text-gray-700 leading-relaxed mb-2" style={{ wordBreak: 'keep-all' }}>
                      세모폰은 다양한 파트너와의 협력을 통해<br />
                      고객에게 더 나은 가치를 제공합니다.
                    </p>
                    <p className="text-base text-gray-700 leading-relaxed" style={{ wordBreak: 'keep-all' }}>
                      투명하고 정직한 파트너십으로<br />
                      함께 성장하고자 합니다.
                    </p>
                  </div>

                  <Image
                    src="/icons/세모폰 기본.png"
                    alt="세모폰"
                    width={600}
                    height={600}
                    className="w-full h-auto"
                  />
                </div>
              </div>

              {/* 오른쪽: 폼 */}
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* 문의 유형 */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">문의 유형 *</label>
                    <select
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-brand text-gray-900"
                      required
                    >
                      <option value="">선택해주세요</option>
                      <option value="창업문의">창업문의</option>
                      <option value="제휴문의">제휴문의</option>
                      <option value="협업문의">협업문의</option>
                    </select>
                  </div>

                  {/* 이름 */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">이름</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="성명"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-brand text-gray-900 placeholder:text-gray-400"
                      required
                    />
                  </div>

                  {/* 연락처 */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">연락처</label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="010-1234-5678"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-brand text-gray-900 placeholder:text-gray-400"
                      required
                    />
                  </div>

                  {/* 상담지역 */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">상담지역</label>
                    <input
                      type="text"
                      name="region"
                      placeholder="지역을 입력해주세요 (예: 서울 강남구, 경기 부천시)"
                      value={formData.region}
                      onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-brand text-gray-900 placeholder:text-gray-400"
                      required
                    />
                  </div>

                  {/* 내용 */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">내용</label>
                    <textarea
                      name="message"
                      rows={6}
                      placeholder="내용"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-brand resize-none text-gray-900 placeholder:text-gray-400"
                      required
                    />
                  </div>

                  {/* 개인정보 수집 동의 */}
                  <div className="flex items-start gap-2 bg-gray-50 p-4 rounded-lg">
                    <input
                      type="checkbox"
                      id="privacyAgreed"
                      checked={formData.privacyAgreed}
                      onChange={(e) => setFormData({ ...formData, privacyAgreed: e.target.checked })}
                      className="mt-1 w-4 h-4"
                      required
                    />
                    <label htmlFor="privacyAgreed" className="text-sm text-gray-700 flex-1">
                      <span className="font-bold">개인정보 수집 및 이용에 동의</span>
                      <Link href="/privacy" className="ml-2 text-brand underline">
                        자세히보기
                      </Link>
                    </label>
                  </div>

                  {/* 제출 버튼 */}
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{ backgroundColor: '#FEE500' }}
                    className="w-full py-4 text-gray-900 rounded-full font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl"
                  >
                    {submitting ? '전송 중...' : '문의 보내기'}
                  </button>
                </form>

                {/* 직접 연락 */}
                <div className="mt-8 text-center pt-8 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-3">또는 직접 연락주세요</p>
                  <div className="space-y-2">
                    <a href="tel:0507-1489-2274" className="block text-lg font-bold text-gray-900 hover:text-brand transition-colors">
                      0507-1489-2274
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
