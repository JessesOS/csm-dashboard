import { NextResponse } from "next/server";
import { routeErrorMessage, updateTask } from "../../../../lib/taskStore";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const payload = await request.json();
    const task = await updateTask(id, payload);
    return NextResponse.json({ task });
  } catch (error) {
    return NextResponse.json({ error: routeErrorMessage(error) }, { status: 400 });
  }
}
