import { NextResponse } from "next/server";
import { createTask, listTasks, routeErrorMessage } from "../../../lib/taskStore";
import { defaultProduct, normalizeProduct, productCategories, productSourceDocument, productTeamMembers } from "../../../lib/productWorkspaces";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const product = normalizeProduct(searchParams.get("product") ?? defaultProduct);
  const categories = productCategories(product);
  const teamMembers = productTeamMembers(product);
  const sourceDocument = productSourceDocument(product);

  try {
    const tasks = await listTasks(product, searchParams.get("clientId"));
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
    const task = await createTask(payload.product, payload.clientId, payload);
    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: routeErrorMessage(error) }, { status: 400 });
  }
}
