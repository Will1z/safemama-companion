"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const items = [
  { href: "/dashboard", label: "Home", icon: "🏠" },
  { href: "/chat", label: "Chat", icon: "💬" },
  { href: "/vitals", label: "Vitals", icon: "🫀" },
  { href: "/help", label: "Help", icon: "🆘" },
];

export default function BottomNav() {
  const path = usePathname();
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t shadow-md">
      <ul className="mx-auto max-w-4xl grid grid-cols-4">
        {items.map((it) => {
          const active = path.startsWith(it.href);
          return (
            <li key={it.href}>
              <Link
                href={it.href}
                className={clsx(
                  "flex flex-col items-center justify-center py-2 text-[13px] font-medium",
                  active ? "text-[#1C3D3A]" : "text-[#1B2735]/70"
                )}
                aria-current={active ? "page" : undefined}
              >
                <span className="mb-0.5">{it.icon}</span>
                <span>{it.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}