import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Simple Message dApp",
  description: "A basic example of interacting with a Clarity smart contract on Stacks to store a message",
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


