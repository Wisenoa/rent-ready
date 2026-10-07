"use client";

import dynamic from "next/dynamic";

const FreeToolsGateway = dynamic(
  () =>
    import("@/components/landing/free-tools-gateway").then(
      (mod) => mod.FreeToolsGateway
    ),
  {
    loading: () => <div style={{ minHeight: 500 }} aria-hidden="true" />,
  }
);

export function FreeToolsGatewayWrapper() {
  return <FreeToolsGateway />;
}
