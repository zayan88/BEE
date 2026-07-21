import { Card } from "@/components/ui/card";

export default function StatCard({
  label,
  value,
  icon,
  hint,
}: {
  label: string;
  value: string;
  icon?: string;
  hint?: string;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-medium text-brown-soft">{label}</div>
          <div className="mt-1.5 font-display text-2xl font-black text-brown">
            {value}
          </div>
          {hint && <div className="mt-1 text-xs text-brown-soft">{hint}</div>}
        </div>
        {icon && (
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[rgba(245,215,142,0.5)] to-[rgba(229,167,40,0.2)] text-xl">
            {icon}
          </span>
        )}
      </div>
    </Card>
  );
}
