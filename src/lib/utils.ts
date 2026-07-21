import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMoney(
  amount: number,
  symbol = "د.ع",
): string {
  const formatted = new Intl.NumberFormat("ar-IQ", {
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
  return `${formatted} ${symbol}`;
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("ar-IQ").format(n);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("ar-IQ", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function slugify(input: string): string {
  return input
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}
