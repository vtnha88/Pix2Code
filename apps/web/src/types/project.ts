export type Framework = "React" | "Next.js";
export type Styling = "Tailwind CSS" | "CSS Modules" | "Plain CSS";
export type ViewportPreset = "Desktop" | "Tablet" | "Mobile";
export type ProjectStatus = "Ready" | "In progress" | "Draft";

export interface Project {
  id: string;
  name: string;
  description: string;
  framework: Framework;
  styling: Styling;
  viewport: ViewportPreset;
  status: ProjectStatus;
  updatedAt: string;
  screens: number;
  image?: string;
}
