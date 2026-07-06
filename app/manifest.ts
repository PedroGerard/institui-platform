import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: "Incentive",
    description:
      "Instituto Incentive de Inovacao, Desenvolvimento e Transformacao Social.",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f6f6",
    theme_color: "#006871",
    icons: [
      {
        src: "/images/brand/instituto-incentive-symbol.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icon.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
  };
}
