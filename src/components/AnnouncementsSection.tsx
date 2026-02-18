import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ChevronRight, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/services/api';
import { useLanguage } from '@/contexts/LanguageContext';
import { AdaptiveParticleBackground } from '@/components/AdaptiveParticleBackground';

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
  medias?: { id: number; url: string; type: string }[];
}

export function AnnouncementsSection() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const { language } = useLanguage();

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      console.log('Loading announcements for landing page...');
      const response = await api.getAnnouncements();
      console.log('Announcements API response:', response);
      if (response.success && response.data) {
        console.log('All announcements:', response.data);
        // Filter active announcements (not expired)
        const active = response.data.filter((a: Announcement) => 
          new Date(a.ends_at) > new Date()
        );
        console.log('Active announcements:', active);
        setAnnouncements(active.slice(0, 3)); // Show only 3 latest
      }
    } catch (error) {
      console.error('Failed to load announcements:', error);
    }
  };

  // Always show section even if no announcements for debugging
  // if (announcements.length === 0) return null;

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
    <>
      <section className="section-padding bg-gradient-to-br from-primary via-primary/95 to-secondary relative z-10 overflow-hidden">
        {/* White particles on blue background */}
        <AdaptiveParticleBackground color="blue" />
        
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              {language === 'uz' && "E'lonlar"}
              {language === 'ru' && 'Объявления'}
              {language === 'en' && 'Announcements'}
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              {language === 'uz' && 'Muhim yangiliklar va tadbirlar haqida xabardor bo\'ling'}
              {language === 'ru' && 'Будьте в курсе важных новостей и мероприятий'}
              {language === 'en' && 'Stay informed about important news and events'}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {announcements.length === 0 ? (
              <div className="col-span-3 text-center py-12">
                <p className="text-white/80 text-lg">
                  {language === 'uz' && 'Hozircha e\'lonlar yo\'q'}
                  {language === 'ru' && 'Пока нет объявлений'}
                  {language === 'en' && 'No announcements yet'}
                </p>
              </div>
            ) : (
              announcements.map((announcement, index) => (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 border-2 border-white/20 bg-white/10 backdrop-blur-sm">
                  {/* Image Preview */}
                  {announcement.medias && announcement.medias.length > 0 && (
                    <div className="relative h-48 bg-white/5">
                      {announcement.medias[0].type === 'image' ? (
                        <img
                          src={`${import.meta.env.VITE_API_URL || '/api'}${announcement.medias[0].url}`}
                          alt="Announcement"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <video
                          src={`${import.meta.env.VITE_API_URL || '/api'}${announcement.medias[0].url}`}
                          className="w-full h-full object-cover"
                          muted
                        />
                      )}
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <Calendar className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-white mb-2">
                          {getTitle(announcement)}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-white/80">
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
                    <p className="text-white/90 mb-4 line-clamp-3">
                      {getContent(announcement)}
                    </p>
                    <Button 
                      variant="outline" 
                      className="w-full group bg-white/10 border-white/30 text-white hover:bg-white hover:text-primary"
                      onClick={() => setSelectedAnnouncement(announcement)}
                    >
                      {language === 'uz' && 'Batafsil'}
                      {language === 'ru' && 'Подробнее'}
                      {language === 'en' && 'Read More'}
                      <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))
            )}
          </div>
        </div>
      </section>

      {/* Modal */}
      {selectedAnnouncement && (
        <div 
          className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4"
          onClick={() => setSelectedAnnouncement(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedAnnouncement(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            
            <div className="p-8">
              {/* Images */}
              {selectedAnnouncement.medias && selectedAnnouncement.medias.length > 0 && (
                <div className="mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    {selectedAnnouncement.medias.map((media, idx) => (
                      <div key={idx} className="relative aspect-video rounded-lg overflow-hidden">
                        {media.type === 'image' ? (
                          <img
                            src={`${import.meta.env.VITE_API_URL || '/api'}${media.url}`}
                            alt={`Media ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <video
                            src={`${import.meta.env.VITE_API_URL || '/api'}${media.url}`}
                            controls
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {new Date(selectedAnnouncement.published_at).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {language === 'uz' && 'Tugaydi: '}
                  {language === 'ru' && 'Заканчивается: '}
                  {language === 'en' && 'Ends: '}
                  {new Date(selectedAnnouncement.ends_at).toLocaleDateString()}
                </div>
              </div>

              <h2 className="text-3xl font-bold mb-4 text-foreground">
                {getTitle(selectedAnnouncement)}
              </h2>

              <div className="prose max-w-none">
                <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {getContent(selectedAnnouncement)}
                </p>
              </div>

              <div className="mt-8 flex justify-end">
                <Button onClick={() => setSelectedAnnouncement(null)}>
                  {language === 'uz' && 'Yopish'}
                  {language === 'ru' && 'Закрыть'}
                  {language === 'en' && 'Close'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
