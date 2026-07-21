"use client";

import { useEffect } from "react";
import { track } from "@/lib/tracking";

export default function ViewContentTracker({
  productId,
  value,
  name,
}: {
  productId: string;
  value: number;
  name: string;
}) {
  useEffect(() => {
    track("VIEW_CONTENT", { productId, value, contentName: name });
  }, [productId, value, name]);
  return null;
}
