'use client';

import { Theme } from '@/lib/themes';
import React from 'react';

interface ThemeWrapperProps {
  theme: Theme;
  children: React.ReactNode;
}

export function ThemeWrapper({ theme, children }: ThemeWrapperProps) {
  const cssVariables = {
    '--primary': theme.colors.primary,
    '--primary-foreground': theme.colors.primaryForeground,
    '--secondary': theme.colors.secondary,
    '--secondary-foreground': theme.colors.secondaryForeground,
    '--accent': theme.colors.accent,
    '--accent-foreground': theme.colors.accentForeground,
    '--background': theme.colors.background,
    '--foreground': theme.colors.foreground,
    '--card': theme.colors.card,
    '--card-foreground': theme.colors.cardForeground,
    '--muted': theme.colors.muted,
    '--muted-foreground': theme.colors.mutedForeground,
    '--border': theme.colors.border,
    '--radius': theme.shape.radius,
  } as React.CSSProperties;

  const fontClass = 
    theme.typography.font === 'serif' ? 'font-serif' :
    theme.typography.font === 'mono' ? 'font-mono' : 'font-sans';

  return (
    <div 
      style={cssVariables} 
      className={`min-h-screen bg-[var(--background)] text-[var(--foreground)] ${fontClass}`}
    >
      {children}
    </div>
  );
}
