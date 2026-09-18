import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Calculator",
    short_name: "Calculator",
    description: "A simple, fast calculator you can install and use offline.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0b0b12",
    theme_color: "#0b0b12",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  }
}
