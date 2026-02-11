import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Image as ImageIcon, Video, Play } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ParticleBackground } from '@/components/ParticleBackground';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api } from '@/services/api';
import { toast } from 'sonner';

interface GalleryItem {
  id: number;
  title: string;
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
                {galleryImages.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No photos available</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {galleryImages.map((image, index) => (
                      <motion.div
                        key={image.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="group cursor-pointer"
                        onClick={() => setSelectedImage(index)}
                      >
                        <div className="relative overflow-hidden rounded-2xl aspect-[4/3]">
                          <img
                            src={`${import.meta.env.VITE_API_URL || '/api'}${image.url}`}
                            alt={image.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                            <h3 className="text-xl font-display font-semibold text-secondary-foreground">
                              {image.title}
                            </h3>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Videos Tab */}
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
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="group cursor-pointer"
                        onClick={() => setSelectedVideo(index)}
                      >
                        <div className="relative overflow-hidden rounded-2xl aspect-[4/3]">
                          <video
                            src={`${import.meta.env.VITE_API_URL || '/api'}${video.url}`}
                            className="w-full h-full object-cover"
                            muted
                            preload="metadata"
                          />
                          {/* Play button overlay */}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors duration-300">
                            <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                              <Play className="h-8 w-8 text-primary ml-1" fill="currentColor" />
                            </div>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                            <h3 className="text-xl font-display font-semibold text-white">
                              {video.title}
                            </h3>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </section>

      {/* Image Lightbox */}
      <Dialog open={selectedImage !== null} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-5xl p-0 bg-transparent border-none">
          {selectedImage !== null && galleryImages[selectedImage] && (
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
                src={`${import.meta.env.VITE_API_URL || '/api'}${galleryImages[selectedImage].url}`}
                alt={galleryImages[selectedImage].title}
                className="w-full rounded-2xl"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent rounded-b-2xl">
                <h3 className="text-2xl font-display font-semibold text-white">
                  {galleryImages[selectedImage].title}
                </h3>
              </div>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>

      {/* Video Lightbox */}
      <Dialog open={selectedVideo !== null} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-5xl p-0 bg-transparent border-none">
          {selectedVideo !== null && galleryVideos[selectedVideo] && (
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
                src={`${import.meta.env.VITE_API_URL || '/api'}${galleryVideos[selectedVideo].url}`}
                controls
                autoPlay
                className="w-full rounded-2xl"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent rounded-b-2xl pointer-events-none">
                <h3 className="text-2xl font-display font-semibold text-white">
                  {galleryVideos[selectedVideo].title}
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
