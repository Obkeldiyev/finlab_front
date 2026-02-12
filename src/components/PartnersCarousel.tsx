import { useEffect, useState, useRef } from 'react';
import { api } from '@/services/api';

interface Partner {
  id: number;
  name: string;
  logo_url: string;
  website_url: string;
}

export function PartnersCarousel() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef(0);

  useEffect(() => {
    loadPartners();
  }, []);

  useEffect(() => {
    if (partners.length === 0 || !containerRef.current) return;

    const container = containerRef.current;
    const firstChild = container.firstElementChild as HTMLElement;
    if (!firstChild) return;

    // Calculate the width of one set of items (including gap)
    const itemWidth = 256 + 32; // w-64 (256px) + gap-8 (32px)
    const setWidth = itemWidth * partners.length;

    let animationFrameId: number;

    const animate = () => {
      scrollPositionRef.current += 0.7; // Speed of scroll
      
      // Reset position when we've scrolled past one complete set
      if (scrollPositionRef.current >= setWidth) {
        scrollPositionRef.current = 0;
      }
      
      container.style.transform = `translateX(-${scrollPositionRef.current}px)`;
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [partners]);

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

  // Triple the content for seamless looping
  const tripleContent = [...partners, ...partners, ...partners];

  return (
    <div className="relative overflow-hidden py-8">
      <div 
        ref={containerRef}
        className="flex gap-8 items-center"
        style={{ willChange: 'transform' }}
      >
        {tripleContent.map((partner, index) => (
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
