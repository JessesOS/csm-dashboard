import type { PortalFormResponses, PortalFormValue } from "./types";

export type PortalFormFieldType =
  | "text"
  | "email"
  | "url"
  | "tel"
  | "textarea"
  | "select"
  | "radio"
  | "checkboxes"
  | "checkbox";

export interface PortalFormOption {
  label: string;
  value: string;
  description?: string;
}

export interface PortalFormField {
  id: string;
  label: string;
  type: PortalFormFieldType;
  required?: boolean;
  helper?: string;
  placeholder?: string;
  options?: PortalFormOption[];
}

export interface PortalFormSection {
  id: string;
  title: string;
  description?: string;
  fields: PortalFormField[];
}

export const onboardingFormId = "client-onboarding-intake-v1";

export const onboardingFormTitle = "Client onboarding intake";

export const onboardingFormSections: PortalFormSection[] = [
  {
    id: "business-basics",
    title: "Business basics",
    description: "The core details we need to set up the account cleanly.",
    fields: [
      { id: "website_url", label: "Website URL", type: "url", required: true, placeholder: "https://example.com" },
      { id: "email_address", label: "Primary email address", type: "email", required: true, placeholder: "name@example.com" },
      { id: "legal_business_name", label: "Legal Business Name / Trading Name", type: "text", required: true },
      { id: "business_registration", label: "Australian Company Number (ACN) or EIN", type: "text", helper: "Type N/A if the business does not have either." },
      {
        id: "business_type",
        label: "Business Type",
        type: "select",
        options: [
          { label: "Company", value: "company" },
          { label: "Sole trader", value: "sole-trader" },
          { label: "Partnership", value: "partnership" },
          { label: "Trust", value: "trust" },
          { label: "Nonprofit", value: "nonprofit" },
          { label: "Other", value: "other" },
        ],
      },
      { id: "business_phone", label: "Business Phone Number", type: "tel" },
    ],
  },
  {
    id: "business-address",
    title: "Business address",
    fields: [
      { id: "street_address", label: "Business Street Address", type: "text" },
      { id: "city", label: "Business City", type: "text" },
      { id: "state_region", label: "Business State / Province / Region", type: "text" },
      { id: "country", label: "Business Country", type: "text" },
      { id: "post_code", label: "Business Post Code / Zip Code", type: "text" },
    ],
  },
  {
    id: "ideal-customer",
    title: "Ideal customer profile",
    description: "This helps us shape the assistant, ads, follow-up, and conversion strategy.",
    fields: [
      { id: "ideal_customer_profile", label: "Who is your Ideal Customer Profile (ICP)?", type: "textarea", required: true },
      { id: "age_range", label: "What is their age range?", type: "text" },
      {
        id: "gender",
        label: "What is their gender?",
        type: "select",
        options: [
          { label: "All genders", value: "all" },
          { label: "Primarily female", value: "primarily-female" },
          { label: "Primarily male", value: "primarily-male" },
          { label: "Mixed / varies", value: "mixed" },
          { label: "Other / not applicable", value: "other" },
        ],
      },
      { id: "income_level", label: "What is their income level?", type: "text" },
      { id: "customer_pain_points", label: "What pain points are you trying to solve?", type: "textarea" },
      { id: "why_choose_business", label: "Why should a customer choose your business over a competitor?", type: "textarea" },
    ],
  },
  {
    id: "ai-assistant",
    title: "AI assistant setup",
    fields: [
      { id: "common_objections", label: "What common objections may users have when engaging with the AI assistant?", type: "textarea" },
      { id: "assistant_name", label: "What name would you like your AI assistant to be called?", type: "text" },
      {
        id: "assistant_tone",
        label: "Choose up to 3 words that best describe the assistant tone",
        type: "checkboxes",
        helper: "Pick the three that best fit your brand.",
        options: [
          { label: "Friendly", value: "friendly" },
          { label: "Professional", value: "professional" },
          { label: "Warm", value: "warm" },
          { label: "Direct", value: "direct" },
          { label: "Premium", value: "premium" },
          { label: "Helpful", value: "helpful" },
          { label: "Playful", value: "playful" },
          { label: "Calm", value: "calm" },
        ],
      },
      { id: "assistant_email", label: "What email address will the AI assistant use?", type: "email" },
      { id: "prohibited_words", label: "What prohibited words should your AI assistant NEVER use?", type: "textarea" },
      {
        id: "bot_disclosure",
        label: "Should AI disclose being a bot when asked by a lead?",
        type: "radio",
        options: [
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
          { label: "Use recommended wording", value: "recommended" },
        ],
      },
    ],
  },
  {
    id: "booking-callbacks",
    title: "Call booking and callback preferences",
    fields: [
      {
        id: "booking_handling",
        label: "How would you like your AI system to handle call bookings?",
        type: "radio",
        options: [
          {
            label: "No booking - just collect info",
            value: "collect-info",
            description: "AI gathers lead details and lets the customer know someone from the team will reach out manually.",
          },
          { label: "Book calls directly", value: "book-directly" },
          { label: "Offer callback request only", value: "callback-request" },
          { label: "Not sure yet", value: "not-sure" },
        ],
      },
      { id: "callback_windows", label: "What are your preferred callback time windows?", type: "textarea", placeholder: "Example: Weekdays 9am-5pm AEST" },
      {
        id: "call_method",
        label: "How would you like to take calls booked by your AI?",
        type: "radio",
        options: [
          { label: "Phone", value: "phone" },
          { label: "Google Meet / Zoom", value: "video" },
          { label: "In person", value: "in-person" },
          { label: "Other", value: "other" },
        ],
      },
    ],
  },
  {
    id: "follow-up",
    title: "Lead nurture and follow-up",
    fields: [
      {
        id: "non_responsive_nurture",
        label: "How would you like your AI to nurture non-responsive leads?",
        type: "select",
        helper: "Switched off by default unless enabled.",
        options: [
          { label: "Off by default", value: "off" },
          { label: "Gentle 3-touch cadence", value: "gentle-3" },
          { label: "Standard 5-touch cadence", value: "standard-5" },
          { label: "Custom cadence", value: "custom" },
        ],
      },
      {
        id: "cold_conversation_follow_up",
        label: "How would you like your AI to follow up when a conversation goes cold?",
        type: "select",
        helper: "Switched off by default unless enabled.",
        options: [
          { label: "Off by default", value: "off" },
          { label: "Gentle 3-touch cadence", value: "gentle-3" },
          { label: "Standard 5-touch cadence", value: "standard-5" },
          { label: "Custom cadence", value: "custom" },
        ],
      },
    ],
  },
  {
    id: "phone-setup",
    title: "AI answering service number setup",
    fields: [
      { id: "phone_number_city", label: "Which city should your new phone number appear to be from?", type: "text" },
      { id: "existing_database_size", label: "Do you have an existing lead database? If yes, how many?", type: "text" },
      {
        id: "answering_number_setup",
        label: "How would you like to set up your AI Answering Service number?",
        type: "radio",
        options: [
          {
            label: "Forward current number to the new AI-powered number",
            value: "forward-current-number",
            description: "SMS will not be forwarded.",
          },
          { label: "Use the new AI-powered number directly", value: "use-new-number" },
          { label: "Not sure yet", value: "not-sure" },
        ],
      },
    ],
  },
  {
    id: "lead-sources-access",
    title: "Lead sources and access",
    fields: [
      {
        id: "lead_sources",
        label: "Where do your leads come from? Check all that apply.",
        type: "checkboxes",
        options: [
          { label: "Website", value: "website" },
          { label: "Google Ads", value: "google-ads" },
          { label: "Meta Ads", value: "meta-ads" },
          { label: "Facebook Business Page", value: "facebook-business-page" },
          { label: "Instagram Business Page", value: "instagram-business-page" },
          { label: "Other", value: "other" },
        ],
      },
      { id: "crm_team_access", label: "Provide usernames and emails for team members you would like connected to the CRM", type: "textarea" },
      {
        id: "domain_provider_access",
        label: "Domain provider access",
        type: "textarea",
        helper: "Share the provider URL and username. For passwords, use your approved secure handoff method or paste a secure one-time link.",
        placeholder: "Example: GoDaddy URL, username, secure handoff link",
      },
      {
        id: "dns_records_access",
        label: "DNS records access",
        type: "textarea",
        helper: "Share the DNS provider URL and username. For passwords, use your approved secure handoff method or paste a secure one-time link.",
        placeholder: "Example: Cloudflare URL, username, secure handoff link",
      },
      {
        id: "website_cms_access",
        label: "Website content management access",
        type: "textarea",
        helper: "Share the CMS URL and username. For passwords, use your approved secure handoff method or paste a secure one-time link.",
        placeholder: "Example: WordPress URL, username, secure handoff link",
      },
    ],
  },
  {
    id: "google-access",
    title: "Google access",
    fields: [
      { id: "google_ads_account_number", label: "Google Ads account 10-digit account number", type: "text", helper: "This number is displayed at the top of the Google Ads account." },
      {
        id: "gbp_manager_access",
        label: "Google Business Profile manager access",
        type: "radio",
        helper: "Add the nominated agency email as a Manager of the profile.",
        options: [
          { label: "Done", value: "done" },
          { label: "Need help", value: "need-help" },
          { label: "Not applicable", value: "not-applicable" },
        ],
      },
      {
        id: "analytics_admin_access",
        label: "Google Analytics account-level admin access",
        type: "radio",
        options: [
          { label: "Done", value: "done" },
          { label: "Need help", value: "need-help" },
          { label: "No Google Analytics account", value: "no-account" },
        ],
      },
      {
        id: "tag_manager_access",
        label: "Google Tag Manager administrator access",
        type: "radio",
        options: [
          { label: "Done", value: "done" },
          { label: "Need help", value: "need-help" },
          { label: "No Google Tag Manager account", value: "no-account" },
        ],
      },
    ],
  },
  {
    id: "strategy-assets-terms",
    title: "Strategy, assets and terms",
    fields: [
      { id: "campaign_focus_services", label: "Are there certain services or aspects of your business you want to focus on for these ad campaigns?", type: "textarea" },
      { id: "customer_frustration", label: "What problem frustrates your customers so much that they would actively seek out a solution online?", type: "textarea" },
      { id: "signature_process", label: "Do you have a signature process, framework, or approach that could be packaged into a guide?", type: "textarea" },
      { id: "brand_assets_link", label: "Shared folder link for high-resolution logos and brand images", type: "url", placeholder: "Google Drive, Dropbox, or shared folder link" },
      { id: "terms_document_link", label: "Terms & Conditions document link", type: "url" },
      { id: "terms_acceptance", label: "I accept the Terms & Conditions", type: "checkbox", required: true },
    ],
  },
];

