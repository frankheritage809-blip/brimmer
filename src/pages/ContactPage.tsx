import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Car, Clock, ShieldCheck, MessageCircle } from 'lucide-react';

export const ContactPage: React.FC = () => {
  // General Inquiry form
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquirySubject, setInquirySubject] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquirySent, setInquirySent] = useState(false);

  // Airport transfer form
  const [transferGuestName, setTransferGuestName] = useState('');
  const [transferEmail, setTransferEmail] = useState('');
  const [transferPhone, setTransferPhone] = useState('');
  const [flightNumber, setFlightNumber] = useState('');
  const [arrivalDate, setArrivalDate] = useState(new Date().toISOString().split('T')[0]);
  const [arrivalTime, setArrivalTime] = useState('14:00');
  const [vehicleType, setVehicleType] = useState<'Executive Mercedes S-Class' | 'Luxury Range Rover' | 'Grand Passenger Sprinter'>('Executive Mercedes S-Class');
  const [passengers, setPassengers] = useState(2);
  const [transferSent, setTransferSent] = useState(false);
  const [transferLoading, setTransferLoading] = useState(false);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName || !inquiryEmail) return;
    setInquirySent(true);
  };

  const handleTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTransferLoading(true);
    try {
      const res = await fetch('/api/transfers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName: transferGuestName,
          email: transferEmail,
          phone: transferPhone,
          flightNumber,
          arrivalDate,
          arrivalTime,
          vehicleType,
          passengers,
          luggageCount: 2
        })
      });
      const data = await res.json();
      if (data.success) {
        setTransferSent(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTransferLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#C5A880]">
          Royal Concierge &amp; Enquiries
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">
          Contact The Grand Azure
        </h1>
        <p className="text-slate-600 text-sm">
          Our senior concierge team is at your continuous disposal 24 hours a day, 7 days a week.
        </p>
      </div>

      {/* 3 Contact Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-7 rounded-2xl border border-slate-200/90 shadow-sm space-y-3 text-center">
          <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border border-slate-200 mx-auto flex items-center justify-center text-[#C5A880]">
            <Phone className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-lg font-bold text-slate-900">Direct Telephone</h3>
          <p className="text-xs text-slate-500">24/7 International Concierge Desk</p>
          <div className="text-sm font-semibold text-slate-900 space-y-1">
            <p>+1 (800) 582-AZURE (US / Toll-Free)</p>
            <p>+234 1 892 4000 (Nigeria / Direct)</p>
          </div>
        </div>

        <div className="bg-white p-7 rounded-2xl border border-slate-200/90 shadow-sm space-y-3 text-center">
          <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border border-slate-200 mx-auto flex items-center justify-center text-[#C5A880]">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-lg font-bold text-slate-900">Direct Inquiries</h3>
          <p className="text-xs text-slate-500">Average response within 15 minutes</p>
          <div className="text-sm font-semibold text-slate-900 space-y-1">
            <p>concierge@grandazurehotel.com</p>
            <p>reservations@grandazurehotel.com</p>
          </div>
        </div>

        <div className="bg-white p-7 rounded-2xl border border-slate-200/90 shadow-sm space-y-3 text-center">
          <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border border-slate-200 mx-auto flex items-center justify-center text-[#C5A880]">
            <MapPin className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-lg font-bold text-slate-900">Peninsula Enclave</h3>
          <p className="text-xs text-slate-500">Private Oceanfront Drive</p>
          <div className="text-sm font-semibold text-slate-900 space-y-1">
            <p>Azure Promenade, Victoria Island</p>
            <p>Lagos &amp; Côte d'Azur Exclusive Estates</p>
          </div>
        </div>
      </div>

      {/* Split Form: Contact Inquiry Left, Airport Limousine Request Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* Contact Inquiry */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#C5A880]">
              Direct Message
            </span>
            <h3 className="font-serif text-2xl font-bold text-slate-900 mt-1">General Inquiries</h3>
            <p className="text-xs text-slate-500 mt-1">
              Have a special event, wedding, or VIP delegation request? Write to our head of protocol.
            </p>
          </div>

          {inquirySent ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-center space-y-2 text-xs">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <p className="font-bold text-sm">Message Transmitted</p>
              <p>Thank you, {inquiryName}. Our concierge will reply directly to {inquiryEmail}.</p>
            </div>
          ) : (
            <form onSubmit={handleInquirySubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Your Name *</label>
                  <input
                    type="text"
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                    required
                    placeholder="e.g. Victoria Sterling"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#0B192C]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Your Email *</label>
                  <input
                    type="email"
                    value={inquiryEmail}
                    onChange={(e) => setInquiryEmail(e.target.value)}
                    required
                    placeholder="victoria@example.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#0B192C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Inquiry Subject</label>
                <input
                  type="text"
                  value={inquirySubject}
                  onChange={(e) => setInquirySubject(e.target.value)}
                  placeholder="Private Wedding / Penthouse Buyout / Special Request"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#0B192C]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Message Details *</label>
                <textarea
                  value={inquiryMessage}
                  onChange={(e) => setInquiryMessage(e.target.value)}
                  required
                  rows={4}
                  placeholder="Please state how we may accommodate your visit..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#0B192C]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#0B192C] hover:bg-[#132A4B] text-white font-semibold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>Send to Concierge Desk</span>
                <Send className="w-3.5 h-3.5 text-[#C5A880]" />
              </button>
            </form>
          )}
        </div>

        {/* Airport Limousine & Private Chauffeur Request */}
        <div className="bg-[#0B192C] text-white p-8 rounded-3xl border border-[#1E3A5F] shadow-xl space-y-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#C5A880]">
              VIP Transportation
            </span>
            <h3 className="font-serif text-2xl font-bold text-white mt-1">
              Airport Limousine &amp; Helicopter Transfer
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Meet &amp; Greet directly at tarmac or VIP arrivals terminal. Chauffeur tracks your flight live.
            </p>
          </div>

          {transferSent ? (
            <div className="p-6 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl text-emerald-200 text-center space-y-2 text-xs">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <p className="font-bold text-sm text-white">Chauffeur Request Confirmed</p>
              <p>Your {vehicleType} transfer for flight {flightNumber} on {arrivalDate} has been scheduled. Your chauffeur will hold a Grand Azure nameboard upon gate arrival.</p>
            </div>
          ) : (
            <form onSubmit={handleTransferSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Guest Name *</label>
                  <input
                    type="text"
                    value={transferGuestName}
                    onChange={(e) => setTransferGuestName(e.target.value)}
                    required
                    placeholder="e.g. Lord Harrison Thorne"
                    className="w-full px-3.5 py-2.5 bg-[#132A4B] border border-[#1E3A5F] rounded-lg text-white focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Flight Number *</label>
                  <input
                    type="text"
                    value={flightNumber}
                    onChange={(e) => setFlightNumber(e.target.value)}
                    required
                    placeholder="e.g. BA 075 / AF 384"
                    className="w-full px-3.5 py-2.5 bg-[#132A4B] border border-[#1E3A5F] rounded-lg text-white focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Arrival Date *</label>
                  <input
                    type="date"
                    value={arrivalDate}
                    onChange={(e) => setArrivalDate(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-[#132A4B] border border-[#1E3A5F] rounded-lg text-white focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Arrival Time</label>
                  <input
                    type="time"
                    value={arrivalTime}
                    onChange={(e) => setArrivalTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#132A4B] border border-[#1E3A5F] rounded-lg text-white focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Vehicle Selection</label>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-[#132A4B] border border-[#1E3A5F] rounded-lg text-white focus:outline-none focus:border-[#C5A880]"
                  >
                    <option value="Executive Mercedes S-Class">Mercedes-Benz S-Class Limousine</option>
                    <option value="Luxury Range Rover">Range Rover Autobiography SUV</option>
                    <option value="Grand Passenger Sprinter">Mercedes VIP Sprinter (Up to 8 Pax)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Passengers</label>
                  <select
                    value={passengers}
                    onChange={(e) => setPassengers(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-[#132A4B] border border-[#1E3A5F] rounded-lg text-white focus:outline-none focus:border-[#C5A880]"
                  >
                    <option value={1}>1 Passenger</option>
                    <option value={2}>2 Passengers</option>
                    <option value={4}>4 Passengers</option>
                    <option value={6}>6+ Passengers</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Email *</label>
                  <input
                    type="email"
                    value={transferEmail}
                    onChange={(e) => setTransferEmail(e.target.value)}
                    required
                    placeholder="guest@example.com"
                    className="w-full px-3.5 py-2.5 bg-[#132A4B] border border-[#1E3A5F] rounded-lg text-white focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Phone *</label>
                  <input
                    type="tel"
                    value={transferPhone}
                    onChange={(e) => setTransferPhone(e.target.value)}
                    required
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3.5 py-2.5 bg-[#132A4B] border border-[#1E3A5F] rounded-lg text-white focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={transferLoading}
                className="w-full py-3.5 bg-[#C5A880] hover:bg-[#d8bd95] text-[#0B192C] font-semibold text-xs uppercase tracking-widest rounded-lg transition-colors cursor-pointer shadow-lg disabled:opacity-50"
              >
                Schedule VIP Airport Chauffeur
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
