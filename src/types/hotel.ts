export type RoomCategory = 'Standard' | 'Deluxe' | 'Executive' | 'Presidential Suite';

export interface Room {
  id: string;
  slug: string;
  title: string;
  category: RoomCategory;
  description: string;
  shortDescription: string;
  pricePerNight: number;
  capacityAdults: number;
  capacityChildren: number;
  sizeSqm: number;
  bedType: string;
  view: string;
  floor: string;
  rating: number;
  reviewsCount: number;
  isAvailable: boolean;
  amenities: string[];
  images: string[];
  featured: boolean;
  totalUnits: number;
}

export type ReservationStatus = 'confirmed' | 'checked-in' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed';
export type PaymentMethod = 'stripe_card' | 'paystack' | 'pay_at_hotel';

export interface Reservation {
  id: string;
  reference: string;
  roomId: string;
  roomTitle: string;
  roomCategory: RoomCategory;
  roomImage: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  nights: number;
  guestsAdults: number;
  guestsChildren: number;
  roomsCount: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestCountry?: string;
  specialRequests?: string;
  estimatedArrival?: string;
  
  // Pricing breakdown
  nightlyRate: number;
  subtotal: number;
  taxAmount: number; // 10%
  serviceFee: number; // 5%
  discountAmount: number;
  promoCode?: string;
  totalAmount: number;

  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentTransactionId?: string;
  status: ReservationStatus;
  cancellationReason?: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'guest';
  phone?: string;
  token?: string;
  createdAt: string;
}

export interface Promotion {
  code: string;
  discountPercent: number;
  description: string;
  validUntil: string;
  minNights: number;
  active: boolean;
}

export interface DiningMenuItem {
  id: string;
  name: string;
  category: 'Starters' | 'Main Course' | 'Seafood' | 'Desserts' | 'Fine Wines' | 'Cocktails';
  description: string;
  price: number;
  dietary?: string[];
  image?: string;
}

export interface DiningReservation {
  id: string;
  guestName: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  seatingPreference: 'Indoor Pavilion' | 'Terrace Oceanfront' | 'Private Wine Cellar';
  specialNotes?: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: string;
}

export interface AirportTransferRequest {
  id: string;
  guestName: string;
  email: string;
  phone: string;
  flightNumber: string;
  arrivalDate: string;
  arrivalTime: string;
  vehicleType: 'Executive Mercedes S-Class' | 'Luxury Range Rover' | 'Grand Passenger Sprinter';
  passengers: number;
  luggageCount: number;
  status: 'confirmed' | 'pending' | 'completed';
  createdAt: string;
}

export interface AvailabilityCheckResult {
  isAvailable: boolean;
  availableUnits: number;
  nights: number;
  nightlyRate: number;
  subtotal: number;
  taxAmount: number;
  serviceFee: number;
  totalAmount: number;
  error?: string;
}

export interface AdminMetrics {
  totalRevenue: number;
  totalReservations: number;
  confirmedBookings: number;
  occupancyRate: number;
  availableRoomsCount: number;
  pendingRequests: number;
  recentReservations: Reservation[];
}
