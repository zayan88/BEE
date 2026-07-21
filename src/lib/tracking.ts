// Client-side tracking helpers. Fires events to the installed pixels
// (Meta, TikTok, GA4, Snapchat) and mirrors them to our own analytics API.

export type TrackEventType =
  | "PAGE_VIEW"
  | "VIEW_CONTENT"
  | "ADD_TO_CART"
  | "INITIATE_CHECKOUT"
  | "LEAD"
  | "PURCHASE"
  | "UPSELL_ACCEPTED"
  | "UPSELL_REJECTED"
  | "ORDER_SUBMITTED";

// Map our internal event names to each vendor's standard event name.
const META_MAP: Record<TrackEventType, string | null> = {
  PAGE_VIEW: "PageView",
  VIEW_CONTENT: "ViewContent",
  ADD_TO_CART: "AddToCart",
  INITIATE_CHECKOUT: "InitiateCheckout",
  LEAD: "Lead",
  PURCHASE: "Purchase",
  UPSELL_ACCEPTED: "Purchase",
  UPSELL_REJECTED: null,
  ORDER_SUBMITTED: "Lead",
};

const TIKTOK_MAP: Record<TrackEventType, string | null> = {
  PAGE_VIEW: "Pageview",
  VIEW_CONTENT: "ViewContent",
  ADD_TO_CART: "AddToCart",
  INITIATE_CHECKOUT: "InitiateCheckout",
  LEAD: "SubmitForm",
  PURCHASE: "CompletePayment",
  UPSELL_ACCEPTED: "CompletePayment",
  UPSELL_REJECTED: null,
  ORDER_SUBMITTED: "PlaceAnOrder",
};

const SNAP_MAP: Record<TrackEventType, string | null> = {
  PAGE_VIEW: "PAGE_VIEW",
  VIEW_CONTENT: "VIEW_CONTENT",
  ADD_TO_CART: "ADD_CART",
  INITIATE_CHECKOUT: "START_CHECKOUT",
  LEAD: "SIGN_UP",
  PURCHASE: "PURCHASE",
  UPSELL_ACCEPTED: "PURCHASE",
  UPSELL_REJECTED: null,
  ORDER_SUBMITTED: "PURCHASE",
};

type W = typeof window & {
  fbq?: (...args: unknown[]) => void;
  ttq?: { track: (name: string, data?: unknown) => void };
  gtag?: (...args: unknown[]) => void;
  snaptr?: (...args: unknown[]) => void;
  dataLayer?: unknown[];
};

const SESSION_KEY = "cod_sid";

export function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let sid = localStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid =
      (crypto.randomUUID?.() as string) ??
      Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
}

export type TrackPayload = {
  productId?: string | null;
  orderId?: string | null;
  value?: number;
  currency?: string;
  province?: string | null;
  contentName?: string;
};

export function track(type: TrackEventType, payload: TrackPayload = {}) {
  if (typeof window === "undefined") return;
  const w = window as W;
  const value = payload.value ?? 0;
  const currency = payload.currency ?? "IQD";

  // --- Meta Pixel ---
  const metaName = META_MAP[type];
  if (w.fbq && metaName) {
    w.fbq("track", metaName, {
      value,
      currency,
      content_ids: payload.productId ? [payload.productId] : undefined,
      content_name: payload.contentName,
    });
  }

  // --- TikTok Pixel ---
  const ttName = TIKTOK_MAP[type];
  if (w.ttq && ttName) {
    w.ttq.track(ttName, {
      value,
      currency,
      content_id: payload.productId ?? undefined,
      content_name: payload.contentName,
    });
  }

  // --- Google Analytics (GA4) ---
  if (w.gtag) {
    w.gtag("event", type.toLowerCase(), {
      value,
      currency,
      items: payload.productId ? [{ item_id: payload.productId }] : undefined,
    });
  }

  // --- Google Tag Manager dataLayer ---
  if (w.dataLayer) {
    w.dataLayer.push({ event: `cod_${type.toLowerCase()}`, value, currency });
  }

  // --- Snapchat Pixel ---
  const snapName = SNAP_MAP[type];
  if (w.snaptr && snapName) {
    w.snaptr("track", snapName, { price: value, currency });
  }

  // --- First-party analytics ---
  try {
    const body = JSON.stringify({
      type,
      productId: payload.productId ?? null,
      orderId: payload.orderId ?? null,
      sessionId: getSessionId(),
      value,
      province: payload.province ?? null,
      source: new URLSearchParams(window.location.search).get("utm_source"),
      path: window.location.pathname,
    });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track", body);
    } else {
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      });
    }
  } catch {
    // swallow — analytics must never break the UX
  }
}
