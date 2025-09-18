import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: "Chioma A.",
    role: "First-time mother, 28 weeks",
    content: "SafeMama has been a lifesaver during my pregnancy. The voice check-ins make it so easy to track how I'm feeling, and my doctor loves the summaries.",
    rating: 5,
    background: "linear-gradient(135deg, rgb(var(--accent)), rgb(var(--accent-2)))"
  },
  {
    name: "Fatima Y.",
    role: "Second pregnancy, 32 weeks",
    content: "I love how SafeMama helps me stay organized with my appointments and medications. The trimester-specific content is incredibly helpful.",
    rating: 5,
    background: "linear-gradient(135deg, rgb(var(--accent-2)), rgb(var(--accent)))"
  },
  {
    name: "Teni O.",
    role: "High-risk pregnancy, 24 weeks",
    content: "The peace of mind SafeMama provides is priceless. Knowing I can easily share updates with my doctor gives me confidence in my pregnancy journey.",
    rating: 5,
    background: "linear-gradient(135deg, rgb(var(--primary)), rgb(var(--accent)))"
  },
  {
    name: "Aisha B.",
    role: "Third pregnancy, 18 weeks",
    content: "As a busy mom of two, SafeMama helps me stay on top of my health without adding stress. The voice features are perfect for multitasking.",
    rating: 5,
    background: "linear-gradient(135deg, rgb(var(--accent)), rgb(var(--primary)))"
  },
  {
    name: "Ngozi E.",
    role: "First pregnancy, 35 weeks",
    content: "The community features and educational content have been amazing. I feel so much more prepared for labor and delivery thanks to SafeMama.",
    rating: 5,
    background: "linear-gradient(135deg, rgb(var(--accent-2)), rgb(var(--primary)))"
  }
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="marketing-heading text-3xl md:text-4xl mb-6">
            What mothers are <span className="marketing-accent">saying</span>
          </h2>
          <p className="marketing-text text-lg">
            Real stories from mothers who trust SafeMama for their pregnancy journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="marketing-card p-6 relative overflow-hidden group cursor-pointer"
            >
              {/* Background gradient overlay */}
              <div 
                className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300"
                style={{ background: testimonial.background }}
              />
              
              <div className="relative z-10">
                {/* Quote icon */}
                <div className="w-8 h-8 bg-[rgb(var(--accent))]/20 rounded-full flex items-center justify-center mb-4">
                  <Quote className="w-4 h-4 text-[rgb(var(--accent))]" />
                </div>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-[rgb(var(--accent-2))] fill-current" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-[rgb(var(--ink))]/80 mb-4 text-sm leading-relaxed">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="border-t border-[rgb(var(--accent))]/20 pt-4">
                  <div className="font-semibold text-[rgb(var(--ink))] text-sm">
                    {testimonial.name}
                  </div>
                  <div className="text-[rgb(var(--ink))]/60 text-xs">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust indicator */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-2 bg-[rgb(var(--surface))] rounded-full px-6 py-3 border border-black/5">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-[rgb(var(--accent-2))] fill-current" />
              ))}
            </div>
            <span className="text-sm font-medium text-[rgb(var(--ink))]">
              4.9/5 average rating from 50,000+ users
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
