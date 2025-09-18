'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

type ClayPhoneProps = {
  screenshotSrc: string;
  alt: string;
  tilt?: boolean;
  glow?: boolean;
  priority?: boolean;
  caption?: React.ReactNode;
};

export default function ClayPhone({
  screenshotSrc,
  alt,
  tilt = false,
  glow = false,
  priority = false,
  caption,
}: ClayPhoneProps) {
  return (
    <div className="relative">
      {/* Phone Frame */}
      <div className={cn(
        "relative w-80 h-[640px] mx-auto",
        "bg-gradient-to-b from-gray-100 to-gray-200",
        "rounded-[3rem] p-2 shadow-2xl",
        "border-4 border-gray-300",
        tilt && "transform rotate-3 hover:rotate-0 transition-transform duration-300",
        glow && "shadow-[0_0_40px_rgba(0,0,0,0.1)]"
      )}>
        {/* Screen */}
        <div className="w-full h-full bg-black rounded-[2.5rem] overflow-hidden relative">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-10" />
          
          {/* Content */}
          <div className="w-full h-full relative">
            <Image
              src={screenshotSrc}
              alt={alt}
              fill
              className="object-cover"
              priority={priority}
            />
          </div>
        </div>
      </div>
      
      {/* Caption */}
      {caption && (
        <div className="mt-4 text-center text-sm text-gray-600">
          {caption}
        </div>
      )}
    </div>
  );
}
