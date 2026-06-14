import { respondClients } from "./respondClients";
import { categories, seedTasks, sourceDocument, teamMembers } from "./respondTasks";
import { scaleClients } from "./scaleClients";
import { scaleCategories, scaleSourceDocument, scaleTasks, scaleTeamMembers } from "./scaleTasks";
import type { Category, ProductKey, RespondClient, Task } from "./types";

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
];

export const defaultProduct: ProductKey = "respond";

export function normalizeProduct(value: string | null | undefined): ProductKey {
  return value === "scale" ? "scale" : "respond";
}

export function productConfig(product: ProductKey) {
  return productWorkspaces.find((workspace) => workspace.key === product) ?? productWorkspaces[0];
}

export function productCategories(product: ProductKey): Category[] {
  return product === "scale" ? scaleCategories : categories;
}

export function productTeamMembers(product: ProductKey): string[] {
  return product === "scale" ? scaleTeamMembers : teamMembers;
}

export function productTasks(product: ProductKey): Task[] {
  return product === "scale" ? scaleTasks : seedTasks;
}

export function productClients(product: ProductKey): RespondClient[] {
  return product === "scale" ? scaleClients : respondClients;
}

export function productSourceDocument(product: ProductKey) {
  return product === "scale" ? scaleSourceDocument : sourceDocument;
}

export const allSeedClients: RespondClient[] = [...respondClients, ...scaleClients];
