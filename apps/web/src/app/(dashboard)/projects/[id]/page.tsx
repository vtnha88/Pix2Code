import { Workspace } from "@/components/workspace/workspace";

export default async function ProjectWorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <Workspace projectId={id} />;
}
