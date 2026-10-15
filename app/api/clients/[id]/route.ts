import { NextResponse } from "next/server";
import { deleteClient, routeErrorMessage, setClientJourneyLink } from "../../../../lib/taskStore";

export const dynamic = "force-dynamic";

// Currently only sets the BSS customer-journey link: { journeyClientId }.
export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const payload = (await request.json()) as { journeyClientId?: unknown };

    if (typeof payload.journeyClientId !== "string") {
      return NextResponse.json({ error: "journeyClientId is required." }, { status: 400 });
    }

    const client = await setClientJourneyLink(id, payload.journeyClientId);
    return NextResponse.json({ client });
  } catch (error) {
    return NextResponse.json({ error: routeErrorMessage(error) }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    const result = await deleteClient(id, searchParams.get("environment"), searchParams.get("product"));
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: routeErrorMessage(error) }, { status: 400 });
  }
}
