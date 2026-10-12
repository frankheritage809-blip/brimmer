import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext.js';
import { useAuth } from '../context/AuthContext.js';
import { PricingSummary } from '../components/booking/PricingSummary.js';
import { PaymentSelector } from '../components/booking/PaymentSelector.js';
import { PaymentMethod, Reservation } from '../types/hotel.js';
import { ShieldCheck, User, Mail, Phone, Globe, MessageSquare, Clock, AlertCircle, RefreshCw } from 'lucide-react';

interface CheckoutPageProps {
  onNavigate: (path: string) => void;
  onBookingConfirmed: (reservation: Reservation) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  onNavigate,
  onBookingConfirmed
}) => {
  const { draft, pricing } = useBooking();
  const { user } = useAuth();

  // Guest details form
  const [guestName, setGuestName] = useState(user?.name || '');
  const [guestEmail, setGuestEmail] = useState(user?.email || '');
  const [guestPhone, setGuestPhone] = useState(user?.phone || '+1 (555) 234-5678');
  const [guestCountry, setGuestCountry] = useState('United States');
  const [specialRequests, setSpecialRequests] = useState('');
  const [estimatedArrival, setEstimatedArrival] = useState('15:00 - 17:00');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('stripe_card');
  const [paymentTransactionId, setPaymentTransactionId] = useState<string | null>(null);

  // States
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!draft.room) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center space-y-4">
        <h2 className="font-serif text-3xl font-bold text-slate-900">No Suite Selected</h2>
        <p className="text-slate-500 text-sm">Please choose a room or suite first to begin your reservation.</p>
        <button
          onClick={() => onNavigate('/rooms')}
          className="px-6 py-3 bg-[#0B192C] text-white rounded-lg text-xs uppercase tracking-wider font-semibold"
        >
          Browse Suites
        </button>
      </div>
    );
  }

  const handlePaymentSuccess = async (txId: string) => {
    setPaymentTransactionId(txId);
    await completeReservation(txId);
  };

  const handlePaymentFailed = (error: string) => {
    setErrorMessage(error);
  };

  const handleArrivalGuaranteeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !guestEmail || !guestPhone) {
      setErrorMessage('Please fill in your contact information');
      return;
    }
    await completeReservation();
  };

  const completeReservation = async (transactionId?: string) => {
    setSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: draft.roomId,
          checkIn: draft.checkIn,
          checkOut: draft.checkOut,
          guestsAdults: draft.guestsAdults,
          guestsChildren: draft.guestsChildren,
          roomsCount: draft.roomsCount,
          guestName,
          guestEmail,
          guestPhone,
          guestCountry,
          specialRequests,
          estimatedArrival,
          promoCode: draft.promoCode || undefined,
          paymentMethod,
          paymentTransactionId: transactionId || paymentTransactionId || undefined
        })
      });

      const data = await res.json();

      if (data.success && data.reservation) {
        onBookingConfirmed(data.reservation);
        onNavigate(`/confirmation/${data.reservation.reference}`);
      } else {
        setErrorMessage(data.error || 'Unable to confirm reservation. Please review details.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Server connection error');
    } finally {
      setSubmitting(false);
    }
  };

  const totalAmount = pricing?.totalAmount || Math.round(draft.room.pricePerNight * 1.15);

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 space-y-10">
      {/* Checkout Title */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-widest text-[#C5A880]">
          Step 2 of 2 · Final Confirmation
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 mt-1">
          Complete Your Reservation
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Guaranteed reservation at The Grand Azure Hotel &amp; Suites.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
          <div>
            <p className="font-bold">Reservation Alert</p>
            <p>{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Main Grid: Guest Form & Payment Left, Summary Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Form (7 Columns) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Guest Personal Information */}
          <div className="bg-white p-6 lg:p-8 rounded-2xl border border-slate-200/90 shadow-sm space-y-5">
            <h3 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
              <User className="w-5 h-5 text-[#C5A880]" />
              <span>Lead Guest Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Full Legal Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    required
                    placeholder="e.g. Alexander Sterling"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#0B192C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Email Address (For Voucher) *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    required
                    placeholder="e.g. alexander@example.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#0B192C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Phone Number (Concierge SMS) *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    required
                    placeholder="+1 (555) 234-5678"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#0B192C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Country of Residence</label>
                <div className="relative">
                  <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={guestCountry}
                    onChange={(e) => setGuestCountry(e.target.value)}
                    placeholder="United States / Nigeria / UK"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#0B192C]"
                  />
                </div>
              </div>
            </div>

            {/* Estimated Arrival Time */}
            <div className="pt-2">
              <label className="block text-xs text-slate-700 font-medium mb-1">
                Estimated Time of Arrival
              </label>
              <select
                value={estimatedArrival}
                onChange={(e) => setEstimatedArrival(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#0B192C]"
              >
                <option value="12:00 - 15:00">Early Arrival (12:00 PM – 3:00 PM)</option>
                <option value="15:00 - 17:00">Standard Check-In (3:00 PM – 5:00 PM)</option>
                <option value="17:00 - 20:00">Evening Arrival (5:00 PM – 8:00 PM)</option>
                <option value="20:00 - 23:00">Late Night Arrival (8:00 PM – 11:00 PM)</option>
              </select>
            </div>

            {/* Special Requests */}
            <div>
              <label className="block text-xs text-slate-700 font-medium mb-1">
                Special Concierge Requests &amp; Preferences (Optional)
              </label>
              <textarea
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                rows={3}
                placeholder="High floor room, feather-free pillows, chilled champagne on arrival, quiet courtyard facing, etc."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#0B192C]"
              />
            </div>
          </div>

          {/* Payment Architecture */}
          <div className="bg-white p-6 lg:p-8 rounded-2xl border border-slate-200/90 shadow-sm space-y-6">
            <PaymentSelector
              amountUSD={totalAmount}
              selectedMethod={paymentMethod}
              onSelectMethod={(method) => setPaymentMethod(method)}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentFailed={handlePaymentFailed}
              disabled={submitting}
            />

            {paymentMethod === 'pay_at_hotel' && (
              <form onSubmit={handleArrivalGuaranteeSubmit}>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-[#0B192C] hover:bg-[#132A4B] text-white font-semibold text-xs uppercase tracking-widest rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-[#C5A880]" />
                      <span>Confirming Suite Reservation...</span>
                    </>
                  ) : (
                    <span>Confirm &amp; Guarantee Reservation</span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Pricing Summary (5 Columns) */}
        <div className="lg:col-span-5 sticky top-28 space-y-6">
          <PricingSummary showPromoInput={true} />
        </div>
      </div>
    </div>
  );
};
