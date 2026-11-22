import { Cpu, ExternalLink, Info, Terminal } from "lucide-react";

export function ModelsPage() {
  return <div className="page-content">
    <div className="mb-7"><div className="eyebrow mb-2">LOCAL INFERENCE</div><h1 className="page-title">AI Models</h1><p className="mb-0 mt-2 text-[12px] text-zinc-500">Set up a local llama.cpp runtime for future workflows.</p></div>
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(290px,.8fr)]">
      <div className="space-y-4">
        <section className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-[var(--border-soft)] p-4"><div className="flex items-center gap-3"><div className="grid size-9 place-items-center rounded-lg border border-violet-400/15 bg-violet-400/[.08] text-violet-300"><Cpu size={17} /></div><div><h2 className="m-0 text-[13px] font-semibold">llama.cpp runtime</h2><p className="mb-0 mt-1 text-[10px] text-zinc-600">CPU-only local server</p></div></div><span className="badge yellow">Status not checked</span></div>
          <div className="space-y-3 p-4 text-[11px] leading-5 text-zinc-400">
            <p className="m-0">Install the server and download the example vision model and projector from the project root:</p>
            <code className="block rounded-md border border-[var(--border)] bg-[#101013] p-3 text-violet-200">npm run llama:install</code>
            <p className="m-0">Then run the downloaded model:</p>
            <code className="block break-all rounded-md border border-[var(--border)] bg-[#101013] p-3 text-violet-200">{'npm run llama:run -- --model "$PWD/Qwen2.5-VL-3B-Instruct-Q4_K_M.gguf" --mmproj "$PWD/mmproj-Qwen2.5-VL-3B-Instruct-Q8_0.gguf"'}</code>
            <p className="flex items-start gap-2 text-zinc-500"><Info size={14} className="mt-0.5 shrink-0" />The application does not check the server or send it requests yet. See the README for vision models and setup details.</p>
          </div>
        </section>
      </div>
      <aside className="space-y-4">
        <section className="card p-4"><div className="mb-2 flex items-center gap-2 text-[12px] font-semibold"><Terminal size={15} />Separate runtime</div><p className="mb-0 text-[10px] leading-5 text-zinc-500">The server listens on localhost only. Installation downloads approximately 2.8 GB of model files for offline use.</p></section>
        <section className="rounded-xl border border-violet-400/15 bg-gradient-to-br from-violet-500/[.10] to-transparent p-4"><div className="mb-2 text-[12px] font-semibold text-violet-200">Integration status</div><p className="mb-3 mt-0 text-[10px] leading-5 text-zinc-500">Screenshot analysis, inference, model selection, and code generation in Pixel2Code are not implemented.</p><a href="https://github.com/ggml-org/llama.cpp" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[10px] text-violet-300 hover:text-violet-200">llama.cpp documentation <ExternalLink size={11} /></a></section>
      </aside>
    </div>
  </div>;
}
