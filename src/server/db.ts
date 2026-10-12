import { Room, Reservation, User, Promotion, DiningReservation, AirportTransferRequest, AdminMetrics } from '../types/hotel.js';
import { INITIAL_ROOMS, INITIAL_PROMOTIONS } from './data/seedData.js';

class HotelDatabase {
  private rooms: Room[] = [...INITIAL_ROOMS];
  private promotions: Promotion[] = [...INITIAL_PROMOTIONS];
  private reservations: Reservation[] = [];
  private users: User[] = [
    {
      id: 'usr-admin',
      name: 'Victoria Vance',
      email: 'admin@grandazure.com',
      role: 'admin',
      phone: '+1 (555) 019-2834',
      createdAt: '2026-01-01T00:00:00.000Z'
    },
    {
      id: 'usr-guest-1',
      name: 'Alexander Sterling',
      email: 'guest@example.com',
      role: 'guest',
      phone: '+1 (555) 438-9201',
      createdAt: '2026-02-15T00:00:00.000Z'
    }
  ];
  private diningReservations: DiningReservation[] = [];
  private transferRequests: AirportTransferRequest[] = [];

  constructor() {
    this.seedInitialReservations();
  }

  private seedInitialReservations() {
    // Seed sample confirmed reservations to demonstrate calendar blocking and stats
    const today = new Date();
    const in3Days = new Date(today);
    in3Days.setDate(today.getDate() + 3);
    const in6Days = new Date(today);
    in6Days.setDate(today.getDate() + 6);

    const pad = (n: number) => String(n).padStart(2, '0');
    const fmt = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

    this.reservations.push({
      id: 'res-seed-1',
      reference: 'AZR-2026-8912',
      roomId: 'room-1',
      roomTitle: 'The Presidential Ocean Penthouse',
      roomCategory: 'Presidential Suite',
      roomImage: '/src/assets/images/room_presidential_suite_1791847526410.jpg',
      checkIn: fmt(in3Days),
      checkOut: fmt(in6Days),
      nights: 3,
      guestsAdults: 2,
      guestsChildren: 0,
      roomsCount: 1,
      guestName: 'Lord Harrison Thorne',
      guestEmail: 'guest@example.com',
      guestPhone: '+44 20 7946 0921',
      guestCountry: 'United Kingdom',
      specialRequests: 'Chilled Krug champagne and late afternoon turndown.',
      nightlyRate: 1250,
      subtotal: 3750,
      taxAmount: 375,
      serviceFee: 187.5,
      discountAmount: 0,
      totalAmount: 4312.5,
      paymentMethod: 'stripe_card',
      paymentStatus: 'paid',
      paymentTransactionId: 'ch_stripe_seed_8912',
      status: 'confirmed',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
    });

    this.reservations.push({
      id: 'res-seed-2',
      reference: 'AZR-2026-5421',
      roomId: 'room-2',
      roomTitle: 'Deluxe Azure Ocean Suite',
      roomCategory: 'Deluxe',
      roomImage: '/src/assets/images/room_deluxe_ocean_1791847526856.jpg',
      checkIn: fmt(today),
      checkOut: fmt(in3Days),
      nights: 3,
      guestsAdults: 2,
      guestsChildren: 1,
      roomsCount: 1,
      guestName: 'Ngozi Okonjo',
      guestEmail: 'ngozi@sample-tech.ng',
      guestPhone: '+234 803 123 4567',
      guestCountry: 'Nigeria',
      specialRequests: 'High floor preferred, airport transfer arranged.',
      nightlyRate: 580,
      subtotal: 1740,
      taxAmount: 174,
      serviceFee: 87,
      discountAmount: 261, // 15% discount
      promoCode: 'AZURE2026',
      totalAmount: 1740,
      paymentMethod: 'paystack',
      paymentStatus: 'paid',
      paymentTransactionId: 'pstk_seed_9024_ng',
      status: 'checked-in',
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString()
    });
  }

  // --- Rooms ---
  public getRooms(): Room[] {
    return this.rooms;
  }

  public getRoomById(id: string): Room | undefined {
    return this.rooms.find(r => r.id === id || r.slug === id);
  }

  public createRoom(roomData: Omit<Room, 'id'>): Room {
    const id = `room-${Date.now()}`;
    const newRoom: Room = { ...roomData, id };
    this.rooms.push(newRoom);
    return newRoom;
  }

