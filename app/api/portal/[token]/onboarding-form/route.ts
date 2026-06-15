import { NextResponse } from "next/server";
import {
  getPortalOnboardingFormSubmission,
  routeErrorMessage,
  savePortalOnboardingFormSubmission,
} from "../../../../../lib/taskStore";
import { onboardingFormId, onboardingFormSections, onboardingFormTitle } from "../../../../../lib/onboardingForm";

export const dynamic = "force-dynamic";

type PortalRouteContext = {
  params: Promise<{ token: string }>;
};

export async function GET(_request: Request, context: PortalRouteContext) {
  try {
    const { token } = await context.params;
    const submission = await getPortalOnboardingFormSubmission(token);
    return NextResponse.json({
      form: {
        id: onboardingFormId,
        title: onboardingFormTitle,
        sections: onboardingFormSections,
      },
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
