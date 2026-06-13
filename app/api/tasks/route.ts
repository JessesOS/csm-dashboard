import { NextResponse } from "next/server";
import { createTask, listTasks, routeErrorMessage } from "../../../lib/taskStore";
import { categories, sourceDocument, teamMembers } from "../../../lib/respondTasks";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tasks = await listTasks(searchParams.get("clientId") ?? undefined);
    return NextResponse.json({ tasks, categories, teamMembers, sourceDocument });
  } catch (error) {
    return NextResponse.json(
      { error: routeErrorMessage(error), tasks: [], categories, teamMembers, sourceDocument },
      { status: 503 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const task = await createTask(payload.clientId, payload);
    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: routeErrorMessage(error) }, { status: 400 });
  }
}
