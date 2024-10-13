import { type GRKKitType } from "@/utils/types/shared.types";

export const GRKKit: GRKKitType = {
  brand: {
    title: "GoldRush",
    subtitle: "NFT Gallery UI",
    logo_url: "/assets/goldrush-logo.svg",
    github: "https://github.com/covalenthq/goldrush-nft-gallery-ui"
  },
  theme: {
    borderRadius: 80,
    colors: {
      dark: {
        primary: "#FF4C8B",
        background: "#000426",
        foreground: "#FFFFFF",
        secondary: "#868E96",
      },
      light: {
        primary: "#FF4C8B",
        background: "#FFFFFF",
        foreground: "#1C2024",
        secondary: "#868E96",
      },
    },
    mode: "dark",
  }
};

export default GRKKit;