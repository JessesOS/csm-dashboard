import { TrainingRoomPage } from "../components/TrainingRoomPage";
import { defaultProduct, normalizeProduct } from "../../lib/productWorkspaces";
import { listTrainingVideos } from "../../lib/taskStore";

export const dynamic = "force-dynamic";

export default async function TrainingPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string; theme?: string }>;
}) {
  const params = await searchParams;
  const product = normalizeProduct(params.product ?? defaultProduct);
  const theme = params.theme === "light" ? "light" : "dark";
  const videos = await listTrainingVideos(product);

  return (
    <TrainingRoomPage
      initialProduct={product}
      initialVideos={videos}
      initialTheme={theme}
      mode="admin"
    />
  );
}
