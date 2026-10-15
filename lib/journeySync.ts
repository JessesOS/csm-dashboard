import { env } from "cloudflare:workers";
import type { TaskStatus } from "./types";

// Two-way sync between the CSM dashboard and the customer-journey portal
// (customerjourney-app, worker scale-onboarding-portal) for BSS clients.
//
// Ownership: the team's tasks are worked here and pushed to the portal; Fin's
// client tasks (bssClientTaskIds) are completed in the portal and pushed back
// to POST /api/journey-sync. Either side's change flows across; updates that
// arrive FROM the portal carry actor "portal" and are never pushed back, so
// nothing echoes. Both workers share the JOURNEY_SYNC_TOKEN secret.

const DEFAULT_JOURNEY_SYNC_URL = "https://scale-onboarding-portal.jesse-b4e.workers.dev";
const PUSH_TIMEOUT_MS = 5000;

export const JOURNEY_SYNC_ACTOR = "portal";

function readRuntimeEnv(key: string) {
  const workerValue = (env as Record<string, unknown>)[key];

  if (typeof workerValue === "string" && workerValue.trim()) {
    return workerValue.trim();
  }

  if (typeof process !== "undefined") {
    const processValue = process.env[key];
    return processValue?.trim() || undefined;
  }

  return undefined;
}

export function journeySyncConfigured() {
  return Boolean(readRuntimeEnv("JOURNEY_SYNC_TOKEN"));
}

export function isJourneySyncAuthorized(request: Request) {
  const expected = readRuntimeEnv("JOURNEY_SYNC_TOKEN");

  if (!expected) {
    return false;
  }

  const provided =
    request.headers.get("x-journey-sync-token") ?? request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  return Boolean(provided && provided === expected);
}

export interface JourneyPushResult {
  ok: boolean;
  skipped?: string;
  error?: string;
}

/** Push one task's status to the portal. Never throws — a portal outage must not break the CSM board. */
export async function pushTaskStatusToJourney(input: {
  journeyClientId: string;
  milestoneId: string;
  status: TaskStatus;
}): Promise<JourneyPushResult> {
  const token = readRuntimeEnv("JOURNEY_SYNC_TOKEN");

  if (!token) {
    return { ok: false, skipped: "JOURNEY_SYNC_TOKEN not configured" };
  }

  const baseUrl = (readRuntimeEnv("JOURNEY_SYNC_URL") ?? DEFAULT_JOURNEY_SYNC_URL).replace(/\/+$/, "");

  try {
    const response = await fetch(`${baseUrl}/api/csm-sync/milestone`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-journey-sync-token": token },
      body: JSON.stringify({
        journeyClientId: input.journeyClientId,
        milestoneId: input.milestoneId,
        status: input.status,
        done: input.status === "complete",
      }),
      signal: AbortSignal.timeout(PUSH_TIMEOUT_MS),
    });

    if (!response.ok) {
      return { ok: false, error: `Portal responded ${response.status}: ${(await response.text()).slice(0, 300)}` };
    }

    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Portal push failed" };
  }
}
