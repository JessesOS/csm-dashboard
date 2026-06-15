import { NextResponse } from "next/server";
import {
  getPortalOnboardingFormSubmission,
  getPortalWorkspace,
  routeErrorMessage,
  savePortalOnboardingFormSubmission,
} from "../../../../../lib/taskStore";

export const dynamic = "force-dynamic";

type PortalRouteContext = {
  params: Promise<{ token: string }>;
};

export async function GET(_request: Request, context: PortalRouteContext) {
  try {
    const { token } = await context.params;
    const [{ formDefinition }, submission] = await Promise.all([
      getPortalWorkspace(token),
      getPortalOnboardingFormSubmission(token),
    ]);
    return NextResponse.json({
      form: formDefinition,
      submission,
    });
  } catch (error) {
    return NextResponse.json({ error: routeErrorMessage(error) }, { status: 404 });
  }
}

export async function POST(request: Request, context: PortalRouteContext) {
  try {
    const { token } = await context.params;
    const payload = await request.json();
    const submission = await savePortalOnboardingFormSubmission(token, payload?.responses);
    return NextResponse.json({ submission });
  } catch (error) {
    return NextResponse.json({ error: routeErrorMessage(error) }, { status: 400 });
  }
}
