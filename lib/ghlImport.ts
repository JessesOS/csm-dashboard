import { env } from "cloudflare:workers";
import type { ClientCreatePayload, ProductKey } from "./types";

type GhlRecord = Record<string, unknown>;

type GhlConfig = {
  apiKey: string;
  locationId: string;
  baseUrl: string;
  apiVersion: string;
};

type GhlOpportunity = {
  id: string;
  contactId?: string;
  name: string;
  status: string;
  pipelineStageId?: string;
  stageName?: string;
  contactName?: string;
  companyName?: string;
  assignedTo?: string;
  source?: string;
  tags: string[];
  value: number;
  updatedAt?: string;
};

export type GhlClientImportPreview = {
  opportunityId: string;
  contactId?: string;
  opportunityName: string;
  stageName?: string;
  contactName?: string;
  companyName?: string;
  status: string;
};

type GhlClientImport = {
  payload: ClientCreatePayload;
  preview: GhlClientImportPreview;
};

export type GhlPipelineOpportunitySummary = {
  id: string;
  title: string;
  businessName?: string;
  source?: string;
  value: number;
  valueLabel: string;
  owner?: string;
  initials: string;
  updatedAt?: string;
};

export type GhlPipelineStageSummary = {
  id: string;
  name: string;
  tone: string;
  count: number;
  value: number;
  valueLabel: string;
  opportunities: GhlPipelineOpportunitySummary[];
};

export type GhlActiveClientPipeline = {
  id: string;
  name: string;
  syncedAt: string;
  stages: GhlPipelineStageSummary[];
};

const DEFAULT_GHL_API_BASE_URL = "https://services.leadconnectorhq.com";
const DEFAULT_GHL_API_VERSION = "2021-07-28";
const ACTIVE_CLIENT_PIPELINE = "active clients";
const currencyFormatter = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
});

export async function specifiedGhlClientImport(selectorInput: string, product: ProductKey): Promise<GhlClientImport> {
  const selector = selectorInput.trim();

  if (!selector) {
    throw new Error("Tell me the GHL client, contact, or opportunity name/ID to import.");
  }

  const [pipelinesResponse, opportunitiesResponse] = await loadActiveClientSources();
  const pipelines = getRecords(pipelinesResponse, "pipelines");
  const activePipeline = pipelines.find((pipeline) =>
    readString(pipeline, ["name"])?.toLowerCase().includes(ACTIVE_CLIENT_PIPELINE)
  );

  if (!activePipeline) {
    throw new Error("GHL Active Clients pipeline was not found.");
  }

  const stageLookup = buildStageLookup(pipelines);
  const activeOpportunities = getRecords(opportunitiesResponse, "opportunities")
    .map((opportunity, index) => normalizeOpportunity(opportunity, index, stageLookup))
    .filter((opportunity) => opportunity.status !== "lost")
    .sort((a, b) => compareDateDesc(a.updatedAt, b.updatedAt));
  const selectedOpportunity = findSpecifiedOpportunity(activeOpportunities, selector);

  if (!selectedOpportunity) {
    throw new Error(`No unique GHL Active Clients match was found for "${selector}".`);
  }

  const contact = selectedOpportunity.contactId ? await loadContact(selectedOpportunity.contactId) : null;
  const contactRecord = contact && isRecord(contact.contact) ? contact.contact : null;
  const contactName = contactRecord ? readContactName(contactRecord) : null;
  const companyName = contactRecord ? readCompanyName(contactRecord) : selectedOpportunity.companyName;
  const clientName = cleanImportText(contactName ?? selectedOpportunity.contactName ?? selectedOpportunity.name);
  const cleanCompanyName = cleanOptionalImportText(companyName ?? selectedOpportunity.companyName);
  const industry = cleanImportText(
    (contactRecord ? readString(contactRecord, ["source"]) : null) ??
      selectedOpportunity.source ??
      selectedOpportunity.tags[0] ??
      "GHL Active Client"
  );

  return {
    payload: {
      environment: "live",
      product,
      name: clientName,
      companyName: cleanCompanyName && normalizeLookup(cleanCompanyName) !== normalizeLookup(clientName) ? cleanCompanyName : undefined,
      industry,
      owner: "GHL import",
    },
    preview: {
      opportunityId: selectedOpportunity.id,
      contactId: selectedOpportunity.contactId,
      opportunityName: selectedOpportunity.name,
      stageName: selectedOpportunity.stageName,
      contactName: contactName ?? selectedOpportunity.contactName,
      companyName: cleanCompanyName,
      status: selectedOpportunity.status,
    },
  };
}

