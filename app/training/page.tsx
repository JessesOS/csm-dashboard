import { TrainingRoomPage } from "../components/TrainingRoomPage";
import { defaultProduct, normalizeProduct } from "../../lib/productWorkspaces";
import { listTrainingVideos } from "../../lib/taskStore";

export const dynamic = "force-dynamic";

export default async function TrainingPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string; theme?: string; admin?: string }>;
}) {
  const params = await searchParams;
  const product = normalizeProduct(params.product ?? defaultProduct);
  const theme = params.theme === "light" ? "light" : "dark";
  const adminEditing = params.admin === "1";
  const videos = await listTrainingVideos(product);

  return (
    <TrainingRoomPage
      initialProduct={product}
      initialVideos={videos}
      initialTheme={theme}
      initialAdminEditing={adminEditing}
      mode="admin"
    />
  );
}
