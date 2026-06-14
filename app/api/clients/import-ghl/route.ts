import { NextResponse } from "next/server";
import { specifiedGhlRespondClientImport } from "../../../../lib/ghlImport";
import { createClient, routeErrorMessage } from "../../../../lib/taskStore";

export const dynamic = "force-dynamic";

const importEnvironment = "live";
const importProduct = "respond";

export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => ({}));
    const selector = typeof payload.selector === "string" ? payload.selector.trim() : "";
    const ghlImport = await specifiedGhlRespondClientImport(selector);
    const result = await createClient({
      ...ghlImport.payload,
      environment: importEnvironment,
      product: importProduct,
    });

    return NextResponse.json({
      ...result,
      imported: result.created,
      source: "ghl",
      preview: ghlImport.preview,
    }, { status: result.created ? 201 : 200 });
  } catch (error) {
    const message = routeErrorMessage(error);
    const status = message.includes("Missing required GHL env var") || message.includes("GHL API request failed") ? 503 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
