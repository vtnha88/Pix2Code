"use client";

import { useState, useSyncExternalStore } from "react";
import { useToast } from "@/components/layout/app-shell";
import { Check, FolderOpen, Info, MonitorCog, Palette, Save, SlidersHorizontal, Sparkles } from "lucide-react";

type Settings = { language: string; framework: string; fontSize: string; tabSize: string; wordWrap: boolean; minimap: boolean; theme: string; };
const defaults: Settings = { language: "English", framework: "Next.js", fontSize: "13", tabSize: "2", wordWrap: true, minimap: false, theme: "Dark" };
let settingsSnapshot = defaults;
let settingsLoaded = false;
const listeners = new Set<() => void>();
function loadSettingsSnapshot() {
  if (typeof window === "undefined") return defaults;
  if (!settingsLoaded) {
    try {
      const stored = window.localStorage.getItem("pixel2code-settings");
      settingsSnapshot = stored ? { ...defaults, ...JSON.parse(stored) as Partial<Settings> } : defaults;
    } catch {
      window.localStorage.removeItem("pixel2code-settings");
      settingsSnapshot = defaults;
    }
    settingsLoaded = true;
  }
  return settingsSnapshot;
}
function subscribeSettings(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function SettingsPage() {
  const settings = useSyncExternalStore(subscribeSettings, loadSettingsSnapshot, () => defaults);
  const [saved, setSaved] = useState(true);
  const toast = useToast().toast;
  const update = <K extends keyof Settings>(key: K, value: Settings[K]) => { settingsSnapshot = { ...settings, [key]: value }; settingsLoaded = true; listeners.forEach((listener) => listener()); setSaved(false); };
  const save = () => {
    try {
      window.localStorage.setItem("pixel2code-settings", JSON.stringify(settings));
      setSaved(true);
      toast("Preferences saved on this device");
    } catch {
      toast("Could not save preferences in this browser.");
    }
  };
  return <div className="page-content">
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><div className="eyebrow mb-2">PREFERENCES</div><h1 className="page-title">Settings</h1><p className="mb-0 mt-2 text-[12px] text-zinc-500">Make Pixel2Code feel like your workspace.</p></div><button type="button" className="button primary" onClick={save}><Save size={14} />{saved ? "Save changes" : "Save changes"}</button></div>
    <div className="mx-auto max-w-[800px] space-y-4">
      <SettingsSection title="General" description="Your workspace preferences" icon={<Palette size={15} />}>
        <SettingsSelect label="Theme" description="Choose the interface appearance" value={settings.theme} options={["Dark", "System"]} onChange={(value) => update("theme", value)} />
        <SettingsSelect label="Language" description="Application display language" value={settings.language} options={["English"]} onChange={(value) => update("language", value)} />
        <SettingsSelect label="Default framework" description="Used for new projects" value={settings.framework} options={["Next.js", "React"]} onChange={(value) => update("framework", value)} />
      </SettingsSection>
      <SettingsSection title="Editor" description="Code editor defaults" icon={<MonitorCog size={15} />}>
        <SettingsSelect label="Font size" description="Editor text size" value={settings.fontSize} options={["12", "13", "14", "15", "16"]} suffix="px" onChange={(value) => update("fontSize", value)} />
        <SettingsSelect label="Tab size" description="Number of spaces per indent" value={settings.tabSize} options={["2", "4", "8"]} onChange={(value) => update("tabSize", value)} />
        <SettingsToggle label="Word wrap" description="Wrap long lines in the editor" checked={settings.wordWrap} onClick={() => update("wordWrap", !settings.wordWrap)} />
        <SettingsToggle label="Minimap" description="Show a code overview in the editor" checked={settings.minimap} onClick={() => update("minimap", !settings.minimap)} />
      </SettingsSection>
      <SettingsSection title="AI defaults" description="Preferences for a future local inference integration" icon={<Sparkles size={15} />}>
        <SettingsSelect label="Vision model" description="Default model for screenshot analysis" value="Not connected" options={["Not connected"]} onChange={() => toast("AI settings are planned for a future integration.")} />
        <SettingsSelect label="Coding model" description="Default model for frontend code" value="Not connected" options={["Not connected"]} onChange={() => toast("AI settings are planned for a future integration.")} />
        <SettingsSelect label="Correction iterations" description="Maximum visual refinement passes" value="3" options={["1", "2", "3", "5"]} onChange={() => toast("AI settings are planned for a future integration.")} />
      </SettingsSection>
      <SettingsSection title="Storage" description="Local data and cache information" icon={<FolderOpen size={15} />}>
        <div className="flex flex-wrap items-center justify-between gap-3 py-2"><div><div className="text-[11px] text-zinc-300">Project storage path</div><div className="mt-1 text-[10px] text-zinc-600">Browser local storage · device only</div></div><button type="button" className="button small" onClick={() => toast("Storage location controls are not available in a browser prototype.")}>Change location</button></div>
        <div className="flex items-center justify-between py-2"><div><div className="text-[11px] text-zinc-300">Assets and cache</div><div className="mt-1 text-[10px] text-zinc-600">Asset size is not measured by this prototype</div></div><span className="badge">Local</span></div>
      </SettingsSection>
      <SettingsSection title="About" description="Application information" icon={<Info size={15} />}>
        <div className="flex items-center justify-between py-2"><div><div className="text-[11px] text-zinc-300">Pixel2Code</div><div className="mt-1 text-[10px] text-zinc-600">Local-first design to code workspace</div></div><span className="badge">Prototype · v0.1.0</span></div>
      </SettingsSection>
      <div className="flex items-center justify-end gap-2 pb-6"><span className="mr-auto flex items-center gap-1.5 text-[10px] text-zinc-600"><SlidersHorizontal size={12} />Preferences are stored in this browser</span>{saved && <span className="flex items-center gap-1 text-[10px] text-emerald-400"><Check size={12} />Saved</span>}<button type="button" className="button primary" onClick={save}>Save preferences</button></div>
    </div>
  </div>;
}
function SettingsSection({ title, description, icon, children }: { title: string; description: string; icon: React.ReactNode; children: React.ReactNode }) {
  return <section className="card p-4 sm:p-5"><div className="mb-4 flex items-center gap-3"><div className="grid size-8 place-items-center rounded-lg border border-[var(--border)] bg-white/[.025] text-zinc-400">{icon}</div><div><h2 className="m-0 text-[12px] font-semibold">{title}</h2><p className="mb-0 mt-1 text-[10px] text-zinc-600">{description}</p></div></div><div className="divide-y divide-[var(--border-soft)]">{children}</div></section>;
}
function SettingsSelect({ label, description, value, options, suffix, onChange }: { label: string; description: string; value: string; options: string[]; suffix?: string; onChange: (value: string) => void }) {
  return <label className="flex flex-wrap items-center justify-between gap-3 py-2.5"><span><span className="block text-[11px] text-zinc-300">{label}</span><span className="mt-1 block text-[10px] text-zinc-600">{description}</span></span><span className="flex items-center gap-2"><select className="select !h-8 !min-h-8 min-w-[135px] text-[10px]" value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option} value={option}>{option}{suffix}</option>)}</select></span></label>;
}
function SettingsToggle({ label, description, checked, onClick }: { label: string; description: string; checked: boolean; onClick: () => void }) {
  return <button type="button" className="flex w-full items-center justify-between gap-3 py-2.5 text-left" onClick={onClick}><span><span className="block text-[11px] text-zinc-300">{label}</span><span className="mt-1 block text-[10px] text-zinc-600">{description}</span></span><span className={`switch shrink-0 ${checked ? "on" : ""}`} /></button>;
}
