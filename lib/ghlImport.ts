import { env } from "cloudflare:workers";
import type { ClientCreatePayload } from "./types";

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
  stageName?: string;
  contactName?: string;
  companyName?: string;
  assignedTo?: string;
  source?: string;
  tags: string[];
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

const DEFAULT_GHL_API_BASE_URL = "https://services.leadconnectorhq.com";
const DEFAULT_GHL_API_VERSION = "2021-07-28";
const ACTIVE_CLIENT_PIPELINE = "active clients";

export async function specifiedGhlRespondClientImport(selectorInput: string): Promise<GhlClientImport> {
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
      product: "respond",
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

  return {
    id: readString(opportunity, ["id"]) ?? `ghl-opportunity-${index}`,
    contactId: readString(opportunity, ["contactId"]),
    name: readString(opportunity, ["name"]) ?? "Untitled GHL client",
    status: (readString(opportunity, ["status"]) ?? "open").toLowerCase(),
    stageName: stage?.stageName,
    contactName: readPathString(opportunity, ["contact.name", "contact.fullName", "contact.contactName"]),
    companyName: readPathString(opportunity, ["contact.companyName", "contact.businessName", "contact.company", "companyName", "businessName"]),
    assignedTo: readString(opportunity, ["assignedTo"]),
    source: readString(opportunity, ["source"]),
    tags: readPathStringArray(opportunity, ["contact.tags", "tags"]),
    updatedAt: readString(opportunity, ["updatedAt", "lastStatusChangeAt", "createdAt"]),
  };
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
