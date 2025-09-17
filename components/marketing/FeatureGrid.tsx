import { 
  Brain, 
  ShieldCheck, 
  Users, 
  Calendar, 
  MapPin, 
  MessageCircle,
  Heart,
  FileText,
  Phone,
  BookOpen,
  Lock
} from 'lucide-react';

const features = [
  {
    icon: <MessageCircle className="w-6 h-6" />,
    title: "Voice Check-ins",
    description: "Share your daily experiences and concerns through natural voice conversations with AI that understands pregnancy."
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Symptom Logging",
    description: "Track symptoms, mood, and health metrics with intelligent guidance and personalized recommendations."
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "Doctor Summaries",
    description: "Get clear, actionable summaries to share with your healthcare provider for better care coordination."
  },
  {
    icon: <Phone className="w-6 h-6" />,
    title: "Easy Sharing",
    description: "Send updates directly to your clinician via WhatsApp, email, or secure messaging platform."
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: "Learn by Trimester",
    description: "Personalized educational content tailored to your pregnancy stage and specific needs."
  },
  {
    icon: <Lock className="w-6 h-6" />,
    title: "Private & Secure",
    description: "HIPAA-compliant platform ensuring your data privacy and security with enterprise-grade encryption."
  }
];

export default function FeatureGrid() {
  return (
    <section id="features" className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[rgb(var(--ink))] mb-6">
            Everything you need for a <span className="text-[rgb(var(--accent))]">safe pregnancy</span>
          </h2>
          <p className="text-lg text-[rgb(var(--ink))]/70">
            Comprehensive tools and support designed specifically for expecting mothers
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="marketing-card p-6 group cursor-pointer"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 bg-[rgb(var(--accent))]/20 rounded-xl flex items-center justify-center text-[rgb(var(--accent))] group-hover:scale-110 transition-transform duration-200">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-[rgb(var(--ink))] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-[rgb(var(--ink))]/70 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
