import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Maison Verin",
  description: "Experiment 109 / Scroll-Powered Slider",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
