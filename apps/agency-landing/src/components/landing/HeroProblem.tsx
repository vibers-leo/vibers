'use client';

import { content } from '@/data/content';
import { Theme } from '@/lib/themes';
import { cn } from "@vibers/ui";
import { ArrowRight, CheckCircle2, DollarSign, Frown, UserX } from 'lucide-react';

interface SectionProps {
  theme: Theme;
}

export function Hero({ theme }: SectionProps) {
  const isCentered = theme.id % 2 === 0;

  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className={cn(
          "flex flex-col gap-8",
          isCentered ? "items-center text-center" : "lg:flex-row lg:items-center lg:justify-between"
        )}>
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center rounded-[var(--radius)] bg-[var(--accent)] px-3 py-1 text-sm font-medium text-[var(--primary)]">
              {content.hero.badge}
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-7xl">
              {content.hero.title}
            </h1>
            <p className="max-w-2xl text-lg text-[var(--muted-foreground)] sm:text-xl">
              {content.hero.subtitle}
            </p>
            <div className={cn("flex flex-col gap-4 sm:flex-row", isCentered && "justify-center")}>
              <button className="inline-flex items-center justify-center rounded-[var(--radius)] bg-[var(--primary)] px-8 py-4 text-base font-medium text-[var(--primary-foreground)] shadow-lg transition-all hover:bg-[var(--primary)]/90 hover:scale-105">
                {content.hero.cta}
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
            <div className={cn("flex items-center gap-2 text-sm font-medium text-[var(--muted-foreground)]", isCentered && "justify-center")}>
              <CheckCircle2 className="h-4 w-4 text-[var(--primary)]" />
              {content.hero.trust}
            </div>
          </div>
          
          {/* Visual element - simplified for demo */}
          <div className={cn("flex-1", isCentered ? "mt-12 w-full max-w-4xl" : "lg:pl-12")}>
            <div className="aspect-[4/3] w-full overflow-hidden rounded-[var(--radius)] border border-[var(--border)] bg-[var(--muted)] shadow-2xl">
              <div className="flex h-full items-center justify-center text-[var(--muted-foreground)]">
                [Hero Image Placeholder]
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Problem({ theme }: SectionProps) {
  const icons = { UserX, DollarSign, Frown };

  return (
    <section className="bg-[var(--muted)] py-20">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            {content.problem.title}
          </h2>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {content.problem.items.map((item, i) => {
            const Icon = icons[item.icon as keyof typeof icons] || Frown;
            return (
              <div 
                key={i} 
                className="group relative overflow-hidden rounded-[var(--radius)] bg-[var(--card)] p-8 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-[var(--radius)] bg-[var(--accent)] text-[var(--primary)]">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-xl font-bold">{item.title}</h3>
                <p className="text-[var(--muted-foreground)]">{item.desc}</p>
                
                {/* Decorative border bottom */}
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-[var(--primary)] transition-all group-hover:w-full" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
