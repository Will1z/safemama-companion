import './globals.css';
import type { Metadata } from 'next';
import { Inter, Playfair_Display, Roboto_Mono } from 'next/font/google';
import { TopNotice } from '@/components/ui/TopNotice';
import OfflineBanner from '@/components/OfflineBanner';
import ElevenLabsGlobalWidget from '@/components/voice/ElevenLabsGlobalWidget';
import { AuthProvider } from '@/components/auth/AuthProvider';

// TypeScript declaration for global Window interface
declare global {
  interface Window {
    SAFEMAMA_SESSION_ID?: string;
  }
}

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  display: 'swap',
  fallback: ['system-ui', 'arial'],
  preload: true
});
const playfair = Playfair_Display({ 
  subsets: ['latin'], 
  variable: '--font-playfair',
  display: 'swap',
  fallback: ['serif'],
  preload: true
});
const robotoMono = Roboto_Mono({ 
  subsets: ['latin'], 
  variable: '--font-roboto-mono',
  display: 'swap',
  fallback: ['monospace'],
  preload: true
});

export const metadata: Metadata = {
  metadataBase: new URL('https://safemama.app'),
  title: 'SafeMama — A gentle antenatal voice companion',
  description: 'Calm, supportive guidance for pregnancy. Voice check-ins, trimester learn content, and simple summaries for your clinician.',
  keywords: 'pregnancy, antenatal care, voice companion, maternal health, pregnancy support, healthcare, AI assistant',
  authors: [{ name: 'SafeMama Team' }],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  themeColor: 'rgb(194, 227, 226)',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/icon-192x192.png',
  },
  openGraph: {
    title: 'SafeMama — A gentle antenatal voice companion',
    description: 'Calm, supportive guidance for pregnancy. Voice check-ins, trimester learn content, and simple summaries for your clinician.',
    url: 'https://safemama.app',
    siteName: 'SafeMama',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'SafeMama - A gentle antenatal voice companion',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SafeMama — A gentle antenatal voice companion',
    description: 'Calm, supportive guidance for pregnancy. Voice check-ins, trimester learn content, and simple summaries for your clinician.',
    images: ['/og.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light" data-theme="light" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} ${robotoMono.variable} font-inter`} style={{backgroundColor: 'rgb(255 255 255)', color: 'rgb(15 23 42)'}}>
        <AuthProvider>
          <TopNotice 
            message="SafeMama is a medical information platform and does not replace professional medical advice. Always consult healthcare providers for medical emergencies."
            type="warning"
          />
          <OfflineBanner />
          {children}
        </AuthProvider>
        
        {/* Global ElevenLabs Widget */}
        <ElevenLabsGlobalWidget 
          height={560}
          width="400px"
        />
        
        {/* Session ID Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function getOrCreateSessionId() {
                  if (typeof window === 'undefined') return '';
                  const key = 'safemama_session_id';
                  const existing = window.localStorage.getItem(key);
                  if (existing) return existing;
                  const newId = crypto.randomUUID();
                  window.localStorage.setItem(key, newId);
                  return newId;
                }
                window.SAFEMAMA_SESSION_ID = getOrCreateSessionId();
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}