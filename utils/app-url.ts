const PRODUCTION_ORIGIN = "https://syndhur.com";
const LOCAL_ORIGIN = "http://localhost:3000";

function cleanOrigin(origin?: string | null) {
  if (!origin) return "";
  const value = origin.trim().replace(/^["']|["']$/g, "");
  try {
    return new URL(value).origin.replace(/\/+$/, "");
  } catch {
    return value.replace(/\/+$/, "");
  }
}

function isLocalOrigin(origin: string) {
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);
}

export function getAppOrigin(fallbackOrigin?: string) {
  if (typeof window !== "undefined") {
    const browserOrigin = cleanOrigin(window.location.origin);
    if (browserOrigin) {
      return isLocalOrigin(browserOrigin) ? LOCAL_ORIGIN : PRODUCTION_ORIGIN;
    }
  }

  const fallback = cleanOrigin(fallbackOrigin);
  if (fallback) {
    return isLocalOrigin(fallback) ? LOCAL_ORIGIN : PRODUCTION_ORIGIN;
  }

  const envOrigin = cleanOrigin(process.env.NEXT_PUBLIC_APP_URL);
  if (envOrigin) {
    return isLocalOrigin(envOrigin) ? LOCAL_ORIGIN : PRODUCTION_ORIGIN;
  }

  return process.env.NODE_ENV === "production" ? PRODUCTION_ORIGIN : LOCAL_ORIGIN;
}
