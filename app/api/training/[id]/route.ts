import { NextResponse } from "next/server";
import { deleteTrainingVideo, routeErrorMessage } from "../../../../lib/taskStore";

export const dynamic = "force-dynamic";

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const video = await deleteTrainingVideo(id);
    return NextResponse.json({ video });
  } catch (error) {
    return NextResponse.json({ error: routeErrorMessage(error) }, { status: 400 });
  }
}
