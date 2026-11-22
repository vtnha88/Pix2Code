"use client";

import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowDownToLine, ArrowLeft, ArrowLeftRight, Check, ChevronDown, ChevronRight, Code2,
  Copy, ImagePlus, Layers3, LoaderCircle, Maximize, Monitor,
  MoreHorizontal, PanelLeftClose, Plus, Settings2, Smartphone, Tablet,
  Upload, X, ZoomIn, ZoomOut,
} from "lucide-react";
import { useProjectStore } from "@/stores/project-store";
import { useToast } from "@/components/layout/app-shell";

type ExplorerTab = "Assets" | "Layers" | "Design Tokens";
type InspectorTab = "Properties" | "Code" | "AI Settings";
type Viewport = "Desktop" | "Tablet" | "Mobile";
type PreviewMode = "Original" | "Generated" | "Compare";
const stages = ["Image Analysis", "Layout Reconstruction", "Component Generation", "Code Validation", "Preview Preparation"];

export function Workspace({ projectId }: { projectId: string }) {
  const project = useProjectStore((state) => state.projects.find((item) => item.id === projectId));
  const updateProject = useProjectStore((state) => state.updateProject);
  const toast = useToast().toast;
  const fileInput = useRef<HTMLInputElement>(null);
  const [explorerTab, setExplorerTab] = useState<ExplorerTab>("Assets");
  const [inspectorTab, setInspectorTab] = useState<InspectorTab>("Properties");
  const [viewport, setViewport] = useState<Viewport>(project?.viewport ?? "Desktop");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("Original");
  const [zoom, setZoom] = useState(100);
  const [image, setImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState("");
  const [dragging, setDragging] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState("Main Content");
  const [generationOpen, setGenerationOpen] = useState(false);
  const [generationStep, setGenerationStep] = useState(-1);
  const [generationDone, setGenerationDone] = useState(false);
  const [codeTab, setCodeTab] = useState<"React" | "CSS">("React");
  const [code, setCode] = useState("export function Dashboard() {\\n  return (\\n    <main>\\n      {/* Your design, ready for code */}\\n    </main>\\n  );\\n}");
  const [feedbackEnabled, setFeedbackEnabled] = useState(true);

  useEffect(() => {
    if (!generationOpen || generationDone) return;
    if (generationStep >= stages.length - 1) {
      const finish = window.setTimeout(() => setGenerationDone(true), 650);
      return () => window.clearTimeout(finish);
    }
    const timer = window.setTimeout(() => setGenerationStep((step) => step + 1), generationStep < 0 ? 400 : 800);
    return () => window.clearTimeout(timer);
  }, [generationDone, generationOpen, generationStep]);

  if (!project) {
    return <div className="page-content"><div className="card flex flex-col items-center p-12 text-center"><h1 className="text-lg font-semibold">Project not found</h1><p className="text-xs text-zinc-500">This project may have been removed from your local workspace.</p><Link className="button mt-3" href="/projects">Back to projects</Link></div></div>;
  }

  const acceptFile = (file?: File) => {
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      toast("Choose a PNG, JPG, or WEBP image.");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      toast("Images must be smaller than 15 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        toast("Could not read this image. Please try another file.");
        return;
      }
      setImage(reader.result);
      setImageName(file.name);
      setPreviewMode("Original");
      updateProject(projectId, { screens: Math.max(project.screens, 1), status: "In progress", updatedAt: "Just now" });
      toast("Screenshot added to this workspace");
    };
    reader.onerror = () => toast("Could not read this image. Please try another file.");
    reader.readAsDataURL(file);
  };
  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => acceptFile(event.target.files?.[0]);
  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    acceptFile(event.dataTransfer.files[0]);
  };
  const startGeneration = () => {
    setGenerationStep(-1);
    setGenerationDone(false);
    setGenerationOpen(true);
  };
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast("Code copied to clipboard");
    } catch {
      toast("Clipboard access is unavailable in this browser.");
    }
  };

  return (
    <>
      <div className="flex h-[54px] items-center justify-between border-b border-[var(--border-soft)] bg-[#0d0d10] px-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/projects" className="icon-button" aria-label="Back to projects"><ArrowLeft size={15} /></Link>
          <div className="hidden h-5 w-px bg-[var(--border)] sm:block" />
          <div className="min-w-0"><div className="truncate text-[12px] font-medium">{project.name}</div><div className="text-[9px] text-zinc-600">Local prototype · Saved just now</div></div>
          <span className="badge purple hidden sm:inline-flex">{project.framework}</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button type="button" className="button ghost small hidden md:inline-flex" onClick={() => toast("Undo history is not available in this prototype.")}>Undo</button>
          <button type="button" className="button small hidden sm:inline-flex" onClick={() => toast("ZIP export will be available in a future integration.")}><ArrowDownToLine size={13} />Export ZIP</button>
          <button type="button" className="button primary small" onClick={startGeneration}><Code2 size={14} />Generate Code</button>
        </div>
      </div>

      <div className="workspace-grid">
        <aside className="workspace-panel explorer-panel">
          <div className="workspace-header"><span className="text-[11px] font-semibold text-zinc-300">Design Explorer</span><button type="button" className="icon-button h-7 min-w-7" aria-label="Explorer options"><PanelLeftClose size={14} /></button></div>
          <div className="flex border-b border-[var(--border-soft)] px-2">
            {(["Assets", "Layers", "Design Tokens"] as const).map((tab) => <button key={tab} type="button" className={`workspace-tab ${explorerTab === tab ? "active" : ""}`} onClick={() => setExplorerTab(tab)}>{tab}</button>)}
          </div>
          {explorerTab === "Assets" && <div className="p-3">
            <div className="mb-3 flex items-center justify-between"><span className="eyebrow">SCREENSHOTS · {image ? 1 : 0}</span><button type="button" className="icon-button h-7 min-w-7" aria-label="Upload image" onClick={() => fileInput.current?.click()}><Plus size={14} /></button></div>
            <input ref={fileInput} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={onFileChange} />
            {image ? <button type="button" className="w-full rounded-md border border-violet-400/30 bg-violet-500/[.07] p-2 text-left" onClick={() => setPreviewMode("Original")}><Image src={image} alt={imageName} width={480} height={160} unoptimized className="mb-2 h-24 w-full rounded object-cover" /><span className="block truncate text-[10px] text-zinc-300">{imageName}</span><span className="text-[9px] text-zinc-600">Original image</span></button> : <button type="button" className="drop-zone flex w-full flex-col items-center gap-2 px-3 py-6 text-center" onClick={() => fileInput.current?.click()}><ImagePlus size={19} className="text-zinc-500" /><span className="text-[10px] text-zinc-400">Upload your first screenshot</span><span className="text-[9px] text-zinc-600">PNG · JPG · WEBP</span></button>}
            <p className="mt-4 text-[9px] leading-4 text-zinc-700">Images stay in this browser session; they are not sent to a server.</p>
          </div>}
          {explorerTab === "Layers" && <div className="p-3">
            <div className="mb-2 flex items-center justify-between"><span className="eyebrow">LAYERS</span><button type="button" className="icon-button h-7 min-w-7" aria-label="More layer actions"><MoreHorizontal size={14} /></button></div>
            <div className="space-y-0.5">
              <LayerButton label="Header" depth={0} selected={selectedLayer === "Header"} onClick={() => setSelectedLayer("Header")} />
              <LayerButton label="Navigation" depth={1} selected={selectedLayer === "Navigation"} onClick={() => setSelectedLayer("Navigation")} />
              <LayerButton label="Main Content" depth={0} selected={selectedLayer === "Main Content"} onClick={() => setSelectedLayer("Main Content")} />
              <LayerButton label="Overview Cards" depth={1} selected={selectedLayer === "Overview Cards"} onClick={() => setSelectedLayer("Overview Cards")} />
              <LayerButton label="Primary Button" depth={2} selected={selectedLayer === "Primary Button"} onClick={() => setSelectedLayer("Primary Button")} />
              <LayerButton label="Footer" depth={0} selected={selectedLayer === "Footer"} onClick={() => setSelectedLayer("Footer")} />
            </div>
            <div className="mt-5 rounded-md border border-amber-500/10 bg-amber-500/[.03] p-2.5 text-[9px] leading-4 text-zinc-600">Sample layer names are illustrative. No visual analysis has run.</div>
          </div>}
          {explorerTab === "Design Tokens" && <div className="space-y-5 p-3">
            <div><div className="eyebrow mb-2.5">COLORS</div><div className="space-y-2">{[["Ink", "#121218", "#121218"], ["Surface", "#F8F7FA", "#F8F7FA"], ["Accent", "#8B5CF6", "#8B5CF6"], ["Muted", "#A1A1AA", "#A1A1AA"]].map(([label, hex, color]) => <div key={label} className="flex items-center justify-between"><span className="flex items-center gap-2 text-[10px] text-zinc-400"><i className="size-4 rounded border border-white/10" style={{ backgroundColor: color }} />{label}</span><span className="font-mono text-[9px] text-zinc-600">{hex}</span></div>)}</div></div>
            <div><div className="eyebrow mb-2.5">TYPOGRAPHY</div><div className="rounded border border-[var(--border-soft)] p-2.5"><div className="text-[13px] font-semibold">Aa Inter</div><div className="mt-1 text-[9px] text-zinc-600">Heading / 16px / Semibold</div></div></div>
            <div><div className="eyebrow mb-2.5">SPACING</div><div className="flex gap-2">{["4", "8", "16", "24"].map((size) => <div key={size} className="flex flex-col items-center gap-1 text-[9px] text-zinc-600"><i className="rounded-sm bg-violet-400/40" style={{ width: `${Number(size)}px`, height: `${Number(size)}px` }} />{size}</div>)}</div></div>
          </div>}
        </aside>

        <section className="workspace-canvas flex min-w-0 flex-col">
          <div className="flex min-h-[48px] flex-wrap items-center justify-between gap-2 border-b border-[var(--border-soft)] bg-[#101013]/90 px-3">
            <div className="flex items-center gap-1">
              {(["Desktop", "Tablet", "Mobile"] as const).map((item) => {
                const Icon = item === "Desktop" ? Monitor : item === "Tablet" ? Tablet : Smartphone;
                return <button key={item} type="button" className={`icon-button h-7 min-w-7 px-2 ${viewport === item ? "bg-[#292630] text-violet-200" : ""}`} aria-label={`${item} viewport`} title={item} onClick={() => setViewport(item)}><Icon size={14} /> <span className="hidden text-[10px] sm:inline">{item}</span></button>;
              })}
              <span className="mx-1 h-4 w-px bg-[var(--border)]" />
              {(["Original", "Generated", "Compare"] as const).map((mode) => <button key={mode} type="button" className={`rounded px-2 py-1.5 text-[10px] ${previewMode === mode ? "bg-[#292630] text-violet-200" : "text-zinc-600 hover:text-zinc-300"}`} onClick={() => setPreviewMode(mode)}>{mode === "Compare" ? <span className="flex items-center gap-1"><ArrowLeftRight size={11} />Compare</span> : mode}</button>)}
            </div>
            <div className="flex items-center gap-0.5">
              <button type="button" className="icon-button h-7 min-w-7" aria-label="Zoom out" onClick={() => setZoom(Math.max(50, zoom - 25))}><ZoomOut size={14} /></button>
              <select aria-label="Zoom" className="w-[58px] appearance-none bg-transparent text-center text-[10px] text-zinc-400 outline-none" value={zoom} onChange={(event) => setZoom(Number(event.target.value))}>{[50, 75, 100, 150].map((value) => <option key={value} value={value}>{value}%</option>)}</select>
              <button type="button" className="icon-button h-7 min-w-7" aria-label="Zoom in" onClick={() => setZoom(Math.min(150, zoom + 25))}><ZoomIn size={14} /></button>
              <button type="button" className="icon-button h-7 min-w-7" aria-label="Fit to screen" onClick={() => setZoom(100)}><Maximize size={13} /></button>
            </div>
          </div>
          <div className="flex flex-1 items-center justify-center overflow-auto p-5 sm:p-8" onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={onDrop}>
            {image ? <div className={`flex items-start justify-center gap-4 ${previewMode === "Compare" ? "flex-col lg:flex-row" : "w-full"}`}>
              {(previewMode === "Original" || previewMode === "Compare") && <PreviewFigure label="Original screenshot" image={image} imageName={imageName} viewport={viewport} zoom={zoom} />}
              {(previewMode === "Generated" || previewMode === "Compare") && <div className="flex w-full flex-col items-center" style={{ maxWidth: viewport === "Mobile" ? 375 : viewport === "Tablet" ? 768 : 1120 }}><div className="mb-2 w-full text-[9px] uppercase tracking-wider text-zinc-600">Generated preview <span className="badge yellow ml-1">DEMO</span></div><div className="preview-frame grid min-h-[360px] w-full place-items-center bg-[#fbfafc] p-8 text-center" style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}><div className="max-w-[280px] text-[#24212d]"><div className="mx-auto mb-4 grid size-11 place-items-center rounded-xl bg-violet-100 text-violet-600"><Code2 size={20} /></div><div className="text-[17px] font-semibold">Preview not generated</div><p className="mt-2 text-[11px] leading-5 text-zinc-500">Code generation is simulated in this prototype. Your screenshot remains available in the Original view.</p><button className="mt-3 rounded-md bg-violet-600 px-3 py-2 text-[10px] text-white" onClick={startGeneration}>Run demo flow</button></div></div></div>}
            </div> : previewMode === "Generated" ? <div className="card flex w-full max-w-[480px] flex-col items-center px-7 py-12 text-center">
              <input ref={fileInput} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={onFileChange} />
              <span className="badge yellow mb-4">DEMO PREVIEW</span>
              <h2 className="m-0 text-[17px] font-semibold">Preview not generated</h2>
              <p className="mb-0 mt-2 max-w-[320px] text-[11px] leading-5 text-zinc-500">The generation flow is simulated. Add a screenshot to start a real project workspace.</p>
              <button type="button" className="button primary mt-4" onClick={() => fileInput.current?.click()}><Upload size={14} />Upload screenshot</button>
            </div> : <div className={`drop-zone flex w-full max-w-[500px] flex-col items-center px-7 py-12 text-center ${dragging ? "dragging" : ""}`}>
              <input ref={fileInput} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={onFileChange} />
              <div className="mb-5 grid size-12 place-items-center rounded-xl border border-violet-400/15 bg-violet-400/[.08] text-violet-300"><ImagePlus size={21} /></div>
              <span className="badge purple mb-4">DESIGN WORKSPACE</span>
              <h2 className="m-0 text-[19px] font-semibold tracking-tight">Start with a design</h2>
              <p className="mb-0 mt-2 max-w-[320px] text-[11px] leading-5 text-zinc-500">Upload a screenshot to begin reconstructing your interface.</p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                <button type="button" className="button primary" onClick={() => fileInput.current?.click()}><Upload size={14} />Upload screenshot</button>
              </div>
              <div className="mt-5 text-[9px] text-zinc-700">PNG, JPG, WEBP · Up to 15 MB · Drag and drop supported</div>
              <div className="mt-6 flex items-center gap-2 text-[9px] text-zinc-600"><span className="size-1.5 rounded-full bg-amber-400" />Local-first prototype · No data leaves this browser</div>
            </div>}
          </div>
          {dragging && <div className="pointer-events-none absolute inset-x-0 bottom-5 z-10 text-center text-[11px] text-violet-200">Drop image to add it to this project</div>}
          <div className="flex h-7 items-center justify-between border-t border-[var(--border-soft)] bg-[#0c0c0f] px-3 text-[9px] text-zinc-700"><span className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-amber-400" />Demo workspace</span><span>{viewport} · {zoom}%</span></div>
        </section>

        <aside className="workspace-panel inspector-panel">
          <div className="workspace-header"><span className="text-[11px] font-semibold text-zinc-300">Inspector</span><button type="button" className="icon-button h-7 min-w-7" aria-label="Inspector settings" onClick={() => toast("Inspector settings are not configurable yet.")}><Settings2 size={14} /></button></div>
          <div className="flex border-b border-[var(--border-soft)] px-2">
            {(["Properties", "Code", "AI Settings"] as const).map((tab) => <button key={tab} type="button" className={`workspace-tab ${inspectorTab === tab ? "active" : ""}`} onClick={() => setInspectorTab(tab)}>{tab}</button>)}
          </div>
          {inspectorTab === "Properties" && <div className="space-y-5 p-3.5">
            <div><div className="mb-2.5 flex items-center justify-between"><div className="text-[11px] font-semibold text-zinc-200">{selectedLayer}</div><span className="badge">{selectedLayer === "Header" ? "Header" : selectedLayer.includes("Button") ? "Button" : "Container"}</span></div><div className="text-[9px] text-zinc-600">Prototype properties · values are illustrative</div></div>
            <PropertyGroup title="Position"><div className="grid grid-cols-2 gap-2"><PropertyField label="X" value="0" /><PropertyField label="Y" value="80" /></div></PropertyGroup>
            <PropertyGroup title="Dimensions"><div className="grid grid-cols-2 gap-2"><PropertyField label="Width" value="1440" /><PropertyField label="Height" value="auto" /></div></PropertyGroup>
            <PropertyGroup title="Appearance"><div className="mb-2 flex items-center justify-between"><span className="text-[10px] text-zinc-500">Background</span><span className="flex items-center gap-2 text-[9px] text-zinc-400"><i className="size-3 rounded-sm border border-white/10 bg-[#18181b]" />#18181B</span></div><PropertyField label="Border radius" value="8 px" /></PropertyGroup>
            <PropertyGroup title="Typography"><div className="grid grid-cols-2 gap-2"><PropertyField label="Font family" value="Inter" /><PropertyField label="Weight" value="Medium" /></div></PropertyGroup>
            <PropertyGroup title="Spacing"><div className="grid grid-cols-2 gap-2"><PropertyField label="Padding" value="16 px" /><PropertyField label="Gap" value="12 px" /></div></PropertyGroup>
          </div>}
          {inspectorTab === "Code" && <div className="flex h-[calc(100%-88px)] min-h-[300px] flex-col p-3">
            <div className="mb-2 flex items-center justify-between"><div className="flex gap-1">{(["React", "CSS"] as const).map((tab) => <button key={tab} type="button" className={`rounded px-2 py-1 text-[10px] ${codeTab === tab ? "bg-[#282631] text-violet-200" : "text-zinc-600"}`} onClick={() => setCodeTab(tab)}>{tab}</button>)}</div><button type="button" className="icon-button h-7 min-w-7" title="Copy code" onClick={copyCode}><Copy size={13} /></button></div>
            <textarea spellCheck={false} aria-label={`${codeTab} code`} className="min-h-[270px] flex-1 resize-none rounded-md border border-[var(--border-soft)] bg-[#0a0a0c] p-3 font-mono text-[10px] leading-5 text-violet-100 outline-none focus:border-violet-500/40" value={codeTab === "React" ? code : ".dashboard {\\n  display: grid;\\n  min-height: 100vh;\\n}"} onChange={(event) => setCode(event.target.value)} />
            <div className="mt-2 text-[9px] text-zinc-700">Editor preview · Monaco integration planned</div>
          </div>}
          {inspectorTab === "AI Settings" && <div className="space-y-4 p-3.5">
            <div className="rounded-md border border-amber-500/10 bg-amber-500/[.04] p-2.5 text-[10px] leading-4 text-amber-100/70">AI engine will be available in a future integration.</div>
            <label className="block space-y-1.5"><span className="text-[10px] text-zinc-500">Vision model</span><select className="select text-[10px]" defaultValue=""><option value="">Not connected</option><option disabled>Connect a local runtime first</option></select></label>
            <label className="block space-y-1.5"><span className="text-[10px] text-zinc-500">Coding model</span><select className="select text-[10px]" defaultValue=""><option value="">Not connected</option><option disabled>Connect a local runtime first</option></select></label>
            <label className="block space-y-2"><span className="flex justify-between text-[10px] text-zinc-500"><span>Temperature</span><span className="font-mono">0.3</span></span><input type="range" min="0" max="1" step="0.1" defaultValue="0.3" className="w-full accent-violet-400" /></label>
            <label className="block space-y-1.5"><span className="text-[10px] text-zinc-500">Max correction iterations</span><select className="select text-[10px]" defaultValue="3"><option>1</option><option>2</option><option>3</option><option>5</option></select></label>
            <button type="button" className="flex w-full items-center justify-between text-[10px] text-zinc-400" onClick={() => setFeedbackEnabled(!feedbackEnabled)}>Visual feedback loop <span className={`switch ${feedbackEnabled ? "on" : ""}`} /></button>
            <span className="block text-[9px] text-zinc-700">Setting is a UI prototype only.</span>
          </div>}
        </aside>
      </div>

      {generationOpen && <GenerationDialog step={generationStep} done={generationDone} onClose={() => setGenerationOpen(false)} onOpenPreview={() => { setGenerationOpen(false); setPreviewMode("Generated"); }} />}
    </>
  );
}

