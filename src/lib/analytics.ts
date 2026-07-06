"use client";

import { track } from "@vercel/analytics";

type AnalyticsValue = string | number | boolean | null | undefined;

export type AnalyticsPayload = Record<string, AnalyticsValue>;

const conversionEvents = new Set([
  "lead_form_submit",
  "support_contact_click",
  "contact_channel_click",
  "project_source_click",
  "document_open",
  "document_download",
]);

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function sanitizePayload(payload: AnalyticsPayload) {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined),
  ) as Record<string, string | number | boolean | null>;
}

export function trackSiteEvent(eventName: string, payload: AnalyticsPayload = {}) {
  if (typeof window === "undefined") {
    return;
  }

  const isConversion = conversionEvents.has(eventName) || payload.conversion === true;
  const properties = sanitizePayload({
    ...payload,
    conversion: isConversion,
    event_category: isConversion ? "conversion" : "engagement",
  });

  track(eventName, properties);
  window.gtag?.("event", eventName, properties);
  window.dataLayer?.push({ event: eventName, ...properties });
}
