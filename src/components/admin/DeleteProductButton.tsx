"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteProduct } from "@/server/actions/admin";
import { Button } from "@/components/ui/button";

export default function DeleteProductButton({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant="destructive"
      size="sm"
      disabled={pending}
      onClick={() => {
        if (!confirm(`حذف المنتج "${name}"؟ لا يمكن التراجع.`)) return;
        startTransition(async () => {
          await deleteProduct(id);
          router.refresh();
        });
      }}
    >
      حذف
    </Button>
  );
}
