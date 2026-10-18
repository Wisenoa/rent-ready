/** Next's client router must never receive an untrusted scheme or external URL. */
export function safeAuthCallback(value: string | null | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return "/dashboard";
  try {
    const url = new URL(value, "https://lokna.fr");
    if (url.origin !== "https://lokna.fr") return "/dashboard";
    return url.pathname + url.search;
  } catch { return "/dashboard"; }
}
