import React from 'react';
import { Award, Compass, Heart, Shield, Sparkles } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero */}
      <section className="relative h-[65vh] min-h-[440px] flex items-center justify-center overflow-hidden">
        <img
          src="/src/assets/images/hotel_hero_exterior_1791847526394.jpg"
          alt="The Grand Azure Palace Heritage"
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B192C] via-[#0B192C]/60 to-transparent" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white space-y-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C5A880]">
            The Heritage &amp; Vision
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight">
            Crafted for the Discerning
          </h1>
          <p className="text-sm sm:text-base text-slate-200 max-w-xl mx-auto leading-relaxed">
            The Grand Azure Hotel &amp; Suites was founded to restore the true essence of haute hospitality: graceful privacy, bespoke attentiveness, and timeless architectural harmony.
          </p>
        </div>
      </section>

      {/* Philosophy */}
      <section className="max-w-5xl mx-auto px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C5A880]">
              Hospitality Philosophy
            </span>
            <h2 className="font-serif text-3xl font-bold text-slate-900 leading-tight">
              Quiet Grandeur &amp; Intuitive Butler Service
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              True luxury does not clamor for attention. It exists in the flawless thread-count of Egyptian linens, the silent precision of our 24/7 personal butlers, and the morning sea breeze entering through floor-to-ceiling glass archways.
            </p>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Every room has been acoustically isolated by acoustic engineering specialists, ensuring complete sanctuary from the bustling world outside.
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200">
            <img
              src="/src/assets/images/dining_fine_restaurant_1791847527242.jpg"
              alt="Culinary Mastery"
              className="w-full h-80 object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-slate-200">
          <div className="space-y-2">
            <Award className="w-6 h-6 text-[#C5A880]" />
            <h4 className="font-serif text-lg font-bold text-slate-900">Michelin Gastronomy</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Executive Chef Laurent Mercier’s philosophy emphasizes ethical coastal catches, Alba truffles, and Grand Cru cellar treasures.
            </p>
          </div>

          <div className="space-y-2">
            <Shield className="w-6 h-6 text-[#C5A880]" />
            <h4 className="font-serif text-lg font-bold text-slate-900">Total Discretion &amp; Security</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Diplomatic-grade security perimeters, private elevator access, and confidential handling for global leaders and artists.
            </p>
          </div>

          <div className="space-y-2">
            <Heart className="w-6 h-6 text-[#C5A880]" />
            <h4 className="font-serif text-lg font-bold text-slate-900">Holistic Rejuvenation</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ancient thermal rituals combined with modern biostrength technology in our private stone thermal sanctuary.
            </p>
          </div>
        </div>

        <div className="text-center pt-8">
          <button
            onClick={() => onNavigate('/rooms')}
            className="px-8 py-4 bg-[#0B192C] hover:bg-[#132A4B] text-white font-semibold text-xs uppercase tracking-widest rounded-lg transition-colors shadow-lg cursor-pointer"
          >
            Experience The Grand Azure
          </button>
        </div>
      </section>
    </div>
  );
};
