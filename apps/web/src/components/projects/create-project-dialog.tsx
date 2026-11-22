"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { X, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useProjectStore } from "@/stores/project-store";
import { useToast } from "@/components/layout/app-shell";

const schema = z.object({
  name: z.string().trim().min(2, "Add at least 2 characters.").max(60, "Keep the name under 60 characters."),
  description: z.string().max(180, "Keep the description under 180 characters."),
  framework: z.enum(["React", "Next.js"]),
  styling: z.enum(["Tailwind CSS", "CSS Modules", "Plain CSS"]),
  viewport: z.enum(["Desktop", "Tablet", "Mobile"]),
});
type FormValues = z.infer<typeof schema>;

export function CreateProjectDialog({ onClose }: { onClose: () => void }) {
  const addProject = useProjectStore((state) => state.addProject);
  const toast = useToast().toast;
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", description: "", framework: "Next.js", styling: "Tailwind CSS", viewport: "Desktop" },
  });
  const submit = (values: FormValues) => {
    const project = addProject(values);
    toast("Project created");
    onClose();
    router.push(`/projects/${project.id}`);
  };

  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="modal p-5" role="dialog" aria-modal="true" aria-labelledby="create-project-title">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <div className="mb-1.5 flex size-9 items-center justify-center rounded-lg border border-violet-400/20 bg-violet-500/10 text-violet-300"><Sparkles size={17} /></div>
            <h2 id="create-project-title" className="m-0 text-[17px] font-semibold tracking-tight">Create a project</h2>
            <p className="mb-0 mt-1 text-[11px] text-zinc-500">Set up a workspace for your next design.</p>
          </div>
          <button type="button" className="icon-button" aria-label="Close dialog" onClick={onClose}><X size={16} /></button>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit(submit)}>
          <label className="block space-y-1.5">
            <span className="text-[11px] font-medium text-zinc-300">Project name <span className="text-rose-300">*</span></span>
            <input autoFocus className="input" placeholder="e.g. Studio dashboard" {...register("name")} />
            {errors.name && <span className="block text-[10px] text-rose-300">{errors.name.message}</span>}
          </label>
          <label className="block space-y-1.5">
            <span className="text-[11px] font-medium text-zinc-300">Description <span className="text-zinc-600">· optional</span></span>
            <input className="input" placeholder="What are you building?" {...register("description")} />
            {errors.description && <span className="block text-[10px] text-rose-300">{errors.description.message}</span>}
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block space-y-1.5">
              <span className="text-[11px] font-medium text-zinc-300">Framework</span>
              <select className="select" {...register("framework")}><option>Next.js</option><option>React</option></select>
            </label>
            <label className="block space-y-1.5">
              <span className="text-[11px] font-medium text-zinc-300">Styling</span>
              <select className="select" {...register("styling")}><option>Tailwind CSS</option><option>CSS Modules</option><option>Plain CSS</option></select>
            </label>
          </div>
          <label className="block space-y-1.5">
            <span className="text-[11px] font-medium text-zinc-300">Starting viewport</span>
            <div className="grid grid-cols-3 gap-2">
              {(["Desktop", "Tablet", "Mobile"] as const).map((value) => (
                <label key={value} className="flex items-center gap-2 rounded-md border border-[var(--border)] bg-[#101013] px-2.5 py-2 text-[11px] text-zinc-300">
                  <input type="radio" value={value} className="checkbox" {...register("viewport")} />{value}
                </label>
              ))}
            </div>
          </label>
          <div className="divider !my-5" />
          <div className="flex justify-end gap-2">
            <button type="button" className="button" onClick={onClose}>Cancel</button>
            <button type="submit" className="button primary" disabled={isSubmitting}>Create project <span aria-hidden="true">→</span></button>
          </div>
        </form>
      </section>
    </div>
  );
}
