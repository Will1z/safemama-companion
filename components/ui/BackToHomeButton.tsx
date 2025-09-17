'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function BackToHomeButton() {
  const pathname = usePathname();

  // Don't render on marketing pages or root
  if (pathname === '/' || pathname.startsWith('/(marketing)')) {
    return null;
  }

  return (
    <Link href="/" aria-label="Back to SafeMama Home" prefetch>
      <Button 
        variant="secondary" 
        className="px-4 py-2 rounded-xl bg-[rgb(var(--secondary))] text-[rgb(var(--secondary-foreground))] hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent))] focus:ring-offset-2 min-h-[44px]"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Button>
    </Link>
  );
}
