import React from 'react';
import { ArrowRight, Globe, BookOpen, Sliders } from 'lucide-react';

interface AlumilGreyBoxesProps {
  onNavigate: (sectionId: string) => void;
}

export const AlumilGreyBoxes: React.FC<AlumilGreyBoxesProps> = ({ onNavigate }) => {
  const boxes = [
    {
      id: 'presence',
      tag: 'REGIONAL HUB',
      title: 'Visit Our Location',
      description:
        'Find our pinned location in Baghdad and get directions directly from the contact section.',
      linkText: 'Read more',
      action: () => onNavigate('contact'),
      icon: Globe
    },
    {
      id: 'knowledge',
      tag: 'KNOWLEDGE BASE',
      title: 'Informational Material & Catalogs',
      description:
        'Read our rich, informative technical documentation and enrich your knowledge about thermal-break frames and acoustic glazing.',
      linkText: 'Open Architectural Guide',
      action: () => onNavigate('typology'),
      icon: BookOpen
    },
    {
      id: 'tools',
      tag: 'TOOLS',
      title: 'Products Selection Guide',
      description:
        'Discover the architectural system that Doorhome recommends based on your building typology and climate insulation requirements.',
      linkText: 'Enter the Guide',
      action: () => onNavigate('typology'),
      icon: Sliders
    }
  ];

  return (
    <section id="support" className="py-16 sm:py-20 bg-[#F8F8F8] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Subtitle Block */}
        <div className="max-w-3xl mb-12">
          <h4 className="text-xs font-black tracking-widest uppercase text-slate-500 mb-2">
            SUPPORT
          </h4>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#3E4346] tracking-tight">
            Find what you need according to your requirements
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            We provide all the necessary services and the most up-to-date material to answer all of your questions. Regardless of your purchase phase, we can support you to find what you want.
          </p>
        </div>

        {/* 3 Grey Box Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {boxes.map((box) => {
            const Icon = box.icon;
            return (
              <div
                key={box.id}
                onClick={box.action}
                className="bg-white p-7 rounded-lg border border-slate-200/90 shadow-2xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 group-hover:text-red-600 transition-colors">
                      {box.tag}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-red-600 group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-[#3E4346] group-hover:text-red-600 transition-colors mb-2">
                    {box.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {box.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-1 text-xs font-bold text-[#3E4346] group-hover:text-red-600 transition-colors">
                  <span>{box.linkText}</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
