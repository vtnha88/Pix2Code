import Link from "next/link";
import { Clock3, Code2, ImagePlus } from "lucide-react";

export default function HistoryPage() {
  return <div className="page-content">
    <div className="mb-7"><div className="eyebrow mb-2">ACTIVITY</div><h1 className="page-title">Generation history</h1><p className="mb-0 mt-2 text-[12px] text-zinc-500">Review recent prototype activity in your workspace.</p></div>
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-[var(--border-soft)] p-4"><div><h2 className="m-0 text-[13px] font-semibold">Recent activity</h2><p className="mb-0 mt-1 text-[10px] text-zinc-600">Only UI prototype actions are shown here.</p></div><span className="badge yellow">Demo data</span></div>
      <div className="divide-y divide-[var(--border-soft)]">
        {[["SaaS Analytics Dashboard", "Workspace opened", "2 hours ago", Clock3], ["E-commerce Landing Page", "Screenshot added", "Yesterday", ImagePlus], ["Finance Mobile App", "Demo generation flow completed", "Oct 18, 2025", Code2]].map(([name, action, when, Icon]) => {
          const ActivityIcon = Icon;
          return <div key={String(name)} className="flex items-center gap-3 p-4"><div className="grid size-8 place-items-center rounded-lg border border-[var(--border)] bg-white/[.025] text-zinc-500"><ActivityIcon size={14} /></div><div className="min-w-0 flex-1"><div className="truncate text-[11px] text-zinc-300">{String(name)}</div><div className="mt-1 text-[10px] text-zinc-600">{String(action)}</div></div><span className="text-[10px] text-zinc-600">{String(when)}</span></div>;
        })}
      </div>
    </div>
    <div className="mt-4 text-center text-[10px] text-zinc-700">Generation history will include real run metadata after the AI engine is integrated.</div>
    <Link href="/projects" className="mt-5 inline-flex items-center gap-1 text-[11px] text-violet-300">Browse projects <span>→</span></Link>
  </div>;
}
