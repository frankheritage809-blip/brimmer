import React, { useState, useEffect } from 'react';
import { Reservation } from '../types/hotel.js';
import {
  CheckCircle2,
  Calendar,
  Clock,
  Printer,
  Download,
  Share2,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  AlertCircle,
  ArrowRight
} from 'lucide-react';

interface ConfirmationPageProps {
  reference: string;
  onNavigate: (path: string) => void;
}

export const ConfirmationPage: React.FC<ConfirmationPageProps> = ({ reference, onNavigate }) => {
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [emailSentAlert, setEmailSentAlert] = useState(true);

  useEffect(() => {
    fetch(`/api/reservations/${reference}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.reservation) {
          setReservation(data.reservation);
        }
      })
      .catch((err) => console.error('Failed to load reservation:', err))
      .finally(() => setLoading(false));
  }, [reference]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24 text-center">
        <p className="text-slate-500 text-sm">Retrieving reservation verification...</p>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="font-serif text-2xl font-bold text-slate-900">Reservation Not Found</h2>
        <p className="text-slate-500 text-xs">
          Reference "{reference}" could not be located in our verified guest system.
        </p>
        <button
          onClick={() => onNavigate('/')}
          className="px-5 py-2.5 bg-[#0B192C] text-white rounded text-xs font-semibold"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12 space-y-10">
      {/* Top Banner Alert */}
      {emailSentAlert && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs text-emerald-800">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Official VIP Confirmation Voucher has been transmitted to <strong>{reservation.guestEmail}</strong>.
            </span>
          </div>
          <button
            onClick={() => setEmailSentAlert(false)}
            className="text-emerald-700 hover:text-emerald-950 font-bold ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Printable Voucher Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden print:border-none print:shadow-none">
        {/* Navy Header */}
        <div className="bg-[#0B192C] text-white p-8 lg:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#1E3A5F]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-900/60 border border-emerald-500/30 rounded-full text-emerald-300 text-xs font-semibold mb-3">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Reservation Confirmed &amp; Guaranteed</span>
            </div>
            <h1 className="font-serif text-3xl lg:text-4xl font-bold text-white tracking-tight">
              The Grand Azure Hotel &amp; Suites
            </h1>
            <p className="text-xs text-slate-300 mt-1">Official Guest Confirmation Voucher</p>
          </div>

          <div className="bg-[#132A4B] p-4 rounded-xl border border-[#1E3A5F] text-center md:text-right shrink-0">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-medium">
              Reservation Reference
            </span>
            <span className="font-mono text-2xl font-bold text-[#C5A880] tracking-wider block mt-0.5">
              {reservation.reference}
            </span>
            <span className="text-[11px] text-emerald-400 font-medium block mt-1">
              Payment: {reservation.paymentStatus.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Voucher Body */}
        <div className="p-8 lg:p-10 space-y-8">
          {/* Guest and Stay Details Strip */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-8 border-b border-slate-100">
            {/* Lead Guest */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Primary Guest Information
              </h4>
              <p className="text-base font-bold text-slate-900">{reservation.guestName}</p>
              <div className="text-xs text-slate-600 space-y-1">
                <p>Email: {reservation.guestEmail}</p>
                <p>Phone: {reservation.guestPhone}</p>
                {reservation.guestCountry && <p>Origin: {reservation.guestCountry}</p>}
              </div>
            </div>

            {/* Room & Suite */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Accommodations
              </h4>
              <p className="text-base font-bold text-slate-900">{reservation.roomTitle}</p>
              <div className="text-xs text-slate-600 space-y-1">
                <p>Category: {reservation.roomCategory}</p>
                <p>Guests: {reservation.guestsAdults} Adult(s), {reservation.guestsChildren} Child(ren)</p>
                <p>Rooms Booked: {reservation.roomsCount} Suite</p>
              </div>
            </div>
          </div>

          {/* Dates & Schedule */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-5 bg-[#FAF8F5] rounded-2xl border border-[#F0EBE1] text-xs">
            <div>
              <p className="text-slate-400 uppercase text-[10px] font-semibold">Check-In</p>
              <p className="font-serif text-lg font-bold text-slate-900 mt-0.5">{reservation.checkIn}</p>
              <p className="text-slate-500">From 3:00 PM</p>
            </div>
            <div>
              <p className="text-slate-400 uppercase text-[10px] font-semibold">Check-Out</p>
              <p className="font-serif text-lg font-bold text-slate-900 mt-0.5">{reservation.checkOut}</p>
              <p className="text-slate-500">Until 12:00 PM</p>
            </div>
            <div>
              <p className="text-slate-400 uppercase text-[10px] font-semibold">Duration</p>
              <p className="font-serif text-lg font-bold text-slate-900 mt-0.5">{reservation.nights} Night(s)</p>
              <p className="text-slate-500">Breakfast Included</p>
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Settlement &amp; Billing Breakdown
            </h4>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Room Charges ({reservation.nights} nights @ ${reservation.nightlyRate}/night)</span>
                <span className="font-mono tabular-nums text-slate-900">${reservation.subtotal.toLocaleString()}</span>
              </div>
              {reservation.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Special Promotion Applied ({reservation.promoCode})</span>
                  <span className="font-mono tabular-nums">-${reservation.discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Hospitality VAT &amp; Taxes (10%)</span>
                <span className="font-mono tabular-nums text-slate-900">${reservation.taxAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Luxury Concierge &amp; Service Fee (5%)</span>
                <span className="font-mono tabular-nums text-slate-900">${reservation.serviceFee.toLocaleString()}</span>
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
                <span>Total Amount</span>
                <span className="font-serif text-xl text-[#0B192C] font-mono tabular-nums">
                  ${reservation.totalAmount.toLocaleString()} USD
                </span>
              </div>
            </div>
          </div>

          {/* Special Requests if present */}
          {reservation.specialRequests && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <p className="font-semibold text-slate-800">Guest Special Requests Recorded:</p>
              <p className="text-slate-600 italic">"{reservation.specialRequests}"</p>
            </div>
          )}

          {/* Policies & Cancellation */}
          <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-2">
            <p>
              <strong>Cancellation Policy:</strong> Free cancellation is permitted up to 48 hours prior to check-in date ({reservation.checkIn}). Late cancellations or no-shows are subject to a one-night fee.
            </p>
            <p>
              <strong>Front Desk Verification:</strong> Please present a valid government-issued photo ID upon VIP check-in.
            </p>
          </div>
        </div>

        {/* Voucher Footer with Action Buttons */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 print:hidden">
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 bg-white border border-slate-300 hover:border-slate-800 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Voucher</span>
            </button>
            <button
              onClick={() => onNavigate('/guest-dashboard')}
              className="px-4 py-2.5 bg-[#0B192C] hover:bg-[#132A4B] text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span>View in Guest Portal</span>
              <ArrowRight className="w-4 h-4 text-[#C5A880]" />
            </button>
          </div>

          <button
            onClick={() => onNavigate('/')}
            className="text-xs font-medium text-slate-600 hover:text-slate-900 underline"
          >
            Return to Hotel Homepage
          </button>
        </div>
      </div>
    </div>
  );
};
