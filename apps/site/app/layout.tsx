import type { Metadata } from "next";
import type { ReactNode } from "react";
import siteConfig from "@site-config";
import { PageTransition } from "@/components/motion/PageTransition";
import { SmoothScrollProvider } from "@/components/motion/SmoothScrollProvider";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://motionsites.vercel.app"
  ),
  title: {
    default: siteConfig.site.title,
    template: `%s · ${siteConfig.site.name}`
  },
  description: siteConfig.site.description,
  openGraph: {
    title: siteConfig.site.title,
    description: siteConfig.site.description,
    siteName: siteConfig.site.name,
    images: [{ url: siteConfig.assets.ogImage, width: 1200, height: 630, alt: siteConfig.site.title }],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.site.title,
    description: siteConfig.site.description,
    images: [siteConfig.assets.ogImage]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <SmoothScrollProvider>
          <PageTransition>{children}</PageTransition>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
