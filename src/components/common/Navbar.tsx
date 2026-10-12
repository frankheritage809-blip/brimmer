import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { Menu, X, User as UserIcon, Shield, Calendar, Phone } from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  const { user, setShowAuthModal, setAuthModalMode, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { label: 'Rooms & Suites', path: '/rooms' },
    { label: 'Dining', path: '/dining' },
    { label: 'Wellness & Spa', path: '/wellness' },
    { label: 'Offers', path: '/offers' },
    { label: 'About Us', path: '/about' }
  ];

  const handleLinkClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0B192C]/95 backdrop-blur-md border-b border-[#1E3A5F] text-white">
      {/* Top micro concierge strip */}
      <div className="hidden lg:flex items-center justify-between px-8 py-1.5 text-xs text-slate-300 border-b border-slate-800/80">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>24/7 Royal Concierge: +1 (800) 582-AZURE</span>
          </span>
          <span className="text-slate-500">|</span>
          <span>Victoria Island &amp; Côte d'Azur Exclusive Enclaves</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('/faq')}
            className="hover:text-[#C5A880] transition-colors"
          >
            Hotel Policies &amp; FAQ
          </button>
          <span className="text-slate-500">|</span>
          <button
            onClick={() => onNavigate('/contact')}
            className="hover:text-[#C5A880] transition-colors"
          >
            Contact &amp; Location
          </button>
        </div>
      </div>

      {/* Main Top Bar Contract: 3 Zones */}
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 lg:px-8 h-20">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => handleLinkClick('/')}
          className="text-left group cursor-pointer whitespace-nowrap shrink-0 focus:outline-none"
        >
          <span className="font-serif text-2xl lg:text-3xl font-bold tracking-tight text-white group-hover:text-[#C5A880] transition-colors">
            The Grand Azure
          </span>
        </button>

        {/* Zone 2: 4-5 single-line clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-200">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => handleLinkClick(link.path)}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer border-b-2 ${
                currentPath === link.path
                  ? 'border-[#C5A880] text-[#C5A880]'
                  : 'border-transparent hover:text-white hover:border-slate-400'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: 1 primary action & Account controls */}
        <div className="flex items-center gap-4 shrink-0">
          {/* User Account Button */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded bg-slate-800/80 hover:bg-slate-700/80 text-xs font-medium text-slate-200 border border-slate-700 transition-colors"
              >
                {user.role === 'admin' ? (
                  <Shield className="w-3.5 h-3.5 text-[#C5A880]" />
                ) : (
                  <UserIcon className="w-3.5 h-3.5 text-[#C5A880]" />
                )}
                <span className="max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-md shadow-xl bg-[#0B192C] border border-[#1E3A5F] py-1 text-sm text-slate-200 z-50">
                  <div className="px-4 py-2 border-b border-slate-800">
                    <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                    <p className="font-semibold text-white truncate">{user.name}</p>
                    <p className="text-[11px] text-[#C5A880] capitalize mt-0.5">{user.role} Member</p>
                  </div>

                  {user.role === 'admin' ? (
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onNavigate('/admin');
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-800/80 flex items-center gap-2 text-white"
                    >
                      <Shield className="w-4 h-4 text-[#C5A880]" />
                      Hotel Management Portal
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onNavigate('/guest-dashboard');
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-800/80 flex items-center gap-2 text-white"
                    >
                      <Calendar className="w-4 h-4 text-[#C5A880]" />
                      My Reservations
                    </button>
                  )}

                  <div className="border-t border-slate-800 my-1" />
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-rose-900/40 text-rose-300 text-xs"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => {
                setAuthModalMode('login');
                setShowAuthModal(true);
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors"
            >
              <UserIcon className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Sign In</span>
            </button>
          )}

          {/* Primary CTA */}
          <button
            onClick={() => handleLinkClick('/rooms')}
            className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#0B192C] bg-[#C5A880] hover:bg-[#d8bd95] rounded transition-all shadow-md hover:shadow-lg whitespace-nowrap shrink-0"
          >
            Book Your Stay
          </button>

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0B192C] border-b border-[#1E3A5F] px-6 py-5 space-y-4">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleLinkClick(link.path)}
                className={`text-left text-base font-medium py-1 ${
                  currentPath === link.path ? 'text-[#C5A880]' : 'text-slate-200'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
            {user ? (
              <>
                <button
                  onClick={() => handleLinkClick(user.role === 'admin' ? '/admin' : '/guest-dashboard')}
                  className="w-full text-left py-2 text-sm text-[#C5A880] font-medium"
                >
                  {user.role === 'admin' ? 'Hotel Admin Dashboard' : 'My Reservations & Account'}
                </button>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2 text-sm text-rose-300 font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setAuthModalMode('login');
                  setShowAuthModal(true);
                }}
                className="w-full text-left py-2 text-sm text-slate-200 font-medium"
              >
                Guest &amp; Staff Login
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
