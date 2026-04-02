'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Send, CheckCircle, ArrowRight } from 'lucide-react';

type InquiryType = '단건 의뢰' | '유지관리' | '기타';

const springTransition = {
  type: 'spring' as const,
  stiffness: 100,
  damping: 20,
  mass: 1,
};

export default function ContactSection() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [inquiryType, setInquiryType] = useState<InquiryType>('단건 의뢰');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    setSending(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, inquiryType, message }),
      });

      if (response.ok) {
        setSent(true);
        showToast('success', '문의가 성공적으로 접수되었습니다!');
      } else {
        showToast('error', '문의 전송에 실패했습니다. 이메일로 전송합니다.');
        window.location.href = `mailto:contact@dlab.co.kr?subject=[계발자들] ${inquiryType} 문의 - ${name}&body=이름: ${name}%0A연락처: ${phone}%0A유형: ${inquiryType}%0A%0A${message}`;
        setSent(true);
      }
    } catch {
      showToast('error', '문의 전송에 실패했습니다. 이메일로 전송합니다.');
      window.location.href = `mailto:contact@dlab.co.kr?subject=[계발자들] ${inquiryType} 문의 - ${name}&body=이름: ${name}%0A연락처: ${phone}%0A유형: ${inquiryType}%0A%0A${message}`;
      setSent(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="relative py-24 md:py-32 lg:py-40 border-t border-[rgba(57,255,20,0.08)]">
      {/* 풀블리드 배경 글로우 */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[400px] w-[600px] rounded-full blur-[200px] opacity-[0.06] bg-[#39FF14]" />
      </div>

      <div className="mx-auto max-w-3xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={springTransition}
          className="text-center mb-14"
        >
          <span className="mb-4 inline-block rounded-full bg-[rgba(57,255,20,0.08)] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.15em] text-[#39FF14]">
            Proposal
          </span>
          <h2 className="text-4xl font-black leading-snug tracking-tight md:text-5xl">비즈니스 제안하기</h2>
          <p className="mt-3 text-white/40 break-keep max-w-xl mx-auto">
            본인의 비즈니스를 설명하고 제안을 기다리세요.<br />
            계발자들이 최적의 실행 전략과 가격 플랜을 제시해 드립니다.
          </p>
        </motion.div>

        {sent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={springTransition}
          >
            <div className="rounded-[2rem] bg-[rgba(57,255,20,0.06)] p-1.5 ring-1 ring-[rgba(57,255,20,0.3)]">
              <div className="rounded-[calc(2rem-0.375rem)] bg-[rgba(57,255,20,0.03)] p-12 text-center"
                   style={{ boxShadow: 'inset 0 1px 1px rgba(57,255,20,0.1)' }}>
                <CheckCircle className="mx-auto h-12 w-12 text-[#39FF14] mb-4" />
                <h3 className="text-xl font-bold mb-2 leading-snug">문의가 전송되었습니다</h3>
                <p className="text-white/40">빠른 시일 내에 연락드리겠습니다.</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={springTransition}
          >
            {/* 더블 베젤 폼 카드 */}
            <div className="rounded-[2rem] bg-white/5 p-1.5 ring-1 ring-white/10">
              <form
                onSubmit={handleSubmit}
                className="rounded-[calc(2rem-0.375rem)] bg-[rgba(255,255,255,0.03)] p-8 md:p-10 space-y-6"
                style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.08)' }}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-white/40 mb-2">이름 *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="홍길동"
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder-white/20 transition-all duration-500 focus:border-[#39FF14] focus:shadow-[0_0_20px_rgba(57,255,20,0.08)] focus:outline-none"
                      style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/40 mb-2">연락처 *</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      placeholder="010-1234-5678"
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder-white/20 transition-all duration-500 focus:border-[#39FF14] focus:shadow-[0_0_20px_rgba(57,255,20,0.08)] focus:outline-none"
                      style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/40 mb-2">문의 유형</label>
                  <div className="flex gap-3">
                    {(['단건 의뢰', '유지관리', '기타'] as InquiryType[]).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setInquiryType(type)}
                        className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-500 ${
                          inquiryType === type
                            ? 'bg-[#39FF14] text-black shadow-[0_0_20px_rgba(57,255,20,0.2)]'
                            : 'border border-white/10 bg-white/5 text-white/40 hover:text-white hover:bg-white/10'
                        }`}
                        style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/40 mb-2">프로젝트 설명</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    placeholder="만들고 싶은 서비스, 예산, 일정 등을 자유롭게 적어주세요."
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder-white/20 transition-all duration-500 focus:border-[#39FF14] focus:shadow-[0_0_20px_rgba(57,255,20,0.08)] focus:outline-none resize-none"
                    style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
                  />
                </div>

                {/* 프리미엄 CTA 버튼 */}
                <button
                  type="submit"
                  disabled={sending || !name || !phone}
                  className="group flex w-full items-center justify-center gap-3 rounded-full bg-[#39FF14] py-4 text-base font-bold text-black transition-all duration-500 hover:shadow-[0_0_30px_rgba(57,255,20,0.3)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
                  style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
                >
                  {sending ? (
                    <>전송 중...</>
                  ) : (
                    <>
                      문의 보내기
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/10">
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                      </span>
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-white/25">
                  또는 <a href="mailto:contact@dlab.co.kr" className="text-[#39FF14] hover:underline">contact@dlab.co.kr</a>로 직접 연락주세요
                </p>
              </form>
            </div>
          </motion.div>
        )}
      </div>

      {/* 토스트 알림 */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 50, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: 50 }}
          transition={springTransition}
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-full px-6 py-3 text-sm font-medium ${
            toast.type === 'success'
              ? 'border border-[rgba(57,255,20,0.3)] bg-[rgba(57,255,20,0.15)] text-[#39FF14] shadow-[0_0_30px_rgba(57,255,20,0.15)]'
              : 'border border-red-500/30 bg-red-500/15 text-red-400'
          }`}
        >
          {toast.message}
        </motion.div>
      )}
    </section>
  );
}
