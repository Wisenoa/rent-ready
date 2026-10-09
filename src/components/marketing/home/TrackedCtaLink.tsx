"use client";

import React from "react";
import Link, { LinkProps } from "next/link";
import { HomepageEvent, trackHomepageEvent } from "@/lib/analytics/homepage-tracker";

interface TrackedCtaLinkProps extends LinkProps {
  event: HomepageEvent;
  children: React.ReactNode;
  className?: string;
  id?: string;
  "aria-label"?: string;
}

export function TrackedCtaLink({
  event,
  children,
  className,
  onClick,
  ...props
}: TrackedCtaLinkProps) {
  return (
    <Link
      {...props}
      className={className}
      onClick={(e) => {
        trackHomepageEvent(event);
        if (onClick) onClick(e);
      }}
    >
      {children}
    </Link>
  );
}
