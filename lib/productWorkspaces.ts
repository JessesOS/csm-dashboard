import { bssClients } from "./bssClients";
import { bssCategories, bssSeedTasks, bssSourceDocument, bssTeamMembers } from "./bssTasks";
import { liveRespondClients, respondClients } from "./respondClients";
import { categories, seedTasks, sourceDocument, teamMembers } from "./respondTasks";
import { scaleClients } from "./scaleClients";
import { scaleCategoriesForVariant, scaleSourceDocument, scaleTasksForVariant, scaleTeamMembers } from "./scaleTasks";
import type { Category, EnvironmentKey, ProductKey, RespondClient, ScaleVariant, Task } from "./types";

export interface ProductWorkspace {
  key: ProductKey;
  label: string;
  clientLabel: string;
  shortLabel: string;
  description: string;
  brandMark: string;
  defaultClientId: string;
  ownerFallback: string;
  currentTaskFallback: string;
  nextStepFallback: string;
  taskTemplateLabel: string;
}

export interface OperatingEnvironment {
  key: EnvironmentKey;
  label: string;
  shortLabel: string;
  description: string;
  statusLabel: string;
}

export const operatingEnvironments: OperatingEnvironment[] = [
  {
    key: "demo",
    label: "Demo",
    shortLabel: "Demo",
    description: "Seeded training data, walkthrough clients, and safe UI experiments.",
    statusLabel: "Demo environment",
  },
  {
    key: "live",
    label: "Live",
    shortLabel: "Live",
    description: "Clean real-client workspace with the same Respond and Scale flows.",
    statusLabel: "Live workspace",
  },
];

export const productWorkspaces: ProductWorkspace[] = [
  {
    key: "respond",
    label: "Respond",
    clientLabel: "Respond clients",
    shortLabel: "Respond",
    description: "Voice AI onboarding, delivery, and support workflows.",
    brandMark: "R",
    defaultClientId: respondClients[0]?.id ?? "northlane-health",
    ownerFallback: "Response CSM",
    currentTaskFallback: "Fresh Respond onboarding template",
    nextStepFallback: "Start Respond onboarding checklist",
    taskTemplateLabel: "Respond checklist",
  },
  {
    key: "scale",
    label: "Scale",
    clientLabel: "Scale clients",
    shortLabel: "Scale",
    description: "Paid media, funnel, AI bot, and go-live operations.",
    brandMark: "S",
    defaultClientId: scaleClients[0]?.id ?? "scale-northlane-health",
    ownerFallback: "Scale CSM",
    currentTaskFallback: "Fresh Scale implementation template",
    nextStepFallback: "Start Scale operational checklist",
    taskTemplateLabel: "Scale checklist",
  },
  {
    key: "bss",
    label: "BSS Fin Creighton",
    clientLabel: "BSS Fin Creighton",
    shortLabel: "BSS",
    description: "Custom CRM, website, and AI lead agent delivery for Bitcoin Success School.",
    brandMark: "B",
    defaultClientId: bssClients[0]?.id ?? "bss-fin-creighton-demo",
    ownerFallback: "Jesse Allan",
    currentTaskFallback: "Fresh BSS delivery template",
    nextStepFallback: "Start BSS onboarding",
    taskTemplateLabel: "BSS checklist",
  },
];

export const defaultProduct: ProductKey = "respond";
export const defaultEnvironment: EnvironmentKey = "demo";
export const defaultScaleVariant: ScaleVariant = "meta_google";

export function normalizeScaleVariant(value: string | null | undefined): ScaleVariant {
  return value === "meta" || value === "google" ? value : "meta_google";
}

export function normalizeProduct(value: string | null | undefined): ProductKey {
  if (value === "scale") return "scale";
  if (value === "bss") return "bss";
  return "respond";
}

export function normalizeEnvironment(value: string | null | undefined): EnvironmentKey {
  return value === "live" ? "live" : "demo";
}

export function productConfig(product: ProductKey) {
  return productWorkspaces.find((workspace) => workspace.key === product) ?? productWorkspaces[0];
}

export function environmentConfig(environment: EnvironmentKey) {
  return operatingEnvironments.find((workspace) => workspace.key === environment) ?? operatingEnvironments[0];
}

export function productCategories(product: ProductKey, scaleVariant: ScaleVariant = defaultScaleVariant): Category[] {
  if (product === "scale") return scaleCategoriesForVariant(scaleVariant);
  if (product === "bss") return bssCategories;
  return categories;
}

export function productTeamMembers(product: ProductKey): string[] {
  if (product === "scale") return scaleTeamMembers;
  if (product === "bss") return bssTeamMembers;
  return teamMembers;
}

export function productTasks(product: ProductKey, scaleVariant: ScaleVariant = defaultScaleVariant): Task[] {
  if (product === "scale") return scaleTasksForVariant(scaleVariant);
  if (product === "bss") return bssSeedTasks;
  return seedTasks;
}

export function productClients(product: ProductKey): RespondClient[] {
  if (product === "scale") return scaleClients;
  if (product === "bss") return bssClients;
  return respondClients;
}

export function environmentProductClients(environment: EnvironmentKey, product: ProductKey): RespondClient[] {
  if (environment === "demo") {
    return productClients(product);
  }

  return product === "respond" ? liveRespondClients : [];
}

export function productSourceDocument(product: ProductKey) {
  if (product === "scale") return scaleSourceDocument;
  if (product === "bss") return bssSourceDocument;
  return sourceDocument;
}

export const allSeedClients: RespondClient[] = [...respondClients, ...scaleClients, ...bssClients, ...liveRespondClients];
