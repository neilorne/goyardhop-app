"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddressForm() {
  const router = useRouter();
  const [address, setAddress] = useState("");
  return (
    <form
      className="addr"
      onSubmit={(e) => {
        e.preventDefault();
        if (address.trim().length >= 5) router.push(`/price?address=${encodeURIComponent(address.trim())}`);
      }}
    >
      <label className="sr-only" htmlFor="address">Property address</label>
      <input id="address" className="input" autoComplete="street-address" placeholder="Street address and ZIP"
        value={address} onChange={(e) => setAddress(e.target.value)} />
      <button className="btn" type="submit">Get my price</button>
    </form>
  );
}
