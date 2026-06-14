import { NextResponse } from "next/server";
import { createClient, listClients, routeErrorMessage } from "../../../lib/taskStore";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const clients = await listClients(searchParams.get("environment"), searchParams.get("product"));
    return NextResponse.json({ clients });
  } catch (error) {
    return NextResponse.json({ error: routeErrorMessage(error), clients: [] }, { status: 503 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const result = await createClient(payload);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: routeErrorMessage(error) }, { status: 400 });
  }
}
