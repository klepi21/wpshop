'use client';

import * as SliderPrimitive from '@radix-ui/react-slider';

interface SliderProps {
  min: number;
  max: number;
  step: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

export function Slider({ min, max, step, value, onChange }: SliderProps) {
  return (
    <SliderPrimitive.Root
      className="relative flex items-center select-none touch-none w-full h-5"
      min={min}
      max={max}
      step={step}
      value={value}
      onValueChange={onChange}
    >
      <SliderPrimitive.Track className="bg-white/10 relative grow rounded-full h-1">
        <SliderPrimitive.Range className="absolute bg-[#C99733] rounded-full h-full" />
      </SliderPrimitive.Track>
      {value.map((_, index) => (
        <SliderPrimitive.Thumb
          key={index}
          className="block w-4 h-4 bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-[#C99733] focus:ring-offset-2 focus:ring-offset-black"
        />
      ))}
    </SliderPrimitive.Root>
  );
} 