"use client";

import Link from "next/link";
import { useState } from "react";
import { Copy, MoreHorizontal, Pencil, Trash2, Monitor, Smartphone } from "lucide-react";
import type { Project } from "@/types/project";
import { projectThumbs } from "@/lib/demo-data";
import { useProjectStore } from "@/stores/project-store";
import { useToast } from "@/components/layout/app-shell";

function statusStyle(status: Project["status"]) {
  if (status === "Ready") return "green";
  if (status === "In progress") return "purple";
  return "";
}

export function ProjectCard({ project, compact = false, list = false }: { project: Project; compact?: boolean; list?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(project.name);
  const updateProject = useProjectStore((state) => state.updateProject);
  const deleteProject = useProjectStore((state) => state.deleteProject);
  const duplicateProject = useProjectStore((state) => state.duplicateProject);
  const toast = useToast().toast;

  const rename = () => {
    const next = name.trim();
    if (!next) return;
    updateProject(project.id, { name: next });
    setEditing(false);
    toast("Project renamed");
  };

  return (
    <article className={`card group relative overflow-visible transition hover:border-[#3a3942] ${list ? "flex items-stretch" : ""}`}>
      <Link href={`/projects/${project.id}`} className={`block ${list ? "w-40 shrink-0" : ""}`}>
        <div className={`thumb ${list ? "h-full min-h-[112px] rounded-r-none" : `rounded-b-none ${compact ? "h-[112px]" : "h-[164px]"}`}`} style={{ background: projectThumbs[project.image ?? "default"] ?? projectThumbs.default }}>
          <div className="absolute inset-0 opacity-80">
            <div className="absolute left-[8%] top-[12%] h-[76%] w-[84%] rounded-md border border-white/10 bg-[#15141bd9] shadow-2xl">
              <div className="flex h-[18%] items-center gap-1 border-b border-white/10 px-[5%]"><i className="size-1 rounded-full bg-[#a78bfa]" /><i className="h-1 w-[18%] rounded-full bg-white/20" /><i className="ml-auto h-1 w-[12%] rounded-full bg-white/10" /></div>
              <div className="grid h-[82%] grid-cols-[22%_1fr] gap-[3%] p-[4%]">
                <div className="rounded-sm bg-white/[.04]" />
                <div className="space-y-[5%]"><div className="h-[24%] rounded-sm bg-white/[.08]" /><div className="grid h-[56%] grid-cols-3 gap-[4%]"><i className="rounded-sm bg-white/[.06]" /><i className="rounded-sm bg-white/[.08]" /><i className="rounded-sm bg-white/[.05]" /></div></div>
              </div>
            </div>
          </div>
          <span className="absolute bottom-2.5 left-2.5 badge bg-black/55 text-white/80">{project.framework}</span>
        </div>
      </Link>
      <div className={`min-w-0 flex-1 p-3.5 ${list ? "flex flex-col justify-center" : ""}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            {editing ? <input autoFocus className="input !h-7 !min-h-7 text-xs" value={name} onChange={(event) => setName(event.target.value)} onBlur={rename} onKeyDown={(event) => { if (event.key === "Enter") rename(); if (event.key === "Escape") setEditing(false); }} aria-label="Rename project" /> : (
              <Link href={`/projects/${project.id}`} className="block truncate text-[13px] font-semibold text-zinc-200 hover:text-white">{project.name}</Link>
            )}
            <div className="mt-1 truncate text-[10px] text-zinc-600">{project.description || "No description yet"}</div>
          </div>
          <div className="relative -mr-1 -mt-1">
            <button type="button" aria-label={`Actions for ${project.name}`} className="icon-button h-7 min-w-7" onClick={() => setMenuOpen(!menuOpen)}><MoreHorizontal size={16} /></button>
            {menuOpen && <div className="absolute right-0 top-8 z-20 w-40 rounded-lg border border-[var(--border)] bg-[#1a1a1f] p-1 shadow-xl">
              <button type="button" className="flex w-full items-center gap-2 rounded px-2 py-2 text-left text-[11px] text-zinc-300 hover:bg-white/[.05]" onClick={() => { setEditing(true); setMenuOpen(false); }}><Pencil size={13} />Rename</button>
              <button type="button" className="flex w-full items-center gap-2 rounded px-2 py-2 text-left text-[11px] text-zinc-300 hover:bg-white/[.05]" onClick={() => { duplicateProject(project.id); setMenuOpen(false); toast("Project duplicated"); }}><Copy size={13} />Duplicate</button>
              <button type="button" className="flex w-full items-center gap-2 rounded px-2 py-2 text-left text-[11px] text-rose-300 hover:bg-white/[.05]" onClick={() => { deleteProject(project.id); setMenuOpen(false); toast("Project deleted"); }}><Trash2 size={13} />Delete</button>
            </div>}
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-[var(--border-soft)] pt-3">
          <div className="flex items-center gap-2.5">
            <span className={`badge ${statusStyle(project.status)}`}>{project.status}</span>
            <span className="text-[10px] text-zinc-600">{project.updatedAt}</span>
          </div>
          <span className="flex items-center gap-1 text-[10px] text-zinc-500">{project.viewport === "Mobile" ? <Smartphone size={12} /> : <Monitor size={12} />}{project.screens} screens</span>
        </div>
      </div>
    </article>
  );
}
