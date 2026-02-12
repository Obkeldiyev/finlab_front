import { useEffect, useState } from 'react';
import { api } from '@/services/api';

interface Partner {
  id: number;
  name: string;
  logo_url: string;
  website_url: string;
}

export function PartnersCarousel() {
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    try {
      const response = await api.getPartners();
      if (response.success && response.data && response.data.length > 0) {
        setPartners(response.data);
      }
    } catch (error) {
      console.error('Failed to load partners:', error);
    }
  };

  if (partners.length === 0) return null;

  return (
    <div className="relative overflow-hidden py-8">
      <style>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll-partners {
          animation: scroll-left 30s linear infinite;
        }
        .animate-scroll-partners:hover {
          animation-play-state: running;
        }
      `}</style>
      
      <div className="flex gap-8 items-center animate-scroll-partners">
        {/* Render twice for seamless loop */}
        {[...partners, ...partners].map((partner, index) => (
          <a
            key={`${partner.id}-${index}`}
            href={partner.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 w-64 h-32 bg-white rounded-2xl shadow-lg border-2 border-slate-200 p-6 flex items-center justify-center hover:shadow-xl hover:border-primary/50 transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={`${import.meta.env.VITE_API_URL || '/api'}${partner.logo_url}`}
              alt={partner.name}
              className="max-h-full max-w-full object-contain"
            />
          </a>
        ))}
      </div>
    </div>
  );
}
