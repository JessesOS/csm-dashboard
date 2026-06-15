"use client";

import { useMemo, useState, type FormEvent } from "react";
import {
  emptyOnboardingFormResponses,
  type PortalFormDefinition,
  type PortalFormField,
} from "../../../lib/onboardingForm";
import type { PortalFormResponses, PortalFormSubmission, PortalFormValue } from "../../../lib/types";

function mergeResponses(form: PortalFormDefinition, submission: PortalFormSubmission | null | undefined) {
  return {
    ...emptyOnboardingFormResponses(form),
    ...(submission?.responses ?? {}),
  };
}

function textValue(value: PortalFormValue | undefined) {
  return Array.isArray(value) ? "" : value ?? "";
}

function arrayValue(value: PortalFormValue | undefined) {
  return Array.isArray(value) ? value : [];
}

function fieldInputType(field: PortalFormField) {
  if (field.type === "email" || field.type === "url" || field.type === "tel") {
    return field.type;
  }

  return "text";
}

function submittedLabel(value: string | undefined) {
  if (!value) {
    return "Not submitted";
  }

  return new Date(value).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function PortalOnboardingForm({
  token,
  form,
  initialSubmission,
}: {
  token: string;
  form: PortalFormDefinition;
  initialSubmission: PortalFormSubmission | null;
}) {
  const [isOpen, setIsOpen] = useState(!initialSubmission);
  const [responses, setResponses] = useState<PortalFormResponses>(() => mergeResponses(form, initialSubmission));
  const [submission, setSubmission] = useState<PortalFormSubmission | null>(initialSubmission);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const completedFields = useMemo(() => {
    return Object.values(responses).filter((value) => (Array.isArray(value) ? value.length > 0 : Boolean(value))).length;
  }, [responses]);
  const totalFields = useMemo(() => form.sections.reduce((count, section) => count + section.fields.length, 0), [form.sections]);

  function updateField(field: PortalFormField, value: string) {
    setResponses((current) => ({ ...current, [field.id]: value }));
  }

  function toggleCheckboxValue(field: PortalFormField, value: string) {
    setResponses((current) => {
      const currentValues = arrayValue(current[field.id]);
      const nextValues = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : field.id === "assistant_tone" && currentValues.length >= 3
          ? currentValues
          : [...currentValues, value];

      return { ...current, [field.id]: nextValues };
    });
  }

  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSaving(true);

    try {
      const response = await fetch(`/api/portal/${token}/onboarding-form`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ responses }),
      });
      const payload = (await response.json()) as { submission?: PortalFormSubmission; error?: string };

      if (!response.ok || !payload.submission) {
        throw new Error(payload.error || "We could not save the onboarding form.");
      }

      setSubmission(payload.submission);
      setResponses(mergeResponses(form, payload.submission));
      setIsOpen(false);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "We could not save the onboarding form.");
    } finally {
      setIsSaving(false);
    }
  }

  function renderField(field: PortalFormField) {
    const id = `portal-onboarding-${field.id}`;
    const value = responses[field.id];

    if (field.type === "textarea") {
      return (
        <textarea
          id={id}
          aria-label={field.label}
          value={textValue(value)}
          placeholder={field.placeholder}
          required={field.required}
          rows={4}
          onChange={(event) => updateField(field, event.target.value)}
        />
      );
    }

    if (field.type === "select") {
      return (
        <select
          id={id}
          aria-label={field.label}
          value={textValue(value)}
          required={field.required}
          onChange={(event) => updateField(field, event.target.value)}
        >
          <option value="">Select one</option>
          {(field.options ?? []).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    if (field.type === "radio") {
      return (
        <div className="portal-form-options">
          {(field.options ?? []).map((option) => (
            <label key={option.value} className="portal-form-option">
              <input
                type="radio"
                name={field.id}
                value={option.value}
                checked={textValue(value) === option.value}
                required={field.required}
                onChange={(event) => updateField(field, event.target.value)}
              />
              <span>
                <strong>{option.label}</strong>
                {option.description ? <small>{option.description}</small> : null}
              </span>
            </label>
          ))}
        </div>
      );
    }

    if (field.type === "checkboxes") {
      const currentValues = arrayValue(value);
      return (
        <div className="portal-form-options portal-form-options-grid">
          {(field.options ?? []).map((option) => (
            <label key={option.value} className="portal-form-option">
              <input
                type="checkbox"
                value={option.value}
                checked={currentValues.includes(option.value)}
                onChange={() => toggleCheckboxValue(field, option.value)}
              />
              <span>
                <strong>{option.label}</strong>
                {option.description ? <small>{option.description}</small> : null}
              </span>
            </label>
          ))}
        </div>
      );
    }

    if (field.type === "checkbox") {
      return (
        <label className="portal-form-option portal-form-acceptance">
          <input
            id={id}
            type="checkbox"
            checked={textValue(value) === "accepted"}
            required={field.required}
            onChange={(event) => updateField(field, event.target.checked ? "accepted" : "")}
          />
          <span>
            <strong>{field.label}</strong>
          </span>
        </label>
      );
    }

    return (
      <input
        id={id}
        aria-label={field.label}
        type={fieldInputType(field)}
        value={textValue(value)}
        placeholder={field.placeholder}
        required={field.required}
        onChange={(event) => updateField(field, event.target.value)}
      />
    );
  }

  return (
    <section className="portal-native-form">
      <button
        className="portal-native-form-toggle"
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span className="portal-native-form-chevron" aria-hidden="true" />
        <span>
          <strong>{form.title}</strong>
          <small>{submission ? `Submitted ${submittedLabel(submission.submittedAt)}. You can update it if anything has changed.` : "Open the guided form and submit it here in the portal."}</small>
        </span>
        <em>{submission ? "Submitted" : `${completedFields}/${totalFields}`}</em>
      </button>

      {isOpen ? (
        <form className="portal-native-form-body" onSubmit={submitForm}>
          <div className="portal-native-form-intro">
            <strong>{form.introTitle}</strong>
            <span>{form.introDescription}</span>
          </div>

          {form.sections.map((section) => (
            <fieldset key={section.id} className="portal-form-section">
              <legend>
                <strong>{section.title}</strong>
                {section.description ? <span>{section.description}</span> : null}
              </legend>

              <div className="portal-form-field-grid">
                {section.fields.map((field) => (
                  <div key={field.id} className={`portal-form-field portal-form-field-${field.type}`}>
                    {field.type !== "checkbox" ? (
                      <span className="portal-form-label">
                        {field.label}
                        {field.required ? <em>Required</em> : null}
                      </span>
                    ) : null}
                    {renderField(field)}
                    {field.helper ? <small>{field.helper}</small> : null}
                  </div>
                ))}
              </div>
            </fieldset>
          ))}

          {error ? <p className="portal-form-error">{error}</p> : null}

          <div className="portal-form-submit-row">
            <span>{submission ? "Saving again will update the existing response." : "Submitting moves this step to review for your CSM team."}</span>
            <button className="portal-primary-action" type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : submission ? "Update response" : "Submit onboarding form"}
            </button>
          </div>
        </form>
      ) : null}
    </section>
  );
}