function PreviewFigure({ label, image, imageName, viewport, zoom }: { label: string; image: string; imageName: string; viewport: Viewport; zoom: number }) {
  const width = viewport === "Mobile" ? "375px" : viewport === "Tablet" ? "768px" : "1120px";
  return <figure className="m-0 flex w-full flex-col items-center" style={{ maxWidth: width }}><figcaption className="mb-2 w-full text-[9px] uppercase tracking-wider text-zinc-600">{label} <span className="normal-case">· {imageName}</span></figcaption><div className="preview-frame w-full" style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}><Image src={image} alt={imageName} width={1440} height={900} unoptimized className="block h-auto max-h-[72vh] w-full object-contain" /></div></figure>;
}
function LayerButton({ label, depth, selected, onClick }: { label: string; depth: number; selected: boolean; onClick: () => void }) {
  return <button type="button" onClick={onClick} className={`flex h-7 w-full items-center gap-1.5 rounded px-2 text-left text-[10px] ${selected ? "bg-violet-500/10 text-violet-200" : "text-zinc-500 hover:bg-white/[.03] hover:text-zinc-300"}`} style={{ paddingLeft: `${8 + depth * 14}px` }}><ChevronRight size={11} className={depth ? "invisible" : ""} /><Layers3 size={12} />{label}</button>;
}
function PropertyGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return <div><div className="mb-2 text-[9px] font-semibold uppercase tracking-wider text-zinc-600">{title}</div>{children}</div>;
}
function PropertyField({ label, value }: { label: string; value: string }) {
  return <label className="block"><span className="mb-1 block text-[9px] text-zinc-600">{label}</span><input className="input !h-7 !min-h-7 text-[10px]" defaultValue={value} /></label>;
}
function GenerationDialog({ step, done, onClose, onOpenPreview }: { step: number; done: boolean; onClose: () => void; onOpenPreview: () => void }) {
  return <div className="modal-backdrop"><section className="modal max-w-[440px] p-5" role="dialog" aria-modal="true" aria-labelledby="generation-title">
    <div className="mb-5 flex items-start justify-between"><div><span className="badge yellow mb-2">SIMULATED DEMO</span><h2 id="generation-title" className="m-0 text-[17px] font-semibold">{done ? "Demo flow complete" : "Preparing your workspace"}</h2><p className="mb-0 mt-1 text-[11px] text-zinc-500">{done ? "This was a frontend-only progress simulation." : "Showing the planned generation stages. No AI is running."}</p></div><button type="button" className="icon-button" aria-label="Close dialog" onClick={onClose}><X size={15} /></button></div>
    <div className="mb-5 space-y-1">
      {stages.map((stage, index) => {
        const complete = done || index < step;
        const active = !done && index === step;
        return <div key={stage} className="flex items-center gap-3 rounded-md px-2.5 py-2"><span className={`grid size-6 place-items-center rounded-full border ${complete ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-300" : active ? "border-violet-400/30 bg-violet-500/10 text-violet-200" : "border-[var(--border)] text-zinc-700"}`}>{complete ? <Check size={12} /> : active ? <LoaderCircle size={13} className="animate-spin" /> : <span className="text-[9px]">{index + 1}</span>}</span><span className={`flex-1 text-[11px] ${complete || active ? "text-zinc-200" : "text-zinc-600"}`}>{stage}</span><span className="text-[9px] text-zinc-600">{complete ? "Done" : active ? "In progress" : "Waiting"}</span></div>;
      })}
    </div>
    <div className="rounded-md border border-violet-400/10 bg-violet-500/[.04] p-2.5 text-[10px] leading-4 text-zinc-500">No image analysis, code generation, or preview rendering occurs in this UI prototype.</div>
    <div className="mt-5 flex justify-end gap-2"><button type="button" className="button" onClick={onClose}>{done ? "Close" : "Cancel"}</button>{done && <button type="button" className="button primary" onClick={onOpenPreview}>View demo preview <ChevronDown size={13} className="-rotate-90" /></button>}</div>
  </section></div>;
}
