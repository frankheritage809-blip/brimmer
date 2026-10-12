import React, { useState } from 'react';
import { Maximize2, X, Sparkles } from 'lucide-react';

interface GalleryPageProps {
  onNavigate: (path: string) => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ onNavigate }) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [lightboxImg, setLightboxImg] = useState<{ src: string; title: string; category: string } | null>(null);

  const galleryItems = [
    {
      src: '/src/assets/images/hotel_hero_exterior_1791847526394.jpg',
      title: 'Grand Azure Facade at Twilight',
      category: 'Architecture'
    },
    {
      src: '/src/assets/images/room_presidential_suite_1791847526410.jpg',
      title: 'Presidential Penthouse Master Quarters',
      category: 'Suites'
    },
    {
      src: '/src/assets/images/dining_fine_restaurant_1791847527242.jpg',
      title: 'L’Azur Grand Pavilion Michelin Dining',
      category: 'Dining'
    },
    {
      src: '/src/assets/images/room_deluxe_ocean_1791847526856.jpg',
      title: 'Deluxe Oceanfront Terrace at Morning',
      category: 'Suites'
    },
    {
      src: '/src/assets/images/facility_spa_wellness_1791847527068.jpg',
      title: 'Travertine Thermal Plunge & Steam Pool',
      category: 'Wellness'
    },
    {
      src: '/src/assets/images/hotel_hero_exterior_1791847526394.jpg',
      title: 'Reflective Infinity Waters & Palm Gardens',
      category: 'Architecture'
    }
  ];

  const categories = ['All', 'Suites', 'Dining', 'Wellness', 'Architecture'];

  const filteredItems = galleryItems.filter(
    (item) => selectedFilter === 'All' || item.category === selectedFilter
  );

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#C5A880]">
          Visual Splendor
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">
          Hotel Photo Gallery
        </h1>
        <p className="text-slate-600 text-sm">
          A visual journey through our coastal palace, Michelin dining salons, and secluded sanctuary suites.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedFilter(cat)}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer ${
              selectedFilter === cat
                ? 'bg-[#0B192C] text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item, idx) => (
          <div
            key={idx}
            onClick={() => setLightboxImg(item)}
            className="group relative h-72 rounded-2xl overflow-hidden border border-slate-200 shadow-sm cursor-pointer"
          >
            <img
              src={item.src}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white">
              <span className="text-[11px] uppercase tracking-wider text-[#C5A880] font-semibold">
                {item.category}
              </span>
              <p className="font-serif text-lg font-bold">{item.title}</p>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-300">
                <Maximize2 className="w-3.5 h-3.5" />
                <span>View Full Screen</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxImg && (
        <div
          onClick={() => setLightboxImg(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setLightboxImg(null)}
              className="absolute -top-12 right-0 p-2 text-white hover:text-[#C5A880]"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={lightboxImg.src}
              alt={lightboxImg.title}
              className="max-h-[80vh] w-auto rounded-2xl object-contain shadow-2xl border border-white/20"
              referrerPolicy="no-referrer"
            />
            <div className="mt-4 text-center text-white">
              <p className="font-serif text-xl font-bold">{lightboxImg.title}</p>
              <p className="text-xs text-[#C5A880] uppercase tracking-wider">{lightboxImg.category}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
