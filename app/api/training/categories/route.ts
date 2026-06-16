import { NextResponse } from "next/server";
import { reorderTrainingCategories, routeErrorMessage } from "../../../../lib/taskStore";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request) {
  try {
    const payload = await request.json();
    const videos = await reorderTrainingCategories(payload.product, payload.categories);
    return NextResponse.json({ videos });
  } catch (error) {
    return NextResponse.json({ error: routeErrorMessage(error) }, { status: 400 });
  }
}
