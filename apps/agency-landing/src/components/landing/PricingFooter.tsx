'use client';

import { content } from '@/data/content';
import { Theme } from '@/lib/themes';
import { cn } from "@vibers/ui";
import { Check } from 'lucide-react';

interface SectionProps {
  theme: Theme;
}

export function Pricing({ theme }: SectionProps) {
  const isCards = true;

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold">{content.pricing.title}</h2>
        </div>
        
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 max-w-5xl mx-auto">
          {content.pricing.plans.map((plan, i) => (
            <div 
              key={i}
              className={cn(
                "relative flex flex-col rounded-[var(--radius)] p-8 transition-all border",
                plan.highlight 
                  ? "border-[var(--primary)] bg-[var(--card)] shadow-2xl scale-105" 
                  : "border-[var(--border)] bg-[var(--background)] shadow-sm hover:border-[var(--primary)]/50"
              )}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[var(--primary)] px-4 py-1 text-sm font-medium text-[var(--primary-foreground)]">
                  BEST CHOICE
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="mb-2 text-xl font-semibold">{plan.name}</h3>
                <div className="mb-4 flex items-baseline">
                  <span className="text-4xl font-bold">{plan.price}원</span>
                  <span className="ml-2 text-[var(--muted-foreground)]">/ {plan.period}</span>
                </div>
                <p className="text-[var(--muted-foreground)]">{plan.desc}</p>
              </div>
              
              <ul className="mb-8 flex-1 space-y-4">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start">
                    <Check className="mr-3 h-5 w-5 flex-shrink-0 text-[var(--primary)]" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button 
                className={cn(
                  "w-full rounded-[var(--radius)] py-3 text-center font-semibold transition-colors",
                  plan.highlight
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)]/90"
                    : "bg-[var(--accent)] text-[var(--primary)] hover:bg-[var(--accent)]/80"
                )}
              >
                상담 신청하기
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FAQ({ theme }: SectionProps) {
  return (
    <section className="bg-[var(--muted)]/50 py-20">
      <div className="container mx-auto max-w-3xl px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold">{content.faq.title}</h2>
        </div>
        <div className="space-y-4">
          {content.faq.items.map((item, i) => (
            <div key={i} className="rounded-[var(--radius)] bg-[var(--card)] p-6 shadow-sm border border-[var(--border)]">
              <h3 className="mb-2 text-lg font-bold">{item.q}</h3>
              <p className="text-[var(--muted-foreground)]">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Footer({ theme }: SectionProps) {
  return (
    <footer className="bg-[var(--secondary)] py-12 text-[var(--secondary-foreground)]">
      <div className="container mx-auto px-4 text-center">
        <h2 className="mb-6 text-2xl font-bold">MZ MKT AGENCY</h2>
        <p className="mb-8 text-sm opacity-70">
          사업지 등록번호: 000-00-00000 | 대표: 홍길동 | 주소: 서울특별시 강남구 테헤란로
        </p>
        <div className="text-xs opacity-50">
          © 2024 MZ Marketing. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
