import { NextResponse } from "next/server";
import { specifiedGhlClientImport } from "../../../../lib/ghlImport";
import { normalizeProduct } from "../../../../lib/productWorkspaces";
import { createClient, routeErrorMessage } from "../../../../lib/taskStore";

export const dynamic = "force-dynamic";

const importEnvironment = "live";

export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => ({}));
    const selector = typeof payload.selector === "string" ? payload.selector.trim() : "";
    const importProduct = normalizeProduct(typeof payload.product === "string" ? payload.product : "respond");
    const ghlImport = await specifiedGhlClientImport(selector, importProduct);
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
