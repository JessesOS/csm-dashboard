import { NextResponse } from "next/server";
import { listPortalTasks, routeErrorMessage } from "../../../../../lib/taskStore";

export const dynamic = "force-dynamic";

type PortalRouteContext = {
  params: Promise<{ token: string }>;
};

export async function GET(_request: Request, context: PortalRouteContext) {
  try {
    const { token } = await context.params;
    const data = await listPortalTasks(token);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: routeErrorMessage(error) }, { status: 404 });
  }
}
