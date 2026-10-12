import React from 'react';
import { useBooking } from '../context/BookingContext.js';
import { Sparkles, Tag, ArrowRight, Check, Heart, Shield, Waves, Users } from 'lucide-react';

interface OffersPageProps {
  onNavigate: (path: string) => void;
}

export const OffersPage: React.FC<OffersPageProps> = ({ onNavigate }) => {
  const { applyPromoCode } = useBooking();

  const packages = [
    {
      title: 'The Royal Romantic Escape',
      category: 'Couples & Honeymoon',
      discount: '20% OFF',
      code: 'HONEYMOON',
      nights: 'Minimum 3 Nights',
      icon: Heart,
      description: 'Celebrate love with chilled Dom Pérignon and Belgian strawberries upon arrival, daily breakfast served in bed, romantic private candlelit 4-course dinner at L’Azur, and a couple’s hot stone treatment at our thermal spa.',
      inclusions: [
        'Complimentary bottle of Dom Pérignon Brut',
        'Couple’s 90-min Thermal Stone Therapy',
        'Daily artisanal champagne breakfast in suite',
        'Guaranteed 16:00 late check-out priority'
      ]
    },
    {
      title: 'The Executive Privileges Club',
      category: 'Corporate & Business Leaders',
      discount: '10% OFF',
      code: 'EXECUTIVE10',
      nights: 'Valid on All Stays',
      icon: Shield,
      description: 'Engineered for seamless productivity and high diplomacy. Private chauffeured airport transfers in our Mercedes S-Class, garment pressing, high-speed encrypted Wi-Fi, and 24/7 access to the 22nd-floor Azure Club Lounge.',
      inclusions: [
        'Roundtrip private airport limousine service',
        'All-day Azure Club Lounge privileges',
        'Complimentary pressing of 2 suits or dresses daily',
        '2 hours private boardroom allocation'
      ]
    },
    {
      title: 'Grand Azure Welcome Season',
      category: 'Seasonal Promotion',
      discount: '15% OFF',
      code: 'AZURE2026',
      nights: 'Minimum 2 Nights',
      icon: Sparkles,
      description: 'Experience our world-awarded coastal luxury with 15% off any suite tier. Includes $150 resort credit redeemable across our Michelin fine dining restaurants, thermal spa, or private yacht excursions.',
      inclusions: [
        '15% direct discount on total stay price',
        '$150 resort credit per suite reservation',
        'Daily gourmet buffet and à la carte breakfast',
        'Welcome fruit basket and artisanal macarons'
      ]
    },
    {
      title: 'The Oceanfront Family Retreat',
      category: 'Family & Multi-Generational',
      discount: 'Family Perks',
      code: 'AZURE2026',
      nights: 'Minimum 3 Nights',
      icon: Users,
      description: 'Spacious interconnecting suites with luxury child amenities, tailored kids’ marine biology excursions, complimentary ice cream at the pool terrace, and dedicated evening babysitting.',
      inclusions: [
        '50% off second interconnecting room',
        'Kids dine complimentary from junior gourmet menu',
        'Complimentary 4 hours certified concierge childcare',
        'Family catamaran dolphin observation trip'
      ]
    }
  ];

  const handleApplyOffer = (code: string) => {
    applyPromoCode(code);
    onNavigate('/rooms');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#C5A880]">
          Bespoke Privileges
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">
          Special Offers &amp; Curated Packages
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed">
          Book directly with The Grand Azure to unlock exclusive promotional codes, resort credits, and complimentary luxury inclusions.
        </p>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {packages.map((pkg, idx) => {
          const Icon = pkg.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-8 flex flex-col justify-between space-y-6 hover:shadow-xl transition-all duration-300"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-[#C5A880]">
                    {pkg.category}
                  </span>
                  <span className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-900 rounded-full text-xs font-bold font-mono">
                    {pkg.discount}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-slate-200 flex items-center justify-center text-[#0B192C]">
                    <Icon className="w-5 h-5 text-[#C5A880]" />
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-slate-900">{pkg.title}</h3>
                    <p className="text-[11px] text-slate-400">{pkg.nights}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{pkg.description}</p>

                {/* Inclusions */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Package Inclusions:
                  </p>
                  {pkg.inclusions.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                      <Check className="w-3.5 h-3.5 text-[#C5A880] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Box */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded">
                    {pkg.code}
                  </span>
                </div>

                <button
                  onClick={() => handleApplyOffer(pkg.code)}
                  className="px-5 py-2.5 bg-[#0B192C] hover:bg-[#132A4B] text-white font-semibold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Apply &amp; Book</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C5A880]" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
