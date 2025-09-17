import MarketingLayout from './marketing-layout';
import Hero from '@/components/marketing/Hero';
import TrustBar from '@/components/marketing/TrustBar';
import FeatureGrid from '@/components/marketing/FeatureGrid';
import ScreenshotWithBullets from '@/components/marketing/ScreenshotWithBullets';
import Testimonials from '@/components/marketing/Testimonials';
import CTA from '@/components/marketing/CTA';
import NewsletterModal from '@/components/marketing/NewsletterModal';

export default function MarketingPage() {
  return (
    <MarketingLayout>
      <Hero />
      <TrustBar />
      <FeatureGrid />
      <ScreenshotWithBullets />
      <Testimonials />
      <CTA />
      <NewsletterModal />
    </MarketingLayout>
  );
}