export async function loadActiveClientPipeline(): Promise<GhlActiveClientPipeline> {
  const [pipelinesResponse, opportunitiesResponse] = await loadActiveClientSources();
  const pipelines = getRecords(pipelinesResponse, "pipelines");
  const activePipeline = pipelines.find((pipeline) =>
    readString(pipeline, ["name"])?.toLowerCase().includes(ACTIVE_CLIENT_PIPELINE)
  );

  if (!activePipeline) {
    throw new Error("GHL Active Clients pipeline was not found.");
  }

  const pipelineId = readString(activePipeline, ["id"]) ?? "active-clients";
  const pipelineName = readString(activePipeline, ["name"]) ?? "Active Clients";
  const stageLookup = buildStageLookup(pipelines);
  const opportunities = getRecords(opportunitiesResponse, "opportunities")
    .map((opportunity, index) => normalizeOpportunity(opportunity, index, stageLookup))
    .sort((a, b) => compareDateDesc(a.updatedAt, b.updatedAt));
  const pipelineStages = getRecords(activePipeline, "stages")
    .map((stage, index) => {
      const id = readString(stage, ["id"]) ?? `stage-${index}`;
      return {
        id,
        name: readString(stage, ["name"]) ?? `Stage ${index + 1}`,
      };
    });
  const stageGroups = new Map<string, GhlPipelineStageSummary>();

  for (const [index, stage] of pipelineStages.entries()) {
    stageGroups.set(stage.id, emptyPipelineStage(stage.id, stage.name, index));
  }

  for (const opportunity of opportunities) {
    const stageId = opportunity.pipelineStageId ?? opportunity.stageName ?? "unassigned";
    const existingStage = stageGroups.get(stageId);
    const stage = existingStage ?? emptyPipelineStage(stageId, opportunity.stageName ?? "Unassigned", stageGroups.size);
    const summary = summarizeOpportunity(opportunity);

    stage.opportunities.push(summary);
    stage.count += 1;
    stage.value += opportunity.value;
    stage.valueLabel = currencyFormatter.format(stage.value);
    stageGroups.set(stageId, stage);
  }

  return {
    id: pipelineId,
    name: pipelineName,
    syncedAt: new Date().toISOString(),
    stages: Array.from(stageGroups.values()),
  };
}

function findSpecifiedOpportunity(opportunities: GhlOpportunity[], selector: string) {
  const normalizedSelector = normalizeLookup(selector);
  const exactMatches = opportunities.filter((opportunity) =>
    [opportunity.id, opportunity.contactId, opportunity.name, opportunity.contactName, opportunity.companyName]
      .filter((value): value is string => Boolean(value))
      .some((value) => normalizeLookup(value) === normalizedSelector)
  );

  if (exactMatches.length === 1) {
    return exactMatches[0];
  }

  if (exactMatches.length > 1) {
    return null;
  }

  const partialMatches = opportunities.filter((opportunity) =>
    [opportunity.name, opportunity.contactName, opportunity.companyName]
      .filter((value): value is string => Boolean(value))
      .some((value) => normalizeLookup(value).includes(normalizedSelector))
  );

  return partialMatches.length === 1 ? partialMatches[0] : null;
}

