// Turns what a customer types ("909 Lakemont Drive, Nashville TN 37220") into the pieces
// the county parcel table is keyed by: house number, street name, street type and ZIP.

export const SUFFIX: Record<string, string> = {
  AVENUE: "AVE", AVE: "AVE", AV: "AVE", STREET: "ST", ST: "ST", BOULEVARD: "BLVD", BLVD: "BLVD",
  ROAD: "RD", RD: "RD", DRIVE: "DR", DR: "DR", LANE: "LN", LN: "LN", COURT: "CT", CT: "CT",
  CIRCLE: "CIR", CIR: "CIR", PIKE: "PIKE", PK: "PIKE", PLACE: "PL", PL: "PL", TRAIL: "TRL", TRL: "TRL",
  WAY: "WAY", PARKWAY: "PKWY", PKWY: "PKWY", TERRACE: "TER", TER: "TER", HIGHWAY: "HWY", HWY: "HWY",
  COVE: "CV", CV: "CV", POINT: "PT", PT: "PT", BEND: "BND", BND: "BND", HOLLOW: "HOLW", HOLW: "HOLW",
  SQUARE: "SQ", SQ: "SQ", LOOP: "LOOP", CROSSING: "XING", XING: "XING", RIDGE: "RDG", RDG: "RDG",
  ALLEY: "ALY", ALY: "ALY",
};
export const DIRS = new Set(["N", "S", "E", "W", "NORTH", "SOUTH", "EAST", "WEST"]);

export type ParsedAddress = { house: string; words: string[]; suffix: string; zip: string };

export function parseAddress(text: string): ParsedAddress | null {
  const up = text.toUpperCase().replace(/[.#]/g, " ");
  const zip = (up.match(/\b(37\d{3})\b/) || [])[1] || "";
  const m = up.split(",")[0].trim().match(/^(\d+)[A-Z]?\s+(.+)$/);
  if (!m) return null;
  const words = m[2]
    .replace(/\b(APT|UNIT|STE|SUITE)\b.*$/, "")
    .trim()
    .split(/\s+/)
    .filter((w) => w && !DIRS.has(w));
  // Without commas, drop a trailing city, state and ZIP: keep words up to the street type.
  const cut = words.findIndex((w, i) => i > 0 && SUFFIX[w]);
  if (cut > 0) words.length = cut + 1;
  while (words.length > 1 && /^(\d{5}|TN|TENNESSEE)$/.test(words[words.length - 1])) words.pop();
  let suffix = "";
  if (words.length > 1 && SUFFIX[words[words.length - 1]]) suffix = SUFFIX[words.pop()!];
  if (!words.length) return null;
  return { house: m[1], words, suffix, zip };
}
