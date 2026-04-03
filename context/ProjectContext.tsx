"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { VIBERS_PROJECTS } from '@/lib/admin/projects';

interface Project {
  slug: string;
  name: string;
  domain?: string;
  db?: string;
  priority?: string;
  apiUrl?: string;
}

interface ProjectContextType {
  currentProject: Project;
  setCurrentProject: (project: Project) => void;
  availableProjects: Project[];
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [currentProject, setCurrentProject] = useState<Project>(VIBERS_PROJECTS[0]);

  return (
    <ProjectContext.Provider 
      value={{ 
        currentProject, 
        setCurrentProject, 
        availableProjects: VIBERS_PROJECTS 
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}
