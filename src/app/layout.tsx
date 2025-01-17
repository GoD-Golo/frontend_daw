import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hotel DAW",
  description:
    "Welcome to Hotel DAW. Book rooms at the best hotel in town at affordable prices.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
