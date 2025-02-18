"use client";

import { TestimonialsSection } from "@/components/blocks/testimonials-with-marquee";

const testimonials = [
  {
    author: {
      name: "Michael Chen",
      handle: "Art Collector",
      avatar: "/img/wdpunklogo.png"
    },
    text: "The attention to detail in my custom desk is extraordinary. WoodenPunks truly understands how to bring wood to life.",
  },
  {
    author: {
      name: "Sarah Williams",
      handle: "Interior Designer",
      avatar: "/img/wdpunklogo.png"
    },
    text: "Working with WoodenPunks has been a game-changer for our design projects. Their craftsmanship is unmatched.",
  },
  {
    author: {
      name: "James Rodriguez",
      handle: "Home Owner",
      avatar: "/img/wdpunklogo.png"
    },
    text: "The wall art piece I ordered exceeded all expectations. It's become the centerpiece of our living room.",
  },
  {
    author: {
      name: "Emily Thompson",
      handle: "Business Owner",
      avatar: "/img/wdpunklogo.png"
    },
    text: "From order to delivery, the process was seamless. The quality of their work speaks for itself.",
  }
];

export function WoodworkTestimonials() {
  return (
    <TestimonialsSection
      title="What Our Clients Say"
      description="Join countless satisfied customers who have experienced the beauty and quality of WoodenPunks craftsmanship"
      testimonials={testimonials}
      className="bg-black text-white"
    />
  );
} 