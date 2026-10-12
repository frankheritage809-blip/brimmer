import React, { useState } from 'react';
import { PaymentMethod } from '../../types/hotel.js';
import { CreditCard, ShieldCheck, CheckCircle2, AlertCircle, RefreshCw, Smartphone, Building2 } from 'lucide-react';

interface PaymentSelectorProps {
  amountUSD: number;
  selectedMethod: PaymentMethod;
  onSelectMethod: (method: PaymentMethod) => void;
  onPaymentSuccess: (transactionId: string) => void;
  onPaymentFailed: (error: string) => void;
  disabled?: boolean;
}

export const PaymentSelector: React.FC<PaymentSelectorProps> = ({
  amountUSD,
  selectedMethod,
  onSelectMethod,
  onPaymentSuccess,
  onPaymentFailed,
  disabled = false
}) => {
  // Stripe Card state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardHolder, setCardHolder] = useState('');

  // Paystack state (converted to NGN at ~₦1,550/$1)
  const exchangeRateNGN = 1550;
  const amountNGN = Math.round(amountUSD * exchangeRateNGN);

  const [processing, setProcessing] = useState(false);
  const [paystackSimOpen, setPaystackSimOpen] = useState(false);

  const fillTestCard = () => {
    setCardNumber('4242 4242 4242 4242');
    setCardExpiry('12/28');
    setCardCvc('888');
    setCardHolder('Lady Catherine Vance');
  };

  const handleStripePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !cardExpiry || !cardCvc || !cardHolder) {
      onPaymentFailed('Please complete all card payment fields');
      return;
    }

    setProcessing(true);
    try {
      const res = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethod: 'stripe_card',
          amount: amountUSD,
          currency: 'USD',
          reference: `card_auth_${Date.now()}`
        })
      });
      const data = await res.json();
      if (data.success && data.verified) {
        onPaymentSuccess(data.transactionId);
      } else {
        onPaymentFailed(data.error || 'Card authorization declined by issuer');
      }
    } catch (err: any) {
      onPaymentFailed(err.message || 'Payment server unreachable');
    } finally {
      setProcessing(false);
    }
  };

  const handlePaystackConfirm = async () => {
    setProcessing(true);
    setPaystackSimOpen(false);
    try {
      const res = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethod: 'paystack',
          amount: amountNGN,
          currency: 'NGN',
          reference: `pstk_trx_${Date.now()}`
        })
      });
      const data = await res.json();
      if (data.success && data.verified) {
        onPaymentSuccess(data.transactionId);
      } else {
        onPaymentFailed('Paystack transaction was cancelled or declined');
      }
    } catch (err: any) {
      onPaymentFailed(err.message || 'Paystack server error');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="font-serif text-lg font-bold text-slate-900">Select Payment Method</h4>
        <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Encrypted 256-bit SSL</span>
        </div>
      </div>

      {/* Payment Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => onSelectMethod('stripe_card')}
          className={`p-4 rounded-xl border text-left transition-all ${
            selectedMethod === 'stripe_card'
              ? 'border-[#0B192C] bg-white ring-2 ring-[#0B192C]/10 shadow-sm'
              : 'border-slate-200 bg-slate-50 hover:bg-white text-slate-600'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <CreditCard className={`w-5 h-5 ${selectedMethod === 'stripe_card' ? 'text-[#0B192C]' : 'text-slate-400'}`} />
            {selectedMethod === 'stripe_card' && <CheckCircle2 className="w-4 h-4 text-[#C5A880]" />}
          </div>
          <p className="text-sm font-semibold text-slate-900">Credit / Debit Card</p>
          <p className="text-xs text-slate-500 mt-0.5">Stripe Gateway (USD)</p>
        </button>

        <button
          type="button"
          onClick={() => onSelectMethod('paystack')}
          className={`p-4 rounded-xl border text-left transition-all ${
            selectedMethod === 'paystack'
              ? 'border-emerald-600 bg-white ring-2 ring-emerald-500/10 shadow-sm'
              : 'border-slate-200 bg-slate-50 hover:bg-white text-slate-600'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Smartphone className={`w-5 h-5 ${selectedMethod === 'paystack' ? 'text-emerald-600' : 'text-slate-400'}`} />
            {selectedMethod === 'paystack' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          </div>
          <p className="text-sm font-semibold text-slate-900">Paystack</p>
          <p className="text-xs text-slate-500 mt-0.5">Nigeria / Africa (NGN ₦)</p>
        </button>

        <button
          type="button"
          onClick={() => onSelectMethod('pay_at_hotel')}
          className={`p-4 rounded-xl border text-left transition-all ${
            selectedMethod === 'pay_at_hotel'
              ? 'border-[#C5A880] bg-white ring-2 ring-[#C5A880]/10 shadow-sm'
              : 'border-slate-200 bg-slate-50 hover:bg-white text-slate-600'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Building2 className={`w-5 h-5 ${selectedMethod === 'pay_at_hotel' ? 'text-[#C5A880]' : 'text-slate-400'}`} />
            {selectedMethod === 'pay_at_hotel' && <CheckCircle2 className="w-4 h-4 text-[#C5A880]" />}
          </div>
          <p className="text-sm font-semibold text-slate-900">Pay at Arrival</p>
          <p className="text-xs text-slate-500 mt-0.5">Card Guarantee</p>
        </button>
      </div>

      {/* STRIPE CARD FORM */}
      {selectedMethod === 'stripe_card' && (
        <form onSubmit={handleStripePay} className="p-5 bg-white border border-slate-200 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase text-slate-500">Card Credentials</span>
              <span className="text-xs text-slate-400">· Visa, Mastercard, Amex</span>
            </div>
            <button
              type="button"
              onClick={fillTestCard}
              className="text-xs font-semibold text-[#0B192C] hover:text-[#C5A880] underline cursor-pointer"
            >
              Use Test Card (4242...)
            </button>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Cardholder Name</label>
            <input
              type="text"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              placeholder="e.g. Alexander Sterling"
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-[#0B192C] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Card Number</label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="4242 4242 4242 4242"
              maxLength={19}
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono text-slate-900 focus:outline-none focus:border-[#0B192C] focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Expiry Date (MM/YY)</label>
              <input
                type="text"
                value={cardExpiry}
                onChange={(e) => setCardExpiry(e.target.value)}
                placeholder="12/28"
                maxLength={5}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono text-slate-900 focus:outline-none focus:border-[#0B192C] focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">CVC / CVV</label>
              <input
                type="password"
                value={cardCvc}
                onChange={(e) => setCardCvc(e.target.value)}
                placeholder="888"
                maxLength={4}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono text-slate-900 focus:outline-none focus:border-[#0B192C] focus:bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={disabled || processing}
            className="w-full mt-2 py-3.5 bg-[#0B192C] hover:bg-[#132A4B] text-white font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
          >
            {processing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-[#C5A880]" />
                <span>Verifying with Stripe Secure Vault...</span>
              </>
            ) : (
              <span>Authorize &amp; Pay ${amountUSD.toLocaleString()} USD</span>
            )}
          </button>
        </form>
      )}

      {/* PAYSTACK FORM */}
      {selectedMethod === 'paystack' && (
        <div className="p-5 bg-white border border-emerald-200 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-semibold text-slate-900 text-sm">Paystack Checkout (Nigeria &amp; Africa)</h5>
              <p className="text-xs text-slate-500">Supports Nigerian Bank Cards, USSD, and Instant Transfer</p>
            </div>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded">
              ₦{amountNGN.toLocaleString()} NGN
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-lg text-xs text-slate-600 space-y-1.5 border border-slate-100">
            <p className="flex justify-between">
              <span>USD Amount:</span>
              <span className="font-semibold text-slate-800">${amountUSD.toLocaleString()}</span>
            </p>
            <p className="flex justify-between">
              <span>Conversion Rate:</span>
              <span className="font-semibold text-slate-800">1 USD = ₦{exchangeRateNGN.toLocaleString()}</span>
            </p>
            <p className="flex justify-between text-slate-900 font-bold border-t border-slate-200 pt-1">
              <span>Total Payable NGN:</span>
              <span className="text-emerald-700">₦{amountNGN.toLocaleString()}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={() => setPaystackSimOpen(true)}
            disabled={disabled || processing}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
          >
            {processing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Verifying Paystack Webhook...</span>
              </>
            ) : (
              <span>Proceed to Paystack Gateway</span>
            )}
          </button>

          {/* Paystack Modal Simulation */}
          {paystackSimOpen && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-fade-in">
                <div className="bg-emerald-700 p-5 text-white flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg">Paystack Secured Gateway</h3>
                    <p className="text-xs text-emerald-100">Merchant: The Grand Azure Hotel &amp; Suites</p>
                  </div>
                  <span className="text-xl font-bold font-mono">₦{amountNGN.toLocaleString()}</span>
                </div>
                <div className="p-6 space-y-4 text-sm">
                  <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg text-xs border border-emerald-100">
                    You are simulating an official Paystack sandbox payment. Click below to verify or cancel.
                  </div>
                  <div className="space-y-2 text-xs text-slate-600">
                    <p><strong>Channel:</strong> Guaranteed Nigerian Debit Card / Bank Transfer</p>
                    <p><strong>Customer:</strong> Registered Guest</p>
                    <p><strong>Status:</strong> Ready for Authorization</p>
                  </div>
                  <div className="pt-2 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setPaystackSimOpen(false)}
                      className="flex-1 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium text-xs"
                    >
                      Cancel Payment
                    </button>
                    <button
                      type="button"
                      onClick={handlePaystackConfirm}
                      className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold text-xs transition-colors"
                    >
                      Simulate Successful Payment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* PAY AT HOTEL */}
      {selectedMethod === 'pay_at_hotel' && (
        <div className="p-5 bg-white border border-[#C5A880]/60 rounded-xl space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#C5A880] shrink-0 mt-0.5" />
            <div>
              <h5 className="font-semibold text-slate-900 text-sm">Complimentary Arrival Settlement</h5>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Your reservation is immediately locked and guaranteed. You will present your physical card or cash payment during VIP check-in at our front reception.
              </p>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 italic">
            * Free cancellation applies up to 48 hours prior to arrival date.
          </p>
        </div>
      )}
    </div>
  );
};
