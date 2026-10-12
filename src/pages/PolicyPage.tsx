import React from 'react';
import { ShieldCheck, Lock, FileText, CheckCircle2 } from 'lucide-react';

export const PolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-8 py-14 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#C5A880]">
          Legal &amp; Hospitality Standards
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">
          Terms of Hospitality &amp; Privacy Policy
        </h1>
        <p className="text-xs text-slate-500">
          Last updated: October 2026 · The Grand Azure Hotel &amp; Suites Global Governance
        </p>
      </div>

      <div className="bg-white p-8 lg:p-10 rounded-3xl border border-slate-200/90 shadow-sm space-y-8 text-xs sm:text-sm text-slate-600 leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3">
          <h3 className="font-serif text-xl font-bold text-slate-900">
            1. Reservation Guarantee &amp; Check-In Etiquette
          </h3>
          <p>
            Reservations confirmed through the Grand Azure booking platform are legally guaranteed accommodations. Guests must present a government-issued photographic identity document (Passport, Driver’s License, or National Identity Card) along with the credit card used during booking upon VIP reception.
          </p>
          <p>
            Standard check-in begins at 3:00 PM (15:00) local time. Early check-in requests are subject to availability and will be prioritized for Grand Azure Society members and direct web bookings.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h3 className="font-serif text-xl font-bold text-slate-900">
            2. Cancellation, Modification &amp; Refund Policy
          </h3>
          <p>
            Direct reservations enjoy <strong>Free Cancellation</strong> up to forty-eight (48) hours prior to the scheduled check-in date. If a cancellation is requested within 48 hours of arrival or in the case of an unnotified no-show, the hotel reserves the right to charge an amount equal to the first night’s room rate plus applicable hospitality taxes.
          </p>
          <p>
            For prepaid promotional packages (such as Honeymoon Escape or Executive Club Special), cancellation guidelines specified within the package confirmation voucher shall supersede general terms. All verified refunds are returned to the initial payment source within 3–5 business days.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h3 className="font-serif text-xl font-bold text-slate-900">
            3. Payment Processing &amp; Security Standards
          </h3>
          <p>
            All financial transactions conducted via our web platform are secured by 256-bit Transport Layer Security (TLS) and PCI-DSS Level 1 compliant processors.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Stripe Architecture:</strong> Global transactions in United States Dollars (USD) and international credit/debit instruments.</li>
            <li><strong>Paystack Architecture:</strong> Transactions originating in Nigeria and African banking channels, processed in Nigerian Naira (NGN) with authentic real-time bank verification.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h3 className="font-serif text-xl font-bold text-slate-900">
            4. Privacy Policy &amp; Data Protection (GDPR &amp; NDPR Compliant)
          </h3>
          <p>
            We collect only the essential personal details required to administer your stay, verify identity, deliver concierge services, and satisfy local statutory hospitality records. We never sell, lease, or monetize guest information to third-party marketing entities.
          </p>
          <p>
            You have the right to request access to, rectification of, or erasure of your stored guest profile at any time by contacting our Data Protection Officer at <code>privacy@grandazurehotel.com</code>.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h3 className="font-serif text-xl font-bold text-slate-900">
            5. House Policies &amp; Environmental Sustainability
          </h3>
          <p>
            The Grand Azure operates a 100% non-smoking policy throughout all indoor guest suites, corridors, and enclosed dining salons. Designated smoking lounges are available on outdoor ocean terraces.
          </p>
        </section>
      </div>
    </div>
  );
};
