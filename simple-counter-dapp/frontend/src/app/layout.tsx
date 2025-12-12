import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Simple Counter dApp",
  description: "A basic example of interacting with a Clarity smart contract on Stacks",
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

