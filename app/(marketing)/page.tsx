import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Heart, 
  Clock, 
  Brain, 
  Users, 
  Calendar,
  MapPin,
  Phone,
  ShieldCheck,
  ArrowRight,
  MessageCircle,
  FileText,
  BookOpen,
  CheckCircle,
  Star
} from 'lucide-react';

export default function MarketingPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden" style={{ backgroundColor: 'rgb(140, 200, 205)' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20"></div>
        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="h1-clamp font-playfair font-bold mb-6">
              A gentle antenatal companion for every mother.
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white/90 leading-relaxed max-w-3xl mx-auto">
              SafeMama listens, supports, and helps you share updates with your clinician.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" variant="accent" asChild>
                <Link href="/dashboard" className="flex items-center">
                  Open the App
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Link href="/chat" className="flex items-center">
                  <MessageCircle className="mr-2 w-5 h-5" />
                  Talk to SafeMama
                </Link>
              </Button>
            </div>
            
            {/* Hero Image Placeholder */}
            <div className="relative max-w-2xl mx-auto">
              <div className="aspect-video bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <div className="text-center">
                  <Heart className="w-16 h-16 mx-auto mb-4 text-white/60" />
                  <p className="text-white/80">SafeMama in action</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-6">
              Everything you need for a safe pregnancy
            </h2>
            <p className="text-lg text-muted-foreground">
              Comprehensive tools and support designed specifically for expecting mothers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Voice Check-ins */}
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Voice Check-ins</h3>
                <p className="text-muted-foreground text-sm">
                  Share your daily experiences and concerns through natural voice conversations
                </p>
              </CardContent>
            </Card>

            {/* Symptom Logging */}
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Symptom Logging</h3>
                <p className="text-muted-foreground text-sm">
                  Track symptoms, mood, and health metrics with intelligent guidance
                </p>
              </CardContent>
            </Card>

            {/* Doctor Summaries */}
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-6 h-6 text-success" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Doctor Summaries</h3>
                <p className="text-muted-foreground text-sm">
                  Get clear, actionable summaries to share with your healthcare provider
                </p>
              </CardContent>
            </Card>

            {/* WhatsApp/Email Integration */}
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-info/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-6 h-6 text-info" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Easy Sharing</h3>
                <p className="text-muted-foreground text-sm">
                  Send updates directly to your clinician via WhatsApp or email
                </p>
              </CardContent>
            </Card>

            {/* Learn by Trimester */}
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-6 h-6 text-warning" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Learn by Trimester</h3>
                <p className="text-muted-foreground text-sm">
                  Personalized educational content tailored to your pregnancy stage
                </p>
              </CardContent>
            </Card>

            {/* Private & Secure */}
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-6 h-6 text-destructive" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Private & Secure</h3>
                <p className="text-muted-foreground text-sm">
                  HIPAA-compliant platform ensuring your data privacy and security
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-6">
              How it works
            </h2>
            <p className="text-lg text-muted-foreground">
              Three simple steps to better pregnancy care
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-xl mb-4">1. Talk to SafeMama</h3>
              <p className="text-muted-foreground">
                Share your daily experiences, concerns, and questions through natural voice conversations
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-xl mb-4">2. Safe guidance & summaries</h3>
              <p className="text-muted-foreground">
                Receive personalized insights and clear summaries of your health status
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-xl mb-4">3. Share with your clinician</h3>
              <p className="text-muted-foreground">
                Easily share updates and summaries with your healthcare provider
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-6">
              What mothers are saying
            </h2>
            <p className="text-lg text-muted-foreground">
              Real stories from mothers who trust SafeMama
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Testimonial 1 */}
            <Card className="p-6">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-warning fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "SafeMama has been a lifesaver during my pregnancy. The voice check-ins make it so easy to track how I'm feeling, and my doctor loves the summaries."
                </p>
                <div className="font-semibold">Sarah M.</div>
                <div className="text-sm text-muted-foreground">First-time mother, 28 weeks</div>
              </CardContent>
            </Card>

            {/* Testimonial 2 */}
            <Card className="p-6">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-warning fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "I love how SafeMama helps me stay organized with my appointments and medications. The trimester-specific content is incredibly helpful."
                </p>
                <div className="font-semibold">Maria L.</div>
                <div className="text-sm text-muted-foreground">Second pregnancy, 32 weeks</div>
              </CardContent>
            </Card>

            {/* Testimonial 3 */}
            <Card className="p-6">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-warning fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "The peace of mind SafeMama provides is priceless. Knowing I can easily share updates with my doctor gives me confidence in my pregnancy journey."
                </p>
                <div className="font-semibold">Jennifer K.</div>
                <div className="text-sm text-muted-foreground">High-risk pregnancy, 24 weeks</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about SafeMama
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {/* FAQ Item 1 */}
            <Card className="p-6">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-3">Is my data private and secure?</h3>
                <p className="text-muted-foreground">
                  Yes, absolutely. SafeMama is HIPAA-compliant and uses enterprise-grade security to protect your personal health information. Your data is encrypted and only accessible to you and your authorized healthcare providers.
                </p>
              </CardContent>
            </Card>

            {/* FAQ Item 2 */}
            <Card className="p-6">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-3">How are summaries sent to my doctor?</h3>
                <p className="text-muted-foreground">
                  You can choose to send summaries via WhatsApp, email, or through our secure platform. The summaries are formatted to be easily understood by healthcare professionals and include all relevant information about your health status.
                </p>
              </CardContent>
            </Card>

            {/* FAQ Item 3 */}
            <Card className="p-6">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-3">Who can see my information?</h3>
                <p className="text-muted-foreground">
                  Only you and the healthcare providers you explicitly choose to share information with can access your data. You have complete control over who sees what information and when.
                </p>
              </CardContent>
            </Card>

            {/* FAQ Item 4 */}
            <Card className="p-6">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-3">How much does SafeMama cost?</h3>
                <p className="text-muted-foreground">
                  SafeMama offers a free tier with basic features. Premium features are available through healthcare providers or as part of insurance coverage. Contact us to learn about pricing options in your area.
                </p>
              </CardContent>
            </Card>

            {/* FAQ Item 5 */}
            <Card className="p-6">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-3">Can I use SafeMama offline?</h3>
                <p className="text-muted-foreground">
                  Yes, SafeMama works offline for basic features like logging symptoms and viewing your dashboard. Voice conversations and data syncing require an internet connection, but your data is safely stored locally when offline.
                </p>
              </CardContent>
            </Card>

            {/* FAQ Item 6 */}
            <Card className="p-6">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-3">What languages does SafeMama support?</h3>
                <p className="text-muted-foreground">
                  SafeMama currently supports English, with plans to add Spanish, French, and other languages based on user demand. Voice conversations work in multiple languages through our AI translation capabilities.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 text-white" style={{ backgroundColor: 'rgb(140, 200, 205)' }}>
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-6">
              Ready to feel supported?
            </h2>
            <p className="text-lg mb-8 text-white/90">
              Join thousands of mothers who trust SafeMama for their pregnancy journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" variant="accent" asChild>
                <Link href="/dashboard" className="flex items-center">
                  Open the App
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
            
            {/* Trust badges */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-white/80">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4" />
                <span>HIPAA Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4" />
                <span>Free to Start</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
