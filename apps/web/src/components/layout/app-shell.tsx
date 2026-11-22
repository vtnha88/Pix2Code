"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity, Box, ChevronDown, ChevronLeft, Command, Cpu, FolderKanban, History,
  LayoutDashboard, Menu, Search, Settings2, Sparkles, Bell,
} from "lucide-react";
import { createContext, Suspense, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useProjectStore } from "@/stores/project-store";

interface ToastContextValue {
  toast: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => undefined });
export const useToast = () => useContext(ToastContext);

const navigation = [
  { section: "WORKSPACE", items: [
    { href: "/", label: "Overview", icon: LayoutDashboard },
    { href: "/projects", label: "Projects", icon: FolderKanban },
    { href: "/components", label: "Components", icon: Box },
  ] },
  { section: "AI TOOLS", items: [
    { href: "/models", label: "AI Models", icon: Cpu },
    { href: "/history", label: "Generation History", icon: History },
  ] },
  { section: "PREFERENCES", items: [
    { href: "/settings", label: "Settings", icon: Settings2 },
  ] },
];

function pageName(pathname: string) {
  if (pathname === "/") return "Overview";
  if (pathname.startsWith("/projects/")) return "Workspace";
  const found = navigation.flatMap((group) => group.items).find((item) => item.href === pathname);
  return found?.label ?? "Overview";
}

export function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  return <Suspense fallback={<div className="app-shell"><main className="main-column">{children}</main></div>}><AppShellContent>{children}</AppShellContent></Suspense>;
}

