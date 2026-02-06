import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Image as ImageIcon, Video, Play } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ParticleBackground } from '@/components/ParticleBackground';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

const galleryVideos = [
  { 
    src: '/13 SENTYA.MP4', 
    thumbnail: gallery1,
    title: { uz: 'Laboratoriya taqdimoti', ru: 'Презентация лаборатории', en: 'Laboratory Presentation' } 
  },
];

export default function Gallery() {
  const { t, language } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);

  const getLocalizedTitle = (item: typeof galleryImages[0] | typeof galleryVideos[0]) => {
    return item.title[language as keyof typeof item.title];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100/60 via-blue-50/40 to-indigo-100/50">
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

      {/* Gallery Grid with Tabs */}
      <section className="section-padding relative z-10">
        <div className="container mx-auto">
          <Tabs defaultValue="photos" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="photos" className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                {language === 'uz' && 'Rasmlar'}
                {language === 'ru' && 'Фотографии'}
                {language === 'en' && 'Photos'}
              </TabsTrigger>
              <TabsTrigger value="videos" className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                {language === 'uz' && 'Videolar'}
                {language === 'ru' && 'Видео'}
                {language === 'en' && 'Videos'}
              </TabsTrigger>
            </TabsList>

            {/* Photos Tab */}
            <TabsContent value="photos">
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
            </TabsContent>

            {/* Videos Tab */}
            <TabsContent value="videos">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleryVideos.map((video, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group cursor-pointer"
                    onClick={() => setSelectedVideo(index)}
                  >
                    <div className="relative overflow-hidden rounded-2xl aspect-[4/3]">
                      <img
                        src={video.thumbnail}
                        alt={getLocalizedTitle(video)}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {/* Play button overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors duration-300">
                        <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Play className="h-8 w-8 text-primary ml-1" fill="currentColor" />
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                        <h3 className="text-xl font-display font-semibold text-white">
                          {getLocalizedTitle(video)}
                        </h3>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Image Lightbox */}
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

      {/* Video Lightbox */}
      <Dialog open={selectedVideo !== null} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-5xl p-0 bg-transparent border-none">
          {selectedVideo !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white transition-colors z-50"
              >
                <X className="h-8 w-8" />
              </button>
              <video
                src={galleryVideos[selectedVideo].src}
                controls
                autoPlay
                className="w-full rounded-2xl"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent rounded-b-2xl pointer-events-none">
                <h3 className="text-2xl font-display font-semibold text-white">
                  {getLocalizedTitle(galleryVideos[selectedVideo])}
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