async function loadActiveClientSources() {
  const config = getGhlConfig();
  const pipelinesResponse = await ghlRequest("GET", "/opportunities/pipelines", {
    locationId: config.locationId,
  });
  const pipelines = getRecords(pipelinesResponse, "pipelines");
  const activePipeline = pipelines.find((pipeline) =>
    readString(pipeline, ["name"])?.toLowerCase().includes(ACTIVE_CLIENT_PIPELINE)
  );
  const pipelineId = activePipeline ? readString(activePipeline, ["id"]) : undefined;

  if (!pipelineId) {
    return [pipelinesResponse, { opportunities: [] }] as const;
  }

  const opportunitiesResponse = await ghlRequest("GET", "/opportunities/search", {
    location_id: config.locationId,
    pipeline_id: pipelineId,
    limit: 100,
  });

  return [pipelinesResponse, opportunitiesResponse] as const;
}

async function loadContact(contactId: string) {
  return ghlRequest("GET", `/contacts/${encodeURIComponent(contactId)}`);
}

async function ghlRequest(pathMethod: "GET", path: string, query?: Record<string, string | number | boolean | undefined>) {
  const config = getGhlConfig();
  const url = new URL(path, `${config.baseUrl}/`);

  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url, {
    method: pathMethod,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
      Version: config.apiVersion,
    },
  });
  const responseBody = await readResponseBody(response);

  if (!response.ok) {
    throw new Error(`GHL API request failed (${response.status}) for ${path}.`);
  }

  return responseBody;
}

function getGhlConfig(): GhlConfig {
  const apiKey = readRuntimeEnv("GHL_API_KEY");
  const locationId = readRuntimeEnv("GHL_LOCATION_ID");

  if (!apiKey || !locationId) {
    throw new Error("Missing required GHL env var(s): GHL_API_KEY, GHL_LOCATION_ID");
  }

  return {
    apiKey,
    locationId,
    baseUrl: (readRuntimeEnv("GHL_API_BASE_URL") ?? DEFAULT_GHL_API_BASE_URL).replace(/\/+$/, ""),
    apiVersion: readRuntimeEnv("GHL_API_VERSION") ?? DEFAULT_GHL_API_VERSION,
  };
}

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

async function readResponseBody(response: Response): Promise<unknown> {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

function normalizeOpportunity(
  opportunity: GhlRecord,
  index: number,
  stageLookup: Map<string, { stageName: string }>
): GhlOpportunity {
  const stageId = readString(opportunity, ["pipelineStageId", "pipelineStageUId"]);
  const stage = stageId ? stageLookup.get(stageId) : undefined;
  const value = readNumber(opportunity, ["monetaryValue", "value", "amount", "opportunityValue"]);

  return {
    id: readString(opportunity, ["id"]) ?? `ghl-opportunity-${index}`,
    contactId: readString(opportunity, ["contactId"]),
    name: readString(opportunity, ["name"]) ?? "Untitled GHL client",
    status: (readString(opportunity, ["status"]) ?? "open").toLowerCase(),
    pipelineStageId: stageId,
    stageName: stage?.stageName ?? readString(opportunity, ["stageName", "pipelineStageName"]),
    contactName: readPathString(opportunity, ["contact.name", "contact.fullName", "contact.contactName"]),
    companyName: readPathString(opportunity, ["contact.companyName", "contact.businessName", "contact.company", "companyName", "businessName"]),
    assignedTo: readString(opportunity, ["assignedTo"]),
    source: readString(opportunity, ["source"]),
    tags: readPathStringArray(opportunity, ["contact.tags", "tags"]),
    value: value ?? 0,
    updatedAt: readString(opportunity, ["updatedAt", "lastStatusChangeAt", "createdAt"]),
  };
}

function emptyPipelineStage(id: string, name: string, index: number): GhlPipelineStageSummary {
  return {
    id,
    name,
    tone: pipelineStageTone(name, index),
    count: 0,
    value: 0,
    valueLabel: currencyFormatter.format(0),
    opportunities: [],
  };
}

function summarizeOpportunity(opportunity: GhlOpportunity): GhlPipelineOpportunitySummary {
  const title = cleanImportText(opportunity.name);
  const businessName = cleanOptionalImportText(opportunity.companyName);
  const source = cleanOptionalImportText(opportunity.source ?? opportunity.tags[0]);

  return {
    id: opportunity.id,
    title,
    businessName,
    source,
    value: opportunity.value,
    valueLabel: currencyFormatter.format(opportunity.value),
    owner: cleanOptionalImportText(opportunity.assignedTo),
    initials: initialsFor(opportunity.contactName ?? title),
    updatedAt: opportunity.updatedAt,
  };
}

function pipelineStageTone(name: string, index: number) {
  const normalizedName = normalizeLookup(name);

  if (normalizedName.includes("urgent")) {
    return "urgent";
  }

  if (normalizedName.includes("onboarding")) {
    return "onboarding";
  }

  if (normalizedName.includes("building") || normalizedName.includes("build")) {
    return "building";
  }

  if (normalizedName.includes("recent")) {
    return "recent";
  }

  if (normalizedName.includes("live")) {
    return "live";
  }

  if (normalizedName.includes("paused")) {
    return "paused";
  }

  if (normalizedName.includes("exiting")) {
    return "exiting";
  }

  if (normalizedName.includes("cancel")) {
    return "cancelled";
  }

  return ["urgent", "onboarding", "building", "recent", "live", "paused", "exiting", "cancelled"][index % 8];
}

function buildStageLookup(pipelines: GhlRecord[]) {
  const stages = new Map<string, { stageName: string }>();

  for (const pipeline of pipelines) {
    for (const stage of getRecords(pipeline, "stages")) {
      const stageId = readString(stage, ["id"]);
      if (stageId) {
        stages.set(stageId, { stageName: readString(stage, ["name"]) ?? "Unknown stage" });
      }
    }
  }

  return stages;
}

function getRecords(source: unknown, key: string): GhlRecord[] {
  if (!isRecord(source)) {
    return [];
  }

  const direct = source[key];
  if (Array.isArray(direct)) {
    return direct.filter(isRecord);
  }

  return [];
}

function readString(record: GhlRecord, keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return undefined;
}

function readNumber(record: GhlRecord, keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === "string" && value.trim()) {
      const parsed = Number(value.replace(/[^0-9.-]+/g, ""));
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }

  return undefined;
}

