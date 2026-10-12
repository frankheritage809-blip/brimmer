import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './src/server/db.js';
import { DINING_MENU_ITEMS } from './src/server/data/seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // --- API Routes ---

  // 1. Rooms
  app.get('/api/rooms', (req: Request, res: Response) => {
    try {
      const { category, minPrice, maxPrice, checkIn, checkOut, guests } = req.query;
      let rooms = db.getRooms();

      if (category && category !== 'All') {
        rooms = rooms.filter(r => r.category.toLowerCase() === String(category).toLowerCase());
      }

      if (minPrice) {
        rooms = rooms.filter(r => r.pricePerNight >= Number(minPrice));
      }

      if (maxPrice) {
        rooms = rooms.filter(r => r.pricePerNight <= Number(maxPrice));
      }

      if (guests) {
        const guestCount = Number(guests);
        rooms = rooms.filter(r => (r.capacityAdults + r.capacityChildren) >= guestCount);
      }

      // If dates are provided, filter by availability
      if (checkIn && checkOut) {
        rooms = rooms.filter(r => {
          const { isAvailable } = db.checkRoomAvailability(r.id, String(checkIn), String(checkOut), 1);
          return isAvailable;
        });
      }

      res.json({ success: true, rooms });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get('/api/rooms/:id', (req: Request, res: Response) => {
    try {
      const room = db.getRoomById(req.params.id);
      if (!room) {
        return res.status(404).json({ success: false, error: 'Room not found' });
      }
      res.json({ success: true, room });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post('/api/rooms', (req: Request, res: Response) => {
    try {
      const room = db.createRoom(req.body);
      res.status(201).json({ success: true, room });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  app.put('/api/rooms/:id', (req: Request, res: Response) => {
    try {
      const updated = db.updateRoom(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ success: false, error: 'Room not found' });
      }
      res.json({ success: true, room: updated });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  app.delete('/api/rooms/:id', (req: Request, res: Response) => {
    try {
      const deleted = db.deleteRoom(req.params.id);
      if (!deleted) {
        return res.status(404).json({ success: false, error: 'Room not found' });
      }
      res.json({ success: true, message: 'Room removed successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // 2. Availability & Stay Pricing Validation
  app.post('/api/availability/check', (req: Request, res: Response) => {
    try {
      const { roomId, checkIn, checkOut, promoCode, roomsCount = 1 } = req.body;

      if (!roomId || !checkIn || !checkOut) {
        return res.status(400).json({ success: false, error: 'Missing required booking parameters' });
      }

      const { isAvailable, availableUnits } = db.checkRoomAvailability(roomId, checkIn, checkOut, roomsCount);

      if (!isAvailable) {
        return res.json({
          success: true,
          isAvailable: false,
          availableUnits,
          error: 'This room is fully booked for the selected dates. Please select alternative dates.'
        });
      }

      const pricing = db.calculateStayPricing(roomId, checkIn, checkOut, promoCode);

      res.json({
        success: true,
        isAvailable: true,
        availableUnits,
        ...pricing
      });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  // 3. Payment Verification
  app.post('/api/payments/verify', (req: Request, res: Response) => {
    try {
      const { paymentMethod, reference, amount, currency } = req.body;

      if (!paymentMethod || !amount) {
        return res.status(400).json({ success: false, error: 'Payment details required' });
      }

      // Cryptographic / gateway verification simulation with real audit timestamp
      const txId = paymentMethod === 'paystack'
        ? `pstk_live_${Date.now()}_${Math.floor(Math.random() * 100000)}`
        : `ch_stripe_${Date.now()}_${Math.floor(Math.random() * 100000)}`;

      res.json({
        success: true,
        verified: true,
        transactionId: txId,
        paymentMethod,
        amount,
        currency: currency || 'USD',
        verifiedAt: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // 4. Reservations
  app.post('/api/reservations', (req: Request, res: Response) => {
    try {
      const {
        roomId,
        checkIn,
        checkOut,
        guestsAdults,
        guestsChildren = 0,
        roomsCount = 1,
        guestName,
        guestEmail,
        guestPhone,
        guestCountry,
        specialRequests,
        promoCode,
        paymentMethod,
        paymentTransactionId
      } = req.body;

      // Validate inputs
      if (!roomId || !checkIn || !checkOut || !guestName || !guestEmail || !guestPhone) {
        return res.status(400).json({ success: false, error: 'All primary contact and reservation details are required' });
      }

      // Check double-booking prevention on server side
      const room = db.getRoomById(roomId);
      if (!room) {
        return res.status(404).json({ success: false, error: 'Room category not found' });
      }

      const { isAvailable } = db.checkRoomAvailability(room.id, checkIn, checkOut, roomsCount);
      if (!isAvailable) {
        return res.status(409).json({
          success: false,
          error: 'Reservation collision: Room was just booked by another guest for these dates. Please choose another date or room.'
        });
      }

      // Calculate official pricing
      const pricing = db.calculateStayPricing(room.id, checkIn, checkOut, promoCode);

      // Determine payment status:
      // If pay_at_hotel, paymentStatus is 'pending', booking status is 'confirmed'
      // If stripe/paystack, verify transaction id exists
      let paymentStatus: 'paid' | 'pending' = 'pending';
      if (paymentMethod === 'stripe_card' || paymentMethod === 'paystack') {
        if (!paymentTransactionId) {
          return res.status(400).json({ success: false, error: 'Payment authorization could not be verified' });
        }
        paymentStatus = 'paid';
      }

      const reservation = db.createReservation({
        roomId: room.id,
        roomTitle: room.title,
        roomCategory: room.category,
        roomImage: room.images[0],
        checkIn,
        checkOut,
        nights: pricing.nights,
        guestsAdults: Number(guestsAdults),
        guestsChildren: Number(guestsChildren),
        roomsCount: Number(roomsCount),
        guestName,
        guestEmail,
        guestPhone,
        guestCountry,
        specialRequests,
        nightlyRate: pricing.nightlyRate,
        subtotal: pricing.subtotal,
        taxAmount: pricing.taxAmount,
        serviceFee: pricing.serviceFee,
        discountAmount: pricing.discountAmount,
        promoCode: pricing.promoCode,
        totalAmount: pricing.totalAmount,
        paymentMethod: paymentMethod || 'pay_at_hotel',
        paymentStatus,
        paymentTransactionId,
        status: 'confirmed'
      });

      res.status(201).json({
        success: true,
        message: 'Reservation successfully confirmed',
        reservation
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get('/api/reservations', (req: Request, res: Response) => {
    try {
      const { email, status, search } = req.query;
      const reservations = db.getReservations({
        email: email ? String(email) : undefined,
        status: status ? String(status) : undefined,
        search: search ? String(search) : undefined
      });
      res.json({ success: true, reservations });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get('/api/reservations/:reference', (req: Request, res: Response) => {
    try {
      const reservation = db.getReservationByReference(req.params.reference);
      if (!reservation) {
        return res.status(404).json({ success: false, error: 'Reservation reference not found' });
      }
      res.json({ success: true, reservation });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.patch('/api/reservations/:reference/status', (req: Request, res: Response) => {
    try {
      const { status, reason } = req.body;
      const updated = db.updateReservationStatus(req.params.reference, status, reason);
      if (!updated) {
        return res.status(404).json({ success: false, error: 'Reservation not found' });
      }
      res.json({ success: true, reservation: updated });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.patch('/api/reservations/:reference/notes', (req: Request, res: Response) => {
    try {
      const { specialRequests } = req.body;
      const updated = db.updateReservationNotes(req.params.reference, specialRequests);
      if (!updated) {
        return res.status(404).json({ success: false, error: 'Reservation not found' });
      }
      res.json({ success: true, reservation: updated });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // 5. Authentication
  app.post('/api/auth/login', (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ success: false, error: 'Email and password required' });
      }

      const user = db.findUserByEmail(email);
      if (!user) {
        return res.status(401).json({ success: false, error: 'Invalid credentials or user not found' });
      }

      // Check simple passwords for demo credentials
      if (user.role === 'admin' && password !== 'admin123') {
        return res.status(401).json({ success: false, error: 'Incorrect admin passcode' });
      }

      res.json({
        success: true,
        user: {
          ...user,
          token: `jwt_session_${user.id}_${Date.now()}`
        }
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post('/api/auth/register', (req: Request, res: Response) => {
    try {
      const { name, email, phone } = req.body;
      if (!name || !email) {
        return res.status(400).json({ success: false, error: 'Name and email are required' });
      }

      const existing = db.findUserByEmail(email);
      if (existing) {
        return res.status(409).json({ success: false, error: 'An account with this email already exists' });
      }

      const newUser = db.createUser(name, email, 'guest', phone);
      res.status(201).json({
        success: true,
        user: {
          ...newUser,
          token: `jwt_session_${newUser.id}_${Date.now()}`
        }
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // 6. Promotions
  app.get('/api/promotions', (_req: Request, res: Response) => {
    res.json({ success: true, promotions: db.getPromotions() });
  });

  // 7. Dining & Room Service
  app.get('/api/dining/menu', (_req: Request, res: Response) => {
    res.json({ success: true, menu: DINING_MENU_ITEMS });
  });

  app.post('/api/dining/reservations', (req: Request, res: Response) => {
    try {
      const { guestName, email, phone, date, time, guests, seatingPreference, specialNotes } = req.body;
      if (!guestName || !email || !date || !time) {
        return res.status(400).json({ success: false, error: 'Required table reservation fields missing' });
      }
      const reservation = db.createDiningReservation({
        guestName,
        email,
        phone,
        date,
        time,
        guests: Number(guests) || 2,
        seatingPreference: seatingPreference || 'Indoor Pavilion',
        specialNotes,
        status: 'confirmed'
      });
      res.status(201).json({ success: true, diningReservation: reservation });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // 8. Airport Transfers
  app.post('/api/transfers', (req: Request, res: Response) => {
    try {
      const { guestName, email, phone, flightNumber, arrivalDate, arrivalTime, vehicleType, passengers, luggageCount } = req.body;
      if (!guestName || !flightNumber || !arrivalDate) {
        return res.status(400).json({ success: false, error: 'Flight and passenger details required' });
      }
      const transfer = db.createTransferRequest({
        guestName,
        email,
        phone,
        flightNumber,
        arrivalDate,
        arrivalTime,
        vehicleType: vehicleType || 'Executive Mercedes S-Class',
        passengers: Number(passengers) || 2,
        luggageCount: Number(luggageCount) || 2,
        status: 'confirmed'
      });
      res.status(201).json({ success: true, transfer });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // 9. Admin Metrics & CSV Export
  app.get('/api/admin/metrics', (_req: Request, res: Response) => {
    try {
      const metrics = db.getAdminMetrics();
      res.json({ success: true, metrics });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get('/api/admin/export/reservations', (_req: Request, res: Response) => {
    try {
      const csv = db.exportReservationsCSV();
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="grand-azure-reservations.csv"');
      res.send(csv);
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // --- Serve Frontend Application ---
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Grand Azure Hotel] Full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start Grand Azure server:', err);
  process.exit(1);
});
