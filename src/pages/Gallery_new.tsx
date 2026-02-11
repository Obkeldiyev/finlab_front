import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ParticleBackground } from '@/components/ParticleBackground';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api } from '@/services/api';
import { toast } from 'sonner';

interface GalleryItem {
  id: number;
  title_en: string;
  title_ru: string;
  title_uz: string;
  url: string;
  type: string;
  created_at: string;
}

export default function Gallery() {
  const { t, language } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    try {
      const response = await api.getGallery();
      if (response.success) {
        setGalleryItems(response.data);
      }
    } catch (error) {
      console.error('Failed to load gallery:', error);
      toast.error('Failed to load gallery');
    } finally {
      setIsLoading(false);
    }
  };

  const galleryImages = galleryItems.filter(item => item.type === 'image');
  const galleryVideos = galleryItems.filter(item => item.type === 'video');

  const getLocalizedTitle = (item: GalleryItem) => {
    if (!item) return '';
    return language === 'uz' ? item.title_uz : language === 'ru' ? item.title_ru : item.title_en;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100/60 via-blue-50/40 to-indigo-100/50">
      <ParticleBackground />
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4"
          >
            {t('gallery.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-primary-foreground/80"
          >
            {t('gallery.subtitle')}
          </motion.p>
        </div>
      </section>

      {/* Gallery Grid with Tabs */}
      <section className="section-padding relative z-10">
        <div className="container mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading gallery...</p>
              </div>
            </div>
          ) : (
            <Tabs defaultValue="photos" className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
                <TabsTrigger value="photos">
                  {language === 'uz' ? 'Rasmlar' : language === 'ru' ? 'Фотографии' : 'Photos'}
                </TabsTrigger>
                <TabsTrigger value="videos">
                  {language === 'uz' ? 'Videolar' : language === 'ru' ? 'Видео' : 'Videos'}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="photos">
                {galleryImages.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No photos available</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {galleryImages.map((image, index) => (
                      <motion.div
                        key={image.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <Card 
                          className="overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 group"
                          onClick={() => setSelectedImage(index)}
                        >
                          <div className="relative aspect-video overflow-hidden">
                            <img
                              src={`${import.meta.env.VITE_API_URL || '/api'}${image.url}`}
                              alt={getLocalizedTitle(image)}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                              <p className="text-white font-medium">{getLocalizedTitle(image)}</p>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="videos">
                {galleryVideos.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No videos available</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {galleryVideos.map((video, index) => (
                      <motion.div
                        key={video.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <Card 
                          className="overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 group"
                          onClick={() => setSelectedVideo(index)}
                        >
                          <div className="relative aspect-video overflow-hidden">
                            <video
                              src={`${import.meta.env.VITE_API_URL || '/api'}${video.url}`}
                              className="w-full h-full object-cover"
                              muted
                              preload="metadata"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                              <p className="text-white font-medium">{getLocalizedTitle(video)}</p>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                <svg className="w-8 h-8 text-primary ml-1" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage !== null && galleryImages[selectedImage] && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            src={`${import.meta.env.VITE_API_URL || '/api'}${galleryImages[selectedImage].url}`}
            alt={getLocalizedTitle(galleryImages[selectedImage])}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Video Modal */}
      {selectedVideo !== null && galleryVideos[selectedVideo] && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            onClick={() => setSelectedVideo(null)}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <video
            src={`${import.meta.env.VITE_API_URL || '/api'}${galleryVideos[selectedVideo].url}`}
            controls
            autoPlay
            className="max-w-full max-h-full"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <Footer />
    </div>
  );
}
