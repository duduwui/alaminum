import React, { useState } from 'react';
import { ArrowRight, MapPin, X } from 'lucide-react';

interface AlumilProjectsListProps {
  onViewAll?: () => void;
}

export const AlumilProjectsList: React.FC<AlumilProjectsListProps> = ({ onViewAll }) => {
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  const projects = [
    {
      id: 'villa-erbil',
      category: 'RESIDENTIAL',
      title: 'Luxury Villa in Empire World',
      location: 'Empire World, Erbil',
      system: 'Lorenzo 70LS Minimal & Facade 50F',
      image: './assets/doorhome/03-2.jpg',
      description: 'Expansive 3.2m minimalist sliding spans seamlessly connecting living areas with outdoor pool terraces.'
    },
    {
      id: 'dream-city',
      category: 'RESIDENTIAL',
      title: 'Dream City Private Residence',
      location: 'Dream City, Erbil',
      system: 'Legend 80 6-Chamber Triple Glazed uPVC',
      image: './assets/doorhome/photo_2023-07-03_15-41-20-1280x820.jpg',
      description: 'Passive house standard acoustic fenestration delivering 45 dB noise isolation.'
    },
    {
      id: 'gulan-tower',
      category: 'OFFICES & COMMERCIAL',
      title: 'Gulan Expressway Commercial Facade',
      location: 'Gulan District, Erbil',
      system: 'Curtain Wall Facade 50F Structural Glazing',
      image: './assets/doorhome/3-2.jpg',
      description: 'Engineered high-rise mullion facade with solar reflective Low-E double glazing.'
    },
    {
      id: 'italian-village',
      category: 'MULTI UNIT HOUSING',
      title: 'Italian Village Modern Envelopes',
      location: 'Italian Village II, Erbil',
      system: 'Winsa Dorado 76 & Italian Comunello Locks',
      image: './assets/doorhome/4-2.jpg',
      description: 'Contemporary turn-key fenestration with motorized rolling shutters.'
    }
  ];

  return (
    <section id="gallery" className="py-16 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Box 1: Text Feature Box (Alumil item-first-box) */}
          <div className="bg-[#3E4346] text-white p-8 rounded-2xl flex flex-col justify-between shadow-lg">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Projects
              </h2>
              <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
                Get inspiration! View modern projects with Doorhome systems and get ideas for your space.
              </p>
            </div>

            <div className="pt-6">
              <button
                onClick={onViewAll}
                className="w-full sm:w-auto px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider rounded transition-colors shadow-md shadow-red-600/30 cursor-pointer"
              >
                View all the projects
              </button>
            </div>
          </div>

          {/* Project 1: Villa in Empire World */}
          <div
            onClick={() => setSelectedProject(projects[0])}
            className="group cursor-pointer rounded-2xl overflow-hidden relative shadow-md bg-slate-900 min-h-[300px] flex flex-col justify-end"
          >
            <img
              src={projects[0].image}
              alt={projects[0].title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="relative z-10 p-6 text-white">
              <span className="text-[10px] font-black uppercase text-red-400 tracking-wider block">
                {projects[0].category}
              </span>
              <h3 className="text-lg font-bold text-white mt-1 group-hover:text-red-400 transition-colors">
                {projects[0].title}
              </h3>
            </div>
          </div>

          {/* Project 2: Dream City */}
          <div
            onClick={() => setSelectedProject(projects[1])}
            className="group cursor-pointer rounded-2xl overflow-hidden relative shadow-md bg-slate-900 min-h-[300px] flex flex-col justify-end"
          >
            <img
              src={projects[1].image}
              alt={projects[1].title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="relative z-10 p-6 text-white">
              <span className="text-[10px] font-black uppercase text-red-400 tracking-wider block">
                {projects[1].category}
              </span>
              <h3 className="text-lg font-bold text-white mt-1 group-hover:text-red-400 transition-colors">
                {projects[1].title}
              </h3>
            </div>
          </div>

          {/* Project 3: Gulan Tower */}
          <div
            onClick={() => setSelectedProject(projects[2])}
            className="group cursor-pointer rounded-2xl overflow-hidden relative shadow-md bg-slate-900 min-h-[300px] flex flex-col justify-end"
          >
            <img
              src={projects[2].image}
              alt={projects[2].title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="relative z-10 p-6 text-white">
              <span className="text-[10px] font-black uppercase text-red-400 tracking-wider block">
                {projects[2].category}
              </span>
              <h3 className="text-lg font-bold text-white mt-1 group-hover:text-red-400 transition-colors">
                {projects[2].title}
              </h3>
            </div>
          </div>

          {/* Project 4: Italian Village */}
          <div
            onClick={() => setSelectedProject(projects[3])}
            className="group cursor-pointer rounded-2xl overflow-hidden relative shadow-md bg-slate-900 min-h-[300px] flex flex-col justify-end md:col-span-2 lg:col-span-2"
          >
            <img
              src={projects[3].image}
              alt={projects[3].title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="relative z-10 p-6 text-white">
              <span className="text-[10px] font-black uppercase text-red-400 tracking-wider block">
                {projects[3].category}
              </span>
              <h3 className="text-lg font-bold text-white mt-1 group-hover:text-red-400 transition-colors">
                {projects[3].title}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="bg-white rounded-2xl overflow-hidden max-w-2xl w-full p-6 text-slate-900 relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-900"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={selectedProject.image}
              alt={selectedProject.title}
              className="w-full h-64 object-cover rounded-xl mb-4"
            />

            <span className="text-xs font-black uppercase text-red-600 tracking-wider">
              {selectedProject.category}
            </span>
            <h3 className="text-xl font-bold text-[#3E4346] mt-1">
              {selectedProject.title}
            </h3>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{selectedProject.location}</span>
            </p>
            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
              {selectedProject.description}
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-slate-700">
              System Installed: <strong className="text-[#3E4346]">{selectedProject.system}</strong>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
