import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { dataService, type NewsItem } from '@/services/dataService';
import { useLanguage, getLocalizedField } from '@/contexts/LanguageContext';
import { AdaptiveParticleBackground } from '@/components/AdaptiveParticleBackground';

export function NewsSection() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const { language } = useLanguage();

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      console.log('NewsSection: Loading news...');
      const newsData = await dataService.getNews();
      console.log('NewsSection: Loaded news:', newsData.length, 'items');
      setNews(newsData.slice(0, 3)); // Show only 3 latest
    } catch (error) {
      console.error('NewsSection: Failed to load news:', error);
    }
  };

  console.log('NewsSection: Rendering with', news.length, 'news items');

  if (news.length === 0) {
    console.log('NewsSection: No news, returning null');
    return null;
  }

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

  return (
    <section className="section-padding bg-white relative z-10 overflow-hidden">
      {/* Blue particles on white background */}
      <AdaptiveParticleBackground color="white" />
      
      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            {language === 'uz' && "So'nggi yangiliklar"}
            {language === 'ru' && 'Последние новости'}
            {language === 'en' && 'Latest News'}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {language === 'uz' && 'Laboratoriya faoliyati va tadbirlar haqida eng so\'nggi ma\'lumotlar'}
            {language === 'ru' && 'Последняя информация о деятельности лаборатории и мероприятиях'}
            {language === 'en' && 'Latest information about laboratory activities and events'}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {news.map((newsItem, index) => (
            <motion.div
              key={newsItem.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={`/news/${newsItem.id}`}>
                <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 border-2 border-blue-200/40 hover:border-primary/40 cursor-pointer group">
                  {/* Image Preview */}
                  {newsItem.medias && newsItem.medias.length > 0 && (
                    <div className="relative h-48 bg-accent overflow-hidden">
                      {newsItem.medias[0].type === 'image' ? (
                        <img
                          src={`${import.meta.env.VITE_API_URL || '/api'}${newsItem.medias[0].url}`}
                          alt="News preview"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <video
                          src={`${import.meta.env.VITE_API_URL || '/api'}${newsItem.medias[0].url}`}
                          className="w-full h-full object-cover"
                          preload="metadata"
                        />
                      )}
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(newsItem.published_at)}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatTime(newsItem.published_at)}
                      </div>
                    </div>
                    
                    <h3 className="font-bold text-lg text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                      {getLocalizedField(newsItem, 'title', language)}
                    </h3>
                    
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {getLocalizedField(newsItem, 'content', language)}
                    </p>
                    
                    <div className="flex items-center text-primary font-medium group-hover:gap-2 transition-all">
                      {language === 'uz' && 'Batafsil'}
                      {language === 'ru' && 'Подробнее'}
                      {language === 'en' && 'Read More'}
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link to="/news">
            <Button size="lg" className="group">
              {language === 'uz' && 'Barcha yangiliklar'}
              {language === 'ru' && 'Все новости'}
              {language === 'en' && 'All News'}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
