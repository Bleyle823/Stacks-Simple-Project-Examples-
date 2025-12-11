import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Simple FT dApp",
  description: "A basic example of a fungible token (FT) in a Clarity smart contract on Stacks",
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


