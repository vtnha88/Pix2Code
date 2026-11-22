"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowDownRight, ArrowRight, ArrowUpRight, Box, Clock3, FolderKanban, Layers3, Plus, Sparkles, WandSparkles } from "lucide-react";
import { CreateProjectDialog } from "@/components/projects/create-project-dialog";
import { ProjectCard } from "@/components/projects/project-card";
import { useProjectStore } from "@/stores/project-store";

const activity = [
  { title: "SaaS Analytics Dashboard", detail: "Workspace updated", time: "2h ago", color: "bg-violet-400" },
  { title: "E-commerce Landing Page", detail: "Screenshot added", time: "Yesterday", color: "bg-sky-400" },
  { title: "Finance Mobile App", detail: "Project created", time: "Oct 18", color: "bg-emerald-400" },
];

export function DashboardPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const projects = useProjectStore((state) => state.projects);
  const readyScreens = projects.reduce((total, project) => total + project.screens, 0);

  return (
    <div className="page-content">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[11px] text-zinc-500"><span className="size-1.5 rounded-full bg-violet-400" />Sunday, November 22</div>
          <h1 className="page-title">Good evening, Jordan <span className="text-[22px]">✳</span></h1>
          <p className="mb-0 mt-2 text-[13px] text-zinc-500">Turn your designs into production-ready code.</p>
        </div>
        <button type="button" className="button primary" onClick={() => setDialogOpen(true)}><Plus size={15} />Create new project</button>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-3 xl:grid-cols-4">
        {[
          { label: "Total projects", value: projects.length.toString(), change: "+2 this month", icon: FolderKanban, trend: "up" },
          { label: "Screens added", value: readyScreens.toString(), change: "+8 this month", icon: Layers3, trend: "up" },
          { label: "Components", value: "128", change: "Across 12 projects", icon: Box, trend: "flat" },
          { label: "Time saved", value: "6.4h", change: "Estimated this month", icon: Clock3, trend: "down" },
        ].map((stat) => {
          const Icon = stat.icon;
          return <div key={stat.label} className="card flex min-h-[112px] items-center justify-between p-4">
            <div><div className="text-[11px] text-zinc-500">{stat.label}</div><div className="mt-2 text-[25px] font-semibold tracking-[-.05em] text-zinc-100">{stat.value}</div><div className={`mt-1 flex items-center gap-1 text-[10px] ${stat.trend === "up" ? "text-emerald-400" : "text-zinc-600"}`}>{stat.trend === "up" ? <ArrowUpRight size={12} /> : stat.trend === "down" ? <ArrowDownRight size={12} /> : null}{stat.change}</div></div>
            <span className="grid size-9 place-items-center rounded-lg border border-white/[.04] bg-white/[.03] text-zinc-400"><Icon size={16} /></span>
          </div>;
        })}
      </div>

      <div className="mb-7 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_290px]">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <div><h2 className="section-title">Recent projects</h2><p className="mb-0 mt-1 text-[11px] text-zinc-600">Pick up where you left off</p></div>
            <Link href="/projects" className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white">View all <ArrowRight size={13} /></Link>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {projects.slice(0, 4).map((project) => <ProjectCard key={project.id} project={project} compact />)}
            {projects.length === 0 && <div className="card col-span-full p-8 text-center text-xs text-zinc-500">No projects yet. Create one to get started.</div>}
          </div>
        </section>
        <aside className="space-y-4">
          <section className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-[var(--border-soft)] px-4 py-3.5"><h2 className="section-title text-[13px]">AI model status</h2><span className="badge yellow">Not checked</span></div>
            <div className="space-y-3.5 p-4">
              <StatusRow label="Runtime" value="llama.cpp (not checked)" />
              <div className="rounded-md border border-amber-500/10 bg-amber-500/[.04] px-3 py-2 text-[10px] leading-4 text-zinc-500">Start the local server manually. Screenshot analysis and generation remain simulated.</div>
              <Link href="/models" className="button small w-full justify-center">Runtime setup <ArrowRight size={13} /></Link>
            </div>
          </section>
          <section className="card p-4">
            <div className="mb-4 flex items-center justify-between"><h2 className="section-title text-[13px]">Recent activity</h2><button className="text-[10px] text-zinc-600 hover:text-white" type="button" onClick={() => {}}>This week</button></div>
            <div className="space-y-4">
              {activity.map((item) => <div key={item.title} className="flex gap-2.5">
                <span className={`mt-1.5 size-1.5 shrink-0 rounded-full ${item.color}`} />
                <div className="min-w-0 flex-1"><div className="truncate text-[11px] text-zinc-300">{item.title}</div><div className="mt-1 flex justify-between text-[10px] text-zinc-600"><span>{item.detail}</span><span>{item.time}</span></div></div>
              </div>)}
            </div>
          </section>
          <section className="rounded-xl border border-violet-400/15 bg-gradient-to-br from-violet-500/[.12] via-[#16131d] to-[#141417] p-4">
            <div className="mb-2 flex items-center gap-2 text-violet-200"><WandSparkles size={15} /><span className="text-[12px] font-semibold">Built for local-first</span></div>
            <p className="mb-3 mt-0 text-[10px] leading-4 text-zinc-500">Your designs and future AI workflows stay in your workspace.</p>
            <div className="flex items-center gap-1.5 text-[10px] text-violet-300"><Sparkles size={12} />Coming in a future integration <ArrowRight size={11} /></div>
          </section>
        </aside>
      </div>
      {dialogOpen && <CreateProjectDialog onClose={() => setDialogOpen(false)} />}
    </div>
  );
}

function StatusRow({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-3"><span className="text-[11px] text-zinc-500">{label}</span><span className="flex items-center gap-1.5 text-[10px] text-zinc-400"><span className="size-1.5 rounded-full bg-zinc-600" />{value}</span></div>;
}
