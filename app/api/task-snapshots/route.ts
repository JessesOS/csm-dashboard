import { NextResponse } from "next/server";
import { createTaskSnapshot, listTaskSnapshots, routeErrorMessage } from "../../../lib/taskStore";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const snapshots = await listTaskSnapshots(searchParams.get("environment"), searchParams.get("product"), searchParams.get("clientId"));
    return NextResponse.json({ snapshots });
  } catch (error) {
    return NextResponse.json({ error: routeErrorMessage(error), snapshots: [] }, { status: 400 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const snapshot = await createTaskSnapshot(payload);
    return NextResponse.json({ snapshot }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: routeErrorMessage(error) }, { status: 400 });
  }
}
