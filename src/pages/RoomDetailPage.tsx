import React, { useState, useEffect } from 'react';
import { Room } from '../types/hotel.js';
import { useBooking } from '../context/BookingContext.js';
import {
  Star,
  CheckCircle2,
  Users,
  Maximize2,
  Bed,
  Eye,
  ShieldCheck,
  Calendar,
  Clock,
  ArrowRight,
  ChevronLeft,
  Share2,
  Heart
} from 'lucide-react';

interface RoomDetailPageProps {
  roomId: string;
  onNavigate: (path: string) => void;
  onSelectRoom: (room: Room) => void;
}

export const RoomDetailPage: React.FC<RoomDetailPageProps> = ({
  roomId,
  onNavigate,
  onSelectRoom
}) => {
  const { draft, setDates, setGuests, selectRoom, pricing, pricingLoading } = useBooking();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    fetch(`/api/rooms/${roomId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.room) {
          setRoom(data.room);
          selectRoom(data.room);
        }
      })
      .catch((err) => console.error('Failed to load room details:', err))
      .finally(() => setLoading(false));
  }, [roomId]);

  if (loading || !room) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <p className="text-slate-500 text-sm">Loading suite specifications...</p>
      </div>
    );
  }

  const handleProceedToCheckout = () => {
    selectRoom(room);
    onSelectRoom(room);
    onNavigate('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 space-y-10">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('/rooms')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to All Suites</span>
        </button>
        <div className="flex items-center gap-3">
          <span className="text-xs bg-[#0B192C] text-[#C5A880] px-3 py-1 rounded font-semibold uppercase tracking-wider">
            {room.category}
          </span>
        </div>
      </div>

      {/* Header Title & Rating */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-600 mb-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
              ))}
            </div>
            <span className="font-bold">{room.rating}</span>
            <span className="text-slate-400">({room.reviewsCount} verified guest reviews)</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900">
            {room.title}
          </h1>
          <p className="text-xs text-slate-500 mt-1">{room.floor} · {room.view}</p>
        </div>

        <div className="text-right">
          <p className="font-serif text-4xl font-bold text-[#0B192C] font-mono tabular-nums">
            ${room.pricePerNight}
          </p>
          <p className="text-xs text-slate-500">per night (taxes &amp; luxury breakfast included)</p>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="space-y-4">
        <div className="h-[460px] md:h-[540px] rounded-2xl overflow-hidden shadow-xl border border-slate-200">
          <img
            src={room.images[activeImageIndex] || room.images[0]}
            alt={room.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Thumbnails */}
        {room.images.length > 1 && (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {room.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-28 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                  activeImageIndex === idx ? 'border-[#0B192C] scale-102 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Key Specifications Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm text-center">
        <div>
          <Maximize2 className="w-5 h-5 text-[#C5A880] mx-auto mb-1" />
          <p className="text-[11px] uppercase tracking-wider text-slate-400">Total Area</p>
          <p className="font-semibold text-slate-900 text-sm">{room.sizeSqm} m² / {Math.round(room.sizeSqm * 10.76)} sq ft</p>
        </div>
        <div>
          <Bed className="w-5 h-5 text-[#C5A880] mx-auto mb-1" />
          <p className="text-[11px] uppercase tracking-wider text-slate-400">Bedding</p>
          <p className="font-semibold text-slate-900 text-sm truncate">{room.bedType}</p>
        </div>
        <div>
          <Users className="w-5 h-5 text-[#C5A880] mx-auto mb-1" />
          <p className="text-[11px] uppercase tracking-wider text-slate-400">Max Capacity</p>
          <p className="font-semibold text-slate-900 text-sm">{room.capacityAdults} Adults + {room.capacityChildren} Ch.</p>
        </div>
        <div>
          <Eye className="w-5 h-5 text-[#C5A880] mx-auto mb-1" />
          <p className="text-[11px] uppercase tracking-wider text-slate-400">Vista</p>
          <p className="font-semibold text-slate-900 text-sm truncate">{room.view}</p>
        </div>
      </div>

      {/* Main Content Split: Details Left + Sticky Booking Box Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Story, Amenities, Policies */}
        <div className="lg:col-span-7 space-y-10">
          {/* Detailed Narrative */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-bold text-slate-900">The Suite Experience</h3>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
              {room.description}
            </p>
          </div>

          {/* Full Amenities Checklist */}
          <div className="space-y-4 pt-6 border-t border-slate-200">
            <h3 className="font-serif text-2xl font-bold text-slate-900">Amenities &amp; Inclusions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {room.amenities.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hotel Policies & In-Suite Rules */}
          <div className="space-y-4 pt-6 border-t border-slate-200 bg-white p-6 rounded-2xl border">
            <h4 className="font-serif text-lg font-bold text-slate-900">Suite Policies &amp; House Rules</h4>
            <div className="grid grid-cols-2 gap-4 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Check-in: 3:00 PM</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Check-out: 12:00 PM</span>
              </div>
              <div>
                <span className="font-semibold text-slate-800">Smoking: </span>
                <span>100% Non-Smoking Suite</span>
              </div>
              <div>
                <span className="font-semibold text-slate-800">Pets: </span>
                <span>Well-behaved luxury pets permitted with prior concierge notice</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Booking & Stay Calculator Box */}
        <div className="lg:col-span-5 sticky top-28 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl p-6 lg:p-7 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Stay Calculator</span>
                <p className="font-serif text-2xl font-bold text-slate-900 mt-0.5">${room.pricePerNight} <span className="text-xs font-normal text-slate-500">/ night</span></p>
              </div>
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded">
                Available
              </span>
            </div>

            {/* Dates Selector */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-500 font-medium block mb-1">Check-In</label>
                <input
                  type="date"
                  value={draft.checkIn}
                  onChange={(e) => setDates(e.target.value, draft.checkOut)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#0B192C]"
                />
              </div>
              <div>
                <label className="text-slate-500 font-medium block mb-1">Check-Out</label>
                <input
                  type="date"
                  value={draft.checkOut}
                  onChange={(e) => setDates(draft.checkIn, e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#0B192C]"
                />
              </div>
            </div>

            {/* Guests Selector */}
            <div className="text-xs">
              <label className="text-slate-500 font-medium block mb-1">Guests</label>
              <select
                value={draft.guestsAdults}
                onChange={(e) => setGuests(Number(e.target.value), draft.guestsChildren, draft.roomsCount)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#0B192C]"
              >
                <option value={1}>1 Adult</option>
                <option value={2}>2 Adults</option>
                <option value={3}>3 Adults</option>
                <option value={4}>4 Adults</option>
              </select>
            </div>

            {/* Price Calculations */}
            <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#F0EBE1] space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>${room.pricePerNight} × {pricing?.nights || 1} nights</span>
                <span className="font-mono tabular-nums text-slate-900">${(pricing?.subtotal || room.pricePerNight).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>VAT &amp; Tourism Taxes (10%)</span>
                <span className="font-mono tabular-nums text-slate-900">${(pricing?.taxAmount || Math.round(room.pricePerNight * 0.1)).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Luxury Concierge Fee (5%)</span>
                <span className="font-mono tabular-nums text-slate-900">${(pricing?.serviceFee || Math.round(room.pricePerNight * 0.05)).toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
                <span>Estimated Total</span>
                <span className="font-serif text-lg text-[#0B192C] font-mono tabular-nums">
                  ${(pricing?.totalAmount || Math.round(room.pricePerNight * 1.15)).toLocaleString()}
                </span>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={handleProceedToCheckout}
              className="w-full py-4 bg-[#0B192C] hover:bg-[#132A4B] text-white font-semibold text-xs uppercase tracking-widest rounded-lg transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Reserve This Suite</span>
              <ArrowRight className="w-4 h-4 text-[#C5A880]" />
            </button>

            <p className="text-[11px] text-center text-slate-400">
              Instant confirmation · No hidden resort fees
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
