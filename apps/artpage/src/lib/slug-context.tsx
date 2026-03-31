"use client";

import { createContext, useContext } from "react";
import type { TemplateConfig } from "./templates";

type SlugContextType = {
  slug: string;
  config: TemplateConfig;
};

const SlugContext = createContext<SlugContextType | null>(null);

export function SlugProvider({
  slug,
  config,
  children,
}: {
  slug: string;
  config: TemplateConfig;
  children: React.ReactNode;
}) {
  return (
    <SlugContext.Provider value={{ slug, config }}>
      {children}
    </SlugContext.Provider>
  );
}

export function useSlug() {
  const ctx = useContext(SlugContext);
  if (!ctx) throw new Error("useSlug must be used within SlugProvider");
  return ctx;
}
