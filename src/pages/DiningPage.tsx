import React, { useState, useEffect } from 'react';
import { DiningMenuItem } from '../types/hotel.js';
import { Utensils, Wine, Clock, Users, Calendar, CheckCircle2, Sparkles, Coffee } from 'lucide-react';

interface DiningPageProps {
  onNavigate: (path: string) => void;
}

export const DiningPage: React.FC<DiningPageProps> = ({ onNavigate }) => {
  const [menuItems, setMenuItems] = useState<DiningMenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Table reservation form state
  const [guestName, setGuestName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('19:30');
  const [guests, setGuests] = useState(2);
  const [seatingPreference, setSeatingPreference] = useState<'Indoor Pavilion' | 'Terrace Oceanfront' | 'Private Wine Cellar'>('Indoor Pavilion');
  const [specialNotes, setSpecialNotes] = useState('');
  const [reservationSuccess, setReservationSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/dining/menu')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.menu) {
          setMenuItems(data.menu);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const categories = ['All', 'Starters', 'Main Course', 'Seafood', 'Desserts', 'Cocktails', 'Fine Wines'];

  const filteredMenu = menuItems.filter(
    (item) => selectedCategory === 'All' || item.category === selectedCategory
  );

  const handleTableReserve = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/dining/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName,
          email,
          phone,
          date,
          time,
          guests,
          seatingPreference,
          specialNotes
        })
      });
      const data = await res.json();
      if (data.success) {
        setReservationSuccess(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-20 pb-20">
      {/* Hero */}
      <section className="relative h-[65vh] min-h-[440px] flex items-center justify-center overflow-hidden">
        <img
          src="/src/assets/images/dining_fine_restaurant_1791847527242.jpg"
          alt="L'Azur Grand Pavilion Fine Dining"
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B192C] via-[#0B192C]/60 to-transparent" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white space-y-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C5A880]">
            Gastronomy at The Grand Azure
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight">
            Haute Cuisine &amp; Vintage Cellars
          </h1>
          <p className="text-sm sm:text-base text-slate-200 max-w-xl mx-auto leading-relaxed">
            Three signature dining venues celebrating Atlantic seafood, Alba white truffles, and vintage Grand Cru pairings.
          </p>
        </div>
      </section>

      {/* Venues Overview */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C5A880]">
            The Venues
          </span>
          <h2 className="font-serif text-3xl font-bold text-slate-900 mt-1">
            Three Distinct Culinary Destinations
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-7 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
            <h3 className="font-serif text-xl font-bold text-slate-900">L'Azur Grand Pavilion</h3>
            <p className="text-xs text-[#C5A880] font-semibold uppercase tracking-wider">3 Michelin Stars</p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our flagship gastronomic salon. Tasting menus highlighting caviar, turbot, and heritage wagyu. Jacket required.
            </p>
            <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">Dinner: 18:30 – 23:00</p>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
            <h3 className="font-serif text-xl font-bold text-slate-900">The Terrace Ocean Lounge</h3>
            <p className="text-xs text-[#C5A880] font-semibold uppercase tracking-wider">Alfresco Coastal</p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Relaxed luxury overlooking panoramic sunset tides. Wood-fired flatbreads, fresh oysters, and craft botanical cocktails.
            </p>
            <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">All Day: 11:00 – 01:00</p>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
            <h3 className="font-serif text-xl font-bold text-slate-900">The Horizon Reserve Cellar</h3>
            <p className="text-xs text-[#C5A880] font-semibold uppercase tracking-wider">Private Tasting Salon</p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Subterranean stone vault with 4,000 vintage bottles. Hosted exclusively by our Head Sommelier for bespoke wine pairings.
            </p>
            <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">By Private Reservation</p>
          </div>
        </div>
      </section>

      {/* Interactive Menu Catalog */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C5A880]">
            Tasting Selection
          </span>
          <h2 className="font-serif text-3xl font-bold text-slate-900 mt-1">
            Autumn Degustation Menu
          </h2>
        </div>

        {/* Categories Tab */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#0B192C] text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredMenu.map((item) => (
            <div
              key={item.id}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-start gap-4 hover:border-[#C5A880] transition-colors"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-serif text-lg font-bold text-slate-900">{item.name}</h4>
                  {item.dietary?.map((tag, i) => (
                    <span key={i} className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
              </div>
              <span className="font-serif text-xl font-bold text-[#0B192C] font-mono tabular-nums shrink-0">
                ${item.price}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Table Reservation Form Section */}
      <section className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="bg-[#0B192C] text-white rounded-3xl p-8 lg:p-12 border border-[#1E3A5F] shadow-2xl">
          <div className="text-center max-w-md mx-auto mb-8">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C5A880]">
              Gastronomic Reservation
            </span>
            <h3 className="font-serif text-3xl font-bold text-white mt-1">Reserve a Dining Table</h3>
            <p className="text-xs text-slate-300 mt-1">
              Table reservations are confirmed instantly with priority seating.
            </p>
          </div>

          {reservationSuccess ? (
            <div className="p-6 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl text-center space-y-3 text-emerald-200">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h4 className="font-serif text-xl font-bold text-white">Table Reserved Successfully</h4>
              <p className="text-xs">
                Your reservation at <strong>{seatingPreference}</strong> for {guests} guests on {date} at {time} has been registered. Our Maître d' will be honored to welcome you.
              </p>
              <button
                onClick={() => setReservationSuccess(false)}
                className="mt-2 px-5 py-2 bg-[#C5A880] text-[#0B192C] font-bold text-xs rounded-lg uppercase tracking-wider"
              >
                Reserve Another Table
              </button>
            </div>
          ) : (
            <form onSubmit={handleTableReserve} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Guest Name *</label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  required
                  placeholder="e.g. Lady Catherine Vance"
                  className="w-full px-3.5 py-2.5 bg-[#132A4B] border border-[#1E3A5F] rounded-lg text-white focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Email Address *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="catherine@example.com"
                  className="w-full px-3.5 py-2.5 bg-[#132A4B] border border-[#1E3A5F] rounded-lg text-white focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Phone Number *</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="+1 (555) 019-2834"
                  className="w-full px-3.5 py-2.5 bg-[#132A4B] border border-[#1E3A5F] rounded-lg text-white focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Guests Count</label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-[#132A4B] border border-[#1E3A5F] rounded-lg text-white focus:outline-none focus:border-[#C5A880]"
                >
                  <option value={1}>1 Guest</option>
                  <option value={2}>2 Guests</option>
                  <option value={4}>4 Guests</option>
                  <option value={6}>6 Guests</option>
                  <option value={8}>8+ Private Party</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-[#132A4B] border border-[#1E3A5F] rounded-lg text-white focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Time</label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#132A4B] border border-[#1E3A5F] rounded-lg text-white focus:outline-none focus:border-[#C5A880]"
                >
                  <option value="18:30">18:30 (First Seating)</option>
                  <option value="19:30">19:30 (Peak Ambience)</option>
                  <option value="20:30">20:30 (Late Tasting)</option>
                  <option value="21:30">21:30 (Supper)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-300 mb-1 font-medium">Seating Ambiance</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Indoor Pavilion', 'Terrace Oceanfront', 'Private Wine Cellar'] as const).map((pref) => (
                    <button
                      key={pref}
                      type="button"
                      onClick={() => setSeatingPreference(pref)}
                      className={`p-2.5 rounded-lg border text-center font-medium transition-colors ${
                        seatingPreference === pref
                          ? 'border-[#C5A880] bg-[#1E3A5F] text-white'
                          : 'border-slate-700 bg-[#132A4B] text-slate-300'
                      }`}
                    >
                      {pref}
                    </button>
                  ))}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-300 mb-1 font-medium">Dietary Notes or Celebrations</label>
                <input
                  type="text"
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder="Anniversary celebration, allergy to shellfish, etc."
                  className="w-full px-3.5 py-2.5 bg-[#132A4B] border border-[#1E3A5F] rounded-lg text-white focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div className="sm:col-span-2 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-[#C5A880] hover:bg-[#d8bd95] text-[#0B192C] font-semibold text-xs uppercase tracking-widest rounded-lg transition-colors shadow-lg cursor-pointer disabled:opacity-50"
                >
                  Confirm Table Reservation
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};
