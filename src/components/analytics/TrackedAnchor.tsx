"use client";

import type { AnchorHTMLAttributes, MouseEvent } from "react";
import { trackSiteEvent, type AnalyticsPayload } from "@/lib/analytics";

type TrackedAnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  eventName?: string;
  eventProperties?: AnalyticsPayload;
};

export function TrackedAnchor({
  children,
  eventName = "link_click",
  eventProperties,
  href,
  onClick,
  ...props
}: TrackedAnchorProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    trackSiteEvent(eventName, {
      href: typeof href === "string" ? href : undefined,
      ...eventProperties,
    });

    onClick?.(event);
  }

  return (
    <a {...props} href={href} onClick={handleClick}>
      {children}
    </a>
  );
}
