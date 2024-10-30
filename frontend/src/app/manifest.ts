import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CareCompass",
    short_name: "CareCompass",
    description: "A personalized care recommender for caregivers",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1361F0",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
