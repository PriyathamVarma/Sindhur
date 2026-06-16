const PRODUCTION_ORIGIN = "https://syndhur.com";
const LOCAL_ORIGIN = "http://localhost:3000";

function cleanOrigin(origin?: string | null) {
  if (!origin) return "";
  return origin.trim().replace(/\/+$/, "");
}

function isLocalOrigin(origin: string) {
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);
}

export function getAppOrigin(fallbackOrigin?: string) {
  const envOrigin = cleanOrigin(process.env.NEXT_PUBLIC_APP_URL);

  if (envOrigin && !(process.env.NODE_ENV === "production" && isLocalOrigin(envOrigin))) {
    return envOrigin;
  }

  if (process.env.NODE_ENV === "production") return PRODUCTION_ORIGIN;

  if (typeof window !== "undefined") return cleanOrigin(window.location.origin) || LOCAL_ORIGIN;

  return cleanOrigin(fallbackOrigin) || LOCAL_ORIGIN;
}
