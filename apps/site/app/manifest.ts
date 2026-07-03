import type { MetadataRoute } from "next";
import siteConfig from "@site-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.site.name,
    short_name: siteConfig.site.name,
    description: siteConfig.site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#050816",
    theme_color: "#050816",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any"
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "maskable"
      }
    ]
  };
}
