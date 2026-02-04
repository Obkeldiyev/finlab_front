import { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ParticleBackground } from '@/components/ParticleBackground';
import { Dialog, DialogContent } from '@/components/ui/dialog';

// Import gallery images
import gallery1 from '@/assets/gallery/gallery-1.jpg';
import gallery2 from '@/assets/gallery/gallery-2.jpg';
import gallery3 from '@/assets/gallery/gallery-3.jpg';
import gallery4 from '@/assets/gallery/gallery-4.jpg';
import gallery5 from '@/assets/gallery/gallery-5.jpg';
import gallery6 from '@/assets/gallery/gallery-6.jpg';

const galleryImages = [
  { src: gallery1, title: { uz: 'Konferentsiya xonasi', ru: 'Конференц-зал', en: 'Conference Room' } },
  { src: gallery2, title: { uz: 'Ish joyi', ru: 'Рабочее пространство', en: 'Workspace' } },
  { src: gallery3, title: { uz: 'Ta\'lim muhiti', ru: 'Образовательная среда', en: 'Educational Environment' } },
  { src: gallery4, title: { uz: 'Kompyuter sinfi', ru: 'Компьютерный класс', en: 'Computer Lab' } },
  { src: gallery5, title: { uz: 'Bolalar burchagi', ru: 'Детский уголок', en: 'Kids Corner' } },
  { src: gallery6, title: { uz: 'Robot it', ru: 'Робот-собака', en: 'Robot Dog' } },
];

export default function Gallery() {
  const { t, language } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const getLocalizedTitle = (item: typeof galleryImages[0]) => {
    return item.title[language as keyof typeof item.title];
  };

  return (
    <div className="min-h-screen bg-background">
      <ParticleBackground />
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-hero relative">
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4"
          >
            {t('gallery.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-primary-foreground/80"
          >
            {t('gallery.subtitle')}
          </motion.p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="section-padding relative z-10">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer"
                onClick={() => setSelectedImage(index)}
              >
                <div className="relative overflow-hidden rounded-2xl aspect-[4/3]">
                  <img
                    src={image.src}
                    alt={getLocalizedTitle(image)}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-xl font-display font-semibold text-secondary-foreground">
                      {getLocalizedTitle(image)}
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <Dialog open={selectedImage !== null} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-5xl p-0 bg-transparent border-none">
          {selectedImage !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white transition-colors"
              >
                <X className="h-8 w-8" />
              </button>
              <img
                src={galleryImages[selectedImage].src}
                alt={getLocalizedTitle(galleryImages[selectedImage])}
                className="w-full rounded-2xl"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent rounded-b-2xl">
                <h3 className="text-2xl font-display font-semibold text-white">
                  {getLocalizedTitle(galleryImages[selectedImage])}
                </h3>
              </div>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
