"use client";

import { useMemo, useState } from "react";
import { LayoutGrid, List, Plus, Search, SlidersHorizontal } from "lucide-react";
import { CreateProjectDialog } from "@/components/projects/create-project-dialog";
import { ProjectCard } from "@/components/projects/project-card";
import { useProjectStore } from "@/stores/project-store";

type Filter = "All projects" | "Ready" | "In progress" | "Draft";

export function ProjectsPage() {
  const projects = useProjectStore((state) => state.projects);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All projects");
  const [sortNewest, setSortNewest] = useState(true);
  const [view, setView] = useState<"grid" | "list">("grid");
  const filtered = useMemo(() => projects.filter((project) =>
    (filter === "All projects" || project.status === filter) &&
    `${project.name} ${project.description}`.toLowerCase().includes(query.toLowerCase()),
  ), [filter, projects, query]);
  const sorted = sortNewest ? filtered : [...filtered].reverse();

  return (
    <div className="page-content">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div><div className="eyebrow mb-2">YOUR WORKSPACE</div><h1 className="page-title">Projects</h1><p className="mb-0 mt-2 text-[12px] text-zinc-500">Manage your designs and generated interfaces.</p></div>
        <button type="button" className="button primary" onClick={() => setDialogOpen(true)}><Plus size={15} />New project</button>
      </div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-[250px] flex-1 flex-wrap items-center gap-2">
          <div className="relative min-w-[200px] flex-1 sm:max-w-[280px]"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" /><input className="input pl-9" placeholder="Search projects..." value={query} onChange={(event) => setQuery(event.target.value)} /></div>
          <div className="flex items-center rounded-md border border-[var(--border)] bg-[#101013] p-1">
            {(["All projects", "Ready", "In progress", "Draft"] as const).map((value) => <button key={value} type="button" className={`rounded px-2.5 py-1.5 text-[10px] transition ${filter === value ? "bg-[#292630] text-violet-200" : "text-zinc-500 hover:text-zinc-200"}`} onClick={() => setFilter(value)}>{value}</button>)}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="button small" onClick={() => setSortNewest(!sortNewest)}><SlidersHorizontal size={13} />{sortNewest ? "Newest first" : "Oldest first"}</button>
          <div className="flex rounded-md border border-[var(--border)] p-0.5">
            <button type="button" className={`icon-button h-7 min-w-7 ${view === "grid" ? "bg-[#292630] text-violet-200" : ""}`} aria-label="Grid view" onClick={() => setView("grid")}><LayoutGrid size={14} /></button>
            <button type="button" className={`icon-button h-7 min-w-7 ${view === "list" ? "bg-[#292630] text-violet-200" : ""}`} aria-label="List view" onClick={() => setView("list")}><List size={15} /></button>
          </div>
        </div>
      </div>
      <div className={`grid gap-3 ${view === "grid" ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
        {sorted.map((project) => <ProjectCard key={project.id} project={project} list={view === "list"} />)}
      </div>
      {sorted.length === 0 && <div className="card mt-4 flex flex-col items-center py-16 text-center"><div className="mb-3 grid size-11 place-items-center rounded-xl bg-white/[.04] text-zinc-500"><Search size={18} /></div><div className="text-[13px] font-medium">No projects found</div><p className="mb-0 mt-1 text-[11px] text-zinc-600">Try adjusting your search or filters.</p></div>}
      {dialogOpen && <CreateProjectDialog onClose={() => setDialogOpen(false)} />}
    </div>
  );
}
