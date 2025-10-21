import { useState, useEffect } from 'react';

const clients = [
  { name: 'IIAD', logo: '/clients/IIAD.svg' },
  { name: 'VESNATOURS', logo: '/clients/VESNATOURS.svg' },
  { name: 'Queen of India', logo: '/clients/Queenofindia.svg' },
  { name: 'AND Academy', logo: '/clients/ANDacademy.svg' },
  { name: 'Harrow Decor', logo: '/clients/HarrowDecor.svg' },
  { name: 'Vesna Event Crafters', logo: '/clients/Vesnaeventcrafters.svg' },
  { name: 'Quick Reviewer', logo: '/clients/Quickreviewer.svg' },
  { name: 'Aashiyana Infra Homes', logo: '/clients/aashiyanainfrahomes.svg' },
];

export default function ClientsLogoCarousel() {
  const marqueeClients = [...clients, ...clients, ...clients];
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section className="bg-gradient-to-tr from-[#0A0F1C] via-[#112136] to-[#0A0F1C] py-16 px-6 overflow-hidden relative">
      <h3 className="text-3xl font-extrabold mb-10 text-center bg-gradient-to-r from-[#00B7FF] to-[#6AE5E6] bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(0,183,255,0.7)]">
        Our Clients
      </h3>
      <div
        className="relative overflow-hidden max-w-[88vw] mx-auto rounded-lg border border-[#1E2A47]/50 shadow-lg shadow-[#00B7FF]/20"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={`flex gap-6 whitespace-nowrap py-6 ${isHovered ? 'overflow-x-auto cursor-grab paused' : !isMobile ? 'animate-marquee' : 'overflow-x-auto cursor-grab'}`}
          aria-label="Clients marquee carousel"
          tabIndex={0}
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {(isMobile ? clients : marqueeClients).map((client, idx) => (
            <div
              key={`${client.name}-${idx}`}
              className="inline-flex flex-col items-center justify-center bg-[#112136] rounded-xl p-4 shadow-md transition-shadow duration-300 transform focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#00B7FF]/70 hover:shadow-xl hover:scale-105"
              style={{
                minWidth: isMobile ? '40%' : '18%',
                minHeight: isMobile ? 120 : 160,
                filter: !isMobile ? 'drop-shadow(0 0 4px #0088FF66)' : 'none',
              }}
              tabIndex={0}
              aria-label={client.name}
            >
              <img
                src={client.logo}
                alt={client.name}
                loading="lazy"
                className={`w-auto mb-4 ${isMobile ? 'max-h-16' : 'max-h-20'} border border-[#00B7FF]/40 rounded-md grayscale hover:grayscale-0 transition duration-500 ease-in-out filter`}
              />
              <span className="text-[#00B7FF] font-semibold text-sm tracking-wider select-none">
                {client.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
          animation-play-state: running;
        }
        .paused {
          animation-play-state: paused !important;
        }
        .overflow-x-auto {
          overflow-x: auto;
        }
        .cursor-grab {
          cursor: grab;
        }
        .overflow-x-auto::-webkit-scrollbar {
          display: none;
        }
        div[tabindex='0']:focus-visible {
          outline-offset: 2px;
          outline: 3px solid #00b7ffcc;
          border-radius: 0.75rem;
        }
      `}</style>
    </section>
  );
}
