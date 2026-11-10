import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Unideals: Campus Marketplace",
    short_name: "Unideals",
    description: "Buy and sell with verified students on your campus. Zero commission.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#3838EC",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "1024x1024", type: "image/png", purpose: "any" },
    ],
  };
}
