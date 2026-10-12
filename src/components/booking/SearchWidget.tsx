import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext.js';
import { Calendar, Users, DoorOpen, Search, Sparkles } from 'lucide-react';

interface SearchWidgetProps {
  onSearch?: () => void;
  className?: string;
}

export const SearchWidget: React.FC<SearchWidgetProps> = ({ onSearch, className = '' }) => {
  const { draft, setDates, setGuests } = useBooking();

  const [checkIn, setLocalCheckIn] = useState(draft.checkIn);
  const [checkOut, setLocalCheckOut] = useState(draft.checkOut);
  const [adults, setLocalAdults] = useState(draft.guestsAdults);
  const [children, setLocalChildren] = useState(draft.guestsChildren);
  const [rooms, setLocalRooms] = useState(draft.roomsCount);
  const [showGuestMenu, setShowGuestMenu] = useState(false);

  // Min check in date is today
  const todayStr = new Date().toISOString().split('T')[0];

  const handleCheckInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalCheckIn(val);
    if (val >= checkOut) {
      const nextDay = new Date(val);
      nextDay.setDate(nextDay.getDate() + 1);
      const nextDayStr = nextDay.toISOString().split('T')[0];
      setLocalCheckOut(nextDayStr);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setDates(checkIn, checkOut);
    setGuests(adults, children, rooms);
    if (onSearch) onSearch();
  };

  return (
    <div className={`bg-[#0B192C]/95 backdrop-blur-md border border-[#1E3A5F] shadow-2xl rounded-xl p-4 lg:p-6 text-white ${className}`}>
      <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        {/* Check In Date */}
        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-wider text-slate-300 font-medium flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Check-In</span>
          </label>
          <input
            type="date"
            min={todayStr}
            value={checkIn}
            onChange={handleCheckInChange}
            required
            className="w-full px-3.5 py-3 bg-[#132A4B] border border-[#1E3A5F] rounded-lg text-sm text-white focus:outline-none focus:border-[#C5A880] cursor-pointer"
          />
        </div>

        {/* Check Out Date */}
        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-wider text-slate-300 font-medium flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Check-Out</span>
          </label>
          <input
            type="date"
            min={checkIn || todayStr}
            value={checkOut}
            onChange={(e) => setLocalCheckOut(e.target.value)}
            required
            className="w-full px-3.5 py-3 bg-[#132A4B] border border-[#1E3A5F] rounded-lg text-sm text-white focus:outline-none focus:border-[#C5A880] cursor-pointer"
          />
        </div>

        {/* Guests & Rooms selector */}
        <div className="space-y-1.5 relative">
          <label className="text-xs uppercase tracking-wider text-slate-300 font-medium flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Guests &amp; Suites</span>
          </label>
          <button
            type="button"
            onClick={() => setShowGuestMenu(!showGuestMenu)}
            className="w-full text-left px-3.5 py-3 bg-[#132A4B] border border-[#1E3A5F] rounded-lg text-sm text-white flex items-center justify-between hover:border-[#C5A880] transition-colors"
          >
            <span>
              {adults} Adult{adults > 1 ? 's' : ''}
              {children > 0 ? `, ${children} Child${children > 1 ? 'ren' : ''}` : ''} · {rooms} Room{rooms > 1 ? 's' : ''}
            </span>
            <DoorOpen className="w-4 h-4 text-slate-400" />
          </button>

          {showGuestMenu && (
            <div className="absolute left-0 bottom-full mb-2 w-72 bg-[#0B192C] border border-[#1E3A5F] rounded-xl shadow-2xl p-4 z-50 space-y-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">Adults</p>
                  <p className="text-[11px] text-slate-400">Ages 13 and above</p>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setLocalAdults(Math.max(1, adults - 1))}
                    className="w-7 h-7 rounded border border-slate-600 flex items-center justify-center text-slate-300 hover:bg-slate-800"
                  >
                    -
                  </button>
                  <span className="w-5 text-center text-sm font-bold">{adults}</span>
                  <button
                    type="button"
                    onClick={() => setLocalAdults(Math.min(8, adults + 1))}
                    className="w-7 h-7 rounded border border-slate-600 flex items-center justify-center text-slate-300 hover:bg-slate-800"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <div>
                  <p className="text-sm font-semibold text-white">Children</p>
                  <p className="text-[11px] text-slate-400">Ages 0 to 12</p>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setLocalChildren(Math.max(0, children - 1))}
                    className="w-7 h-7 rounded border border-slate-600 flex items-center justify-center text-slate-300 hover:bg-slate-800"
                  >
                    -
                  </button>
                  <span className="w-5 text-center text-sm font-bold">{children}</span>
                  <button
                    type="button"
                    onClick={() => setLocalChildren(Math.min(6, children + 1))}
                    className="w-7 h-7 rounded border border-slate-600 flex items-center justify-center text-slate-300 hover:bg-slate-800"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <div>
                  <p className="text-sm font-semibold text-white">Suites</p>
                  <p className="text-[11px] text-slate-400">Number of rooms</p>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setLocalRooms(Math.max(1, rooms - 1))}
                    className="w-7 h-7 rounded border border-slate-600 flex items-center justify-center text-slate-300 hover:bg-slate-800"
                  >
                    -
                  </button>
                  <span className="w-5 text-center text-sm font-bold">{rooms}</span>
                  <button
                    type="button"
                    onClick={() => setLocalRooms(Math.min(4, rooms + 1))}
                    className="w-7 h-7 rounded border border-slate-600 flex items-center justify-center text-slate-300 hover:bg-slate-800"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowGuestMenu(false)}
                className="w-full mt-2 py-1.5 bg-[#C5A880] text-[#0B192C] font-semibold text-xs uppercase tracking-wider rounded"
              >
                Done
              </button>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full py-3.5 bg-[#C5A880] hover:bg-[#d8bd95] text-[#0B192C] font-semibold text-xs uppercase tracking-widest rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Search Availability</span>
          </button>
        </div>
      </form>
    </div>
  );
};
