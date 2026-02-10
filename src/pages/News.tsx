import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage, getLocalizedField } from '@/contexts/LanguageContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ParticleBackground } from '@/components/ParticleBackground';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, Clock, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { dataService, type NewsItem } from '@/services/dataService';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export default function News() {
  const { t, language } = useLanguage();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);

  useEffect(() => {
    const loadNews = async () => {
      try {
        const newsData = await dataService.getNews();
        setNews(newsData);
      } catch (error) {
        console.error('Failed to load news:', error);
        toast.error('Failed to load news');
      } finally {
        setIsLoading(false);
      }
    };
    loadNews();
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const renderMedia = (media: NewsItem['medias'][0]) => {
    const baseUrl = import.meta.env.VITE_API_URL || '/api';
    const fullUrl = `${baseUrl}${media.url}`;

    if (media.type === 'image') {
      return (
        <img
          src={fullUrl}
          alt="News media"
          className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      );
    }

    if (media.type === 'video') {
      return (
        <video
          src={fullUrl}
          className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
          controls
          autoPlay
        >
          Your browser does not support the video tag.
        </video>
      );
    }

    return null;
  };

  const openNewsModal = (newsItem: NewsItem) => {
    setSelectedNews(newsItem);
    setSelectedMediaIndex(0);
  };

  const closeNewsModal = () => {
    setSelectedNews(null);
    setSelectedMediaIndex(0);
  };

  const nextMedia = () => {
    if (selectedNews && selectedNews.medias) {
      setSelectedMediaIndex((prev) => 
        prev < selectedNews.medias.length - 1 ? prev + 1 : 0
      );
    }
  };

  const prevMedia = () => {
    if (selectedNews && selectedNews.medias) {
      setSelectedMediaIndex((prev) => 
        prev > 0 ? prev - 1 : selectedNews.medias.length - 1
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100/60 via-blue-50/40 to-indigo-100/50">
        <ParticleBackground />
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center backdrop-blur-sm bg-white/75 p-8 rounded-2xl border border-blue-200/40 shadow-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading news...</p>
          </div>
        </div>
      </div>
    );
  }

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
            {t('news.title')}
          </motion.h1>
        </div>
      </section>

      {/* News Grid */}
      <section className="section-padding relative z-10">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {news.filter(n => n != null).map((newsItem, index) => (
              <motion.div
                key={newsItem.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className="card-feature h-full overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
                  onClick={() => openNewsModal(newsItem)}
                >
                  {/* Media Preview */}
                  {newsItem.medias && newsItem.medias.length > 0 && (
                    <div className="relative h-48 overflow-hidden">
                      {newsItem.medias[0].type === 'image' ? (
                        <img
                          src={`${import.meta.env.VITE_API_URL || '/api'}${newsItem.medias[0].url}`}
                          alt="News preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <video
                          src={`${import.meta.env.VITE_API_URL || '/api'}${newsItem.medias[0].url}`}
                          className="w-full h-full object-cover"
                          preload="metadata"
                        />
                      )}
                      
                      {/* Media Count Badge */}
                      {newsItem.medias.length > 1 && (
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary" className="bg-black/60 text-white">
                            +{newsItem.medias.length - 1}
                          </Badge>
                        </div>
                      )}
                    </div>
                  )}

                  <CardHeader>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(newsItem.published_at)}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatTime(newsItem.published_at)}
                      </div>
                    </div>
                    <CardTitle className="text-xl font-display">
                      {newsItem ? getLocalizedField(newsItem, 'title', language) : ''}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-3">
                      {newsItem ? getLocalizedField(newsItem, 'content', language) : ''}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* News Detail Modal */}
      <Dialog open={!!selectedNews} onOpenChange={closeNewsModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedNews && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-display pr-8">
                  {getLocalizedField(selectedNews, 'title', language)}
                </DialogTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(selectedNews.published_at)}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {formatTime(selectedNews.published_at)}
                  </div>
                </div>
              </DialogHeader>

              {/* Media Gallery */}
              {selectedNews.medias && selectedNews.medias.length > 0 && (
                <div className="relative my-4">
                  <div className="relative">
                    {renderMedia(selectedNews.medias[selectedMediaIndex])}
                  </div>

                  {/* Navigation Arrows */}
                  {selectedNews.medias.length > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          prevMedia();
                        }}
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          nextMedia();
                        }}
                      >
                        <ChevronRight className="h-6 w-6" />
                      </Button>

                      {/* Media Counter */}
                      <div className="absolute bottom-2 right-2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                        {selectedMediaIndex + 1} / {selectedNews.medias.length}
                      </div>
                    </>
                  )}

                  {/* Thumbnail Navigation */}
                  {selectedNews.medias.length > 1 && (
                    <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                      {selectedNews.medias.map((media, index) => (
                        <button
                          key={media.id}
                          onClick={() => setSelectedMediaIndex(index)}
                          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                            index === selectedMediaIndex
                              ? 'border-primary scale-105'
                              : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                        >
                          {media.type === 'image' ? (
                            <img
                              src={`${import.meta.env.VITE_API_URL || '/api'}${media.url}`}
                              alt={`Thumbnail ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <video
                              src={`${import.meta.env.VITE_API_URL || '/api'}${media.url}`}
                              className="w-full h-full object-cover"
                              preload="metadata"
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="prose prose-sm max-w-none">
                <p className="text-foreground whitespace-pre-wrap">
                  {getLocalizedField(selectedNews, 'content', language)}
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}