"use client";

import React from "react";
import { B3Navbar } from "./B3Navbar";
import { B3Hero } from "./B3Hero";
import { B3ProductMoments } from "./B3ProductMoments";
import { B3LegalTrust } from "./B3LegalTrust";
import { B3FreeTools } from "./B3FreeTools";
import { B3Pricing } from "./B3Pricing";
import { B3Faq } from "./B3Faq";
import { B3FinalCta } from "./B3FinalCta";
import { B3Footer } from "./B3Footer";
import { B3DemoState } from "../types";

interface B3HomepageProps {
  isMobile?: boolean;
  demoState?: B3DemoState;
}

export function B3Homepage({ isMobile = false, demoState = "attention" }: B3HomepageProps) {
  return (
    <div className="min-h-screen bg-[#F5F3EF] text-[#15241F]">
      <B3Navbar isMobile={isMobile} />
      <B3Hero isMobile={isMobile} demoState={demoState} />
      <B3ProductMoments />
      <B3LegalTrust />
      <B3FreeTools />
      <B3Pricing />
      <B3Faq />
      <B3FinalCta />
      <B3Footer />
    </div>
  );
}
