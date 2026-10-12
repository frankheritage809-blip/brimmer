import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FaqPageProps {
  onNavigate: (path: string) => void;
}

export const FaqPage: React.FC<FaqPageProps> = ({ onNavigate }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      question: 'What are the check-in and check-out times at The Grand Azure?',
      answer: 'Standard check-in begins at 3:00 PM (15:00) and check-out is at 12:00 PM (noon). Early check-in or late check-out is provided complimentary based on suite availability for guests booking direct or holding Executive Club & Penthouse reservations.'
    },
    {
      question: 'What is the reservation cancellation and refund policy?',
      answer: 'Direct reservations may be cancelled without penalty up to 48 hours prior to your scheduled check-in date. If cancelled within 48 hours or in the event of a no-show, a fee equivalent to one night’s room rate plus tax will apply. Pre-paid non-refundable special packages will specify terms at booking.'
    },
    {
      question: 'What payment methods are supported for reservations?',
      answer: 'We accept all major international cards (Visa, Mastercard, American Express) processed through our bank-grade 256-bit encrypted Stripe architecture, as well as Paystack for Nigerian and African guests (supporting direct debit cards, USSD, and bank transfers). You may also choose to guarantee your suite online and settle upon arrival.'
    },
    {
      question: 'How do I arrange private airport transfers or helicopter charter?',
      answer: 'Private chauffeured transfers in our Mercedes S-Class or Range Rover fleet can be scheduled during checkout or directly via our Contact / Concierge page. For private helicopter transfers directly to our rooftop helipad, please inform our concierge at least 24 hours in advance with your flight tail number.'
    },
    {
      question: 'What dietary preferences and allergies are accommodated at your restaurants?',
      answer: 'Executive Chef Laurent Mercier and our culinary brigade accommodate halal, kosher, gluten-free, vegan, and specific allergen requests. We recommend mentioning any severe dietary restrictions during room or dining table reservations.'
    },
    {
      question: 'Is breakfast included with suite bookings?',
      answer: 'Yes. All direct bookings made through our website include daily gourmet champagne breakfast served either in L’Azur Grand Pavilion or delivered privately to your suite terrace via silver service.'
    },
    {
      question: 'What is the hotel pet policy?',
      answer: 'We welcome well-mannered small pets (up to 12 kg / 26 lbs) in designated garden villas and deluxe ocean suites. Luxury pet amenities including organic treats, memory-foam bedding, and bespoke walking services are provided upon request with our concierge.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#C5A880]">
          Guest Guidance &amp; Policies
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-slate-600 text-sm">
          Everything you need to know about your luxury stay, arrival etiquette, and hotel amenities.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-6 text-left flex items-center justify-between gap-4 font-serif text-lg font-bold text-slate-900 hover:text-[#0B192C]"
              >
                <span>{faq.question}</span>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-[#C5A880] shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                )}
              </button>
              {isOpen && (
                <div className="px-6 pb-6 pt-1 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-[#FAF8F5] p-8 rounded-2xl border border-[#F0EBE1] text-center space-y-3">
        <h4 className="font-serif text-xl font-bold text-slate-900">Have an unaddressed question?</h4>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Our Royal Butler and Concierge desk is on hand 24 hours a day to assist with any tailored requests.
        </p>
        <button
          onClick={() => onNavigate('/contact')}
          className="px-6 py-2.5 bg-[#0B192C] text-white rounded-lg text-xs font-semibold uppercase tracking-wider"
        >
          Contact Butler Desk
        </button>
      </div>
    </div>
  );
};
