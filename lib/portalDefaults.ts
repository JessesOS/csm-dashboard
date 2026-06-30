import type { Task } from "./types";

type PortalTaskInput = Pick<Task, "title" | "category">;

const clientFacingCategories = new Set([
  "Welcome Onboarding Call",
  "Phone & Voice AI Setup",
  "Internal Testing Phase",
  "Go-Live Call",
  "Post Go-Live Reporting & Support",
  "Welcome Onboarding Call",
  "Meta Ads Setup, Handoff & Partner Access",
  "Google Ads Strategy & Landing Page Funnel Creation",
  "AI Test Call & Final Checks (Day 14)",
  "Go Live Call (Day 30)",
  "Post Go-Live Check-ins, Reporting & Admin",
]);

const visibilityKeywords = [
  "onboarding form",
  "csv",
  "client database",
  "download",
  "permission",
  "go-live call",
  "testing call",
  "client satisfaction call",
  "client check-in",
  "phone number",
  "mobile number",
  "porting",
  "abn/acn",
  "google business profile",
  "leadconnector",
  "magic link",
  "demo",
  "admin access",
  "domain provider access",
  "website builder access",
  "google ads",
  "google analytics",
  "google my business",
  "meta business suite",
  "partner access",
  "approval",
  "calendar",
  "social media dms",
  "payment mechanism",
  "go live call",
  "ai test call",
];

const actionKeywords = [
  "submitted the onboarding form",
  "bookmark",
  "provide a csv",
  "phone number preferences",
  "download the leadconnector app",
  "permission to update",
  "testing call with the client",
  "go-live call with client",
  "provide admin access",
  "domain provider access",
  "website builder access",
  "approve",
  "connect their calendar",
  "prepare and upload a csv",
  "social media dms",
  "payment mechanism",
];

function lowerTitle(task: PortalTaskInput) {
  return task.title.toLowerCase();
}

export function shouldSuggestPortalVisible(task: PortalTaskInput) {
  const title = lowerTitle(task);
  const clientTouchpoint =
    clientFacingCategories.has(task.category) &&
    ["client", "call", "demo", "download", "permission", "phone", "csv", "abn/acn"].some((keyword) => title.includes(keyword));

  return clientTouchpoint || visibilityKeywords.some((keyword) => title.includes(keyword));
}

export function shouldSuggestPortalAction(task: PortalTaskInput) {
  const title = lowerTitle(task);
  return actionKeywords.some((keyword) => title.includes(keyword));
}

export function suggestedPortalTitle(task: PortalTaskInput) {
  const title = lowerTitle(task);

  if (title.includes("submitted the onboarding form")) {
    return "Complete your onboarding form";
  }

  if (title.includes("magic link")) {
    return "Bookmark your LaunchBay Magic Link";
  }

  if (title.includes("provide a csv")) {
    return "Upload your client database CSV";
  }

  if (title.includes("phone number preferences")) {
    return "Confirm your phone number preferences";
  }

  if (title.includes("testing call")) {
    return "Attend your AI Testing Call";
  }

  if (title.includes("download the leadconnector app")) {
    return "Download the LeadConnector App";
  }

  if (title.includes("permission to update")) {
    return "Approve phone number updates";
  }

  if (title.includes("go-live call")) {
    return "Attend your Go-Live Call";
  }

  if (title.includes("go live call")) {
    return "Attend your Go Live Call";
  }

  if (title.includes("ai test call")) {
    return "Attend your AI Test Call";
  }

  if (title.includes("domain provider access")) {
    return "Provide domain provider access";
  }

  if (title.includes("website builder access")) {
    return "Provide website builder access";
  }

  if (title.includes("google ads")) {
    return "Confirm Google Ads access";
  }

  if (title.includes("meta business suite") || title.includes("partner access")) {
    return "Confirm Meta partner access";
  }

  if (title.includes("calendar")) {
    return "Connect your calendar";
  }

  if (title.includes("present the")) {
    return "Review your onboarding walkthrough";
  }

  if (title.includes("demo the")) {
    return "Review your launch demo";
  }

  return task.title;
}

export function suggestedPortalNote(task: PortalTaskInput) {
  const title = lowerTitle(task);

  if (shouldSuggestPortalAction(task)) {
    return "Please complete this item or bring it to your next onboarding session.";
  }

  if (title.includes("call") || title.includes("demo") || title.includes("present")) {
    return "We will cover this together during the scheduled session.";
  }

  return "";
}

export function portalDefaultsForTask(task: PortalTaskInput) {
  const portalVisible = shouldSuggestPortalVisible(task);

  return {
    portalVisible,
    portalTitle: portalVisible ? suggestedPortalTitle(task) : "",
    portalNote: portalVisible ? suggestedPortalNote(task) : "",
    portalActionRequired: portalVisible && shouldSuggestPortalAction(task),
    portalConfigured: false,
  };
}
