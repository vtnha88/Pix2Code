import type { Project } from "@/types/project";

export const initialProjects: Project[] = [
  { id: "saas-analytics", name: "SaaS Analytics Dashboard", description: "A metrics-rich workspace for product teams.", framework: "Next.js", styling: "Tailwind CSS", viewport: "Desktop", status: "Ready", updatedAt: "2 hours ago", screens: 4, image: "analytics" },
  { id: "commerce", name: "E-commerce Landing Page", description: "Editorial storefront concept for a modern brand.", framework: "React", styling: "CSS Modules", viewport: "Desktop", status: "In progress", updatedAt: "Yesterday", screens: 2, image: "commerce" },
  { id: "finance-mobile", name: "Finance Mobile App", description: "Personal finance overview and transaction flows.", framework: "React", styling: "Tailwind CSS", viewport: "Mobile", status: "Draft", updatedAt: "Oct 18, 2025", screens: 6, image: "finance" },
  { id: "portfolio", name: "Portfolio Website", description: "A minimal portfolio for a visual designer.", framework: "Next.js", styling: "Plain CSS", viewport: "Desktop", status: "Ready", updatedAt: "Oct 12, 2025", screens: 3, image: "portfolio" },
];

export const projectThumbs: Record<string, string> = {
  analytics: "linear-gradient(145deg,#272044 0%,#181720 45%,#344b63 100%)",
  commerce: "linear-gradient(135deg,#d9c4a2 0%,#735743 52%,#28221f 100%)",
  finance: "linear-gradient(150deg,#143f3a 0%,#122722 52%,#99b58a 100%)",
  portfolio: "linear-gradient(135deg,#e1d7c8 0%,#a7a099 48%,#373638 100%)",
  default: "linear-gradient(135deg,#2c2544 0%,#181720 58%,#52437a 100%)",
};
