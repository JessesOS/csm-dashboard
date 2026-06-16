import { productConfig } from "../../../../lib/productWorkspaces";
import { getPortalWorkspace, listTrainingVideos } from "../../../../lib/taskStore";
import { TrainingRoomPage } from "../../../components/TrainingRoomPage";

export const dynamic = "force-dynamic";

type PortalWorkspace = Awaited<ReturnType<typeof getPortalWorkspace>>;

async function resolvePortalWorkspace(token: string): Promise<PortalWorkspace | null> {
  try {
    return await getPortalWorkspace(token);
  } catch {
    return null;
  }
}

function PortalTrainingUnavailable() {
  return (
    <main className="client-portal-shell client-portal-unavailable">
      <section className="portal-unavailable-panel">
        <span className="portal-brand-mark respond-mark-image" aria-hidden="true" />
        <h1>Training room unavailable</h1>
        <p>This private training link is missing, expired, or not ready yet. Please ask your CSM contact for a fresh portal link.</p>
      </section>
    </main>
  );
}

export default async function ClientTrainingPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const workspace = await resolvePortalWorkspace(token);

  if (!workspace) {
    return <PortalTrainingUnavailable />;
  }

  const product = productConfig(workspace.client.product);
  const videos = await listTrainingVideos(workspace.client.product);

  return (
    <TrainingRoomPage
      initialProduct={workspace.client.product}
      initialVideos={videos}
      mode="client"
      backHref={`/portal/${token}`}
      backLabel="Back to project portal"
      contextLabel={workspace.client.name}
      contextDetail={workspace.client.companyName || product.clientLabel}
    />
  );
}
