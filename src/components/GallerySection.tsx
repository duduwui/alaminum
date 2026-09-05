import React, { useState } from 'react';
import { Layers, MapPin, ExternalLink, X, ZoomIn } from 'lucide-react';
import GlowButton from './GlowButton';

export interface GalleryItem {
  id: string;
  title: string;
  location: string;
  system: string;
  category: 'villa' | 'commercial' | 'doors' | 'facade';
  src: string;
  description: string;
}

export const GallerySection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [lightboxImage, setLightboxImage] = useState<GalleryItem | null>(null);

  const defaultItems: GalleryItem[] = [
    {
      id: 'proj-1',
      title: 'Luxury Private Residence - Erbil Dream City',
      location: 'Dream City, Erbil',
      system: 'Deceuninck Legend 80 Passive uPVC',
      category: 'villa',
      src: '/assets/winhome/photo_2023-07-03_15-41-20-1280x820.jpg',
      description: 'Custom triple-glazed passive window installation with automated roller shutters engineered for extreme climate control.'
    },
    {
      id: 'proj-2',
      title: 'Modern Villa Spans - Gulan Street',
      location: 'Gulan District, Erbil',
      system: 'Lorenzoline 70LS Lift & Slide Aluminum',
      category: 'villa',
      src: '/assets/winhome/photo_2023-07-03_15-40-04-1104x720.jpg',
      description: '3-meter high monumental thermal lift-and-slide doors seamlessly bridging indoor living spaces with private courtyard pools.'
    },
    {
      id: 'proj-3',
      title: 'Corporate Headquarters Facade',
      location: '100m Expressway, Erbil',
      system: 'Façade 50F Structural Curtain Wall',
      category: 'commercial',
      src: '/assets/winhome/photo_2023-07-03_15-42-28-1120x716.jpg',
      description: 'Structural glass mullion tower facade with solar control reflective double glazing engineered for high wind pressure resistance.'
    },
    {
      id: 'proj-4',
      title: 'Automobile Showroom Panorama',
      location: 'Empire World, Erbil',
      system: '50F Facade & Commercial Glazing',
      category: 'facade',
      src: '/assets/winhome/24-1.jpg',
      description: 'Panoramic ultra-clear glass wall spans providing full street visibility and solar control for vehicle display halls.'
    },
    {
      id: 'proj-5',
      title: 'VIP Residential Terrace Spans',
      location: 'Empire Residential Towers, Erbil',
      system: 'Winsa Heavy Duty Lift & Slide',
      category: 'doors',
      src: '/assets/winhome/photo_2023-07-03_15-50-46-1104x700.jpg',
      description: 'Acoustic soundproof glass sliding doors delivering 44 dB city noise reduction for penthouse balcony suites.'
    },
    {
      id: 'proj-6',
      title: 'Contemporary Luxury Villa Compound',
      location: 'Vank City, Erbil',
      system: 'Winsa Dorado 76 & Italian Master Hardware',
      category: 'villa',
      src: '/assets/winhome/photo_2023-07-03_15-49-24-760x485.jpg',
      description: 'Turnkey fenestration package including concealed hardware tilt-and-turn windows and solar protection Low-E units.'
    }
  ];

  const galleryItems: GalleryItem[] = React.useMemo(() => {
    const saved = localStorage.getItem('winhome_admin_gallery_images');
    if (saved) {
      try {
        const parsed: string[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((src, i) => ({
            id: `cms-gallery-${i}`,
            title: `Winhome Architectural Showcase #${i + 1}`,
            location: 'Erbil & Kurdistan Projects',
            system: 'Winhome Premium Systems',
            category: (i % 2 === 0 ? 'villa' : 'commercial') as any,
            src,
            description: 'Custom architectural window & door installation engineered by Winhome.'
          }));
        }
      } catch (e) {
        console.error(e);
      }
    }
    return defaultItems;
  }, []);

  const filteredItems =
    activeFilter === 'all'
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeFilter);

  return (
    <section id="gallery" className="py-20 sm:py-24 bg-slate-950 text-white relative overflow-hidden border-b border-slate-900">
      {/* Subtle Background Glow Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Winhome Project Gallery
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mt-3 leading-relaxed font-medium">
            Take a visual tour of real luxury villas, high-rise towers, and commercial compounds executed by Winhome Company and Nafza Almanzl across Erbil and Kurdistan.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mt-8">
            {[
              { id: 'all', label: 'All Projects' },
              { id: 'villa', label: 'Luxury Villas' },
              { id: 'commercial', label: 'Commercial Towers' },
              { id: 'doors', label: 'Lift & Slide Terraces' },
              { id: 'facade', label: 'Curtain Wall Facades' }
            ].map((f) => (
              <GlowButton
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                variant={activeFilter === f.id ? 'active' : 'outline'}
                isDarkTheme={true}
                size="sm"
              >
                {f.label}
              </GlowButton>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setLightboxImage(item)}
              className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-md hover:shadow-2xl hover:border-blue-500/50 transition-all duration-300 cursor-pointer"
            >
              <div className="aspect-[4/3] w-full overflow-hidden">
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Hover Details Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-6 flex flex-col justify-end text-white">
                <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider mb-1">
                  {item.system}
                </span>
                <h3 className="text-lg font-bold text-white leading-snug">
                  {item.title}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-2">
                  <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>{item.location}</span>
                </div>
                <div className="mt-3 flex items-center gap-1 text-xs text-blue-300">
                  <ZoomIn className="w-4 h-4 text-blue-400" />
                  <span>Click to expand high-resolution</span>
                </div>
              </div>

              {/* Bottom Card Summary */}
              <div className="p-4 bg-slate-900/90 border-t border-slate-800 group-hover:hidden">
                <h4 className="text-sm font-bold text-white truncate">
                  {item.title}
                </h4>
                <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
                  <span>{item.location}</span>
                  <span className="text-blue-400 font-semibold">{item.system.split(' ')[0]}</span>
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
