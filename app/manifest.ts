import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FundWaveSL - Sierra Leone Crowdfunding Platform",
    short_name: "FundWaveSL",
    description:
      "Empowering Sierra Leone communities through crowdfunding. Support local projects and make a difference.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#4f46e5",
    orientation: "portrait",
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
    categories: ["finance", "social", "productivity"],
    lang: "en",
    dir: "ltr",
    scope: "/",
    id: "fundwavesl",
    screenshots: [
      {
        src: "/screenshot-wide.png",
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide",
      },
      {
        src: "/screenshot-narrow.png",
        sizes: "750x1334",
        type: "image/png",
        form_factor: "narrow",
      },
    ],
    shortcuts: [
      {
        name: "Create Campaign",
        short_name: "Create",
        description: "Start a new crowdfunding campaign",
        url: "/create-campaign",
        icons: [{ src: "/icon-create.png", sizes: "96x96" }],
      },
      {
        name: "Browse Campaigns",
        short_name: "Browse",
        description: "Discover campaigns to support",
        url: "/campaigns",
        icons: [{ src: "/icon-browse.png", sizes: "96x96" }],
      },
      {
        name: "My Dashboard",
        short_name: "Dashboard",
        description: "View your campaigns and donations",
        url: "/dashboard",
        icons: [{ src: "/icon-dashboard.png", sizes: "96x96" }],
      },
    ],
  }
}
