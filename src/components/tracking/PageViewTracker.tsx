"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { track } from "@/lib/tracking";

// Fires a first-party PAGE_VIEW on every route change (and mount).
export default function PageViewTracker() {
  const pathname = usePathname();
  useEffect(() => {
    track("PAGE_VIEW");
  }, [pathname]);
  return null;
}
