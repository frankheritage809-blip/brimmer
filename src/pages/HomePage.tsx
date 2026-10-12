import React, { useState, useEffect } from 'react';
import { Room } from '../types/hotel.js';
import { SearchWidget } from '../components/booking/SearchWidget.js';
import { useBooking } from '../context/BookingContext.js';
import {
  Sparkles,
  Wifi,
  Coffee,
  Waves,
  Utensils,
  Wine,
  Compass,
  ArrowRight,
  Star,
  MapPin,
  Clock,
  ShieldCheck,
  Award,
  ChevronRight
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (path: string) => void;
  onSelectRoom: (room: Room) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onSelectRoom }) => {
  const { selectRoom } = useBooking();
  const [featuredRooms, setFeaturedRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/rooms')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.rooms) {
          setFeaturedRooms(data.rooms.slice(0, 3));
        }
      })
      .catch((err) => console.error('Failed to load rooms:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleBookRoom = (room: Room) => {
    selectRoom(room);
    onSelectRoom(room);
    onNavigate('/checkout');
  };

  const handleExploreRoom = (room: Room) => {
    selectRoom(room);
    onSelectRoom(room);
    onNavigate(`/room/${room.id}`);
  };

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Measured Contrast Scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/hotel_hero_exterior_1791847526394.jpg"
            alt="The Grand Azure Palace &amp; Resort"
            className="w-full h-full object-cover scale-105 transform motion-safe:transition-transform motion-safe:duration-1000"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070F1A] via-[#0B192C]/65 to-[#0B192C]/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-28 text-center text-white flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs tracking-widest uppercase font-medium text-[#C5A880] mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>World Luxury Hotel Award Winner 2026</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl leading-[1.1] text-balance">
            Where Timeless Coastal Elegance Meets Haute Hospitality
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-200 max-w-2xl font-light leading-relaxed">
            Perched gracefully between azure ocean waters and lush botanical estates. Experience bespoke butler service, Michelin-starred culinary artistry, and restorative sanctuary suites.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('/rooms')}
              className="px-8 py-4 bg-[#C5A880] hover:bg-[#d8bd95] text-[#0B192C] font-semibold text-xs uppercase tracking-widest rounded-lg transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
            >
              <span>Explore All Suites</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('/dining')}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/30 font-semibold text-xs uppercase tracking-widest rounded-lg transition-all backdrop-blur-md cursor-pointer"
            >
              Fine Dining &amp; Cellar
            </button>
          </div>

          {/* Integrated Live Booking Search Widget below Hero */}
          <div className="w-full max-w-5xl mt-14">
            <SearchWidget onSearch={() => onNavigate('/rooms')} />
          </div>
        </div>
      </section>

      {/* 2. WELCOME & HERITAGE STORY */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C5A880]">
              The Grand Azure Legacy
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
              An Architectural Sanctuary Designed for Discerning Souls
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              Founded on the belief that genuine luxury is felt in silent thoughtfulness, The Grand Azure brings together Mediterranean craftsmanship with contemporary poise. Every archway frames reflective waters, and every room is acoustically insulated to offer deep peace.
            </p>
            <div className="grid grid-cols-3 gap-6 pt-4 border-t border-slate-200">
              <div>
                <p className="font-serif text-3xl font-bold text-[#0B192C] font-mono tabular-nums">185</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Sqm Penthouse</p>
              </div>
              <div>
                <p className="font-serif text-3xl font-bold text-[#0B192C] font-mono tabular-nums">24/7</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Butler Service</p>
              </div>
              <div>
                <p className="font-serif text-3xl font-bold text-[#0B192C] font-mono tabular-nums">3★</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Michelin Gastronomy</p>
              </div>
            </div>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('/about')}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B192C] hover:text-[#C5A880] transition-colors"
              >
                <span>Read Our Hotel Story &amp; Philosophy</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
              <img
                src="/src/assets/images/room_deluxe_ocean_1791847526856.jpg"
                alt="Grand Azure Oceanfront Suite"
                className="w-full h-[480px] object-cover hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-[#0B192C] text-white p-6 rounded-xl shadow-xl max-w-xs border border-[#1E3A5F] hidden sm:block">
              <div className="flex items-center gap-1 text-[#C5A880] mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#C5A880]" />
                ))}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                "The most sublime hospitality experience in West Africa and the Côte d'Azur."
              </p>
              <p className="text-[11px] text-[#C5A880] font-semibold mt-2">— Condé Nast Traveler</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED ROOMS & SUITES */}
      <section className="bg-white py-20 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#C5A880]">
                Private Accommodations
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 mt-1">
                Featured Suites &amp; Residences
              </h2>
              <p className="text-slate-500 text-sm mt-2 max-w-xl">
                Every suite features bespoke Italian linens, ocean terraces, marble soaking tubs, and individualized climate automation.
              </p>
            </div>
            <button
              onClick={() => onNavigate('/rooms')}
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#0B192C] hover:text-[#C5A880] transition-colors"
            >
              <span>View All 6 Suites</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Rooms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredRooms.map((room) => (
              <div
                key={room.id}
                className="group bg-[#FAF8F5] rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                {/* Image slot */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={room.images[0]}
                    alt={room.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-[#0B192C]/85 backdrop-blur-md px-3 py-1 rounded text-[11px] font-semibold uppercase tracking-wider text-[#C5A880]">
                    {room.category}
                  </div>
                  <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg text-slate-900 shadow-sm">
                    <span className="font-serif text-lg font-bold">${room.pricePerNight}</span>
                    <span className="text-[11px] text-slate-500 font-normal"> / night</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-slate-900 group-hover:text-[#0B192C] transition-colors">
                      {room.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {room.shortDescription}
                    </p>

                    {/* Room Specs */}
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-3 pt-3 border-t border-slate-200/70">
                      <span>{room.sizeSqm} sqm</span>
                      <span aria-hidden="true">·</span>
                      <span>{room.bedType.split('+')[0]}</span>
                      <span aria-hidden="true">·</span>
                      <span>Up to {room.capacityAdults} Guests</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex items-center gap-3">
                    <button
                      onClick={() => handleExploreRoom(room)}
                      className="flex-1 py-2.5 border border-slate-300 hover:border-slate-800 text-slate-800 font-medium text-xs rounded-lg transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleBookRoom(room)}
                      className="flex-1 py-2.5 bg-[#0B192C] hover:bg-[#132A4B] text-white font-semibold text-xs rounded-lg transition-colors shadow-sm"
                    >
                      Reserve Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. HOTEL FACILITIES & SERVICES */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C5A880]">
            Sanctuary &amp; Indulgence
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 mt-1">
            Unrivaled World-Class Facilities
          </h2>
          <p className="text-slate-500 text-sm mt-2">
            Every amenity is crafted to restore body, mind, and spirit under the guidance of world-renowned specialists.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-7 rounded-2xl border border-slate-200/90 shadow-sm space-y-4 hover:border-[#C5A880] transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] border border-slate-200 flex items-center justify-center text-[#0B192C]">
              <Waves className="w-6 h-6 text-[#C5A880]" />
            </div>
            <h3 className="font-serif text-lg font-bold text-slate-900">Thermal Spa &amp; Hydrotherapy</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Carved from Roman travertine with Finnish sauna, eucalyptus steam chambers, and hot volcanic stone massage therapy.
            </p>
            <button
              onClick={() => onNavigate('/wellness')}
              className="text-xs font-semibold text-[#0B192C] hover:text-[#C5A880] inline-flex items-center gap-1"
            >
              <span>Explore Treatments</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-slate-200/90 shadow-sm space-y-4 hover:border-[#C5A880] transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] border border-slate-200 flex items-center justify-center text-[#0B192C]">
              <Utensils className="w-6 h-6 text-[#C5A880]" />
            </div>
            <h3 className="font-serif text-lg font-bold text-slate-900">Michelin Fine Dining</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Three signature restaurants overseen by Michelin-starred culinary visionaries, celebrating fresh sea catches and seasonal black truffles.
            </p>
            <button
              onClick={() => onNavigate('/dining')}
              className="text-xs font-semibold text-[#0B192C] hover:text-[#C5A880] inline-flex items-center gap-1"
            >
              <span>View Menus</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-slate-200/90 shadow-sm space-y-4 hover:border-[#C5A880] transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] border border-slate-200 flex items-center justify-center text-[#0B192C]">
              <Compass className="w-6 h-6 text-[#C5A880]" />
            </div>
            <h3 className="font-serif text-lg font-bold text-slate-900">Private Ocean Yachting</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Bespoke sunset catamaran and Riva superyacht charters with private onboard chef, champagne, and secluded cove anchoring.
            </p>
            <button
              onClick={() => onNavigate('/contact')}
              className="text-xs font-semibold text-[#0B192C] hover:text-[#C5A880] inline-flex items-center gap-1"
            >
              <span>Charter Inquiry</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-slate-200/90 shadow-sm space-y-4 hover:border-[#C5A880] transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] border border-slate-200 flex items-center justify-center text-[#0B192C]">
              <Wine className="w-6 h-6 text-[#C5A880]" />
            </div>
            <h3 className="font-serif text-lg font-bold text-slate-900">Private Reserve Cellar</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Housing over 4,000 premier Grand Cru vintages curated by our Master Sommelier, with daily private tasting salons.
            </p>
            <button
              onClick={() => onNavigate('/dining')}
              className="text-xs font-semibold text-[#0B192C] hover:text-[#C5A880] inline-flex items-center gap-1"
            >
              <span>Sommelier Table</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. DINING HIGHLIGHT SPOTLIGHT */}
      <section className="bg-[#0B192C] text-white py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C5A880]">
              Gastronomic Artistry
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white leading-tight">
              L'Azur Grand Pavilion: Where Every Course is a Masterpiece
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Under soaring stone archways and golden chandelier light, Executive Chef Laurent Mercier presents seasonal degustation menus that unite pristine Atlantic harvests with rare Mediterranean truffles and heritage wagyu.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <Award className="w-5 h-5 text-[#C5A880] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Three Michelin Stars Rating</h4>
                  <p className="text-xs text-slate-400">Awarded for culinary purity, artistic plating, and cellar excellence.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Coffee className="w-5 h-5 text-[#C5A880]" />
                <div>
                  <h4 className="text-sm font-semibold text-white">24-Hour Haute Room Dining</h4>
                  <p className="text-xs text-slate-400">Bespoke silver-service breakfast and midnight supper served directly to your suite terrace.</p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <button
                onClick={() => onNavigate('/dining')}
                className="px-6 py-3.5 bg-[#C5A880] hover:bg-[#d8bd95] text-[#0B192C] font-semibold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
              >
                Reserve Dining Table
              </button>
              <button
                onClick={() => onNavigate('/dining')}
                className="px-6 py-3.5 border border-slate-600 hover:border-slate-400 text-white font-medium text-xs uppercase tracking-wider rounded-lg transition-colors"
              >
                Download Autumn Tasting Menu
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl overflow-hidden border border-[#1E3A5F] shadow-2xl">
              <img
                src="/src/assets/images/dining_fine_restaurant_1791847527242.jpg"
                alt="L'Azur Restaurant Interior"
                className="w-full h-[460px] object-cover hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6. SPECIAL OFFERS & PROMOTIONS */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C5A880]">
              Exclusive Stays
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 mt-1">
              Curated Packages &amp; Seasonal Privileges
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Book directly through our website to unlock guaranteed room upgrades, early check-in, and resort credits.
            </p>
          </div>
          <button
            onClick={() => onNavigate('/offers')}
            className="text-xs font-semibold uppercase tracking-wider text-[#0B192C] hover:text-[#C5A880] inline-flex items-center gap-1.5"
          >
            <span>View All Packages</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Offer 1 */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#C5A880] uppercase tracking-wider">Honeymoon &amp; Couples</span>
                <span className="text-xs font-mono font-bold bg-amber-50 text-amber-800 px-2.5 py-1 rounded border border-amber-200">
                  CODE: HONEYMOON
                </span>
              </div>
              <h3 className="font-serif text-xl font-bold text-slate-900 mt-3">The Royal Romantic Escape</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                20% discount on 3+ night stays. Includes chilled Dom Pérignon upon arrival, daily candlelit breakfast in bed, and a private couple's volcanic stone massage.
              </p>
            </div>
            <button
              onClick={() => {
                selectRoom(featuredRooms[0] || featuredRooms[1]);
                onNavigate('/checkout');
              }}
              className="w-full py-2.5 bg-[#FAF8F5] hover:bg-slate-100 border border-slate-200 text-slate-900 font-semibold text-xs uppercase tracking-wider rounded-lg transition-colors"
            >
              Book Romantic Package
            </button>
          </div>

          {/* Offer 2 */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#C5A880] uppercase tracking-wider">Corporate &amp; Leaders</span>
                <span className="text-xs font-mono font-bold bg-blue-50 text-blue-800 px-2.5 py-1 rounded border border-blue-200">
                  CODE: EXECUTIVE10
                </span>
              </div>
              <h3 className="font-serif text-xl font-bold text-slate-900 mt-3">The Executive Privileges Club</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                10% stay discount, private airport limousine transfer, complimentary pressing of business garments, and full 24-hour access to the 22nd-floor Azure Club Lounge.
              </p>
            </div>
            <button
              onClick={() => {
                selectRoom(featuredRooms[2] || featuredRooms[0]);
                onNavigate('/checkout');
              }}
              className="w-full py-2.5 bg-[#FAF8F5] hover:bg-slate-100 border border-slate-200 text-slate-900 font-semibold text-xs uppercase tracking-wider rounded-lg transition-colors"
            >
              Book Executive Package
            </button>
          </div>

          {/* Offer 3 */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#C5A880] uppercase tracking-wider">Welcome Offer</span>
                <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded border border-emerald-200">
                  CODE: AZURE2026
                </span>
              </div>
              <h3 className="font-serif text-xl font-bold text-slate-900 mt-3">Grand Azure Welcome Season</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Enjoy 15% off any ocean suite booking of 2 nights or more. Includes $150 resort credit redeemable at our thermal spa or fine dining pavilions.
              </p>
            </div>
            <button
              onClick={() => onNavigate('/rooms')}
              className="w-full py-2.5 bg-[#0B192C] hover:bg-[#132A4B] text-white font-semibold text-xs uppercase tracking-wider rounded-lg transition-colors"
            >
              Claim 15% Welcome Discount
            </button>
          </div>
        </div>
      </section>

      {/* 7. GUEST TESTIMONIALS & REVIEWS */}
      <section className="bg-[#FAF8F5] py-20 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C5A880]">
              Guest Experiences
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 mt-1">
              Words of Distinction
            </h2>
            <p className="text-xs text-slate-500 mt-2">
              Over 480 verified guest reviews rating 4.96 out of 5 stars.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-7 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center gap-1 text-[#C5A880]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#C5A880]" />
                ))}
              </div>
              <p className="text-slate-700 text-sm italic leading-relaxed">
                "From the private chauffeured transfer to the personalized welcome notes, the presidential suite at Grand Azure was flawless. The view of the evening water from the terrace jacuzzi is burned into my memory."
              </p>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Dr. Emmanuel Adebayo</h4>
                  <p className="text-xs text-slate-400">Stayed in Presidential Penthouse · Lagos</p>
                </div>
                <span className="text-xs text-emerald-600 font-semibold">Verified Stay</span>
              </div>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center gap-1 text-[#C5A880]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#C5A880]" />
                ))}
              </div>
              <p className="text-slate-700 text-sm italic leading-relaxed">
                "Chef Mercier's white truffle risotto and Atlantic turbot paired with the 2015 Château Margaux was the highlight of our anniversary. The thermal hydrotherapy spa is pure heaven on earth."
              </p>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Claire &amp; Jonathan DuPont</h4>
                  <p className="text-xs text-slate-400">Stayed in Deluxe Ocean Suite · Geneva</p>
                </div>
                <span className="text-xs text-emerald-600 font-semibold">Verified Stay</span>
              </div>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center gap-1 text-[#C5A880]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#C5A880]" />
                ))}
              </div>
              <p className="text-slate-700 text-sm italic leading-relaxed">
                "Flawless Wi-Fi, completely soundproof walls, and the 22nd-floor executive lounge made this the perfect business retreat. We hosted private client cocktails with the highest degree of discretion."
              </p>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Sir Richard Sterling</h4>
                  <p className="text-xs text-slate-400">Stayed in Skyline Club Suite · London</p>
                </div>
                <span className="text-xs text-emerald-600 font-semibold">Verified Stay</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. LOCATION & INTERACTIVE MAP SECTION */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="bg-[#0B192C] text-white rounded-3xl overflow-hidden border border-[#1E3A5F] shadow-2xl grid grid-cols-1 lg:grid-cols-2">
          <div className="p-8 lg:p-14 space-y-6 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#C5A880]">
                Location &amp; Access
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mt-1">
                The Coastal Atlantic Peninsula
              </h2>
              <p className="text-slate-300 text-sm mt-3 leading-relaxed">
                Discreetly located on an exclusive peninsula, 20 minutes from the international airport via private hotel helicopter or executive Mercedes chauffeur.
              </p>

              <div className="mt-6 space-y-3 text-xs text-slate-300">
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-[#C5A880]" />
                  <span>Azure Promenade &amp; Admiralty Way Enclave</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#C5A880]" />
                  <span>24-Hour Valet Parking &amp; Helipad Access</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
                  <span>Private Gated Security Perimeter</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => onNavigate('/contact')}
                className="px-6 py-3 bg-[#C5A880] hover:bg-[#d8bd95] text-[#0B192C] font-semibold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
              >
                Request Airport Limousine Transfer
              </button>
            </div>
          </div>

          {/* Interactive Map Visualizer */}
          <div className="relative min-h-[360px] bg-slate-900 border-t lg:border-t-0 lg:border-l border-[#1E3A5F] overflow-hidden flex items-center justify-center p-6">
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#1E3A5F_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="relative z-10 text-center space-y-3 bg-[#0B192C]/90 p-6 rounded-2xl border border-slate-700/80 max-w-sm backdrop-blur-md">
              <div className="w-10 h-10 rounded-full bg-[#C5A880]/20 border border-[#C5A880] mx-auto flex items-center justify-center text-[#C5A880]">
                <MapPin className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-lg font-bold text-white">The Grand Azure Enclave</h4>
              <p className="text-xs text-slate-300">Latitude: 6.4281° N, Longitude: 3.4219° E</p>
              <div className="pt-2">
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded text-xs font-medium border border-white/20 transition-colors"
                >
                  Open in Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
