"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { initialProjects } from "@/lib/demo-data";
import type { Project, ProjectStatus } from "@/types/project";

interface NewProject {
  name: string;
  description: string;
  framework: Project["framework"];
  styling: Project["styling"];
  viewport: Project["viewport"];
}

interface ProjectState {
  projects: Project[];
  addProject: (project: NewProject) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  duplicateProject: (id: string) => void;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: initialProjects,
      addProject: (data) => {
        const project: Project = {
          ...data,
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          status: "Draft" satisfies ProjectStatus,
          updatedAt: "Just now",
          screens: 0,
          image: "default",
        };
        set((state) => ({ projects: [project, ...state.projects] }));
        return project;
      },
      updateProject: (id, updates) =>
        set((state) => ({ projects: state.projects.map((project) => project.id === id ? { ...project, ...updates } : project) })),
      deleteProject: (id) => set((state) => ({ projects: state.projects.filter((project) => project.id !== id) })),
      duplicateProject: (id) => {
        const source = get().projects.find((project) => project.id === id);
        if (!source) return;
        const copy: Project = { ...source, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, name: `${source.name} copy`, updatedAt: "Just now" };
        set((state) => ({ projects: [copy, ...state.projects] }));
      },
    }),
    { name: "pixel2code-projects", storage: createJSONStorage(() => localStorage), skipHydration: true },
  ),
);
