import { describe, expect, it } from "vitest";
import { priceFor } from "../lib/pricing";
import { parseAddress } from "../lib/address";
import { lookupLot } from "../lib/parcels";

describe("priceFor", () => {
  it.each([
    [0.1, 59], [0.25, 59], [0.3, 65], [0.5, 75], [0.75, 95], [1, 120],
    [2, 215], [3, 290], [4, 365], [1.01, 125],
  ])("%s acres costs $%s", (acres, price) => expect(priceFor(acres).price).toBe(price));
  it("rejects zero", () => expect(() => priceFor(0)).toThrow());
});

describe("parseAddress", () => {
  it("handles commas, spelled-out types and trailing city/state/ZIP", () => {
    for (const a of ["909 Lakemont Dr, Nashville, TN 37220", "909 Lakemont Drive 37220", "909 lakemont drive nashville tn 37220"])
      expect(parseAddress(a)).toEqual({ house: "909", words: ["LAKEMONT"], suffix: "DR", zip: "37220" });
  });
  it("needs a house number", () => expect(parseAddress("Lakemont Dr")).toBeNull());
});

describe("lookupLot (real county table)", () => {
  it("finds 909 Lakemont Dr", () =>
    expect(lookupLot("909 Lakemont Drive, Nashville TN 37220")).toMatchObject({ ok: true, acres: 1.01, zip: "37220" }));
  it("finds it without a ZIP", () => expect(lookupLot("909 Lakemont Dr")).toMatchObject({ ok: true, acres: 1.01 }));
  it("reports unknown addresses", () => expect(lookupLot("123 Nowhere Rd 37220")).toEqual({ ok: false, reason: "notfound" }));
});
