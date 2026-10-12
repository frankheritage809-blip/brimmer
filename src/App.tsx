import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext.js';
import { BookingProvider } from './context/BookingContext.js';
import { Navbar } from './components/common/Navbar.js';
import { Footer } from './components/common/Footer.js';
import { WhatsAppButton } from './components/common/WhatsAppButton.js';
import { AuthModal } from './pages/AuthModal.js';
import { HomePage } from './pages/HomePage.js';
import { RoomsPage } from './pages/RoomsPage.js';
import { RoomDetailPage } from './pages/RoomDetailPage.js';
import { CheckoutPage } from './pages/CheckoutPage.js';
import { ConfirmationPage } from './pages/ConfirmationPage.js';
import { DiningPage } from './pages/DiningPage.js';
import { WellnessPage } from './pages/WellnessPage.js';
import { OffersPage } from './pages/OffersPage.js';
import { GalleryPage } from './pages/GalleryPage.js';
import { ContactPage } from './pages/ContactPage.js';
import { FaqPage } from './pages/FaqPage.js';
import { GuestDashboardPage } from './pages/GuestDashboardPage.js';
import { AdminDashboardPage } from './pages/AdminDashboardPage.js';
import { AboutPage } from './pages/AboutPage.js';
import { PolicyPage } from './pages/PolicyPage.js';
import { Room, Reservation } from './types/hotel.js';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);

  // Sync with browser history
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (path !== currentPath) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Route extraction
  const renderCurrentPage = () => {
    if (currentPath === '/') {
      return (
        <HomePage
          onNavigate={navigate}
          onSelectRoom={(room) => setSelectedRoom(room)}
        />
      );
    }

    if (currentPath === '/rooms') {
      return (
        <RoomsPage
          onNavigate={navigate}
          onSelectRoom={(room) => setSelectedRoom(room)}
        />
      );
    }

    if (currentPath.startsWith('/room/')) {
      const roomId = currentPath.replace('/room/', '');
      return (
        <RoomDetailPage
          roomId={roomId}
          onNavigate={navigate}
          onSelectRoom={(room) => setSelectedRoom(room)}
        />
      );
    }

    if (currentPath === '/checkout') {
      return (
        <CheckoutPage
          onNavigate={navigate}
          onBookingConfirmed={(res) => setConfirmedReservation(res)}
        />
      );
    }

    if (currentPath.startsWith('/confirmation/')) {
      const reference = currentPath.replace('/confirmation/', '');
      return (
        <ConfirmationPage
          reference={reference}
          onNavigate={navigate}
        />
      );
    }

    if (currentPath === '/dining') {
      return <DiningPage onNavigate={navigate} />;
    }

    if (currentPath === '/wellness') {
      return <WellnessPage onNavigate={navigate} />;
    }

    if (currentPath === '/offers') {
      return <OffersPage onNavigate={navigate} />;
    }

    if (currentPath === '/gallery') {
      return <GalleryPage onNavigate={navigate} />;
    }

    if (currentPath === '/contact') {
      return <ContactPage />;
    }

    if (currentPath === '/faq') {
      return <FaqPage onNavigate={navigate} />;
    }

    if (currentPath === '/about') {
      return <AboutPage onNavigate={navigate} />;
    }

    if (currentPath === '/guest-dashboard') {
      return <GuestDashboardPage onNavigate={navigate} />;
    }

    if (currentPath === '/admin') {
      return <AdminDashboardPage onNavigate={navigate} />;
    }

    if (currentPath === '/policy') {
      return <PolicyPage />;
    }

    // Default Fallback to Home
    return (
      <HomePage
        onNavigate={navigate}
        onSelectRoom={(room) => setSelectedRoom(room)}
      />
    );
  };

  return (
    <AuthProvider>
      <BookingProvider>
        <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-slate-900 selection:bg-[#C5A880]/30 selection:text-[#0B192C]">
          <Navbar currentPath={currentPath} onNavigate={navigate} />

          <main className="flex-1">
            {renderCurrentPage()}
          </main>

          <Footer onNavigate={navigate} />
          <WhatsAppButton />
          <AuthModal />
        </div>
      </BookingProvider>
    </AuthProvider>
  );
}
