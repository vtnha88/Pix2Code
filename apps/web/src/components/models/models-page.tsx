"use client";

import { useState } from "react";
import { Cpu, ExternalLink, Gauge, HardDrive, Info, PlugZap, RefreshCw, Settings2, Sparkles } from "lucide-react";
import { useToast } from "@/components/layout/app-shell";

export function ModelsPage() {
  const [url, setUrl] = useState("http://localhost:11434");
  const [temperature, setTemperature] = useState("0.3");
  const [context, setContext] = useState("8192");
  const [tokens, setTokens] = useState("2048");
  const toast = useToast().toast;
  return <div className="page-content">
    <div className="mb-7"><div className="eyebrow mb-2">LOCAL INFERENCE</div><h1 className="page-title">AI Models</h1><p className="mb-0 mt-2 text-[12px] text-zinc-500">Configure the local runtime and models for future design workflows.</p></div>
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(290px,.8fr)]">
      <div className="space-y-4">
        <section className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-[var(--border-soft)] p-4"><div className="flex items-center gap-3"><div className="grid size-9 place-items-center rounded-lg border border-violet-400/15 bg-violet-400/[.08] text-violet-300"><PlugZap size={17} /></div><div><h2 className="m-0 text-[13px] font-semibold">Runtime connection</h2><p className="mb-0 mt-1 text-[10px] text-zinc-600">Local model service endpoint</p></div></div><span className="badge yellow"><span className="size-1.5 rounded-full bg-amber-400" />Not connected</span></div>
          <div className="p-4"><label className="mb-1.5 block text-[10px] text-zinc-500">Ollama URL</label><div className="flex flex-wrap gap-2"><input className="input min-w-[220px] flex-1 font-mono text-[11px]" value={url} onChange={(event) => setUrl(event.target.value)} /><button type="button" className="button" onClick={() => toast("Connection testing is not implemented in this UI prototype.")}><RefreshCw size={13} />Test connection</button></div><div className="mt-2 flex items-center gap-1.5 text-[9px] text-zinc-700"><Info size={11} />No network request will be sent in this prototype.</div></div>
        </section>
        <ModelCard title="Vision model" subtitle="Used to understand your screenshot" model="Not installed" modelMeta="No model selected" icon={<Sparkles size={16} />} onAction={() => toast("Model discovery is planned for a future integration.")} />
        <ModelCard title="Coding model" subtitle="Used to generate your frontend code" model="Not installed" modelMeta="No model selected" icon={<Cpu size={16} />} onAction={() => toast("Model discovery is planned for a future integration.")} />
        <section className="card p-4">
          <div className="mb-4 flex items-center gap-2"><Settings2 size={15} className="text-zinc-400" /><h2 className="m-0 text-[13px] font-semibold">Generation defaults</h2><span className="badge ml-auto">Prototype settings</span></div>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block"><span className="mb-1.5 block text-[10px] text-zinc-500">Temperature</span><input className="input" type="number" min="0" max="2" step="0.1" value={temperature} onChange={(event) => setTemperature(event.target.value)} /></label>
            <label className="block"><span className="mb-1.5 block text-[10px] text-zinc-500">Context length</span><select className="select" value={context} onChange={(event) => setContext(event.target.value)}><option value="4096">4,096 tokens</option><option value="8192">8,192 tokens</option><option value="16384">16,384 tokens</option><option value="32768">32,768 tokens</option></select></label>
            <label className="block"><span className="mb-1.5 block text-[10px] text-zinc-500">Maximum output</span><select className="select" value={tokens} onChange={(event) => setTokens(event.target.value)}><option value="1024">1,024 tokens</option><option value="2048">2,048 tokens</option><option value="4096">4,096 tokens</option><option value="8192">8,192 tokens</option></select></label>
          </div>
        </section>
      </div>
      <aside className="space-y-4">
        <section className="card p-4"><h2 className="m-0 text-[13px] font-semibold">Runtime overview</h2><p className="mb-4 mt-1 text-[10px] text-zinc-600">Local inference health at a glance.</p><div className="space-y-3"><OverviewRow label="Provider" value="Ollama" /><OverviewRow label="Connection" value="Not configured" /><OverviewRow label="Vision model" value="Not installed" /><OverviewRow label="Coding model" value="Not installed" /></div><div className="divider my-4" /><div className="flex items-center gap-2 text-[10px] text-zinc-600"><HardDrive size={13} />GPU acceleration <span className="ml-auto">Not detected</span></div></section>
        <section className="rounded-xl border border-violet-400/15 bg-gradient-to-br from-violet-500/[.10] to-transparent p-4"><div className="mb-2 flex items-center gap-2 text-violet-200"><Gauge size={15} /><span className="text-[12px] font-semibold">Privacy by design</span></div><p className="mb-3 mt-0 text-[10px] leading-5 text-zinc-500">The planned inference architecture runs on your machine. Cloud fallback is not part of this prototype.</p><a href="https://ollama.com/download" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[10px] text-violet-300 hover:text-violet-200">Ollama setup guide <ExternalLink size={11} /></a></section>
        <section className="card p-4"><div className="mb-2 text-[11px] font-semibold">What&apos;s next?</div><p className="mb-0 text-[10px] leading-5 text-zinc-600">Runtime detection, installed model discovery, capability checks, and inference progress will be connected in a future integration.</p></section>
      </aside>
    </div>
  </div>;
}
function ModelCard({ title, subtitle, model, modelMeta, icon, onAction }: { title: string; subtitle: string; model: string; modelMeta: string; icon: React.ReactNode; onAction: () => void }) {
  return <section className="card flex flex-wrap items-center justify-between gap-4 p-4"><div className="flex min-w-[220px] items-center gap-3"><div className="grid size-9 place-items-center rounded-lg border border-[var(--border)] bg-[#1a1a1f] text-zinc-400">{icon}</div><div><h2 className="m-0 text-[12px] font-semibold">{title}</h2><p className="mb-0 mt-1 text-[10px] text-zinc-600">{subtitle}</p></div></div><div className="flex flex-1 items-center justify-between gap-4 sm:justify-end"><div><div className="text-[11px] text-zinc-300">{model}</div><div className="mt-1 text-[9px] text-zinc-600">{modelMeta}</div></div><button type="button" className="button small" onClick={onAction}>Change model</button></div></section>;
}
function OverviewRow({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between text-[10px]"><span className="text-zinc-600">{label}</span><span className="text-zinc-400">{value}</span></div>;
}
