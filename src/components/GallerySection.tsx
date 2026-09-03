import React, { useState } from 'react';
import { X, ZoomIn, MapPin, Building } from 'lucide-react';

interface GalleryImage {
  id: string;
  src: string;
  title: string;
  location: string;
  system: string;
  category: 'villa' | 'commercial' | 'doors' | 'facade';
}

export const GallerySection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null);

  const galleryItems: GalleryImage[] = [
    {
      id: 'gal-1',
      src: '/assets/winhome/photo_2023-07-03_15-41-20-1280x820.jpg',
      title: 'Modern Minimalist Villa Facade',
      location: 'Dream City, Erbil',
      system: 'Lorenzoline 70LS Lift & Slide + Structural Glass',
      category: 'villa'
    },
    {
      id: 'gal-2',
      src: '/assets/winhome/03-2.jpg',
      title: 'Panoramic Living Room Glazing',
      location: 'Empire World, Erbil',
      system: 'Deceuninck Legend 80 Passive uPVC',
      category: 'villa'
    },
    {
      id: 'gal-3',
      src: '/assets/winhome/photo_2023-07-03_15-42-28-1120x716.jpg',
      title: 'Commercial Office Tower Fenestration',
      location: 'Gulan Street, Erbil',
      system: 'Façade 50F Thermal Curtain Wall',
      category: 'commercial'
    },
    {
      id: 'gal-4',
      src: '/assets/winhome/photo_2023-07-03_15-50-46-1104x700.jpg',
      title: 'Double Height Floor-to-Ceiling Windows',
      location: 'Italian Village 2, Erbil',
      system: 'Opening 60T Thermal Break Aluminum',
      category: 'facade'
    },
    {
      id: 'gal-5',
      src: '/assets/winhome/2026-04-14-21.53.50-1000x650.jpg',
      title: 'Monumental Garden Terrace Sliding Doors',
      location: 'English Village, Erbil',
      system: 'Winsa Hebe-Schiebe HS76 System',
      category: 'doors'
    },
    {
      id: 'gal-6',
      src: '/assets/winhome/photo_2023-07-03_15-38-36-600x390.jpg',
      title: 'Contemporary Residential Glazing',
      location: 'Vital Village, Erbil',
      system: 'Deceuninck Legend Art 70mm',
      category: 'villa'
    }
  ];

  const filteredItems =
    activeFilter === 'all'
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeFilter);

  return (
    <section id="gallery" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Blue Title Accent as shown in image */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 border border-sky-200 text-sky-800 text-xs font-bold uppercase tracking-wider mb-3">
            <span>Installed Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Winhome Project Gallery
          </h2>
          <p className="text-base text-slate-600 mt-3 leading-relaxed">
            Take a visual tour of real villas, luxury compounds, and commercial buildings executed by Winhome Company and Nafza Almanzl across Erbil and Kurdistan.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {[
              { id: 'all', label: 'All Projects' },
              { id: 'villa', label: 'Luxury Villas' },
              { id: 'commercial', label: 'Commercial Towers' },
              { id: 'doors', label: 'Lift & Slide Terraces' },
              { id: 'facade', label: 'Curtain Wall Facades' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                  activeFilter === f.id
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setLightboxImage(item)}
              className="group relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <div className="aspect-[4/3] w-full overflow-hidden">
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Hover Details Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-6 flex flex-col justify-end text-white">
                <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider mb-1">
                  {item.system}
                </span>
                <h3 className="text-lg font-bold text-white leading-snug">
                  {item.title}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-2">
                  <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span>{item.location}</span>
                </div>
                <div className="mt-3 flex items-center gap-1 text-xs text-white/80">
                  <ZoomIn className="w-4 h-4 text-sky-400" />
                  <span>Click to expand high-resolution</span>
                </div>
              </div>

              {/* Bottom Card Summary (Always visible for mobile clarity!) */}
              <div className="p-4 bg-white border-t border-slate-100 group-hover:hidden">
                <h4 className="text-sm font-bold text-slate-900 truncate">
                  {item.title}
                </h4>
                <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
                  <span>{item.location}</span>
                  <span className="text-sky-600 font-medium">{item.system.split(' ')[0]}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={lightboxImage.src}
                alt={lightboxImage.title}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            <div className="p-6 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-slate-100">
              <div>
                <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
                  {lightboxImage.system}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  {lightboxImage.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-sky-600" />
                  <span>{lightboxImage.location}</span>
                </p>
              </div>

              <a
                href={`https://wa.me/9647504440402?text=Hello%20Winhome,%20I%20am%20interested%20in%20the%20${encodeURIComponent(lightboxImage.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider shrink-0 transition-colors shadow-sm"
              >
                Inquire About Similar Design
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
