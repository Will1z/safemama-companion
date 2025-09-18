'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import ClayPhone from './ClayPhone';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check } from 'lucide-react';

type FeatureSectionProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  bullets?: { icon?: React.ReactNode; text: string }[];
  cta?: { label: string; href: string };
  image: {
    screenshotSrc: string;
    alt: string;
    tilt?: boolean;
    glow?: boolean;
    priority?: boolean;
    caption?: React.ReactNode;
  };
  invert?: boolean;          // image on right/left
  bg?: "none" | "mint" | "blush";
  id?: string;
};

export default function FeatureSection({
  eyebrow,
  title,
  subtitle,
  bullets = [],
  cta,
  image,
  invert = false,
  bg = "none",
  id,
}: FeatureSectionProps) {
  const bgClasses = {
    none: "",
    mint: "bg-mint-soft",
    blush: "bg-blush-soft",
  };

  const containerClasses = cn(
    "py-20 md:py-28",
    bgClasses[bg],
    bg === "none" && "border-y border-black/5"
  );

  return (
    <section id={id} className={containerClasses}>
        <div className="container max-w-7xl mx-auto px-6 md:px-8">
          <div className={cn(
            "grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14 items-center",
            invert && "lg:grid-flow-col-dense"
          )}>
          {/* Content */}
          <div className={cn(
            "space-y-8",
            invert && "lg:col-start-2"
          )}>
            {/* Eyebrow */}
            {eyebrow && (
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[rgb(var(--accent))]/20 text-[rgb(var(--accent))]">
                {eyebrow}
              </div>
            )}

            {/* Title */}
            <h2 className="marketing-heading text-3xl md:text-4xl leading-tight">
              {title}
            </h2>

            {/* Subtitle */}
            {subtitle && (
              <p className="marketing-text text-lg leading-relaxed">
                {subtitle}
              </p>
            )}

            {/* Bullets */}
            {bullets.length > 0 && (
              <ul className="space-y-4">
                {bullets.map((bullet, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[rgb(var(--accent))]/20 flex items-center justify-center mt-0.5">
                      {bullet.icon || <Check className="w-4 h-4 text-[rgb(var(--accent))]" />}
                    </div>
                    <span className="marketing-text leading-relaxed">
                      {bullet.text}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {/* CTA */}
            {cta && (
              <div className="pt-4">
                <Button asChild className="btn-pastel">
                  <Link href={cta.href} className="inline-flex items-center">
                    {cta.label}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            )}
          </div>

                  {/* Image */}
                  <div className={cn(
                    "flex justify-center lg:justify-start",
                    invert && "lg:col-start-1 lg:justify-end"
                  )}>
                    <ClayPhone {...image} />
                  </div>
        </div>
      </div>
    </section>
  );
}
