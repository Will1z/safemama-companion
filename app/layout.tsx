import './globals.css';
import type { Metadata } from 'next';
import { Inter, Playfair_Display, Roboto_Mono } from 'next/font/google';
import { ThemeProvider } from '@/providers/theme-provider';
import { TopNotice } from '@/components/ui/TopNotice';
import OfflineBanner from '@/components/OfflineBanner';
import ElevenLabsGlobalWidget from '@/components/voice/ElevenLabsGlobalWidget';

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  display: 'swap',
  fallback: ['system-ui', 'arial']
});
const playfair = Playfair_Display({ 
  subsets: ['latin'], 
  variable: '--font-playfair',
  display: 'swap',
  fallback: ['serif']
});
const robotoMono = Roboto_Mono({ 
  subsets: ['latin'], 
  variable: '--font-roboto-mono',
  display: 'swap',
  fallback: ['monospace']
});

export const metadata: Metadata = {
  title: 'SafeMama - Your Journey to Safe Motherhood',
  description: 'Comprehensive maternal health platform connecting expecting mothers with healthcare professionals for safer, healthier pregnancies.',
  keywords: 'maternal health, pregnancy, healthcare, AI monitoring, emergency response',
  authors: [{ name: 'SafeMama Team' }],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  themeColor: '#1C3D3A',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/icon-192x192.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light" data-theme="light" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} ${robotoMono.variable} font-inter`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <TopNotice 
            message="SafeMama is a medical information platform and does not replace professional medical advice. Always consult healthcare providers for medical emergencies."
            type="warning"
          />
          <OfflineBanner />
          {children}
          
          {/* Global ElevenLabs Widget */}
          <ElevenLabsGlobalWidget 
            height={560}
            width="400px"
          />
        </ThemeProvider>
      </body>
    </html>
  );
}