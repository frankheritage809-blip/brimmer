import React, { useState } from 'react';
import { Waves, Sparkles, Heart, Activity, CheckCircle2, Shield, Calendar, Clock } from 'lucide-react';

interface WellnessPageProps {
  onNavigate: (path: string) => void;
}

export const WellnessPage: React.FC<WellnessPageProps> = ({ onNavigate }) => {
  const [spaBooked, setSpaBooked] = useState(false);
  const [treatment, setTreatment] = useState('Volcanic Hot Stone Journey (90 min)');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [guestName, setGuestName] = useState('');

  const treatments = [
    {
      name: 'Volcanic Hot Stone Healing Journey',
      duration: '90 min',
      price: '$280',
      description: 'Warmed basalt stones anointed with rare Moroccan argan oil, targeted to release deep muscular tension and restore chi energy.'
    },
    {
      name: 'Marine Collagen & Oscietra Caviar Facial',
      duration: '75 min',
      price: '$320',
      description: 'Cellular rejuvenation utilizing chilled jade rollers, microcurrent lifting, and concentrated marine peptide serum.'
    },
    {
      name: 'Travertine Thermal Plunge & Steam Detox',
      duration: '60 min',
      price: '$160',
      description: 'Private circuit through our 38°C thermal plunge, Finnish cedar sauna, eucalyptus herbal mist room, and ice fountain.'
    },
    {
      name: 'Mediterranean Herbal Body Polish & Wrap',
      duration: '60 min',
      price: '$210',
      description: 'Exfoliation with crushed sea salt, rosemary, and lavender essential oils followed by a restorative warm shea butter cocoon.'
    }
  ];

  const handleSpaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName) return;
    setSpaBooked(true);
  };

  return (
    <div className="space-y-20 pb-20">
      {/* Hero */}
      <section className="relative h-[65vh] min-h-[440px] flex items-center justify-center overflow-hidden">
        <img
          src="/src/assets/images/facility_spa_wellness_1791847527068.jpg"
          alt="The Azure Thermal Spa &amp; Sanctuary"
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B192C] via-[#0B192C]/60 to-transparent" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white space-y-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C5A880]">
            Holistic Sanctuary
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight">
            The Azure Thermal Spa &amp; Wellness Club
          </h1>
          <p className="text-sm sm:text-base text-slate-200 max-w-xl mx-auto leading-relaxed">
            Carved from natural travertine stone and bathed in soft ambient golden glow. Restore equilibrium with ancient thermal therapies and Olympic-grade athletic pavilions.
          </p>
        </div>
      </section>

      {/* Facilities Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C5A880]">
            Sanctuary Pillars
          </span>
          <h2 className="font-serif text-3xl font-bold text-slate-900 mt-1">
            World-Class Wellness Amenities
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] border border-slate-200 flex items-center justify-center text-[#C5A880]">
              <Waves className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-slate-900">Roman Thermal Baths</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Warm 38°C mineral pools, ice cold plunge wells (12°C), Finnish dry saunas, and Turkish hammam steam pavilions with natural aromatherapy.
            </p>
            <p className="text-[11px] text-slate-400">Open 07:00 – 22:00 Daily</p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] border border-slate-200 flex items-center justify-center text-[#C5A880]">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-slate-900">Biostrength Athletic Pavilion</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Outfitted with the latest Technogym AI Biostrength series, cardiovascular zones with ocean panorama, and dedicated personal athletic trainers.
            </p>
            <p className="text-[11px] text-slate-400">24/7 Keycard Access</p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] border border-slate-200 flex items-center justify-center text-[#C5A880]">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-slate-900">Private Ocean Cabanas</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Heated teak wood sun lounges, fresh fruit service, Evian facial mists, and dedicated butler cocktail service along our private infinity pool.
            </p>
            <p className="text-[11px] text-slate-400">Reserved for Hotel Guests</p>
          </div>
        </div>
      </section>

      {/* Spa Menu */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 lg:p-12 border border-slate-200 shadow-sm space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C5A880]">
              Bespoke Spa Treatments
            </span>
            <h3 className="font-serif text-3xl font-bold text-slate-900 mt-1">
              Curated Therapies Menu
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {treatments.map((item, i) => (
              <div
                key={i}
                className="p-6 bg-[#FAF8F5] rounded-2xl border border-slate-200/80 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif text-lg font-bold text-slate-900">{item.name}</h4>
                    <span className="font-serif text-xl font-bold text-[#0B192C] font-mono">{item.price}</span>
                  </div>
                  <span className="text-xs text-[#C5A880] font-semibold">{item.duration}</span>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Appointment Form */}
          <div className="pt-8 border-t border-slate-200 max-w-2xl mx-auto">
            <h4 className="font-serif text-xl font-bold text-slate-900 text-center mb-6">
              Reserve Your Spa Session
            </h4>

            {spaBooked ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-xs text-emerald-800 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="font-bold text-sm">Spa Appointment Requested</p>
                <p>Thank you, {guestName}. Our spa concierge will confirm your session for {treatment} on {date}.</p>
              </div>
            ) : (
              <form onSubmit={handleSpaSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Guest Name</label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    required
                    placeholder="e.g. Lord Harrison Thorne"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#0B192C]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Select Treatment</label>
                    <select
                      value={treatment}
                      onChange={(e) => setTreatment(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#0B192C]"
                    >
                      {treatments.map((t, idx) => (
                        <option key={idx} value={`${t.name} (${t.duration})`}>
                          {t.name} ({t.duration} - {t.price})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Preferred Date</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#0B192C]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#0B192C] hover:bg-[#132A4B] text-white font-semibold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                >
                  Request Spa Reservation
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
