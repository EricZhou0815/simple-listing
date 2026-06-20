import type { Metadata } from "next";
import { readSiteSettings } from "@/lib/storage";
import "./globals.css";

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await readSiteSettings();

  return (
    <html lang="en">
      <head>
        <title>{settings.pageTitle}</title>
        <meta name="description" content="A clean, modern secondhand listing website." />
      </head>
      <body>{children}</body>
    </html>
  );
}
