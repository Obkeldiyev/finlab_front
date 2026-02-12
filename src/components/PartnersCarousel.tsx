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
        // Triple the partners for seamless infinite loop
        const tripled = [...response.data, ...response.data, ...response.data];
        setPartners(tripled);
      }
    } catch (error) {
      console.error('Failed to load partners:', error);
    }
  };

  if (partners.length === 0) return null;

  // Calculate total width for seamless loop
  const cardWidth = 256 + 32; // w-64 + gap-8
  const totalWidth = cardWidth * (partners.length / 3);

  return (
    <div className="relative overflow-hidden py-8">
      <motion.div
        className="flex gap-8 items-center"
        animate={{
          x: [-totalWidth, 0],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: partners.length * 4,
            ease: "linear",
          },
        }}
      >
        {partners.map((partner, index) => (
          <a
            key={`${partner.id}-${index}`}
            href={partner.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 w-64 h-32 bg-white rounded-2xl shadow-lg border-2 border-slate-200 p-6 flex items-center justify-center hover:shadow-xl hover:border-primary/50 transition-all duration-300"
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
