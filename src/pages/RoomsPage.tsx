import React, { useState, useEffect } from 'react';
import { Room, RoomCategory } from '../types/hotel.js';
import { useBooking } from '../context/BookingContext.js';
import {
  Filter,
  SlidersHorizontal,
  Search,
  Users,
  Maximize2,
  Calendar,
  Check,
  Star,
  ArrowRight,
  Sparkles,
  Wifi,
  Coffee,
  Waves
} from 'lucide-react';

interface RoomsPageProps {
  onNavigate: (path: string) => void;
  onSelectRoom: (room: Room) => void;
}

export const RoomsPage: React.FC<RoomsPageProps> = ({ onNavigate, onSelectRoom }) => {
  const { draft, setDates, setGuests, selectRoom } = useBooking();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [minGuests, setMinGuests] = useState<number>(1);
  const [selectedAmenity, setSelectedAmenity] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  useEffect(() => {
    fetch('/api/rooms')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.rooms) {
          setRooms(data.rooms);
        }
      })
      .catch((err) => console.error('Failed to load rooms:', err))
      .finally(() => setLoading(false));
  }, []);

  const categories: (string | RoomCategory)[] = ['All', 'Presidential Suite', 'Deluxe', 'Executive', 'Standard'];

  const popularAmenities = [
    'All',
    'Ocean View',
    'Infinity Plunge Pool',
    'Butler Service',
    'Soaking Tub',
    'Azure Club Lounge Access'
  ];

  // Filtering logic
  const filteredRooms = rooms
    .filter((room) => {
      if (selectedCategory !== 'All' && room.category !== selectedCategory) return false;
      if (room.pricePerNight > maxPrice) return false;
      if (room.capacityAdults + (room.capacityChildren || 0) < minGuests) return false;
      if (selectedAmenity !== 'All') {
        const hasAmenity = room.amenities.some((a) =>
          a.toLowerCase().includes(selectedAmenity.toLowerCase())
        );
        if (!hasAmenity) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.pricePerNight - b.pricePerNight;
      if (sortBy === 'price-desc') return b.pricePerNight - a.pricePerNight;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });

  const handleBookNow = (room: Room) => {
    selectRoom(room);
    onSelectRoom(room);
    onNavigate('/checkout');
  };

  const handleViewDetails = (room: Room) => {
    selectRoom(room);
    onSelectRoom(room);
    onNavigate(`/room/${room.id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 space-y-10">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#C5A880]">
          Private Sanctuaries
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">
          Rooms, Suites &amp; Penthouse Residences
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed">
          Select from our intimate ocean suites, diplomatic club floors, or the crown presidential penthouse. Every reservation includes daily gourmet breakfast and access to the Azure Thermal Spa.
        </p>
      </div>

      {/* Date & Stay Quick Checker Strip */}
      <div className="bg-[#0B192C] text-white p-4 lg:p-6 rounded-2xl border border-[#1E3A5F] shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
          <div>
            <label className="text-[11px] uppercase tracking-wider text-slate-300 font-medium block mb-1">
              Check-In Date
            </label>
            <input
              type="date"
              value={draft.checkIn}
              onChange={(e) => setDates(e.target.value, draft.checkOut)}
              className="w-full px-3 py-2 bg-[#132A4B] border border-[#1E3A5F] rounded-lg text-xs text-white focus:outline-none focus:border-[#C5A880]"
            />
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-wider text-slate-300 font-medium block mb-1">
              Check-Out Date
            </label>
            <input
              type="date"
              value={draft.checkOut}
              onChange={(e) => setDates(draft.checkIn, e.target.value)}
              className="w-full px-3 py-2 bg-[#132A4B] border border-[#1E3A5F] rounded-lg text-xs text-white focus:outline-none focus:border-[#C5A880]"
            />
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-wider text-slate-300 font-medium block mb-1">
              Minimum Guests
            </label>
            <select
              value={minGuests}
              onChange={(e) => {
                const val = Number(e.target.value);
                setMinGuests(val);
                setGuests(val, draft.guestsChildren, draft.roomsCount);
              }}
              className="w-full px-3 py-2 bg-[#132A4B] border border-[#1E3A5F] rounded-lg text-xs text-white focus:outline-none focus:border-[#C5A880]"
            >
              <option value={1}>1 Guest</option>
              <option value={2}>2 Guests (Most Popular)</option>
              <option value={3}>3 Guests</option>
              <option value={4}>4 Guests</option>
              <option value={6}>6 Guests (Family / Penthouse)</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-wider text-slate-300 font-medium block mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 bg-[#132A4B] border border-[#1E3A5F] rounded-lg text-xs text-white focus:outline-none focus:border-[#C5A880]"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Guest Rating</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Layout: Filters Sidebar + Rooms Catalog */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden">
          <button
            onClick={() => setShowFiltersMobile(!showFiltersMobile)}
            className="w-full py-2.5 bg-white border border-slate-300 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold text-slate-800"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#C5A880]" />
            <span>{showFiltersMobile ? 'Hide Filters' : 'Show Advanced Filters'}</span>
          </button>
        </div>

        {/* Filters Sidebar */}
        <div className={`space-y-6 lg:block ${showFiltersMobile ? 'block' : 'hidden'}`}>
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-serif text-base font-bold text-slate-900 flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#C5A880]" />
                <span>Refine Collection</span>
              </h3>
              {(selectedCategory !== 'All' || maxPrice < 2000 || selectedAmenity !== 'All') && (
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setMaxPrice(2000);
                    setSelectedAmenity('All');
                    setMinGuests(1);
                  }}
                  className="text-xs text-slate-400 hover:text-slate-700 underline"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Room Categories */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Suite Category
              </label>
              <div className="flex flex-col gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      selectedCategory === cat
                        ? 'bg-[#0B192C] text-white'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Nightly Budget Slider */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold uppercase tracking-wider text-slate-500">
                  Max Nightly Rate
                </label>
                <span className="font-mono font-bold text-slate-900">${maxPrice}</span>
              </div>
              <input
                type="range"
                min={300}
                max={2000}
                step={50}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#0B192C] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>$300</span>
                <span>$2,000+</span>
              </div>
            </div>

            {/* Signature Amenities */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Signature Feature
              </label>
              <div className="flex flex-col gap-1.5">
                {popularAmenities.map((amenity) => (
                  <button
                    key={amenity}
                    onClick={() => setSelectedAmenity(amenity)}
                    className={`text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedAmenity === amenity
                        ? 'bg-[#C5A880] text-[#0B192C] font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {amenity}
                  </button>
                ))}
              </div>
            </div>

            {/* Guarantee note */}
            <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#F0EBE1] text-[11px] text-slate-600 space-y-1">
              <p className="font-bold text-slate-800">Best Rate Guarantee</p>
              <p>Direct bookings always receive complimentary breakfast and highest floor priority.</p>
            </div>
          </div>
        </div>

        {/* Rooms Listing (3 Columns in remaining grid) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing <strong>{filteredRooms.length}</strong> luxury suites available
            </span>
            <span>All rates quoted in USD ($)</span>
          </div>

          {filteredRooms.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 space-y-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-slate-800">No suites match your criteria</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try loosening your budget filter or switching to "All" categories to view available suites.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setMaxPrice(2000);
                  setSelectedAmenity('All');
                }}
                className="px-4 py-2 bg-[#0B192C] text-white rounded-lg text-xs font-semibold"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredRooms.map((room) => (
                <div
                  key={room.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 grid grid-cols-1 md:grid-cols-12"
                >
                  {/* Photo Column */}
                  <div className="md:col-span-5 relative h-64 md:h-auto overflow-hidden group">
                    <img
                      src={room.images[0]}
                      alt={room.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4 bg-[#0B192C]/85 backdrop-blur-md px-3 py-1 rounded text-[11px] font-semibold uppercase tracking-wider text-[#C5A880]">
                      {room.category}
                    </div>
                  </div>

                  {/* Details Column */}
                  <div className="md:col-span-7 p-6 lg:p-7 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-1.5 text-xs text-amber-600 mb-1">
                            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                            <span className="font-bold">{room.rating}</span>
                            <span className="text-slate-400">({room.reviewsCount} reviews)</span>
                          </div>
                          <h3 className="font-serif text-2xl font-bold text-slate-900">
                            {room.title}
                          </h3>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-serif text-3xl font-bold text-[#0B192C] font-mono tabular-nums">
                            ${room.pricePerNight}
                          </p>
                          <p className="text-[11px] text-slate-400">per night</p>
                        </div>
                      </div>

                      <p className="text-slate-600 text-xs mt-2.5 leading-relaxed">
                        {room.description}
                      </p>

                      {/* Specs pills/metadata */}
                      <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
                        <div>
                          <span className="text-slate-400 text-[10px] uppercase block">Space</span>
                          <span className="font-semibold text-slate-800">{room.sizeSqm} sqm</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] uppercase block">Bedding</span>
                          <span className="font-semibold text-slate-800 truncate block">{room.bedType.split('+')[0]}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] uppercase block">Capacity</span>
                          <span className="font-semibold text-slate-800">{room.capacityAdults} Adults, {room.capacityChildren} Ch.</span>
                        </div>
                      </div>

                      {/* Top Amenities chips */}
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {room.amenities.slice(0, 4).map((amenity, i) => (
                          <span
                            key={i}
                            className="text-[11px] bg-slate-50 text-slate-600 px-2.5 py-1 rounded border border-slate-200"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                      <div className="text-xs text-emerald-700 font-medium">
                        ✓ Free Cancellation up to 48 hrs
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleViewDetails(room)}
                          className="px-4 py-2.5 border border-slate-300 hover:border-slate-800 text-slate-800 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                        >
                          Suite Details
                        </button>
                        <button
                          onClick={() => handleBookNow(room)}
                          className="px-5 py-2.5 bg-[#0B192C] hover:bg-[#132A4B] text-white font-semibold text-xs rounded-lg transition-colors shadow-sm cursor-pointer"
                        >
                          Book Stay
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
