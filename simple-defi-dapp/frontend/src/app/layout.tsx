import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Simple DeFi Vault dApp",
  description: "A basic example of a DeFi-style savings vault in a Clarity smart contract on Stacks",
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


