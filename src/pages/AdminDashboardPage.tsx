import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { Room, Reservation, AdminMetrics, Promotion } from '../types/hotel.js';
import {
  Shield,
  DollarSign,
  TrendingUp,
  Bed,
  Calendar,
  Users,
  Download,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  RefreshCw,
  AlertCircle,
  Utensils,
  Car
} from 'lucide-react';

interface AdminDashboardPageProps {
  onNavigate: (path: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate }) => {
  const { user, setShowAuthModal, setAuthModalMode, loginAsDemo } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'reservations' | 'rooms' | 'requests'>('overview');
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters for Reservations
  const [resSearch, setResSearch] = useState('');
  const [resStatusFilter, setResStatusFilter] = useState('all');

  // Room modal state
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [roomModalOpen, setRoomModalOpen] = useState(false);
  const [roomTitle, setRoomTitle] = useState('');
  const [roomCategory, setRoomCategory] = useState<'Standard' | 'Deluxe' | 'Executive' | 'Presidential Suite'>('Deluxe');
  const [roomPrice, setRoomPrice] = useState(500);
  const [roomCapacity, setRoomCapacity] = useState(2);
  const [roomSize, setRoomSize] = useState(60);
  const [roomBed, setRoomBed] = useState('1 King Bed');
  const [roomDescription, setRoomDescription] = useState('');

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [metricsRes, resRes, roomsRes] = await Promise.all([
        fetch('/api/admin/metrics'),
        fetch(`/api/reservations?search=${encodeURIComponent(resSearch)}&status=${resStatusFilter}`),
        fetch('/api/rooms')
      ]);

      const metricsData = await metricsRes.json();
      const resData = await resRes.json();
      const roomsData = await roomsRes.json();

      if (metricsData.success) setMetrics(metricsData.metrics);
      if (resData.success) setReservations(resData.reservations);
      if (roomsData.success) setRooms(roomsData.rooms);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchDashboardData();
    }
  }, [user, resSearch, resStatusFilter]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-xl mx-auto px-6 py-24 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 mx-auto flex items-center justify-center">
          <Shield className="w-7 h-7" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-slate-900">
          Staff &amp; Executive Access Only
        </h2>
        <p className="text-slate-600 text-xs leading-relaxed">
          The hotel administration portal contains protected guest records, room availability matrices, and billing reports. Authorized management credentials are required.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => loginAsDemo('admin')}
            className="px-6 py-3 bg-[#0B192C] text-white rounded-lg text-xs font-semibold uppercase tracking-wider"
          >
            Login as Demo General Manager
          </button>
          <button
            onClick={() => onNavigate('/')}
            className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold"
          >
            Return to Guest Website
          </button>
        </div>
      </div>
    );
  }

  const handleUpdateStatus = async (reference: string, newStatus: Reservation['status']) => {
    try {
      const res = await fetch(`/api/reservations/${reference}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        fetchDashboardData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleRoomAvailability = async (room: Room) => {
    try {
      const res = await fetch(`/api/rooms/${room.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: !room.isAvailable })
      });
      const data = await res.json();
      if (data.success) {
        fetchDashboardData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingRoom) {
        // Edit
        await fetch(`/api/rooms/${editingRoom.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: roomTitle,
            category: roomCategory,
            pricePerNight: Number(roomPrice),
            capacityAdults: Number(roomCapacity),
            sizeSqm: Number(roomSize),
            bedType: roomBed,
            description: roomDescription
          })
        });
      } else {
        // Create new
        await fetch('/api/rooms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: roomTitle,
            slug: roomTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            category: roomCategory,
            pricePerNight: Number(roomPrice),
            capacityAdults: Number(roomCapacity),
            capacityChildren: 1,
            sizeSqm: Number(roomSize),
            bedType: roomBed,
            view: 'Oceanfront View',
            floor: 'Executive Level',
            rating: 5.0,
            reviewsCount: 1,
            isAvailable: true,
            amenities: ['Ocean Terrace', 'High-Speed Wi-Fi', 'Marble Bath', 'Espresso Bar'],
            images: ['/src/assets/images/room_deluxe_ocean_1791847526856.jpg'],
            featured: false,
            totalUnits: 4,
            shortDescription: roomDescription.slice(0, 100),
            description: roomDescription
          })
        });
      }
      setRoomModalOpen(false);
      setEditingRoom(null);
      fetchDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  const openCreateModal = () => {
    setEditingRoom(null);
    setRoomTitle('');
    setRoomCategory('Deluxe');
    setRoomPrice(550);
    setRoomCapacity(2);
    setRoomSize(65);
    setRoomBed('1 King Bed');
    setRoomDescription('Spacious luxury suite with ocean view balcony.');
    setRoomModalOpen(true);
  };

  const openEditModal = (room: Room) => {
    setEditingRoom(room);
    setRoomTitle(room.title);
    setRoomCategory(room.category);
    setRoomPrice(room.pricePerNight);
    setRoomCapacity(room.capacityAdults);
    setRoomSize(room.sizeSqm);
    setRoomBed(room.bedType);
    setRoomDescription(room.description);
    setRoomModalOpen(true);
  };

  const handleExportCSV = () => {
    window.location.href = '/api/admin/export/reservations';
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 space-y-10">
      {/* Admin Top Header */}
      <div className="bg-[#0B192C] text-white p-6 lg:p-8 rounded-3xl border border-[#1E3A5F] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-900/50 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>Staff Administration Panel · Live Portal</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-white">Hotel Management Dashboard</h1>
          <p className="text-xs text-slate-300 mt-1">
            Real-time reservations, room inventory control, and revenue analytics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#C5A880]" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={fetchDashboardData}
            className="p-2.5 bg-[#132A4B] hover:bg-[#1E3A5F] text-white rounded-lg border border-[#1E3A5F] transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      {metrics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Revenue</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="font-serif text-3xl font-bold text-slate-900 font-mono tabular-nums">
              ${metrics.totalRevenue.toLocaleString()}
            </p>
            <p className="text-[11px] text-emerald-700 font-medium">From active &amp; completed stays</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Occupancy Rate</span>
              <TrendingUp className="w-4 h-4 text-[#C5A880]" />
            </div>
            <p className="font-serif text-3xl font-bold text-slate-900 font-mono tabular-nums">
              {metrics.occupancyRate}%
            </p>
            <p className="text-[11px] text-slate-500">Of available inventory booked</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Confirmed Bookings</span>
              <Calendar className="w-4 h-4 text-[#0B192C]" />
            </div>
            <p className="font-serif text-3xl font-bold text-slate-900 font-mono tabular-nums">
              {metrics.confirmedBookings}
            </p>
            <p className="text-[11px] text-slate-500">Out of {metrics.totalReservations} total inquiries</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Suites Available</span>
              <Bed className="w-4 h-4 text-blue-600" />
            </div>
            <p className="font-serif text-3xl font-bold text-slate-900 font-mono tabular-nums">
              {metrics.availableRoomsCount}
            </p>
            <p className="text-[11px] text-slate-500">Ready for instant guest check-in</p>
          </div>
        </div>
      )}

      {/* Tabs Bar */}
      <div className="flex border-b border-slate-200 gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'overview'
              ? 'border-[#0B192C] text-[#0B192C]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Recent Activity
        </button>
        <button
          onClick={() => setActiveTab('reservations')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'reservations'
              ? 'border-[#0B192C] text-[#0B192C]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          All Reservations ({reservations.length})
        </button>
        <button
          onClick={() => setActiveTab('rooms')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'rooms'
              ? 'border-[#0B192C] text-[#0B192C]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Room Inventory ({rooms.length})
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-serif text-xl font-bold text-slate-900">Recent Guest Reservations</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-400 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Ref</th>
                    <th className="py-3 px-4">Guest</th>
                    <th className="py-3 px-4">Suite</th>
                    <th className="py-3 px-4">Check-In</th>
                    <th className="py-3 px-4">Check-Out</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reservations.slice(0, 5).map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/60">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{r.reference}</td>
                      <td className="py-3 px-4 font-semibold text-slate-900">{r.guestName}</td>
                      <td className="py-3 px-4 truncate max-w-[140px]">{r.roomTitle}</td>
                      <td className="py-3 px-4">{r.checkIn}</td>
                      <td className="py-3 px-4">{r.checkOut}</td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">${r.totalAmount.toLocaleString()}</td>
                      <td className="py-3 px-4 capitalize">{r.paymentMethod} ({r.paymentStatus})</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700">
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RESERVATIONS MANAGER */}
      {activeTab === 'reservations' && (
        <div className="space-y-6">
          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-slate-200">
            <div className="relative flex-1 w-full sm:max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={resSearch}
                onChange={(e) => setResSearch(e.target.value)}
                placeholder="Search reference, guest name, email, or room..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#0B192C]"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <label className="text-xs text-slate-500 font-medium">Status Filter:</label>
              <select
                value={resStatusFilter}
                onChange={(e) => setResStatusFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#0B192C]"
              >
                <option value="all">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="checked-in">Checked-In</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Reservations Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-400 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">Ref</th>
                    <th className="py-3.5 px-4">Guest Details</th>
                    <th className="py-3.5 px-4">Room &amp; Dates</th>
                    <th className="py-3.5 px-4">Financials</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reservations.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/60">
                      <td className="py-4 px-4 font-mono font-bold text-slate-900">{r.reference}</td>
                      <td className="py-4 px-4">
                        <p className="font-bold text-slate-900">{r.guestName}</p>
                        <p className="text-[11px] text-slate-400">{r.guestEmail}</p>
                        <p className="text-[11px] text-slate-400">{r.guestPhone}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-semibold text-slate-800">{r.roomTitle}</p>
                        <p className="text-[11px] text-slate-500">{r.checkIn} → {r.checkOut} ({r.nights}n)</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-mono font-bold text-slate-900">${r.totalAmount.toLocaleString()}</p>
                        <p className="text-[11px] text-slate-500 capitalize">{r.paymentMethod} ({r.paymentStatus})</p>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            r.status === 'confirmed'
                              ? 'bg-emerald-50 text-emerald-700'
                              : r.status === 'checked-in'
                              ? 'bg-blue-50 text-blue-700'
                              : r.status === 'completed'
                              ? 'bg-slate-100 text-slate-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right space-x-1.5 whitespace-nowrap">
                        {r.status === 'confirmed' && (
                          <button
                            onClick={() => handleUpdateStatus(r.reference, 'checked-in')}
                            className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-[11px] font-semibold"
                          >
                            Check-In
                          </button>
                        )}
                        {r.status === 'checked-in' && (
                          <button
                            onClick={() => handleUpdateStatus(r.reference, 'completed')}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-semibold"
                          >
                            Complete Stay
                          </button>
                        )}
                        {r.status !== 'cancelled' && (
                          <button
                            onClick={() => handleUpdateStatus(r.reference, 'cancelled')}
                            className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded text-[11px] font-semibold"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ROOMS INVENTORY CRUD */}
      {activeTab === 'rooms' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-xl font-bold text-slate-900">Room Categories &amp; Rates</h3>
            <button
              onClick={openCreateModal}
              className="px-4 py-2 bg-[#0B192C] hover:bg-[#132A4B] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4 text-[#C5A880]" />
              <span>Add New Room Listing</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-[#C5A880]">
                      {room.category}
                    </span>
                    <button
                      onClick={() => handleToggleRoomAvailability(room)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        room.isAvailable ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {room.isAvailable ? 'Active' : 'Maintenance'}
                    </button>
                  </div>
                  <h4 className="font-serif text-lg font-bold text-slate-900">{room.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{room.shortDescription}</p>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">${room.pricePerNight} / night</span>
                    <span className="text-slate-500">{room.sizeSqm} m² · {room.capacityAdults} Guests</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => openEditModal(room)}
                    className="flex-1 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Price / Details</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Room Create / Edit Modal */}
      {roomModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h4 className="font-serif text-xl font-bold text-slate-900">
              {editingRoom ? 'Edit Room Listing' : 'Create Room Category'}
            </h4>
            <form onSubmit={handleSaveRoom} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Room Title *</label>
                <input
                  type="text"
                  value={roomTitle}
                  onChange={(e) => setRoomTitle(e.target.value)}
                  required
                  placeholder="e.g. Royal Mediterranean Ocean Suite"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#0B192C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Category</label>
                  <select
                    value={roomCategory}
                    onChange={(e) => setRoomCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#0B192C]"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Executive">Executive</option>
                    <option value="Presidential Suite">Presidential Suite</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Nightly Price ($) *</label>
                  <input
                    type="number"
                    value={roomPrice}
                    onChange={(e) => setRoomPrice(Number(e.target.value))}
                    required
                    min={100}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#0B192C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Capacity (Adults)</label>
                  <input
                    type="number"
                    value={roomCapacity}
                    onChange={(e) => setRoomCapacity(Number(e.target.value))}
                    required
                    min={1}
                    max={10}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#0B192C]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Size (sqm)</label>
                  <input
                    type="number"
                    value={roomSize}
                    onChange={(e) => setRoomSize(Number(e.target.value))}
                    required
                    min={20}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#0B192C]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Bed Type</label>
                  <input
                    type="text"
                    value={roomBed}
                    onChange={(e) => setRoomBed(e.target.value)}
                    required
                    placeholder="1 King Bed"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#0B192C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Description</label>
                <textarea
                  value={roomDescription}
                  onChange={(e) => setRoomDescription(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#0B192C]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRoomModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0B192C] text-white rounded-lg text-xs font-semibold uppercase tracking-wider"
                >
                  Save Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
