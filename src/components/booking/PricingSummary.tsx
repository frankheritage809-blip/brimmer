import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext.js';
import { Tag, Check, X, Shield, Clock, Coffee, Wifi } from 'lucide-react';

interface PricingSummaryProps {
  showPromoInput?: boolean;
}

export const PricingSummary: React.FC<PricingSummaryProps> = ({ showPromoInput = true }) => {
  const { draft, pricing, pricingLoading, applyPromoCode, removePromoCode } = useBooking();
  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<string | null>(null);

  if (!draft.room) return null;

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput) return;
    await applyPromoCode(promoInput);
    setPromoMessage(`Promo code "${promoInput.toUpperCase()}" applied.`);
    setPromoInput('');
  };

  const handleRemovePromo = () => {
    removePromoCode();
    setPromoMessage(null);
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm p-6 space-y-6">
      <div className="flex gap-4 items-center pb-5 border-b border-slate-100">
        <img
          src={draft.room.images[0]}
          alt={draft.room.title}
          className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-200"
          referrerPolicy="no-referrer"
        />
        <div className="min-w-0">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C5A880]">
            {draft.room.category}
          </span>
          <h4 className="font-serif text-base font-bold text-slate-900 truncate">
            {draft.room.title}
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            {draft.room.bedType} · {draft.room.sizeSqm} sqm
          </p>
        </div>
      </div>

      {/* Dates & Guests */}
      <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#FAF8F5] rounded-xl text-xs text-slate-700 border border-[#F0EBE1]">
        <div>
          <p className="text-slate-400 font-medium uppercase text-[10px]">Check-In</p>
          <p className="font-semibold text-slate-900 mt-0.5">{draft.checkIn}</p>
          <p className="text-[11px] text-slate-500">From 3:00 PM</p>
        </div>
        <div>
          <p className="text-slate-400 font-medium uppercase text-[10px]">Check-Out</p>
          <p className="font-semibold text-slate-900 mt-0.5">{draft.checkOut}</p>
          <p className="text-[11px] text-slate-500">Until 12:00 PM</p>
        </div>
        <div className="col-span-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-slate-600">
          <span>Stay Duration:</span>
          <span className="font-semibold text-slate-900">
            {pricing?.nights || 1} Night{(pricing?.nights || 1) > 1 ? 's' : ''} · {draft.guestsAdults} Adult{draft.guestsAdults > 1 ? 's' : ''}
            {draft.guestsChildren > 0 ? `, ${draft.guestsChildren} Child` : ''}
          </span>
        </div>
      </div>

      {/* Pricing Math Breakdown */}
      <div className="space-y-2.5 text-sm">
        <div className="flex justify-between text-slate-600">
          <span>
            ${pricing?.nightlyRate || draft.room.pricePerNight} × {pricing?.nights || 1} nights
          </span>
          <span className="font-mono tabular-nums text-slate-900">
            ${(pricing?.subtotal || draft.room.pricePerNight).toLocaleString()}
          </span>
        </div>

        {pricing && pricing.discountAmount > 0 && (
          <div className="flex justify-between text-emerald-700 font-medium">
            <span className="flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              <span>Promotion ({pricing.promoCode})</span>
            </span>
            <span className="font-mono tabular-nums">-${pricing.discountAmount.toLocaleString()}</span>
          </div>
        )}

        <div className="flex justify-between text-slate-600">
          <span>Taxes &amp; Tourism VAT (10%)</span>
          <span className="font-mono tabular-nums text-slate-900">
            ${(pricing?.taxAmount || Math.round(draft.room.pricePerNight * 0.1)).toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between text-slate-600">
          <span>Luxury Service &amp; Concierge Fee (5%)</span>
          <span className="font-mono tabular-nums text-slate-900">
            ${(pricing?.serviceFee || Math.round(draft.room.pricePerNight * 0.05)).toLocaleString()}
          </span>
        </div>

        <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
          <div>
            <span className="text-base font-bold text-slate-900">Total Stay Amount</span>
            <p className="text-[11px] text-slate-500">Includes all applicable fees &amp; taxes</p>
          </div>
          <span className="font-serif text-2xl font-bold text-[#0B192C] font-mono tabular-nums">
            ${(pricing?.totalAmount || Math.round(draft.room.pricePerNight * 1.15)).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Promo Code Input */}
      {showPromoInput && (
        <div className="pt-2">
          {draft.promoCode ? (
            <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800">
              <span className="flex items-center gap-1.5 font-semibold">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Code {draft.promoCode} applied</span>
              </span>
              <button
                type="button"
                onClick={handleRemovePromo}
                className="text-slate-500 hover:text-rose-600 p-1"
                title="Remove code"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <input
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                placeholder="Promo Code (e.g. AZURE2026)"
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs uppercase font-mono tracking-wider focus:outline-none focus:border-[#0B192C]"
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs rounded-lg transition-colors"
              >
                Apply
              </button>
            </form>
          )}
          {promoMessage && <p className="text-[11px] text-emerald-700 mt-1">{promoMessage}</p>}
        </div>
      )}

      {/* Hospitality Inclusions */}
      <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Coffee className="w-3.5 h-3.5 text-[#C5A880]" />
          <span>Gourmet artisanal breakfast included daily</span>
        </div>
        <div className="flex items-center gap-2">
          <Wifi className="w-3.5 h-3.5 text-[#C5A880]" />
          <span>High-speed Wi-Fi 6 &amp; streaming services</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-[#C5A880]" />
          <span>Free cancellation up to 48h before arrival</span>
        </div>
      </div>
    </div>
  );
};
