import type { Metadata } from "next";
import type { ReactNode } from "react";
import siteConfig from "@site-config";
import { PageTransition } from "@/components/motion/PageTransition";
import { SmoothScrollProvider } from "@/components/motion/SmoothScrollProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: siteConfig.site.title,
    template: `%s · ${siteConfig.site.name}`
  },
  description: siteConfig.site.description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <SmoothScrollProvider>
          <PageTransition>{children}</PageTransition>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
