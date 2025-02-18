"use client";

import { BrandsGrid } from "./brands";

const brands = [
  {
    name: "MultiversX",
    logo: "https://research.binance.com/static/images/projects/multiversx/logo2.png",
  },
  {
    name: "Super Rare Bears",
    logo: "https://app.superrarebears.com/static/media/Bears_white_logo.e813743a.png",
  },
  {
    name: "eApes",
    logo: "https://cdn.prod.website-files.com/6597cc7be68d63ec0c8ce33f/65bbad934591b587fd6b239b_eapes_logo.webp",
  },
  {
    name: "FudOut",
    logo: "https://fudout.superrarebears.com/img/fologo.png",
  },
  {
    name: "QuantumX",
    logo: "https://www.quantumx.network/_next/static/media/quantumx.a1754ab8.svg",
  },
  {
    name: "Woodenpunks",
    logo: "https://pbs.twimg.com/profile_images/1771621769843023872/S2P1rgDx_400x400.jpg",
  },
];

export function BrandsGridDemo() {
  return (
    <BrandsGrid
      brands={brands}
      title="Trusted by Leading Web3 Projects"
      className="bg-black"
    />
  );
} 