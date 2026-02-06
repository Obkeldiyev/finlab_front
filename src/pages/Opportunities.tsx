import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Award, BookOpen, Users, Lightbulb, Cpu, Image, Video, FileText, Calendar } from 'lucide-react';
import { useLanguage, getLocalizedField } from '@/contexts/LanguageContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ParticleBackground } from '@/components/ParticleBackground';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { dataService, type Opportunity } from '@/services/dataService';
import { toast } from 'sonner';

export default function Opportunities() {
  const { id } = useParams();
  const { language } = useLanguage();
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [allOpportunities, setAllOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOpportunities = async () => {
      try {
        const opportunitiesData = await dataService.getOpportunities();
        setAllOpportunities(opportunitiesData);
        
        if (id) {
          const found = opportunitiesData.find(opp => opp.id === parseInt(id));
          setOpportunity(found || null);
        }
      } catch (error) {
        console.error('Failed to load opportunities:', error);
        toast.error('Failed to load opportunities');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadOpportunities();
  }, [id]);

  const getIcon = (index: number) => {
    const icons = [Award, BookOpen, Lightbulb];
    return icons[index % icons.length];
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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(language === 'ru' ? 'ru-RU' : language === 'uz' ? 'uz-UZ' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderMedia = (media: Opportunity['medias'][0]) => {
    const baseUrl = import.meta.env.VITE_API_URL || '/api';
    const fullUrl = `${baseUrl}${media.url}`;

    if (media.type === 'image') {
      return (
        <div className="relative group cursor-pointer">
          <img
            src={fullUrl}
            alt="Opportunity media"
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
            <p className="text-muted-foreground">Loading opportunities...</p>
          </div>
        </div>
      </div>
    );
  }

  // If no specific opportunity ID, show all opportunities
  if (!id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100/60 via-blue-50/40 to-indigo-100/50">
        <ParticleBackground />
        <Navbar />

        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-gradient-hero relative">
          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-6"
            >
              {language === 'uz' && 'Imkoniyatlar'}
              {language === 'ru' && 'Возможности'}
              {language === 'en' && 'Opportunities'}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-primary-foreground/80 max-w-2xl mx-auto"
            >
              {language === 'uz' && 'Finlandiya ta\'lim moduli asosida kasbiy rivojlanish imkoniyatlari'}
              {language === 'ru' && 'Возможности профессионального развития на основе финской образовательной модели'}
              {language === 'en' && 'Professional development opportunities based on Finnish education model'}
            </motion.p>
          </div>
        </section>

        {/* Opportunities Grid */}
        <section className="section-padding relative z-10">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allOpportunities.map((opp, index) => {
                const IconComponent = getIcon(index);
                return (
                  <motion.div
                    key={opp.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="card-feature h-full group cursor-pointer overflow-hidden">
                      {/* Media Section */}
                      {opp.medias && opp.medias.length > 0 && (
                        <div className="relative">
                          {opp.medias.length === 1 ? (
                            renderMedia(opp.medias[0])
                          ) : (
                            <div className="grid grid-cols-2 gap-2 p-4">
                              {opp.medias.slice(0, 4).map((media, mediaIndex) => (
                                <div key={media.id} className="relative">
                                  {renderMedia(media)}
                                  {mediaIndex === 3 && opp.medias.length > 4 && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg">
                                      <span className="text-white font-semibold">
                                        +{opp.medias.length - 4}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {/* Media Count Badge */}
                          {opp.medias.length > 1 && (
                            <div className="absolute top-2 right-2">
                              <Badge variant="secondary" className="bg-black/60 text-white">
                                <Image className="h-3 w-3 mr-1" />
                                {opp.medias.length}
                              </Badge>
                            </div>
                          )}
                        </div>
                      )}

                      <CardHeader>
                        <div className="p-4 rounded-2xl bg-primary/10 w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                          <IconComponent className="h-8 w-8 text-primary" />
                        </div>
                        <CardTitle className="text-xl font-display">
                          {getLocalizedField(opp, 'title', language)}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col">
                        {/* Date Information */}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(opp.published_at)}
                          </div>
                          {opp.ends_at && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {language === 'uz' ? 'Tugaydi:' : language === 'ru' ? 'Заканчивается:' : 'Ends:'} {formatDate(opp.ends_at)}
                            </div>
                          )}
                        </div>

                        <p className="text-muted-foreground mb-6 flex-1 line-clamp-3">
                          {getLocalizedField(opp, 'description', language)}
                        </p>
                        
                        {/* Media Types Summary */}
                        {opp.medias && opp.medias.length > 0 && (
                          <div className="flex items-center gap-2 mb-4">
                            {Array.from(new Set(opp.medias.map(m => m.type))).map(type => {
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

                        <Link to={`/opportunities/${opp.id}`}>
                          <Button className="w-full">
                            {language === 'uz' && 'Batafsil'}
                            {language === 'ru' && 'Подробнее'}
                            {language === 'en' && 'Learn More'}
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    );
  }

  // Show specific opportunity details
  if (!opportunity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100/60 via-blue-50/40 to-indigo-100/50">
        <ParticleBackground />
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center backdrop-blur-sm bg-white/75 p-8 rounded-2xl border border-blue-200/40 shadow-lg">
            <p className="text-muted-foreground mb-4">Opportunity not found</p>
            <Link to="/opportunities">
              <Button>Back to Opportunities</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100/60 via-blue-50/40 to-indigo-100/50">
      <ParticleBackground />
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-hero relative">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <Link to="/opportunities" className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-6 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              {language === 'uz' && 'Imkoniyatlarga qaytish'}
              {language === 'ru' && 'Вернуться к возможностям'}
              {language === 'en' && 'Back to Opportunities'}
            </Link>
            
            <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-6">
              {getLocalizedField(opportunity, 'title', language)}
            </h1>
            
            <p className="text-xl text-primary-foreground/80 mb-8">
              {getLocalizedField(opportunity, 'description', language)}
            </p>

            <div className="flex flex-wrap gap-4">
              {opportunity.hours && (
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                  <Clock className="h-5 w-5 text-primary-foreground" />
                  <span className="text-primary-foreground font-medium">
                    {typeof opportunity.hours === 'number' 
                      ? `${opportunity.hours} ${language === 'uz' ? 'soat' : language === 'ru' ? 'часов' : 'hours'}`
                      : Array.isArray(opportunity.hours)
                      ? `${opportunity.hours.join(', ')} ${language === 'uz' ? 'soat' : language === 'ru' ? 'часов' : 'hours'}`
                      : '40 hours'
                    }
                  </span>
                </div>
              )}
              
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <Users className="h-5 w-5 text-primary-foreground" />
                <span className="text-primary-foreground font-medium">
                  {language === 'uz' && 'Sertifikat bilan'}
                  {language === 'ru' && 'С сертификатом'}
                  {language === 'en' && 'With Certificate'}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="section-padding relative z-10">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Media Gallery */}
              {opportunity.medias && opportunity.medias.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <h3 className="text-2xl font-display font-bold">
                    {language === 'uz' && 'Mediya fayllar'}
                    {language === 'ru' && 'Медиа файлы'}
                    {language === 'en' && 'Media Files'}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {opportunity.medias.map((media) => (
                      <div key={media.id} className="rounded-lg overflow-hidden">
                        {renderMedia(media)}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="prose prose-lg max-w-none"
              >
                <div className="text-foreground leading-relaxed whitespace-pre-line">
                  {getLocalizedField(opportunity, 'content', language)}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                {/* Opportunity Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="font-display">
                      {language === 'uz' && 'Ma\'lumotlar'}
                      {language === 'ru' && 'Информация'}
                      {language === 'en' && 'Information'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {language === 'uz' && 'Nashr etilgan'}
                          {language === 'ru' && 'Опубликовано'}
                          {language === 'en' && 'Published'}
                        </p>
                        <p className="font-medium">{formatDate(opportunity.published_at)}</p>
                      </div>
                      {opportunity.ends_at && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            {language === 'uz' && 'Tugash sanasi'}
                            {language === 'ru' && 'Дата окончания'}
                            {language === 'en' && 'End Date'}
                          </p>
                          <p className="font-medium">{formatDate(opportunity.ends_at)}</p>
                        </div>
                      )}
                      {opportunity.medias && opportunity.medias.length > 0 && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            {language === 'uz' && 'Mediya fayllar'}
                            {language === 'ru' && 'Медиа файлы'}
                            {language === 'en' && 'Media Files'}
                          </p>
                          <p className="font-medium">{opportunity.medias.length} {language === 'uz' ? 'ta fayl' : language === 'ru' ? 'файлов' : 'files'}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* CTA */}
                <Card className="bg-gradient-primary text-primary-foreground">
                  <CardContent className="pt-6">
                    <h3 className="font-display font-bold text-xl mb-4">
                      {language === 'uz' && 'Ro\'yxatdan o\'ting'}
                      {language === 'ru' && 'Зарегистрируйтесь'}
                      {language === 'en' && 'Register Now'}
                    </h3>
                    <p className="text-primary-foreground/80 mb-6">
                      {language === 'uz' && 'Kursga ro\'yxatdan o\'ting va kasbiy rivojlanish yo\'lingizni boshlang'}
                      {language === 'ru' && 'Зарегистрируйтесь на курс и начните свой путь профессионального развития'}
                      {language === 'en' && 'Register for the course and start your professional development journey'}
                    </p>
                    <Link to="/register">
                      <Button variant="secondary" className="w-full">
                        {language === 'uz' && 'Ro\'yxatdan o\'tish'}
                        {language === 'ru' && 'Регистрация'}
                        {language === 'en' && 'Register'}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}