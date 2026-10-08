import { NextResponse } from "next/server";
import { lookupLot } from "@/lib/parcels";
import { priceFor } from "@/lib/pricing";

// GET /api/quote?address=909 Lakemont Dr 37220  ->  lot size and instant price.
// GET /api/quote?acres=0.4                      ->  price for a lot size the customer typed.
export function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const typed = Number(params.get("acres"));
  if (params.has("acres")) {
    if (!(typed > 0 && typed <= 50)) return NextResponse.json({ ok: false, reason: "acres" }, { status: 400 });
    return NextResponse.json({ ok: true, source: "typed", ...priceFor(typed) });
  }
  const address = (params.get("address") || "").slice(0, 200);
  const lot = lookupLot(address);
  if (!lot.ok) return NextResponse.json(lot);
  return NextResponse.json({ ok: true, source: "county", matched: lot.matched, ...priceFor(lot.acres) });
}
