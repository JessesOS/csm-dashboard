import { NextResponse } from "next/server";
import { getTaskSnapshot, restoreTaskSnapshot, routeErrorMessage } from "../../../../lib/taskStore";

export const dynamic = "force-dynamic";

function backupFilename(name: string) {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return `${slug || "task-backup"}.json`;
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const snapshot = await getTaskSnapshot(id);
    const { searchParams } = new URL(request.url);

    if (searchParams.get("download") === "1") {
      return new Response(JSON.stringify(snapshot, null, 2), {
        headers: {
          "Content-Disposition": `attachment; filename="${backupFilename(snapshot.name)}"`,
          "Content-Type": "application/json; charset=utf-8",
        },
      });
    }

    return NextResponse.json({ snapshot });
  } catch (error) {
    return NextResponse.json({ error: routeErrorMessage(error) }, { status: 400 });
  }
}

export async function PATCH(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const result = await restoreTaskSnapshot(id);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: routeErrorMessage(error) }, { status: 400 });
  }
}
