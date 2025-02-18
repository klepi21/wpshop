"use client";

import { Timeline } from "@/components/ui/timeline";
import Image from "next/image";

const timelineData = [
  {
    title: "Design",
    content: (
      <div>
        <p className="text-white/80 text-sm md:text-base font-normal mb-8">
          Every piece begins with a thoughtful design process. We blend traditional woodworking principles with modern aesthetics to create unique, functional art pieces.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <Image
            src="/img/design.webp"
            alt="Design sketches"
            width={500}
            height={500}
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full"
          />
          <Image
            src="/img/stain.jpeg"
            alt="3D modeling"
            width={500}
            height={500}
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full"
          />
        </div>
      </div>
    ),
  },
  {
    title: "Selection",
    content: (
      <div>
        <p className="text-white/80 text-sm md:text-base font-normal mb-8">
          We carefully select premium hardwoods, considering grain patterns, color variations, and structural integrity to ensure each piece meets our quality standards.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <Image
            src="/img/casewood.png"
            alt="Wood selection"
            width={500}
            height={500}
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full"
          />
          <Image
            src="/img/charac.png"
            alt="Wood preparation"
            width={500}
            height={500}
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full"
          />
        </div>
      </div>
    ),
  },
  {
    title: "Crafting",
    content: (
      <div>
        <p className="text-white/80 text-sm md:text-base font-normal mb-8">
          Our master craftsmen combine traditional techniques with modern tools to shape, join, and finish each piece. Every step is executed with precision and care.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <Image
            src="/img/srblovk.png"
            alt="Crafting process"
            width={500}
            height={500}
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full"
          />
          <Image
            src="/img/gold.avif"
            alt="Detail work"
            width={500}
            height={500}
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full"
          />
        </div>
      </div>
    ),
  },
];

export function CraftsmanshipTimeline() {
  return (
    <div className="w-full bg-black">
      <div className="max-w-7xl mx-auto py-20 px-4 md:px-8 lg:px-10">
        <h2 className="text-lg md:text-4xl mb-4 text-[#A67C52] max-w-4xl font-bold">
          Our Craftsmanship Process
        </h2>
        <p className="text-white/60 text-sm md:text-base max-w-2xl">
          Each WoodenPunks creation is a journey from concept to completion, crafted with precision and passion. Discover how we bring your pieces to life.
        </p>
      </div>
      <Timeline data={timelineData} />
    </div>
  );
} 