function readPathString(record: GhlRecord, paths: string[]) {
  for (const path of paths) {
    const value = readPath(record, path);
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return undefined;
}

function readPathStringArray(record: GhlRecord, paths: string[]) {
  for (const path of paths) {
    const value = readPath(record, path);
    if (Array.isArray(value)) {
      return value.filter((item): item is string => typeof item === "string" && Boolean(item.trim())).map((item) => item.trim());
    }
  }

  return [];
}

function readPath(record: GhlRecord, path: string) {
  return path.split(".").reduce<unknown>((current, part) => {
    if (!isRecord(current)) {
      return undefined;
    }

    return current[part];
  }, record);
}

function readContactName(record: GhlRecord) {
  const firstName = readString(record, ["firstName", "first_name"]);
  const lastName = readString(record, ["lastName", "last_name"]);
  const joinedName = [firstName, lastName].filter(Boolean).join(" ").trim();

  return joinedName || readString(record, ["fullName", "contactName", "name"]);
}

function readCompanyName(record: GhlRecord) {
  return readString(record, ["companyName", "businessName", "company", "organization", "company_name"]);
}

function isRecord(value: unknown): value is GhlRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function cleanImportText(value: string) {
  return value.replace(/\s+/g, " ").trim().slice(0, 90) || "GHL Client";
}

function cleanOptionalImportText(value?: string | null) {
  const clean = value?.replace(/\s+/g, " ").trim().slice(0, 90);
  return clean || undefined;
}

function normalizeLookup(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function initialsFor(value: string) {
  const words = normalizeLookup(value).split(" ").filter(Boolean);
  const initials = words.slice(0, 2).map((word) => word[0]?.toUpperCase()).join("");
  return initials || "AC";
}

function compareDateDesc(left?: string, right?: string) {
  return dateValue(right) - dateValue(left);
}

function dateValue(value?: string) {
  if (!value) {
    return 0;
  }

  const time = Date.parse(value);
  return Number.isNaN(time) ? 0 : time;
}
