import { CheckCircle, MessageCircle, Brain, Users } from 'lucide-react';

const benefits = [
  {
    icon: <MessageCircle className="w-5 h-5" />,
    title: "Natural Voice Conversations",
    description: "Speak naturally about your symptoms and concerns. Our AI understands pregnancy language."
  },
  {
    icon: <Brain className="w-5 h-5" />,
    title: "Intelligent Analysis",
    description: "Get personalized insights and recommendations based on your specific pregnancy stage."
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: "Seamless Sharing",
    description: "Easily share summaries with your healthcare provider for better care coordination."
  }
];

export default function ScreenshotWithBullets() {
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-[rgb(var(--surface))]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left - Phone screenshot */}
          <div className="relative">
            <div className="relative mx-auto max-w-sm">
              {/* Phone frame */}
              <div className="relative bg-[rgb(var(--ink))] rounded-[3rem] p-2 shadow-2xl">
                <div className="bg-[rgb(var(--surface))] rounded-[2.5rem] overflow-hidden">
                  {/* Status bar */}
                  <div className="h-8 bg-[rgb(var(--primary))] flex items-center justify-center">
                    <div className="w-16 h-1 bg-white/30 rounded-full"></div>
                  </div>
                  
                  {/* App content - Chat interface */}
                  <div className="p-4 space-y-4 h-96 overflow-y-auto">
                    {/* User message */}
                    <div className="flex justify-end">
                      <div className="bg-[rgb(var(--accent))] rounded-2xl rounded-br-md p-3 max-w-xs">
                        <p className="text-sm text-[rgb(var(--ink))]">I've been having some mild headaches lately</p>
                      </div>
                    </div>
                    
                    {/* AI response */}
                    <div className="flex justify-start">
                      <div className="bg-[rgb(var(--surface))] border border-[rgb(var(--accent))]/30 rounded-2xl rounded-bl-md p-3 max-w-xs">
                        <p className="text-sm text-[rgb(var(--ink))]">I understand. Headaches can be common during pregnancy. Let me help you track this and provide some guidance.</p>
                      </div>
                    </div>
                    
                    {/* Summary card */}
                    <div className="bg-[rgb(var(--accent))]/10 rounded-xl p-4 border border-[rgb(var(--accent))]/20">
                      <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-[rgb(var(--accent-2))]" />
                        <span className="text-xs font-medium text-[rgb(var(--ink))]">Summary Generated</span>
                      </div>
                      <p className="text-xs text-[rgb(var(--ink))]/70">Mild headaches reported. Recommend monitoring frequency and consulting healthcare provider if persistent.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Benefits */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-[rgb(var(--ink))]">
                How it <span className="text-[rgb(var(--accent))]">works</span>
              </h2>
              <p className="text-lg text-[rgb(var(--ink))]/70">
                Three simple steps to better pregnancy care and peace of mind
              </p>
            </div>

            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-[rgb(var(--accent))]/20 rounded-xl flex items-center justify-center text-[rgb(var(--accent))] flex-shrink-0">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[rgb(var(--ink))] mb-1">
                      {benefit.title}
                    </h3>
                    <p className="text-[rgb(var(--ink))]/70 text-sm">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <div className="inline-flex items-center space-x-2 bg-[rgb(var(--accent))]/10 rounded-full px-4 py-2">
                <CheckCircle className="w-4 h-4 text-[rgb(var(--accent-2))]" />
                <span className="text-sm font-medium text-[rgb(var(--ink))]">Takes 2-3 minutes to get started</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
