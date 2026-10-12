import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, ShieldCheck, Lock } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
  };

  return (
    <footer className="bg-[#070F1A] text-slate-300 border-t border-[#132A4B]">
      {/* Upper Newsletter & VIP Club strip */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14 border-b border-slate-800/80">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C5A880]">The Grand Azure Society</span>
            <h3 className="font-serif text-2xl lg:text-3xl text-white mt-1">Exclusive Privileges &amp; Seasonal Invitations</h3>
            <p className="text-slate-400 text-sm mt-2 max-w-lg">
              Join our private guest registry for bespoke seasonal rates, private wine cellar tastings, and priority suite allocations.
            </p>
          </div>
          <div>
            {subscribed ? (
              <div className="flex items-center gap-3 p-4 bg-emerald-950/40 border border-emerald-800/60 rounded text-emerald-200 text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Thank you for subscribing. Your exclusive 15% welcome code is <strong>AZURE2026</strong>.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    required
                    className="w-full pl-10 pr-4 py-3 bg-[#0B192C] border border-[#1E3A5F] rounded text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#C5A880] hover:bg-[#d8bd95] text-[#0B192C] font-semibold text-xs uppercase tracking-wider rounded transition-colors whitespace-nowrap flex items-center justify-center gap-2"
                >
                  <span>Join Society</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
            <p className="text-[11px] text-slate-500 mt-2">
              We respect your privacy. Unsubscribe at any time with one click.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer columns */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Story */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-serif text-2xl font-bold text-white tracking-tight">The Grand Azure</h4>
            <p className="text-slate-400 text-sm leading-relaxed pr-6">
              A peerless beacon of timeless luxury and haute hospitality. Crafted for discerning travelers seeking coastal serenity, Michelin-caliber gastronomy, and thoughtful bespoke service.
            </p>
            <div className="pt-2 flex flex-col gap-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                <span>Azure Way, Victoria Island Atlantic Enclave / Côte d'Azur Sanctuary</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C5A880] shrink-0" />
                <span>+1 (800) 582-AZURE / +234 1 892 4000</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C5A880] shrink-0" />
                <span>concierge@grandazurehotel.com</span>
              </div>
            </div>
          </div>

          {/* Suites & Villas */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-[#C5A880] mb-4">Suites &amp; Villas</h5>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onNavigate('/rooms')} className="hover:text-white transition-colors text-slate-400">
                  Presidential Penthouse
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/rooms')} className="hover:text-white transition-colors text-slate-400">
                  Deluxe Ocean Suite
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/rooms')} className="hover:text-white transition-colors text-slate-400">
                  Executive Club Suite
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/rooms')} className="hover:text-white transition-colors text-slate-400">
                  Royal Garden Villa
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/rooms')} className="hover:text-white transition-colors text-slate-400">
                  Imperial Diplomatic Crown
                </button>
              </li>
            </ul>
          </div>

          {/* Experiences & Dining */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-[#C5A880] mb-4">Experiences</h5>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onNavigate('/dining')} className="hover:text-white transition-colors text-slate-400">
                  L'Azur Fine Dining
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/wellness')} className="hover:text-white transition-colors text-slate-400">
                  Azure Thermal Spa
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/offers')} className="hover:text-white transition-colors text-slate-400">
                  Seasonal Packages
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/gallery')} className="hover:text-white transition-colors text-slate-400">
                  Hotel Photo Gallery
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/contact')} className="hover:text-white transition-colors text-slate-400">
                  Private Airport Transfers
                </button>
              </li>
            </ul>
          </div>

          {/* Guest Services & Legal */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-[#C5A880] mb-4">Guest Care</h5>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onNavigate('/faq')} className="hover:text-white transition-colors text-slate-400">
                  Check-in &amp; Policies
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/guest-dashboard')} className="hover:text-white transition-colors text-slate-400">
                  Guest Reservation Portal
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/policy')} className="hover:text-white transition-colors text-slate-400">
                  Terms of Hospitality
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/policy')} className="hover:text-white transition-colors text-slate-400">
                  Cancellation &amp; Refunds
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/policy')} className="hover:text-white transition-colors text-slate-400">
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Security & Payment Badges */}
        <div className="mt-14 pt-8 border-t border-slate-800/60 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Lock className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>256-Bit SSL Bank-Grade Encryption</span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>PCI-DSS Level 1 Verified</span>
            </span>
            <span className="text-slate-500">
              Supported: Visa · Mastercard · Amex · Stripe · Paystack
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span>&copy; {new Date().getFullYear()} The Grand Azure Hotel &amp; Suites. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
