// PRICES: change these numbers to update every screen. Every price already includes the $25 base fee.
export const PRICE_TIERS = [
  { upTo: 0.25, price: 59, equipment: "Push mower (21 in)" },
  { upTo: 0.33, price: 65, equipment: "Push mower (21 in)" },
  { upTo: 0.5, price: 75, equipment: "Mid-size mower (36 in)" },
  { upTo: 0.75, price: 95, equipment: "Mid-size mower (36 in)" },
  { upTo: 1.0, price: 120, equipment: "Riding mower (52 in)" },
] as const;

// Yards over 1 acre: the 1 acre price, plus the 0.75 acre price for the 2nd acre,
// plus the 0.5 acre price for the 3rd acre and every acre after that.
// A partial extra acre is charged for its share, and the total is rounded up to the next $5.
const tierPrice = (upTo: number) => PRICE_TIERS.find((t) => t.upTo === upTo)!.price;
export const EXTRA_ACRE_RATES = [tierPrice(0.75), tierPrice(0.5)];

// Booking fee charged when the customer books; it counts toward the price.
export const BOOKING_FEE = 10;

export type Quote = { acres: number; price: number; equipment: string };

export function priceFor(acres: number): Quote {
  if (!(acres > 0)) throw new Error("Lot size must be more than 0 acres");
  const tier = PRICE_TIERS.find((t) => acres <= t.upTo);
  if (tier) return { acres, price: tier.price, equipment: tier.equipment };
  const last = PRICE_TIERS[PRICE_TIERS.length - 1];
  let extra = 0;
  let left = acres - last.upTo;
  for (let n = 0; left > 1e-9; n++) {
    const share = Math.min(1, left);
    extra += share * EXTRA_ACRE_RATES[Math.min(n, EXTRA_ACRE_RATES.length - 1)];
    left -= share;
  }
  return { acres, price: last.price + Math.ceil(extra / 5 - 1e-9) * 5, equipment: last.equipment };
}
