import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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
        // Quadruple the partners for seamless infinite loop
        const quadrupled = [...response.data, ...response.data, ...response.data, ...response.data];
        setPartners(quadrupled);
      }
    } catch (error) {
      console.error('Failed to load partners:', error);
    }
  };

  if (partners.length === 0) return null;

  return (
    <div className="relative overflow-hidden py-8">
      <motion.div
        className="flex gap-8 items-center"
        animate={{
          x: [0, -1280], // Move left (negative direction)
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 25,
            ease: "linear",
          },
        }}
        style={{ willChange: 'transform' }}
      >
        {partners.map((partner, index) => (
          <a
            key={`${partner.id}-${index}`}
            href={partner.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 w-64 h-32 bg-white rounded-2xl shadow-lg border-2 border-slate-200 p-6 flex items-center justify-center hover:shadow-xl hover:border-primary/50 transition-all duration-300 pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={`${import.meta.env.VITE_API_URL || '/api'}${partner.logo_url}`}
              alt={partner.name}
              className="max-h-full max-w-full object-contain"
            />
          </a>
        ))}
      </motion.div>
    </div>
  );
}
