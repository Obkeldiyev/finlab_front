import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage, getLocalizedField } from '@/contexts/LanguageContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ParticleBackground } from '@/components/ParticleBackground';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Image, Video, FileText, Play } from 'lucide-react';
import { dataService, type NewsItem } from '@/services/dataService';
import { toast } from 'sonner';

export default function News() {
  const { t, language } = useLanguage();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
    return date.toLocaleDateString(language === 'ru' ? 'ru-RU' : language === 'uz' ? 'uz-UZ' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'image':
        return Image;
      case 'video':
        return Video;
      default:
        return FileText;
    }
  };

  const renderMedia = (media: NewsItem['medias'][0]) => {
    const baseUrl = import.meta.env.VITE_API_URL || '/api';
    const fullUrl = `${baseUrl}${media.url}`;

    if (media.type === 'image') {
      return (
        <div className="relative group cursor-pointer">
          <img
            src={fullUrl}
            alt="News media"
            className="w-full h-48 object-cover rounded-lg group-hover:opacity-90 transition-opacity"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg" />
        </div>
      );
    }

    if (media.type === 'video') {
      return (
        <div className="relative group">
          <video
            src={fullUrl}
            className="w-full h-48 object-cover rounded-lg"
            controls
            preload="metadata"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    // For other file types, show a download link
    return (
      <a
        href={fullUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 p-3 bg-accent rounded-lg hover:bg-accent/80 transition-colors"
      >
        <FileText className="h-5 w-5 text-primary" />
        <span className="text-sm font-medium">
          {language === 'uz' ? 'Faylni yuklab olish' : language === 'ru' ? 'Скачать файл' : 'Download file'}
        </span>
      </a>
    );
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
            {news.map((newsItem, index) => (
              <motion.div
                key={newsItem.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="card-feature h-full overflow-hidden">
                  {/* Media Section */}
                  {newsItem.medias && newsItem.medias.length > 0 && (
                    <div className="relative">
                      {newsItem.medias.length === 1 ? (
                        renderMedia(newsItem.medias[0])
                      ) : (
                        <div className="grid grid-cols-2 gap-2 p-4">
                          {newsItem.medias.slice(0, 4).map((media, mediaIndex) => (
                            <div key={media.id} className="relative">
                              {renderMedia(media)}
                              {mediaIndex === 3 && newsItem.medias.length > 4 && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg">
                                  <span className="text-white font-semibold">
                                    +{newsItem.medias.length - 4}
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Media Count Badge */}
                      {newsItem.medias.length > 1 && (
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary" className="bg-black/60 text-white">
                            <Image className="h-3 w-3 mr-1" />
                            {newsItem.medias.length}
                          </Badge>
                        </div>
                      )}
                    </div>
                  )}

                  <CardHeader>
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(newsItem.published_at)}
                    </div>
                    <CardTitle className="text-xl font-display">
                      {getLocalizedField(newsItem, 'title', language)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-3">
                      {getLocalizedField(newsItem, 'content', language)}
                    </p>
                    
                    {/* Media Types Summary */}
                    {newsItem.medias && newsItem.medias.length > 0 && (
                      <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                        {Array.from(new Set(newsItem.medias.map(m => m.type))).map(type => {
                          const IconComponent = getMediaIcon(type);
                          return (
                            <Badge key={type} variant="outline" className="text-xs">
                              <IconComponent className="h-3 w-3 mr-1" />
                              {type === 'image' ? 
                                (language === 'uz' ? 'Rasm' : language === 'ru' ? 'Изображение' : 'Image') :
                                type === 'video' ?
                                (language === 'uz' ? 'Video' : language === 'ru' ? 'Видео' : 'Video') :
                                (language === 'uz' ? 'Fayl' : language === 'ru' ? 'Файл' : 'File')
                              }
                            </Badge>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}