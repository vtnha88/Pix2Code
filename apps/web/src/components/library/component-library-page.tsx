"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, Check, Copy, Search } from "lucide-react";
import { useToast } from "@/components/layout/app-shell";

const categories = ["All", "Layout", "Navigation", "Buttons", "Cards", "Forms", "Data Display"];
const components = [
  { name: "Primary Button", category: "Buttons", description: "High emphasis action with icon support.", type: "button" },
  { name: "Secondary Button", category: "Buttons", description: "Quiet action for secondary flows.", type: "button-muted" },
  { name: "Project Card", category: "Cards", description: "Preview, status, and project metadata.", type: "project" },
  { name: "Status Badge", category: "Data Display", description: "Compact state label with semantic color.", type: "badge" },
  { name: "Text Field", category: "Forms", description: "Labeled input with focus treatment.", type: "input" },
  { name: "Sidebar Navigation", category: "Navigation", description: "Persistent navigation with active route.", type: "navigation" },
  { name: "Metric Card", category: "Data Display", description: "Value, context, and trend indicator.", type: "metric" },
  { name: "Section Header", category: "Layout", description: "Title, supporting text, and trailing action.", type: "section" },
];

export function ComponentLibraryPage() {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [copiedName, setCopiedName] = useState("");
  const toast = useToast().toast;
  const results = useMemo(() => components.filter((item) => (category === "All" || item.category === category) && `${item.name} ${item.description}`.toLowerCase().includes(query.toLowerCase())), [category, query]);
  const copy = async (item: typeof components[number]) => {
    try {
      await navigator.clipboard.writeText(`// ${item.name}\\nexport function ${item.name.replaceAll(" ", "")}() {\\n  return <div />;\\n}`);
      setCopiedName(item.name);
      toast(`Example code copied for ${item.name}`);
      window.setTimeout(() => setCopiedName(""), 1500);
    } catch {
      toast("Clipboard access is unavailable in this browser.");
    }
  };
  return <div className="page-content">
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><div className="eyebrow mb-2">DESIGN SYSTEM</div><h1 className="page-title">Component library</h1><p className="mb-0 mt-2 text-[12px] text-zinc-500">A growing collection of reusable interface building blocks.</p></div><span className="badge">{components.length} components · Preview</span></div>
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap gap-1.5">{categories.map((item) => <button key={item} type="button" className={`rounded-md border px-3 py-1.5 text-[10px] ${category === item ? "border-violet-400/25 bg-violet-500/10 text-violet-200" : "border-[var(--border-soft)] bg-[#111114] text-zinc-500 hover:text-zinc-200"}`} onClick={() => setCategory(item)}>{item}</button>)}</div>
      <div className="relative w-full sm:w-56"><Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" /><input className="input pl-9 text-[11px]" placeholder="Find a component..." value={query} onChange={(event) => setQuery(event.target.value)} /></div>
    </div>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {results.map((item) => <article key={item.name} className="card overflow-hidden">
        <div className="flex h-[145px] items-center justify-center bg-[#101013] p-5">
          {item.type === "button" && <button className="button primary"><span className="size-1.5 rounded-full bg-white/70" />Get started <ArrowUpRight size={13} /></button>}
          {item.type === "button-muted" && <button className="button">View documentation <ArrowUpRight size={13} /></button>}
          {item.type === "project" && <div className="w-full max-w-[240px] rounded-lg border border-[var(--border)] bg-[#18181c] p-3"><div className="mb-3 h-12 rounded-md bg-gradient-to-br from-violet-900/70 to-slate-800" /><div className="text-[11px] font-medium">Product dashboard</div><div className="mt-2 flex justify-between"><span className="badge green">Ready</span><span className="text-[9px] text-zinc-600">2 hours ago</span></div></div>}
          {item.type === "badge" && <div className="flex gap-2"><span className="badge green">Ready</span><span className="badge purple">In progress</span><span className="badge yellow">Draft</span></div>}
          {item.type === "input" && <label className="w-full max-w-[250px] text-[10px] text-zinc-400">Project name<input className="input mt-2" placeholder="Untitled project" /></label>}
          {item.type === "navigation" && <div className="w-[190px] space-y-1 rounded-lg border border-[var(--border)] bg-[#141417] p-2"><div className="rounded-md bg-violet-500/10 px-2 py-2 text-[10px] text-violet-200">◈ &nbsp; Overview</div><div className="px-2 py-2 text-[10px] text-zinc-500">□ &nbsp; Projects</div><div className="px-2 py-2 text-[10px] text-zinc-500">◇ &nbsp; Components</div></div>}
          {item.type === "metric" && <div className="w-[210px] rounded-lg border border-[var(--border)] bg-[#17171b] p-3"><div className="text-[10px] text-zinc-500">Total screens</div><div className="mt-1 text-[23px] font-semibold">24</div><div className="mt-1 text-[9px] text-emerald-400">↗ 12% this month</div></div>}
          {item.type === "section" && <div className="flex w-full items-center justify-between"><div><div className="text-[13px] font-semibold">Recent projects</div><div className="mt-1 text-[10px] text-zinc-500">Pick up where you left off</div></div><button className="button small">View all →</button></div>}
        </div>
        <div className="flex items-start justify-between border-t border-[var(--border-soft)] p-3.5"><div><div className="text-[11px] font-semibold">{item.name}</div><div className="mt-1 text-[10px] text-zinc-600">{item.description}</div><span className="badge mt-2">{item.category}</span></div><button type="button" className="icon-button h-7 min-w-7" aria-label={`Copy ${item.name} example`} onClick={() => void copy(item)}>{copiedName === item.name ? <Check size={14} className="text-emerald-300" /> : <Copy size={13} />}</button></div>
      </article>)}
    </div>
    {results.length === 0 && <div className="card mt-4 p-10 text-center text-xs text-zinc-500">No components match your search.</div>}
    <div className="mt-5 text-center text-[10px] text-zinc-700">Gallery examples are frontend previews. Component generation is not connected yet.</div>
  </div>;
}
