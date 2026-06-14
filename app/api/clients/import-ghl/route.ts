import { NextResponse } from "next/server";
import { specifiedGhlRespondClientImport } from "../../../../lib/ghlImport";
import { createClient, listClients, listTasks, routeErrorMessage } from "../../../../lib/taskStore";

export const dynamic = "force-dynamic";

const importEnvironment = "live";
const importProduct = "respond";

export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => ({}));
    const selector = typeof payload.selector === "string" ? payload.selector.trim() : "";
    const ghlImport = await specifiedGhlRespondClientImport(selector);
    const existingClients = await listClients(importEnvironment, importProduct);
    const existingClient = existingClients.find((client) => normalizeName(client.name) === normalizeName(ghlImport.payload.name ?? ""));

    if (existingClient) {
      return NextResponse.json({
        client: existingClient,
        tasks: await listTasks(importEnvironment, importProduct, existingClient.id),
        imported: false,
        source: "ghl",
        preview: ghlImport.preview,
      });
    }

    const result = await createClient({
      ...ghlImport.payload,
      environment: importEnvironment,
      product: importProduct,
    });

    return NextResponse.json({
      ...result,
      imported: true,
      source: "ghl",
      preview: ghlImport.preview,
    }, { status: 201 });
  } catch (error) {
    const message = routeErrorMessage(error);
    const status = message.includes("Missing required GHL env var") || message.includes("GHL API request failed") ? 503 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

function normalizeName(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}
