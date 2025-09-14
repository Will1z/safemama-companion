import Link from "next/link";
import clsx from "clsx";
import type { ReactNode } from "react";

type Props = {
  href?: string;
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  tone?: "neutral" | "accent" | "warn"; // accent=teal tint, warn=peach/amber tint
  disabled?: boolean;
  className?: string;
};

export default function Tile({ href = "#", icon, title, subtitle, tone = "neutral", disabled, className }: Props) {
  const wrap = clsx(
    "block rounded-2xl border p-4 shadow-soft",
    tone === "neutral" && "bg-white border-[#E7ECEF]",
    tone === "accent" && "bg-[#EAF4F3] border-[#CFEBDC]",
    tone === "warn" && "bg-orange-50 border-orange-200",
    disabled && "opacity-60 pointer-events-none",
    className
  );
  const TitleClass = clsx(
    "font-heading text-xl",
    tone === "warn" ? "text-orange-800" : "text-[#1B2735]"
  );
  const SubClass = clsx(
    "text-sm mt-1",
    tone === "warn" ? "text-orange-700" : "text-[#6C757D]"
  );

  const Inner = (
    <div className={wrap} aria-disabled={disabled}>
      <div className="flex items-start gap-3">
        {icon && <div className="mt-0.5">{icon}</div>}
        <div>
          <div className={TitleClass}>{title}</div>
          {subtitle && <div className={SubClass}>{subtitle}</div>}
        </div>
      </div>
    </div>
  );

  return href ? <Link href={href}>{Inner}</Link> : Inner;
}