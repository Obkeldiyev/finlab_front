import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/services/api';
import { useLanguage } from '@/contexts/LanguageContext';

interface Announcement {
  id: number;
  title_uz: string;
  title_ru: string;
  title_en: string;
  content_uz: string;
  content_ru: string;
  content_en: string;
  published_at: string;
  ends_at: string;
}

export function AnnouncementsSection() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const { language } = useLanguage();

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      const response = await api.getAnnouncements();
      if (response.success && response.data) {
        // Filter active announcements (not expired)
        const active = response.data.filter((a: Announcement) => 
          new Date(a.ends_at) > new Date()
        );
        setAnnouncements(active.slice(0, 3)); // Show only 3 latest
      }
    } catch (error) {
      console.error('Failed to load announcements:', error);
    }
  };

  if (announcements.length === 0) return null;

  const getTitle = (announcement: Announcement) => {
    if (language === 'uz') return announcement.title_uz;
    if (language === 'ru') return announcement.title_ru;
    return announcement.title_en;
  };

  const getContent = (announcement: Announcement) => {
    if (language === 'uz') return announcement.content_uz;
    if (language === 'ru') return announcement.content_ru;
    return announcement.content_en;
  };

  return (
    <section className="section-padding bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 relative z-10">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            {language === 'uz' && "E'lonlar"}
            {language === 'ru' && 'Объявления'}
            {language === 'en' && 'Announcements'}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {language === 'uz' && 'Muhim yangiliklar va tadbirlar haqida xabardor bo\'ling'}
            {language === 'ru' && 'Будьте в курсе важных новостей и мероприятий'}
            {language === 'en' && 'Stay informed about important news and events'}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {announcements.map((announcement, index) => (
            <motion.div
              key={announcement.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full p-6 hover:shadow-xl transition-all duration-300 border-2 border-amber-200 bg-white">
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-foreground mb-2">
                      {getTitle(announcement)}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>
                        {language === 'uz' && 'Tugaydi: '}
                        {language === 'ru' && 'Заканчивается: '}
                        {language === 'en' && 'Ends: '}
                        {new Date(announcement.ends_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {getContent(announcement)}
                </p>
                <Button variant="outline" className="w-full group">
                  {language === 'uz' && 'Batafsil'}
                  {language === 'ru' && 'Подробнее'}
                  {language === 'en' && 'Read More'}
                  <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
