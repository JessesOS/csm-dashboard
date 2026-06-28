import { NextResponse } from "next/server";
import { deleteClient, routeErrorMessage } from "../../../../lib/taskStore";

export const dynamic = "force-dynamic";

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    const result = await deleteClient(id, searchParams.get("environment"), searchParams.get("product"));
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: routeErrorMessage(error) }, { status: 400 });
  }
}
