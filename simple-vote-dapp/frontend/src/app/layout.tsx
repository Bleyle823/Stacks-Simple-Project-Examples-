import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Simple Voting dApp",
  description: "A basic example of a yes/no voting poll in a Clarity smart contract on Stacks",
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