  public updateRoom(id: string, updates: Partial<Room>): Room | null {
    const idx = this.rooms.findIndex(r => r.id === id);
    if (idx === -1) return null;
    this.rooms[idx] = { ...this.rooms[idx], ...updates };
    return this.rooms[idx];
  }

  public deleteRoom(id: string): boolean {
    const initialLen = this.rooms.length;
    this.rooms = this.rooms.filter(r => r.id !== id);
    return this.rooms.length < initialLen;
  }

  // --- Availability Logic (Strict Double-Booking Prevention) ---
  public checkRoomAvailability(
    roomId: string,
    checkIn: string,
    checkOut: string,
    requestedRoomsCount: number = 1
  ): { isAvailable: boolean; overlappingCount: number; availableUnits: number } {
    const room = this.getRoomById(roomId);
    if (!room || !room.isAvailable) {
      return { isAvailable: false, overlappingCount: 0, availableUnits: 0 };
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime()) || checkOutDate <= checkInDate) {
      return { isAvailable: false, overlappingCount: 0, availableUnits: 0 };
    }

    // Check overlap with active reservations
    // Overlap condition: res.checkIn < req.checkOut && res.checkOut > req.checkIn
    let overlappingCount = 0;
    for (const res of this.reservations) {
      if (res.roomId === room.id && res.status !== 'cancelled') {
        const resCheckIn = new Date(res.checkIn);
        const resCheckOut = new Date(res.checkOut);
        if (resCheckIn < checkOutDate && resCheckOut > checkInDate) {
          overlappingCount += (res.roomsCount || 1);
        }
      }
    }

    const totalUnits = room.totalUnits || 1;
    const availableUnits = Math.max(0, totalUnits - overlappingCount);
    const isAvailable = availableUnits >= requestedRoomsCount;

