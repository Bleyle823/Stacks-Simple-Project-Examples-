import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Simple Owner dApp",
  description: "A basic example of interacting with a Clarity smart contract on Stacks to manage an on-chain owner",
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


