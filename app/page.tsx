import MarketingLayout from './marketing-layout';
import Hero from '@/components/marketing/Hero';
import TrustBar from '@/components/marketing/TrustBar';
import FeatureGrid from '@/components/marketing/FeatureGrid';
import ScreenshotWithBullets from '@/components/marketing/ScreenshotWithBullets';
import Testimonials from '@/components/marketing/Testimonials';
import CTA from '@/components/marketing/CTA';
import NewsletterModal from '@/components/marketing/NewsletterModal';
// import FeatureSection from '@/components/marketing/FeatureSection'; // Disabled temporarily

export default function MarketingPage() {
  return (
    <MarketingLayout>
      <Hero />
      <TrustBar />
      
      {/* Feature Sections - Temporarily disabled due to ClayPhone import issues */}
      <div className="py-20 bg-mint-soft">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Voice Check-ins</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Talk like you normally would—SafeMama understands pregnancy language and keeps replies short and caring.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">Hands-free reporting</h3>
              <p className="text-sm text-muted-foreground">Report symptoms using your voice</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">Clear replies</h3>
              <p className="text-sm text-muted-foreground">Get friendly responses in seconds</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">Simple language</h3>
              <p className="text-sm text-muted-foreground">No medical jargon unless you ask</p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-20 bg-blush-soft">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Care Summaries</h2>
          <p className="text-lg text-muted-foreground mb-8">
            SafeMama turns your check-in into a concise note you can send to your clinician.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">Short summaries</h3>
              <p className="text-sm text-muted-foreground">Easy-to-read health updates</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">Easy sharing</h3>
              <p className="text-sm text-muted-foreground">Email or WhatsApp to your doctor</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">Saved records</h3>
              <p className="text-sm text-muted-foreground">All summaries saved to your account</p>
            </div>
          </div>
        </div>
      </div>

      <FeatureGrid />
      <ScreenshotWithBullets />
      <Testimonials />
      <CTA />
      <NewsletterModal />
    </MarketingLayout>
  );
}