    return { isAvailable, overlappingCount, availableUnits };
  }

  public getAvailableRooms(checkIn: string, checkOut: string, guestsCount: number = 1): Room[] {
    return this.rooms.filter(room => {
      if (!room.isAvailable) return false;
      if (room.capacityAdults + (room.capacityChildren || 0) < guestsCount) return false;
      const { isAvailable } = this.checkRoomAvailability(room.id, checkIn, checkOut, 1);
      return isAvailable;
    });
  }

  // --- Pricing Calculator ---
  public calculateStayPricing(
    roomId: string,
    checkIn: string,
    checkOut: string,
    promoCode?: string
  ) {
    const room = this.getRoomById(roomId);
    if (!room) throw new Error('Room not found');

    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    const nights = Math.max(1, Math.round((outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24)));

    const nightlyRate = room.pricePerNight;
    const subtotal = nightlyRate * nights;

    // Apply promo if valid
    let discountAmount = 0;
    let promo: Promotion | undefined;
    if (promoCode) {
      promo = this.promotions.find(p => p.code.toUpperCase() === promoCode.toUpperCase() && p.active);
      if (promo && nights >= promo.minNights) {
        discountAmount = Math.round((subtotal * promo.discountPercent) / 100);
      }
    }

    const discountedSubtotal = subtotal - discountAmount;
    const taxAmount = Math.round(discountedSubtotal * 0.10); // 10% hospitality VAT/tax
    const serviceFee = Math.round(discountedSubtotal * 0.05); // 5% luxury service fee
    const totalAmount = discountedSubtotal + taxAmount + serviceFee;

    return {
      nights,
      nightlyRate,
      subtotal,
      discountAmount,
      promoCode: promo ? promo.code : undefined,
      taxAmount,
      serviceFee,
      totalAmount
    };
  }

  // --- Reservations ---
  public getReservations(filter?: { email?: string; status?: string; search?: string }): Reservation[] {
    let result = [...this.reservations];
    if (filter?.email) {
      result = result.filter(r => r.guestEmail.toLowerCase() === filter.email?.toLowerCase());
    }
    if (filter?.status && filter.status !== 'all') {
      result = result.filter(r => r.status === filter.status);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(r =>
        r.reference.toLowerCase().includes(q) ||
        r.guestName.toLowerCase().includes(q) ||
        r.guestEmail.toLowerCase().includes(q) ||
        r.roomTitle.toLowerCase().includes(q)
      );
    }
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getReservationByReference(reference: string): Reservation | undefined {
    return this.reservations.find(r => r.reference.toUpperCase() === reference.toUpperCase());
  }

  public createReservation(data: Omit<Reservation, 'id' | 'reference' | 'createdAt'>): Reservation {
    // Generate unique reference AZR-2026-XXXX
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const reference = `AZR-2026-${randomDigits}`;
    const id = `res-${Date.now()}-${randomDigits}`;

    const newReservation: Reservation = {
      ...data,
      id,
      reference,
      createdAt: new Date().toISOString()
    };

    this.reservations.unshift(newReservation);
    return newReservation;
  }

  public updateReservationStatus(
    reference: string,
    status: Reservation['status'],
    reason?: string
  ): Reservation | null {
    const res = this.getReservationByReference(reference);
    if (!res) return null;

    res.status = status;
    if (reason) res.cancellationReason = reason;
    if (status === 'cancelled' && res.paymentStatus === 'paid') {
      // In high-end hospitality, cancellation policy notes refund
      res.paymentStatus = 'refunded';
    }
    return res;
  }

  public updateReservationNotes(reference: string, specialRequests: string): Reservation | null {
    const res = this.getReservationByReference(reference);
    if (!res) return null;
    res.specialRequests = specialRequests;
    return res;
  }

  // --- Users & Authentication ---
  public findUserByEmail(email: string): User | undefined {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public createUser(name: string, email: string, role: 'admin' | 'guest' = 'guest', phone?: string): User {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name,
      email,
      role,
      phone,
      createdAt: new Date().toISOString()
    };
    this.users.push(newUser);
    return newUser;
  }

  // --- Promotions ---
  public getPromotions(): Promotion[] {
    return this.promotions;
  }

  public addPromotion(promo: Promotion): Promotion {
    this.promotions.push(promo);
    return promo;
  }

  // --- Dining & Transfers ---
  public createDiningReservation(data: Omit<DiningReservation, 'id' | 'createdAt'>): DiningReservation {
    const item: DiningReservation = {
      ...data,
      id: `dine-res-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.diningReservations.push(item);
    return item;
  }

  public getDiningReservations(): DiningReservation[] {
    return this.diningReservations;
  }

  public createTransferRequest(data: Omit<AirportTransferRequest, 'id' | 'createdAt'>): AirportTransferRequest {
    const item: AirportTransferRequest = {
      ...data,
      id: `transfer-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.transferRequests.push(item);
    return item;
  }

  public getTransferRequests(): AirportTransferRequest[] {
    return this.transferRequests;
  }

  // --- Admin Metrics ---
  public getAdminMetrics(): AdminMetrics {
    const confirmedList = this.reservations.filter(r => r.status === 'confirmed' || r.status === 'checked-in');
    const totalRevenue = confirmedList.reduce((sum, r) => sum + r.totalAmount, 0);
    const totalUnits = this.rooms.reduce((sum, r) => sum + (r.totalUnits || 1), 0);
    const bookedUnits = confirmedList.reduce((sum, r) => sum + (r.roomsCount || 1), 0);
    const occupancyRate = totalUnits > 0 ? Math.min(100, Math.round((bookedUnits / totalUnits) * 100)) : 0;

    return {
      totalRevenue,
      totalReservations: this.reservations.length,
      confirmedBookings: confirmedList.length,
      occupancyRate,
      availableRoomsCount: Math.max(0, totalUnits - bookedUnits),
      pendingRequests: this.diningReservations.length + this.transferRequests.length,
      recentReservations: this.reservations.slice(0, 5)
    };
  }

  // --- CSV Export Generator ---
  public exportReservationsCSV(): string {
    const headers = [
      'Reference',
      'Guest Name',
      'Guest Email',
      'Phone',
      'Room',
      'Category',
      'Check-In',
      'Check-Out',
      'Nights',
      'Guests',
      'Total USD',
      'Payment Method',
      'Payment Status',
      'Booking Status',
      'Created At'
    ];

    const rows = this.reservations.map(r => [
      r.reference,
      `"${r.guestName.replace(/"/g, '""')}"`,
      r.guestEmail,
      r.guestPhone || '',
      `"${r.roomTitle.replace(/"/g, '""')}"`,
      r.roomCategory,
      r.checkIn,
      r.checkOut,
      r.nights,
      `${r.guestsAdults}A ${r.guestsChildren}C`,
      r.totalAmount,
      r.paymentMethod,
      r.paymentStatus,
      r.status,
      r.createdAt
    ]);

    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }
}

export const db = new HotelDatabase();
