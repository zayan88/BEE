"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export default function RevenueChart({
  data,
}: {
  data: { date: string; orders: number; revenue: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e5a728" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#e5a728" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(200,147,46,0.12)" />
        <XAxis
          dataKey="date"
          tickFormatter={(d: string) => d.slice(5)}
          tick={{ fontSize: 11, fill: "#5b4636" }}
          reversed
        />
        <YAxis tick={{ fontSize: 11, fill: "#5b4636" }} width={48} />
        <Tooltip
          contentStyle={{
            borderRadius: 14,
            border: "1px solid rgba(200,147,46,0.2)",
            fontFamily: "inherit",
          }}
          formatter={(value, name) => [
            new Intl.NumberFormat("ar-IQ").format(Number(value)),
            name === "revenue" ? "الإيراد" : "الطلبات",
          ]}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#c8932e"
          strokeWidth={2.5}
          fill="url(#rev)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
