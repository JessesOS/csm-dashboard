import { NextResponse } from "next/server";
import { deleteTask, routeErrorMessage, updateTask } from "../../../../lib/taskStore";

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

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const deletedTask = await deleteTask(id);
    return NextResponse.json({ task: deletedTask });
  } catch (error) {
    return NextResponse.json({ error: routeErrorMessage(error) }, { status: 400 });
  }
}
