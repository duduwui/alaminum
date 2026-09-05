import React, { useState } from 'react';
import CountUp from './CountUp';
import ScrollExpand from './ScrollExpand';
import { ShieldCheck, Award, Building2, MapPin } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const cmsData = React.useMemo(() => {
    const saved = localStorage.getItem('winhome_cms_homepage_media');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return {
      aboutFactoryImage: '/assets/winhome/photo_2023-07-03_15-40-04-1104x720.jpg',
      aboutTitle: 'Building Iraq’s Most Resilient Window & Door Systems',
      aboutSubtitle: 'Winhome Company, operating under Nafza Almanzl Holding, stands at the forefront of architectural fenestration across the Kurdistan Region and federal Iraq.'
    };
  }, []);

  const statsData = [
    {
      num: 25,
      suffix: '+',
      label: 'Years of Leadership',
      desc: 'Decades of fenestration excellence in Iraq & Kurdistan',
      icon: Award,
      color: 'from-blue-500 to-sky-600'
    },
    {
      num: 10000,
      suffix: '+',
      separator: ',',
      label: 'Projects Delivered',
      desc: 'Villas, commercial towers & public developments',
      icon: Building2,
      color: 'from-sky-500 to-indigo-600'
    },
    {
      num: 100,
      suffix: '%',
      label: 'European Quality',
      desc: 'Certified Belgium, Germany & Italian profiles',
      icon: ShieldCheck,
      color: 'from-indigo-500 to-blue-600'
    },
    {
      num: 2,
      suffix: ' Facilities',
      label: 'Erbil Hub & Showroom',
      desc: 'High-capacity CNC plant & luxury client gallery',
      icon: MapPin,
      color: 'from-blue-600 to-cyan-600'
    }
  ];

  const mainContent = (
    <div className="w-full h-auto pt-8 sm:pt-20 pb-12 sm:pb-16 bg-gradient-to-b from-slate-50 via-white to-sky-50/30 relative overflow-hidden flex flex-col justify-center">
      {/* Ambient background glow spheres */}
      <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-sky-200/20 rounded-full blur-3xl pointer-events-none -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-blue-100/25 rounded-full blur-3xl pointer-events-none -ml-48 -mb-48" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Story & Operational Pillars */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-left">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              {cmsData.aboutTitle || 'Building Iraq’s Most Resilient Window & Door Systems'}
            </h2>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
              {cmsData.aboutSubtitle || 'Winhome Company, operating under Nafza Almanzl Holding, stands at the forefront of architectural fenestration across the Kurdistan Region and federal Iraq.'}
            </p>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Extreme temperature swings in our region—from blistering summer heat waves exceeding 50°C to freezing winter lows—cause ordinary PVC and uninsulated aluminum to deform, leak drafts, and degrade within years. Winhome exclusively supplies profiles certified for <strong className="text-slate-900 font-semibold">Severe Climate Class S</strong>, utilizing European UV-stabilized formulations and certified multi-point hardware.
            </p>
          </div>

          {/* Right Column: Clean & Simple Industrial Plant Showcase Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden border border-slate-200/80 shadow-xl bg-slate-100 group">
              <img
                src={cmsData.aboutFactoryImage || '/assets/winhome/photo_2023-07-03_15-40-04-1104x720.jpg'}
                alt="Winhome Erbil Automated CNC Plant"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/winhome/photo_2023-07-03_15-49-24-760x485.jpg';
                }}
                className="w-full h-[240px] sm:h-[360px] object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/75 via-transparent to-transparent p-5 flex flex-col justify-end text-left">
                <h4 className="text-base sm:text-xl font-bold text-white tracking-tight">
                  Winhome Automated CNC Plant, Erbil
                </h4>
              </div>
            </div>
          </div>
        </div>

        {/* Dedicated Full-Width KPI Counter Showcase Strip */}
        <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-slate-200/80">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {statsData.map((stat, idx) => (
              <div
                key={idx}
                className="p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-400/60 transition-all duration-300 group relative overflow-hidden text-center flex flex-col items-center justify-center"
              >
                {/* Subtle hover gradient light */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-sky-500/0 rounded-full blur-xl group-hover:scale-150 transition-transform pointer-events-none" />

                <div className="flex flex-col items-center justify-center text-center">
                  <div className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight flex items-baseline justify-center gap-0.5">
                    <CountUp
                      to={stat.num}
                      separator={stat.separator || ''}
                      duration={2.5}
                      startWhen={true}
                      className="text-slate-900 font-black"
                    />
                    <span className="text-slate-900 font-black">{stat.suffix}</span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-1 sm:mt-2 group-hover:text-blue-600 transition-colors">
                    {stat.label}
                  </h4>

                  <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1 leading-relaxed font-medium max-w-[220px]">
                    {stat.desc}
                  </p>
                </div>

                <div className="w-full h-1 bg-slate-100 rounded-full mt-3 sm:mt-4 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-600 to-sky-500 w-0 group-hover:w-full transition-all duration-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section id="about" className="relative border-b border-slate-200/80 bg-slate-100">
      <ScrollExpand
        useWindowScroll
        startWidth={isMobile ? 85 : 55}
        startHeight={isMobile ? 40 : 45}
        startRadius={isMobile ? 20 : 28}
        endRadius={0}
        scrollDistance={isMobile ? 0.5 : 0.9}
        holdDistance={isMobile ? 0.15 : 0.2}
        smoothing={0.12}
        onExpandChange={setIsExpanded}
        title={
          <div className="flex flex-col items-center justify-center p-4 text-center pointer-events-none">
            <h3 className="text-base sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
              Building Iraq's Most Resilient Systems
            </h3>
          </div>
        }
      >
        {mainContent}
      </ScrollExpand>
    </section>
  );
};

export default AboutSection;
