"use client";

import { useState, useTransition } from "react";
import type { OrderStatus } from "@prisma/client";
import { Select } from "@/components/ui/select";
import { updateOrderStatus } from "@/server/actions/admin";
import { ALL_STATUSES, STATUS_LABELS } from "@/lib/order-status";

export default function OrderStatusSelect({
  orderId,
  status,
}: {
  orderId: string;
  status: OrderStatus;
}) {
  const [value, setValue] = useState<OrderStatus>(status);
  const [pending, startTransition] = useTransition();

  return (
    <Select
      className="min-w-[130px] py-2 text-sm"
      value={value}
      disabled={pending}
      onChange={(e) => {
        const next = e.target.value as OrderStatus;
        setValue(next);
        startTransition(async () => {
          await updateOrderStatus(orderId, next);
        });
      }}
    >
      {ALL_STATUSES.map((s) => (
        <option key={s} value={s}>
          {STATUS_LABELS[s]}
        </option>
      ))}
    </Select>
  );
}
