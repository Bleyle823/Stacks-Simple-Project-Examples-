import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Simple NFT dApp",
  description: "A basic example of minting and transferring NFTs in a Clarity smart contract on Stacks",
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


