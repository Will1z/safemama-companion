"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { 
  HomeIcon, 
  ChatBubbleLeftIcon, 
  HeartIcon, 
  QuestionMarkCircleIcon 
} from "@heroicons/react/24/outline";
import { 
  HomeIcon as HomeIconSolid, 
  ChatBubbleLeftIcon as ChatBubbleLeftIconSolid, 
  HeartIcon as HeartIconSolid, 
  QuestionMarkCircleIcon as QuestionMarkCircleIconSolid 
} from "@heroicons/react/24/solid";

const items = [
  { 
    href: "/dashboard", 
    label: "Home", 
    icon: HomeIcon, 
    iconSolid: HomeIconSolid 
  },
  { 
    href: "/chat", 
    label: "Chat", 
    icon: ChatBubbleLeftIcon, 
    iconSolid: ChatBubbleLeftIconSolid 
  },
  { 
    href: "/vitals", 
    label: "Vitals", 
    icon: HeartIcon, 
    iconSolid: HeartIconSolid 
  },
  { 
    href: "/help", 
    label: "Help", 
    icon: QuestionMarkCircleIcon, 
    iconSolid: QuestionMarkCircleIconSolid 
  },
];

export default function BottomNav() {
  const path = usePathname();
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-t border-slate-200 shadow-md pb-[max(8px,env(safe-area-inset-bottom))]">
      <ul className="mx-auto max-w-4xl grid grid-cols-4">
        {items.map((it) => {
          const active = path.startsWith(it.href);
          const IconComponent = active ? it.iconSolid : it.icon;
          return (
            <li key={it.href}>
              <Link
                href={it.href}
                className={clsx(
                  "flex flex-col items-center justify-center py-2 text-[13px] font-medium transition-colors",
                  active ? "text-[rgb(var(--primary-foreground))]" : "text-[rgb(var(--foreground))]/70"
                )}
                aria-current={active ? "page" : undefined}
              >
                <IconComponent className="w-5 h-5 mb-0.5" />
                <span>{it.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}