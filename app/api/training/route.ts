import { NextResponse } from "next/server";
import { createTrainingVideo, listTrainingVideos, routeErrorMessage } from "../../../lib/taskStore";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const videos = await listTrainingVideos(searchParams.get("product"));
    return NextResponse.json({ videos });
  } catch (error) {
    return NextResponse.json({ error: routeErrorMessage(error), videos: [] }, { status: 503 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const video = await createTrainingVideo(payload.product, payload);
    return NextResponse.json({ video }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: routeErrorMessage(error) }, { status: 400 });
  }
}
