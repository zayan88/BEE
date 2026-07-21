import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { trackEventSchema } from "@/lib/validations";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);
  const { success } = rateLimit(`track:${ip}`, { limit: 120, windowMs: 60_000 });
  if (!success) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const parsed = trackEventSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 422 });
  }

  const d = parsed.data;
  try {
    await prisma.analyticsEvent.create({
      data: {
        type: d.type,
        productId: d.productId ?? null,
        orderId: d.orderId ?? null,
        sessionId: d.sessionId ?? null,
        value: d.value ?? 0,
        province: d.province ?? null,
        source: d.source ?? null,
        path: d.path ?? null,
        userAgent: req.headers.get("user-agent")?.slice(0, 500) ?? null,
      },
    });
  } catch {
    // Never fail the beacon — analytics must be best-effort.
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: true });
}
