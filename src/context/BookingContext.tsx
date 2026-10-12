import React, { createContext, useContext, useState, useEffect } from 'react';
import { Room } from '../types/hotel.js';

interface BookingDraft {
  roomId: string | null;
  room: Room | null;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  guestsAdults: number;
  guestsChildren: number;
  roomsCount: number;
  promoCode: string;
}

interface BookingPricing {
  nights: number;
  nightlyRate: number;
  subtotal: number;
  discountAmount: number;
  promoCode?: string;
  taxAmount: number;
  serviceFee: number;
  totalAmount: number;
  isAvailable: boolean;
  availableUnits?: number;
  error?: string;
}

interface BookingContextType {
  draft: BookingDraft;
  pricing: BookingPricing | null;
  pricingLoading: boolean;
  setDates: (checkIn: string, checkOut: string) => void;
  setGuests: (adults: number, children: number, roomsCount?: number) => void;
  selectRoom: (room: Room) => void;
  applyPromoCode: (code: string) => Promise<boolean>;
  removePromoCode: () => void;
  resetDraft: () => void;
  refreshAvailability: () => Promise<void>;
}

const getDefaultDates = () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 2); // 2 nights default stay
  const dayAfter = new Date(tomorrow);
  dayAfter.setDate(tomorrow.getDate() + 3);

  const pad = (n: number) => String(n).padStart(2, '0');
  const fmt = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  return {
    checkIn: fmt(tomorrow),
    checkOut: fmt(dayAfter)
  };
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const defaultDates = getDefaultDates();
  const [draft, setDraft] = useState<BookingDraft>({
    roomId: null,
    room: null,
    checkIn: defaultDates.checkIn,
    checkOut: defaultDates.checkOut,
    guestsAdults: 2,
    guestsChildren: 0,
    roomsCount: 1,
    promoCode: ''
  });

  const [pricing, setPricing] = useState<BookingPricing | null>(null);
  const [pricingLoading, setPricingLoading] = useState<boolean>(false);

  const refreshAvailability = async () => {
    if (!draft.roomId || !draft.checkIn || !draft.checkOut) {
      setPricing(null);
      return;
    }

    setPricingLoading(true);
    try {
      const res = await fetch('/api/availability/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: draft.roomId,
          checkIn: draft.checkIn,
          checkOut: draft.checkOut,
          roomsCount: draft.roomsCount,
          promoCode: draft.promoCode || undefined
        })
      });
      const data = await res.json();
      if (data.success) {
        setPricing({
          nights: data.nights || 1,
          nightlyRate: data.nightlyRate || 0,
          subtotal: data.subtotal || 0,
          discountAmount: data.discountAmount || 0,
          promoCode: data.promoCode,
          taxAmount: data.taxAmount || 0,
          serviceFee: data.serviceFee || 0,
          totalAmount: data.totalAmount || 0,
          isAvailable: data.isAvailable,
          availableUnits: data.availableUnits,
          error: data.error
        });
      } else {
        setPricing({
          nights: 1,
          nightlyRate: draft.room?.pricePerNight || 0,
          subtotal: draft.room?.pricePerNight || 0,
          discountAmount: 0,
          taxAmount: 0,
          serviceFee: 0,
          totalAmount: draft.room?.pricePerNight || 0,
          isAvailable: false,
          error: data.error || 'Room unavailable'
        });
      }
    } catch (err: any) {
      console.error('Failed to verify pricing:', err);
    } finally {
      setPricingLoading(false);
    }
  };

  useEffect(() => {
    if (draft.roomId) {
      refreshAvailability();
    }
  }, [draft.roomId, draft.checkIn, draft.checkOut, draft.roomsCount, draft.promoCode]);

  const setDates = (checkIn: string, checkOut: string) => {
    setDraft(prev => ({ ...prev, checkIn, checkOut }));
  };

  const setGuests = (guestsAdults: number, guestsChildren: number, roomsCount: number = 1) => {
    setDraft(prev => ({ ...prev, guestsAdults, guestsChildren, roomsCount }));
  };

  const selectRoom = (room: Room) => {
    setDraft(prev => ({ ...prev, roomId: room.id, room }));
  };

  const applyPromoCode = async (code: string) => {
    const trimmed = code.trim().toUpperCase();
    setDraft(prev => ({ ...prev, promoCode: trimmed }));
    return true;
  };

  const removePromoCode = () => {
    setDraft(prev => ({ ...prev, promoCode: '' }));
  };

  const resetDraft = () => {
    const def = getDefaultDates();
    setDraft({
      roomId: null,
      room: null,
      checkIn: def.checkIn,
      checkOut: def.checkOut,
      guestsAdults: 2,
      guestsChildren: 0,
      roomsCount: 1,
      promoCode: ''
    });
    setPricing(null);
  };

  return (
    <BookingContext.Provider
      value={{
        draft,
        pricing,
        pricingLoading,
        setDates,
        setGuests,
        selectRoom,
        applyPromoCode,
        removePromoCode,
        resetDraft,
        refreshAvailability
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) throw new Error('useBooking must be used within BookingProvider');
  return context;
};
