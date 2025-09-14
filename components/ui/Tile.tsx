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
    tone === "neutral" && "bg-white border-[rgb(var(--border))]",
    tone === "accent" && "bg-[rgb(var(--primary))]/20 border-[rgb(var(--primary))]/30",
    tone === "warn" && "bg-[rgb(var(--warning))]/60 border-[rgb(var(--warning))]",
    disabled && "opacity-60 pointer-events-none",
    className
  );
  const TitleClass = clsx(
    "font-heading text-xl",
    tone === "warn" ? "text-slate-900" : "text-[rgb(var(--primary-foreground))]"
  );
  const SubClass = clsx(
    "text-sm mt-1",
    tone === "warn" ? "text-slate-800" : "text-muted-foreground"
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