function AppShellContent({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  useEffect(() => {
    void useProjectStore.persist.rehydrate();
  }, []);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const toast = useCallback((message: string) => {
    setToastMessage(message);
    window.setTimeout(() => setToastMessage(""), 2600);
  }, []);
  const context = useMemo(() => ({ toast }), [toast]);
  const rootClass = `${collapsed ? "sidebar-collapsed " : ""}${mobileOpen ? "mobile-sidebar-open" : ""}`;

  return (
    <ToastContext.Provider value={context}>
      <div className={`app-shell ${rootClass}`}>
        <aside className={`sidebar ${collapsed ? "collapsed" : ""}`} aria-label="Main navigation">
          <div className="flex h-[58px] items-center justify-between border-b border-[var(--border-soft)] px-4">
            <Link href="/" className="flex min-w-0 items-center gap-2.5">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-violet-400/20 bg-violet-500/15 text-violet-300">
                <Command size={17} strokeWidth={2.2} />
              </span>
              <span className="brand-name truncate text-[14px] font-semibold tracking-[-.03em]">Pixel<span className="text-violet-300">2</span>Code</span>
            </Link>
            <button type="button" className="icon-button sidebar-action ml-2" aria-label="Collapse sidebar" onClick={() => setCollapsed(!collapsed)}>
              <ChevronLeft size={15} className={collapsed ? "rotate-180" : ""} />
            </button>
          </div>
          <div className="sidebar-meta m-3 flex items-center justify-between rounded-md border border-[var(--border-soft)] bg-[#141417] px-2.5 py-2">
            <div className="flex items-center gap-2">
              <span className="relative size-2 rounded-full bg-amber-400"><span className="absolute inset-0 animate-ping rounded-full bg-amber-400/40" /></span>
              <span className="text-[11px] text-zinc-300">Local AI Offline</span>
            </div>
            <ChevronDown size={13} className="text-zinc-600" />
          </div>
          <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-3">
            {navigation.map((group) => (
              <div key={group.section} className="space-y-1">
                <div className="nav-label mb-2">{group.section}</div>
                {group.items.map(({ href, label, icon: Icon }) => {
                  const active = pathname === href || (href === "/projects" && pathname.startsWith("/projects/"));
                  return (
                    <Link key={href} href={href} aria-label={label} className={`nav-link ${active ? "active" : ""}`} title={collapsed ? label : undefined} onClick={() => setMobileOpen(false)}>
                      <Icon size={16} strokeWidth={1.8} /><span className="nav-text truncate">{label}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
            <div className="sidebar-meta rounded-lg border border-violet-400/15 bg-gradient-to-br from-violet-500/[.10] to-transparent p-3">
              <div className="mb-2 flex items-center gap-2 text-violet-200"><Sparkles size={14} /><span className="text-[11px] font-semibold">Your local workspace</span></div>
              <p className="m-0 text-[10px] leading-4 text-zinc-500">Prototype mode. Model connections will be available in a future integration.</p>
            </div>
          </nav>
          <div className="border-t border-[var(--border-soft)] p-3">
            <div className="flex items-center gap-2.5 rounded-lg px-2 py-2 hover:bg-white/[.03]">
              <div className="grid size-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-300 to-indigo-500 text-[11px] font-bold text-white">JD</div>
              <div className="profile-copy min-w-0 flex-1">
                <div className="truncate text-[11px] font-medium text-zinc-200">Jordan Davis</div>
                <div className="truncate text-[10px] text-zinc-600">Free workspace</div>
              </div>
              <Activity className="sidebar-meta text-zinc-600" size={14} />
            </div>
          </div>
        </aside>

        <div className="main-column">
          <header className="topbar">
            <div className="flex min-w-0 items-center gap-3">
              <button type="button" className="icon-button -ml-2 md:hidden" aria-label="Open navigation" onClick={() => setMobileOpen(!mobileOpen)}><Menu size={18} /></button>
              <div className="hidden items-center gap-2 text-[11px] text-zinc-600 sm:flex">
                <span>Workspace</span><span>/</span><span className="text-zinc-300">{pageName(pathname)}</span>
              </div>
              <span className="text-[13px] font-medium text-zinc-200 sm:hidden">{pageName(pathname)}</span>
            </div>
            <div className="flex items-center gap-2">
              {searchOpen ? (
                <input autoFocus className="input !h-[32px] !min-h-[32px] w-48 text-[11px]" placeholder="Search projects..." aria-label="Search projects" onKeyDown={(event) => { if (event.key === "Escape") setSearchOpen(false); }} />
              ) : null}
              <button type="button" className="icon-button" aria-label="Search" onClick={() => setSearchOpen(!searchOpen)}><Search size={16} /></button>
              <div className="mx-1 hidden h-5 w-px bg-[var(--border)] sm:block" />
              <button type="button" className="hidden items-center gap-2 rounded-md border border-amber-500/15 bg-amber-500/[.06] px-2.5 py-1.5 text-[10px] text-amber-200 sm:flex" onClick={() => toast("Local runtime status is simulated in this prototype.")}>
                <span className="size-1.5 rounded-full bg-amber-400" /> Runtime offline
              </button>
              <div className="relative">
                <button type="button" className="icon-button" aria-label="Notifications" onClick={() => setNotificationsOpen(!notificationsOpen)}><Bell size={16} /><span className="absolute right-1 top-1 size-1.5 rounded-full bg-violet-400" /></button>
                {notificationsOpen && <div className="absolute right-0 top-10 z-30 w-64 rounded-lg border border-[var(--border)] bg-[#17171b] p-3 shadow-xl"><div className="mb-1 text-xs font-semibold">You&apos;re all caught up</div><div className="text-[11px] leading-5 text-zinc-500">New project activity will show up here.</div></div>}
              </div>
              <button type="button" className="grid size-8 place-items-center rounded-full border border-white/10 bg-[#24212e] text-[10px] font-semibold text-violet-200" aria-label="User profile" onClick={() => toast("Profile settings are coming soon.")}>JD</button>
            </div>
          </header>
          <main>{children}</main>
        </div>
        {toastMessage && <div className="toast"><span className="size-1.5 rounded-full bg-violet-400" />{toastMessage}</div>}
      </div>
    </ToastContext.Provider>
  );
}
