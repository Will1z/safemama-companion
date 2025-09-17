import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Heart, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen marketing-theme">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-black/5 bg-[rgb(var(--surface))]/95 backdrop-blur supports-[backdrop-filter]:bg-[rgb(var(--surface))]/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[rgb(var(--primary))] rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="font-playfair font-semibold text-xl text-[rgb(var(--primary))]">SafeMama</span>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-sm text-[rgb(var(--ink))]/70 hover:text-[rgb(var(--ink))] transition-colors">
              Home
            </Link>
            <Link href="#how-it-works" className="text-sm text-[rgb(var(--ink))]/70 hover:text-[rgb(var(--ink))] transition-colors">
              How it works
            </Link>
            <Link href="#features" className="text-sm text-[rgb(var(--ink))]/70 hover:text-[rgb(var(--ink))] transition-colors">
              Features
            </Link>
            <Link href="#testimonials" className="text-sm text-[rgb(var(--ink))]/70 hover:text-[rgb(var(--ink))] transition-colors">
              Testimonials
            </Link>
            <Button asChild className="btn-pastel">
              <Link href="/dashboard">Open the App</Link>
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-[rgb(var(--ink))]"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-black/5 bg-[rgb(var(--surface))]/95 backdrop-blur">
            <div className="container mx-auto px-4 py-4 space-y-4">
              <Link 
                href="/" 
                className="block text-sm text-[rgb(var(--ink))]/70 hover:text-[rgb(var(--ink))] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="#how-it-works" 
                className="block text-sm text-[rgb(var(--ink))]/70 hover:text-[rgb(var(--ink))] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                How it works
              </Link>
              <Link 
                href="#features" 
                className="block text-sm text-[rgb(var(--ink))]/70 hover:text-[rgb(var(--ink))] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link 
                href="#testimonials" 
                className="block text-sm text-[rgb(var(--ink))]/70 hover:text-[rgb(var(--ink))] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Testimonials
              </Link>
              <Button asChild className="btn-pastel w-full">
                <Link href="/dashboard">Open the App</Link>
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main>
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[rgb(var(--primary))] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-[rgb(var(--accent))] rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-[rgb(var(--ink))]" />
                </div>
                <span className="font-playfair font-semibold text-xl">SafeMama</span>
              </div>
              <p className="text-white/80 text-sm">
                A gentle antenatal companion for every mother.
              </p>
            </div>

            {/* Product */}
            <div className="space-y-4">
              <h3 className="font-semibold">Product</h3>
              <div className="space-y-2">
                <Link href="/dashboard" className="block text-white/80 hover:text-white text-sm transition-colors">
                  Dashboard
                </Link>
                <Link href="/learn" className="block text-white/80 hover:text-white text-sm transition-colors">
                  Learn
                </Link>
                <Link href="/vitals" className="block text-white/80 hover:text-white text-sm transition-colors">
                  Vitals
                </Link>
                <Link href="/community" className="block text-white/80 hover:text-white text-sm transition-colors">
                  Community
                </Link>
              </div>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h3 className="font-semibold">Support</h3>
              <div className="space-y-2">
                <Link href="/help" className="block text-white/80 hover:text-white text-sm transition-colors">
                  Help Center
                </Link>
                <Link href="/privacy" className="block text-white/80 hover:text-white text-sm transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="block text-white/80 hover:text-white text-sm transition-colors">
                  Terms of Service
                </Link>
              </div>
            </div>

            {/* Company */}
            <div className="space-y-4">
              <h3 className="font-semibold">Company</h3>
              <div className="space-y-2">
                <Link href="/demo" className="block text-white/80 hover:text-white text-sm transition-colors">
                  Request Demo
                </Link>
                <Link href="/console" className="block text-white/80 hover:text-white text-sm transition-colors">
                  Provider Console
                </Link>
                <Button asChild className="btn-pastel mt-4">
                  <Link href="/dashboard">Open the App</Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 mt-12 pt-8 text-center">
            <p className="text-white/80 text-sm">
              © 2024 SafeMama. All rights reserved. Empowering safer pregnancies worldwide.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
