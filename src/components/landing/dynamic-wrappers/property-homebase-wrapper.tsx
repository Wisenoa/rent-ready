"use client";

import dynamic from "next/dynamic";

const PropertyHomebaseFeature = dynamic(
  () =>
    import("@/components/landing/property-homebase-feature").then(
      (mod) => mod.PropertyHomebaseFeature
    ),
  {
    loading: () => <div style={{ minHeight: 600 }} aria-hidden="true" />,
  }
);

export function PropertyHomebaseWrapper() {
  return <PropertyHomebaseFeature />;
}
