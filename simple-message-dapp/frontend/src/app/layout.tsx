import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Simple Message dApp",
  description: "A simple message dApp demonstrating basic Clarity smart contract functionality",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}