const fields = onboardingFormSections.flatMap((section) => section.fields);
const fieldLookup = new Map(fields.map((field) => [field.id, field]));
const maxLengths: Partial<Record<PortalFormFieldType, number>> = {
  text: 220,
  email: 180,
  url: 420,
  tel: 60,
  textarea: 2500,
  select: 120,
  radio: 120,
  checkbox: 40,
};

function cleanTextValue(value: unknown, fieldType: PortalFormFieldType) {
  if (typeof value !== "string") {
    return "";
  }

  const maxLength = maxLengths[fieldType] ?? 180;
  return value.replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function cleanTextareaValue(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return value.replace(/\r\n/g, "\n").trim().slice(0, maxLengths.textarea);
}

function optionValues(field: PortalFormField) {
  return new Set((field.options ?? []).map((option) => option.value));
}

function sanitizeFieldValue(field: PortalFormField, value: unknown): PortalFormValue {
  if (field.type === "checkboxes") {
    const allowed = optionValues(field);
    return Array.isArray(value)
      ? value
          .filter((item): item is string => typeof item === "string")
          .map((item) => item.trim())
          .filter((item) => allowed.has(item))
          .slice(0, field.id === "assistant_tone" ? 3 : 12)
      : [];
  }

  if (field.type === "checkbox") {
    return value === "accepted" || value === true ? "accepted" : "";
  }

  if (field.type === "textarea") {
    return cleanTextareaValue(value);
  }

  if (field.type === "radio" || field.type === "select") {
    const clean = cleanTextValue(value, field.type);
    return optionValues(field).has(clean) ? clean : "";
  }

  return cleanTextValue(value, field.type);
}

export function emptyOnboardingFormResponses(): PortalFormResponses {
  return Object.fromEntries(fields.map((field) => [field.id, field.type === "checkboxes" ? [] : ""]));
}

export function sanitizeOnboardingFormResponses(input: unknown): PortalFormResponses {
  const source = input && typeof input === "object" ? (input as Record<string, unknown>) : {};
  const responses = emptyOnboardingFormResponses();

  fieldLookup.forEach((field, fieldId) => {
    responses[fieldId] = sanitizeFieldValue(field, source[fieldId]);
  });

  return responses;
}

export function onboardingFormMissingRequired(responses: PortalFormResponses) {
  return fields
    .filter((field) => field.required)
    .filter((field) => {
      const value = responses[field.id];
      return Array.isArray(value) ? value.length === 0 : !value;
    })
    .map((field) => field.label);
}

export function isOnboardingFormTaskTitle(value: string | null | undefined) {
  return (value ?? "").toLowerCase().includes("onboarding form");
}
