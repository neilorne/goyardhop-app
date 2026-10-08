import Link from "next/link";
import { lookupLot } from "@/lib/parcels";
import { BOOKING_FEE, priceFor } from "@/lib/pricing";
import BookPanel from "./BookPanel";

const WHY = {
  format: "Start the address with a house number and street name.",
  notfound: "We couldn't find that address in Davidson County records. Check the spelling, or enter your lot size below.",
  noacres: "That address is on record without a lot size (often a condo). Enter your lot size below.",
};

// Click 2 of 3: the instant price, with the first open slot one tap away.
export default async function PricePage({ searchParams }: { searchParams: Promise<{ address?: string; acres?: string }> }) {
  const { address = "", acres: typedAcres } = await searchParams;
  const typed = Number(typedAcres);
  const lot = typed > 0 && typed <= 50 ? ({ ok: true, acres: typed, matched: address } as const) : lookupLot(address);

  if (!lot.ok) {
    return (
      <main className="screen">
        <h1>Let's get your lot size</h1>
        <p className="sub">{address}</p>
        <p>{WHY[lot.reason]}</p>
        <form className="panel" action="/price">
          <input type="hidden" name="address" value={address} />
          <label htmlFor="acres">Lot size in acres</label>
          <input id="acres" name="acres" className="input" inputMode="decimal" placeholder="e.g. 0.25" required />
          <button className="btn" type="submit">See my price</button>
        </form>
        <Link className="btn quiet" href="/">Try a different address</Link>
      </main>
    );
  }

  const quote = priceFor(lot.acres);
  return (
    <main className="screen">
      <p className="eyebrow">Your instant price</p>
      <p className="sub">{lot.matched}</p>
      <div className="pricebox"><span className="price"><sup>$</sup>{quote.price}</span><span className="sub">per visit, everything included</span></div>
      <div className="facts">
        <div className="fact"><span>Lot size</span><b>{quote.acres.toFixed(2)} acre</b></div>
        <div className="fact"><span>Equipment</span><b>{quote.equipment}</b></div>
      </div>
      <p className="note">{typed > 0 ? "Using the lot size you entered." : "Lot size from Metro Nashville property records."}</p>
      <BookPanel address={lot.matched} price={quote.price} fee={BOOKING_FEE} />
    </main>
  );
}
