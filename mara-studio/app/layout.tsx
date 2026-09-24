import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-display" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  metadataBase: new URL("https://gallery.web.orvia.org.uk"),
  title: { default: "Mara Ellison | Paintings from coast, moor and weather", template: "%s | Mara Ellison" },
  description: "A fictional ORVIA Web demonstration showing a contemporary artist website with a working studio web app behind it.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Mara Ellison Studio — ORVIA Web Demonstration",
    description: "A beautiful artist website on the front. A practical working tool behind it.",
    type: "website",
    url: "https://gallery.web.orvia.org.uk"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable}`}>
      <body>{children}</body>
    </html>
  );
}
