import { readFileSync } from "node:fs";
import path from "node:path";
import { DIRS, SUFFIX, parseAddress } from "./address";

// Lot sizes for Davidson County, built from Metro Nashville's public parcel records by
// tools/build_parcels.py. Shape: { zip: { street: { houseNumber: acres } } }.
export type ParcelTable = Record<string, Record<string, Record<string, number>>>;

let cached: ParcelTable | null = null;
export function loadParcels(): ParcelTable {
  cached ??= JSON.parse(readFileSync(path.join(process.cwd(), "data", "parcels.json"), "utf8"));
  return cached!;
}

export type LotResult =
  | { ok: true; acres: number; matched: string; zip: string }
  | { ok: false; reason: "format" | "notfound" | "noacres" };

const titleCase = (s: string) => s.toLowerCase().replace(/\b[a-z]/g, (c) => c.toUpperCase());

export function lookupLot(address: string, table: ParcelTable = loadParcels()): LotResult {
  const a = parseAddress(address);
  if (!a) return { ok: false, reason: "format" };
  const want = a.words.join(" ");
  const zips = a.zip ? (table[a.zip] ? [a.zip] : []) : Object.keys(table);
  const rows: { zip: string; street: string; acres: number; score: number }[] = [];
  for (const zip of zips) {
    for (const [street, houses] of Object.entries(table[zip])) {
      const acres = houses[a.house];
      if (acres === undefined) continue;
      const w = street.split(" ").filter((x) => !DIRS.has(x));
      const last = w[w.length - 1];
      const hasSuffix = w.length > 1 && SUFFIX[last] === last;
      if ((hasSuffix ? w.slice(0, -1) : w).join(" ") !== want) continue;
      const score = (a.suffix && hasSuffix && last === a.suffix ? 2 : 0) + (!a.suffix || !hasSuffix ? 1 : 0);
      rows.push({ zip, street, acres, score });
    }
  }
  if (!rows.length) return { ok: false, reason: "notfound" };
  rows.sort((x, y) => y.score - x.score);
  const r = rows[0];
  if (!(r.acres > 0)) return { ok: false, reason: "noacres" };
  return { ok: true, acres: r.acres, matched: `${a.house} ${titleCase(r.street)}, Nashville, TN ${r.zip}`, zip: r.zip };
}
