import { NextResponse } from "next/server";
import { loadActiveClientPipeline } from "../../../../lib/ghlImport";
import { routeErrorMessage } from "../../../../lib/taskStore";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const pipeline = await loadActiveClientPipeline();

    return NextResponse.json(
      { pipeline },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    const message = routeErrorMessage(error);
    const status = message.includes("Missing required GHL env var") || message.includes("GHL API request failed") ? 503 : 400;

    return NextResponse.json({ error: message }, { status });
  }
}
