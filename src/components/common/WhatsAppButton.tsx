import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  const [openTooltip, setOpenTooltip] = useState(false);

  const phoneNumber = '2348031234567'; // Nigerian/International Concierge format
  const message = encodeURIComponent('Hello Grand Azure Concierge, I would like to inquire about booking a suite and luxury amenities.');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {openTooltip && (
        <div className="mb-3 w-72 bg-[#0B192C] text-white p-4 rounded-xl shadow-2xl border border-[#1E3A5F] text-xs relative animate-fade-in">
          <button
            onClick={() => setOpenTooltip(false)}
            className="absolute top-2.5 right-2.5 text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <p className="font-semibold text-white">Grand Azure Butler Desk</p>
          </div>
          <p className="text-slate-300 leading-relaxed mb-3">
            Inquire directly about bespoke suite availability, private dining, or luxury airport chauffeur.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-center rounded transition-colors"
          >
            Open WhatsApp Chat
          </a>
        </div>
      )}

      <button
        onClick={() => setOpenTooltip(!openTooltip)}
        aria-label="Direct WhatsApp Concierge"
        className="w-13 h-13 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl flex items-center justify-center transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    </div>
  );
};
