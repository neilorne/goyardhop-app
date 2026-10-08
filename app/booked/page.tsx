import Link from "next/link";

// Confirmation. Not saved or charged yet: accounts, payment (Stripe) and texts (Twilio) come next.
export default async function Booked({ searchParams }: { searchParams: Promise<{ address?: string; price?: string; when?: string }> }) {
  const { address = "", price = "", when = "" } = await searchParams;
  return (
    <main className="screen center">
      <h1>You're all set!</h1>
      <p>{when}</p>
      <p className="sub">{address}</p>
      <p className="price-sm">${price}</p>
      <p className="note">Test version: nothing is saved or charged yet.</p>
      <Link className="btn ghost" href="/">Back to start</Link>
    </main>
  );
}
