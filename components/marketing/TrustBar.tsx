import { Star } from 'lucide-react';

export default function TrustBar() {
  return (
    <section className="py-12 bg-[rgb(var(--surface))] border-y border-black/5">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-12">
          {/* Rating pill */}
          <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-sm border border-black/5">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-[rgb(var(--accent-2))] fill-current" />
              ))}
            </div>
            <span className="text-sm font-medium text-[rgb(var(--ink))]">4.9/5</span>
          </div>

          {/* User avatars and text */}
          <div className="flex items-center space-x-3">
            <div className="flex -space-x-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                  style={{
                    background: `linear-gradient(135deg, ${i % 2 === 0 ? 'rgb(var(--accent))' : 'rgb(var(--accent-2))'}, ${i % 2 === 0 ? 'rgb(var(--accent-2))' : 'rgb(var(--accent))'})`
                  }}
                />
              ))}
            </div>
            <span className="text-sm text-[rgb(var(--ink))]/70">
              Loved by <span className="font-semibold text-[rgb(var(--ink))]">50,000+</span> expecting mothers
            </span>
          </div>

          {/* Trust badges */}
          <div className="flex items-center space-x-6 text-xs text-[rgb(var(--ink))]/60">
            <span>✓ HIPAA Compliant</span>
            <span>✓ Medical Grade Security</span>
            <span>✓ 24/7 Support</span>
          </div>
        </div>
      </div>
    </section>
  );
}
