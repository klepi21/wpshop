'use client';

import * as React from "react"
import { cn } from "@/lib/utils"

interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  pauseOnHover?: boolean
  direction?: "left" | "right"
  speed?: number
}

export function Marquee({
  children,
  pauseOnHover = false,
  direction = "left",
  speed = 40,
  className,
  ...props
}: MarqueeProps) {
  return (
    <div 
      className={cn("w-full overflow-hidden", className)} 
      {...props}
    >
      <div className="relative flex w-full overflow-x-hidden [--gap:1rem]">
        <div 
          className={cn(
            "animate-marquee flex min-w-full shrink-0 items-center justify-around gap-[var(--gap)] py-3",
            pauseOnHover && "hover:[animation-play-state:paused]",
            direction === "right" && "animate-marquee-reverse"
          )}
          style={{ "--duration": `${speed}s` } as React.CSSProperties}
        >
          {children}
        </div>
        <div
          className={cn(
            "animate-marquee flex min-w-full shrink-0 items-center justify-around gap-[var(--gap)] py-3",
            pauseOnHover && "hover:[animation-play-state:paused]",
            direction === "right" && "animate-marquee-reverse"
          )}
          style={{ "--duration": `${speed}s` } as React.CSSProperties}
        >
          {children}
        </div>
      </div>
    </div>
  );
} 