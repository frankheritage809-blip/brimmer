import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { Reservation } from '../types/hotel.js';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  FileText,
  AlertTriangle,
  User,
  RefreshCw,
  Edit3,
  ExternalLink
} from 'lucide-react';

interface GuestDashboardPageProps {
  onNavigate: (path: string) => void;
}

export const GuestDashboardPage: React.FC<GuestDashboardPageProps> = ({ onNavigate }) => {
  const { user, setShowAuthModal, setAuthModalMode } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  // Modification modal state
  const [modifyingRes, setModifyingRes] = useState<Reservation | null>(null);
  const [specialRequestsInput, setSpecialRequestsInput] = useState('');
  const [cancellingRes, setCancellingRes] = useState<Reservation | null>(null);
  const [cancelReason, setCancelReason] = useState('Change of personal travel itinerary');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUserBookings = () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`/api/reservations?email=${encodeURIComponent(user.email)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.reservations) {
          setReservations(data.reservations);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUserBookings();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center space-y-4">
        <h2 className="font-serif text-3xl font-bold text-slate-900">Guest Portal Access</h2>
        <p className="text-slate-500 text-sm">
          Please sign in to view and manage your verified reservations, modify stay notes, or download official confirmation vouchers.
        </p>
        <div className="pt-2">
          <button
            onClick={() => {
              setAuthModalMode('login');
              setShowAuthModal(true);
            }}
            className="px-6 py-3 bg-[#0B192C] text-white rounded-lg text-xs font-semibold uppercase tracking-wider"
          >
            Sign In to Account
          </button>
        </div>
      </div>
    );
  }

  const handleSaveNotes = async () => {
    if (!modifyingRes) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/reservations/${modifyingRes.reference}/notes`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ specialRequests: specialRequestsInput })
      });
      const data = await res.json();
      if (data.success) {
        setModifyingRes(null);
        fetchUserBookings();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelReservation = async () => {
    if (!cancellingRes) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/reservations/${cancellingRes.reference}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled', reason: cancelReason })
      });
      const data = await res.json();
      if (data.success) {
        setCancellingRes(null);
        fetchUserBookings();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12 space-y-10">
      {/* Profile Header */}
      <div className="bg-[#0B192C] text-white p-8 rounded-3xl border border-[#1E3A5F] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#C5A880] text-[#0B192C] font-serif text-2xl font-bold flex items-center justify-center">
            {user.name.charAt(0)}
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[#C5A880]">
              Grand Azure Private Member
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-0.5">
              Welcome, {user.name}
            </h1>
            <p className="text-xs text-slate-300 mt-1">{user.email} · Registered Guest</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/rooms')}
            className="px-5 py-2.5 bg-[#C5A880] hover:bg-[#d8bd95] text-[#0B192C] font-semibold text-xs uppercase tracking-wider rounded-lg transition-colors"
          >
            Book Another Suite
          </button>
        </div>
      </div>

      {/* Bookings Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-2xl font-bold text-slate-900">Your Reservations</h3>
          <span className="text-xs text-slate-500">
            {reservations.length} Reservation{reservations.length !== 1 ? 's' : ''} on file
          </span>
        </div>

        {loading ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
            <RefreshCw className="w-6 h-6 animate-spin text-[#C5A880] mx-auto mb-2" />
            <p className="text-xs text-slate-500">Retrieving reservations...</p>
          </div>
        ) : reservations.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 space-y-3">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="font-serif text-lg font-bold text-slate-800">No Reservations Yet</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You do not have any active or past reservations under this email address. Explore our collection of ocean suites.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('/rooms')}
                className="px-5 py-2.5 bg-[#0B192C] text-white rounded-lg text-xs font-semibold uppercase tracking-wider"
              >
                Browse Suites &amp; Villas
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {reservations.map((res) => {
              const isCancelled = res.status === 'cancelled';
              return (
                <div
                  key={res.id}
                  className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                    isCancelled ? 'border-slate-200 opacity-70' : 'border-slate-200/90 shadow-sm hover:shadow-md'
                  }`}
                >
                  <div className="p-6 lg:p-7 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex gap-4 items-center">
                      <img
                        src={res.roomImage}
                        alt={res.roomTitle}
                        className="w-20 h-20 rounded-xl object-cover border border-slate-200 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                            {res.reference}
                          </span>
                          <span
                            className={`text-[11px] font-semibold px-2 py-0.5 rounded uppercase ${
                              res.status === 'confirmed'
                                ? 'bg-emerald-50 text-emerald-700'
                                : res.status === 'checked-in'
                                ? 'bg-blue-50 text-blue-700'
                                : res.status === 'completed'
                                ? 'bg-slate-100 text-slate-700'
                                : 'bg-rose-50 text-rose-700'
                            }`}
                          >
                            {res.status}
                          </span>
                        </div>
                        <h4 className="font-serif text-lg font-bold text-slate-900">{res.roomTitle}</h4>
                        <p className="text-xs text-slate-500">
                          {res.checkIn} to {res.checkOut} ({res.nights} nights) · {res.guestsAdults} Adults
                        </p>
                      </div>
                    </div>

                    <div className="text-left md:text-right">
                      <p className="text-[11px] text-slate-400 uppercase tracking-wider">Total Settlement</p>
                      <p className="font-serif text-2xl font-bold text-[#0B192C] font-mono tabular-nums">
                        ${res.totalAmount.toLocaleString()} USD
                      </p>
                      <span className="text-[11px] text-slate-500 capitalize">
                        Payment: {res.paymentMethod} ({res.paymentStatus})
                      </span>
                    </div>
                  </div>

                  {/* Special Requests or Cancellation Notice */}
                  {res.specialRequests && !isCancelled && (
                    <div className="px-6 py-2.5 bg-slate-50 border-t border-slate-100 text-xs text-slate-600 flex items-center justify-between">
                      <span className="truncate">
                        <strong>Concierge Note:</strong> "{res.specialRequests}"
                      </span>
                      <button
                        onClick={() => {
                          setModifyingRes(res);
                          setSpecialRequestsInput(res.specialRequests || '');
                        }}
                        className="text-xs text-[#0B192C] hover:text-[#C5A880] font-semibold shrink-0 ml-3"
                      >
                        Edit Note
                      </button>
                    </div>
                  )}

                  {isCancelled && res.cancellationReason && (
                    <div className="px-6 py-2.5 bg-rose-50 border-t border-rose-100 text-xs text-rose-700">
                      <strong>Cancellation Note:</strong> "{res.cancellationReason}"
                    </div>
                  )}

                  {/* Action Bar */}
                  <div className="px-6 py-3.5 bg-slate-50/70 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <button
                      onClick={() => onNavigate(`/confirmation/${res.reference}`)}
                      className="inline-flex items-center gap-1.5 text-slate-800 hover:text-[#C5A880] font-semibold"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>View Official Voucher</span>
                    </button>

                    {!isCancelled && (
                      <div className="flex items-center gap-3">
                        {!res.specialRequests && (
                          <button
                            onClick={() => {
                              setModifyingRes(res);
                              setSpecialRequestsInput('');
                            }}
                            className="text-slate-600 hover:text-slate-900 font-medium"
                          >
                            + Add Special Request
                          </button>
                        )}
                        <button
                          onClick={() => setCancellingRes(res)}
                          className="text-rose-600 hover:text-rose-800 font-medium"
                        >
                          Cancel Reservation
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Special Requests Modal */}
      {modifyingRes && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h4 className="font-serif text-xl font-bold text-slate-900">
              Update Concierge Notes
            </h4>
            <p className="text-xs text-slate-500">
              Reservation: {modifyingRes.reference} ({modifyingRes.roomTitle})
            </p>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Special Requests &amp; Preferences
              </label>
              <textarea
                value={specialRequestsInput}
                onChange={(e) => setSpecialRequestsInput(e.target.value)}
                rows={4}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#0B192C]"
                placeholder="High floor request, late check-in notice, dietary notes, etc."
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setModifyingRes(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNotes}
                disabled={actionLoading}
                className="px-5 py-2 bg-[#0B192C] text-white rounded-lg text-xs font-semibold uppercase tracking-wider"
              >
                Save Updates
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Reservation Modal */}
      {cancellingRes && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-xl font-bold text-slate-900">
              Cancel Reservation {cancellingRes.reference}?
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              In accordance with The Grand Azure cancellation policy, free cancellation applies. If you paid via card, our accounts department will process the refund to your original payment method.
            </p>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Reason for Cancellation</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#0B192C]"
              >
                <option value="Change of personal travel itinerary">Change of personal travel itinerary</option>
                <option value="Flight delay or cancellation">Flight delay or cancellation</option>
                <option value="Booking dates need adjustment">Booking dates need adjustment</option>
                <option value="Personal emergency">Personal emergency</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setCancellingRes(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Keep Reservation
              </button>
              <button
                onClick={handleCancelReservation}
                disabled={actionLoading}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold uppercase tracking-wider"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
