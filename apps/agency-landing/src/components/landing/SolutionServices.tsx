'use client';

import { content } from '@/data/content';
import { Theme } from '@/lib/themes';
import { cn } from "@vibers/ui";
import { Check, Zap, Shield, Repeat } from 'lucide-react';

interface SectionProps {
  theme: Theme;
}

export function Solution({ theme }: SectionProps) {
  const isAlternate = theme.id % 3 === 0;

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16">
          <div className={cn("mb-12 lg:mb-0", isAlternate && "order-2")}>
            <div className="mb-4 inline-flex items-center rounded-[var(--radius)] bg-[var(--primary)] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--primary-foreground)]">
              {content.solution.badge}
            </div>
            <h2 className="mb-6 text-3xl font-bold sm:text-4xl">
              {content.solution.title}
            </h2>
            <p className="mb-8 text-lg text-[var(--muted-foreground)]">
              {content.solution.desc}
            </p>
            <div className="space-y-6">
              {content.solution.features.map((feature, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--primary)]">
                      <Check className="h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{feature.title}</h3>
                    <p className="mt-1 text-[var(--muted-foreground)]">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={cn("relative", isAlternate && "order-1")}>
            <div className="aspect-square overflow-hidden rounded-[var(--radius)] bg-[var(--muted)] border border-[var(--border)] shadow-xl lg:aspect-auto lg:h-full">
               <div className="flex h-full items-center justify-center text-[var(--muted-foreground)]">
                [Trust Image Placeholder]
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


export function Services({ theme }: SectionProps) {
  const isMinimal = theme.type === 'Minimal';

  return (
    <section className={cn("py-20", isMinimal ? "bg-[var(--background)]" : "bg-[var(--accent)]/30")}>
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold">{content.services.title}</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {content.services.items.map((item, i) => (
            <div 
              key={i} 
              className={cn(
                "flex flex-col rounded-[var(--radius)] p-6 transition-all",
                isMinimal 
                  ? "border border-[var(--border)] hover:border-[var(--primary)]" 
                  : "bg-[var(--card)] shadow-sm hover:shadow-lg"
              )}
            >
              <h3 className="mb-3 text-lg font-bold text-[var(--foreground)]">{item.title}</h3>
              <p className="text-sm text-[var(--muted-foreground)]">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
