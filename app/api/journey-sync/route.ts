import { NextResponse } from "next/server";
import { isJourneySyncAuthorized, journeySyncConfigured } from "../../../lib/journeySync";
import { applyJourneyMilestoneUpdate, listJourneySyncStatus, routeErrorMessage } from "../../../lib/taskStore";

export const dynamic = "force-dynamic";

// Inbound half of the BSS sync: the customer-journey portal calls this when Fin
// completes (or un-completes) a task. Server-to-server, shared-token auth
// (header x-journey-sync-token). See lib/journeySync.ts.

export async function GET(request: Request) {
  if (!isJourneySyncAuthorized(request)) {
    return NextResponse.json({ ok: true, configured: journeySyncConfigured() });
  }

  return NextResponse.json({ ok: true, configured: true, clients: await listJourneySyncStatus() });
}

export async function POST(request: Request) {
  if (!isJourneySyncAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized sync request." }, { status: 401 });
  }

  try {
    const body = (await request.json()) as { journeyClientId?: unknown; milestoneId?: unknown; done?: unknown; note?: unknown };

    if (typeof body.journeyClientId !== "string" || !body.journeyClientId.trim()) {
      return NextResponse.json({ ok: false, error: "journeyClientId is required." }, { status: 400 });
    }

    if (typeof body.milestoneId !== "string" || !body.milestoneId.trim()) {
      return NextResponse.json({ ok: false, error: "milestoneId is required." }, { status: 400 });
    }

    const tasks = await applyJourneyMilestoneUpdate({
      journeyClientId: body.journeyClientId.trim(),
      milestoneId: body.milestoneId.trim(),
      done: body.done !== false,
      note: typeof body.note === "string" && body.note.trim() ? body.note : undefined,
    });

    return NextResponse.json({ ok: true, updated: tasks.map((task) => ({ id: task.id, status: task.status })) });
  } catch (error) {
    return NextResponse.json({ ok: false, error: routeErrorMessage(error) }, { status: 400 });
  }
}
