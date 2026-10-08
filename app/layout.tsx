import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "GoYardHop | Professional yard care without the hassle",
  description: "Instant price from your address, book in three taps. Nashville yard care.",
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="app">
          <header className="topbar">
            <Link className="logo" href="/">GO<span>YARD</span>HOP</Link>
          </header>
          {children}
          <footer className="foot">
            <span>GoYardHop LLC · Nashville, TN</span>
            <span>Questions? Call the owner, Neil: <a href="tel:+16156121221">(615) 612-1221</a></span>
          </footer>
        </div>
      </body>
    </html>
  );
}
