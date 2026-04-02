'use client';

import { Theme } from '@/lib/themes';
import { ThemeWrapper } from './landing/ThemeWrapper';
import { Hero, Problem } from './landing/HeroProblem';
import { Solution, Services } from './landing/SolutionServices';
import { Pricing, FAQ, Footer } from './landing/PricingFooter';

interface TemplateViewProps {
  theme: Theme;
}

export default function TemplateView({ theme }: TemplateViewProps) {
  return (
    <ThemeWrapper theme={theme}>
      <main>
        <Hero theme={theme} />
        <Problem theme={theme} />
        <Solution theme={theme} />
        <Services theme={theme} />
        <Pricing theme={theme} />
        <FAQ theme={theme} />
      </main>
      <Footer theme={theme} />
    </ThemeWrapper>
  );
}
