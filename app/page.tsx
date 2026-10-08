import AddressForm from "./AddressForm";

// Click 1 of 3: type the address, get the price.
export default function Home() {
  return (
    <main>
      <section className="hero">
        <h1>Professional yard care without the hassle</h1>
        <p>Mow, trim, edge and a Clean Finish. One instant price from your address, no estimates.</p>
        <AddressForm />
      </section>
      <section className="section">
        <h2>How it works</h2>
        <ol className="how">
          <li><b>Enter your address</b><span>We look up your lot size from county records.</span></li>
          <li><b>See your price</b><span>One price for the whole job, no add-ons.</span></li>
          <li><b>Book</b><span>Take the first open slot or pick a day. Pay the balance after you approve the photos.</span></li>
        </ol>
      </section>
    </main>
  );
}
