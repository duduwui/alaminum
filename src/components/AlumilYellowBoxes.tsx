import React from 'react';
import { ArrowRight, HelpCircle, MapPin, Users } from 'lucide-react';

interface AlumilYellowBoxesProps {
  onNavigate: (sectionId: string) => void;
}

export const AlumilYellowBoxes: React.FC<AlumilYellowBoxesProps> = ({ onNavigate }) => {
  const items = [
    {
      id: 'support',
      title: 'Customer Support',
      description:
        'We have the solution to all of your questions! We support you, providing complete answers to your architectural queries.',
      linkText: 'Get support',
      action: () => onNavigate('contact'),
      icon: HelpCircle
    },
    {
      id: 'presence',
      title: 'Across the region',
      description:
        'Operating with fabrication and technical support hubs across Erbil, Sulaymaniyah, and Duhok with full local stock.',
      linkText: 'Read more',
      action: () => onNavigate('about'),
      icon: MapPin
    },
    {
      id: 'partners',
      title: 'Partners & Fabricators',
      description:
        'Contact a certified installer from our authorized network and learn about the right solutions for your space.',
      linkText: 'View our network',
      action: () => onNavigate('contact'),
      icon: Users
    }
  ];

  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((it) => {
            const Icon = it.icon;
            return (
              <div
                key={it.id}
                onClick={it.action}
                className="bg-gradient-to-br from-red-600 to-red-800 text-white p-8 rounded-xl shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between group cursor-pointer border border-red-500"
              >
                <div>
                  <div className="w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center mb-4 backdrop-blur-xs">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-xl font-black text-white mb-3">
                    {it.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-red-50 leading-relaxed font-medium">
                    {it.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-white/20 flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-white group-hover:underline">
                    {it.linkText}
                  </span>
                  <ArrowRight className="w-4 h-4 text-white transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
