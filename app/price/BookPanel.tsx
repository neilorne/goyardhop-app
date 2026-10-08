"use client";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { TIMES, fmtDay, upcomingWorkdays } from "@/lib/schedule";

// Click 3 of 3: book the first open slot, or open the picker to choose another.
export default function BookPanel({ address, price, fee }: { address: string; price: number; fee: number }) {
  const router = useRouter();
  const days = useMemo(() => upcomingWorkdays(7), []);
  const [picking, setPicking] = useState(false);
  const [day, setDay] = useState(0);
  const [time, setTime] = useState(0);
  const when = `${fmtDay(days[day])} at ${TIMES[time]}`;
  const book = () =>
    router.push(`/booked?${new URLSearchParams({ address, price: String(price), when })}`);

  return (
    <div className="panel">
      <button className="btn" type="button" onClick={book}>Book {day === 0 && time === 0 ? "first available" : ""}: {when}</button>
      <p className="note">${fee} booking fee today, counted toward your price. The rest is charged after you approve the photos.</p>
      {!picking ? (
        <button className="btn quiet" type="button" onClick={() => setPicking(true)}>Choose a different day or time</button>
      ) : (
        <>
          <div className="days">
            {days.map((d, i) => (
              <button key={i} type="button" className="day" aria-pressed={i === day} onClick={() => setDay(i)}>{fmtDay(d)}</button>
            ))}
          </div>
          <div className="times">
            {TIMES.map((t, i) => (
              <button key={t} type="button" className="time" aria-pressed={i === time} onClick={() => setTime(i)}>{t}</button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
