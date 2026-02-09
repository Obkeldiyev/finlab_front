import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage, getLocalizedField } from '@/contexts/LanguageContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ParticleBackground } from '@/components/ParticleBackground';
import { VideoBackground } from '@/components/VideoBackground';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sticker } from '@/components/ui/sticker';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, Calendar, ArrowRight, Search, Filter } from 'lucide-react';
import { dataService, type Course, type Direction } from '@/services/dataService';
import { toast } from 'sonner';

export default function Courses() {
  const { t, language } = useLanguage();
  const [searchParams] = useSearchParams();
  const [courses, setCourses] = useState<Course[]>([]);
  const [directions, setDirections] = useState<Direction[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDirection, setSelectedDirection] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [coursesData, directionsData] = await Promise.all([
          dataService.getCourses(),
          dataService.getDirections()
        ]);
        setCourses(coursesData);
        setDirections(directionsData);
        setFilteredCourses(coursesData);
        
        // Check if there's a direction filter in URL
        const directionParam = searchParams.get('direction');
        if (directionParam) {
          setSelectedDirection(directionParam);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
        toast.error('Failed to load courses');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [searchParams]);

  useEffect(() => {
    let filtered = [...courses];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(course =>
        getLocalizedField(course, 'title', language).toLowerCase().includes(searchTerm.toLowerCase()) ||
        getLocalizedField(course, 'description', language).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by direction
    if (selectedDirection !== 'all') {
      filtered = filtered.filter(course => course.direction_id === parseInt(selectedDirection));
    }

    // Sort
    if (sortBy === 'date') {
      filtered.sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => 
        getLocalizedField(a, 'title', language).localeCompare(getLocalizedField(b, 'title', language))
      );
    }

    setFilteredCourses(filtered);
  }, [searchTerm, selectedDirection, sortBy, courses, language]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(language === 'ru' ? 'ru-RU' : language === 'uz' ? 'uz-UZ' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100/60 via-blue-50/40 to-indigo-100/50">
        <ParticleBackground />
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center backdrop-blur-sm bg-white/75 p-8 rounded-2xl border border-blue-200/40 shadow-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading courses...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100/60 via-blue-50/40 to-indigo-100/50">
      <ParticleBackground />
      <Navbar />

      {/* Hero with Video Background */}
      <section className="relative min-h-[70vh] flex items-center justify-center">
        <VideoBackground 
          videoSrc="/Comp 1ren.mp4"
          className="min-h-[70vh] flex items-center justify-center"
        >
          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-display font-bold text-white mb-6"
            >
              {t('courses.title')}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-white/90 max-w-2xl mx-auto"
            >
              {language === 'uz' && "Finlandiya ta'lim modeli asosida kasbiy rivojlanish kurslari"}
              {language === 'ru' && 'Курсы профессионального развития на основе финской модели образования'}
              {language === 'en' && 'Professional development courses based on Finnish education model'}
            </motion.p>
          </div>
        </VideoBackground>
      </section>

      {/* Courses List */}
      <section className="section-padding relative z-10">
        <div className="container mx-auto">
          {/* Filters */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder={language === 'uz' ? 'Kurslarni qidirish...' : language === 'ru' ? 'Поиск курсов...' : 'Search courses...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/75 backdrop-blur-sm border-blue-200/40"
                />
              </div>

              {/* Direction Filter */}
              <Select value={selectedDirection} onValueChange={setSelectedDirection}>
                <SelectTrigger className="w-full md:w-64 bg-white/75 backdrop-blur-sm border-blue-200/40">
                  <SelectValue placeholder={language === 'uz' ? "Yo'nalish" : language === 'ru' ? 'Направление' : 'Direction'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {language === 'uz' ? "Barcha yo'nalishlar" : language === 'ru' ? 'Все направления' : 'All Directions'}
                  </SelectItem>
                  {directions.map((direction) => (
                    <SelectItem key={direction.id} value={String(direction.id)}>
                      {getLocalizedField(direction, 'title', language)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48 bg-white/75 backdrop-blur-sm border-blue-200/40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">
                    {language === 'uz' ? 'Sana bo\'yicha' : language === 'ru' ? 'По дате' : 'By Date'}
                  </SelectItem>
                  <SelectItem value="name">
                    {language === 'uz' ? 'Nom bo\'yicha' : language === 'ru' ? 'По названию' : 'By Name'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Results count */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="h-4 w-4" />
              <span>
                {language === 'uz' && `${filteredCourses.length} ta kurs topildi`}
                {language === 'ru' && `Найдено ${filteredCourses.length} курсов`}
                {language === 'en' && `Found ${filteredCourses.length} courses`}
              </span>
            </div>
          </div>

          <div className="space-y-8">
            {filteredCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="card-feature overflow-hidden hover-lift hover-glow cursor-pointer group relative">
                  {/* Stickers */}
                  <div className="absolute top-4 right-4 z-10">
                    {index === 0 && <Sticker type="bestseller" size="md" />}
                    {index === 1 && <Sticker type="premium" size="md" />}
                    {index === 2 && <Sticker type="exclusive" size="md" />}
                    {index > 2 && index % 2 === 0 && <Sticker type="limited" size="md" />}
                    {index > 2 && index % 2 === 1 && <Sticker type="free" size="md" />}
                  </div>
                  
                  <div className="md:flex">
                    {/* Hours Badge */}
                    <div className="md:w-48 bg-gradient-primary p-6 flex flex-col items-center justify-center text-center group-hover:scale-105 transition-transform duration-300">
                      <div className="text-5xl font-bold text-primary-foreground">{course.hours || 40}</div>
                      <div className="text-primary-foreground/80">
                        {language === 'uz' ? 'soat' : language === 'ru' ? 'часов' : 'hours'}
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 p-6">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(course.start_date)}
                        </div>
                      </div>
                      
                      <CardTitle className="text-2xl font-display mb-3 group-hover:text-primary transition-colors duration-300">
                        {getLocalizedField(course, 'title', language)}
                      </CardTitle>
                      
                      {/* Sticker explanation based on index */}
                      {index === 0 && (
                        <div className="mb-3 p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                          <p className="text-sm text-red-800 font-medium">
                            {language === 'uz' && '🏆 Eng ko\'p sotilgan kurs! 1000+ muvaffaqiyatli bitiruvchi'}
                            {language === 'ru' && '🏆 Самый продаваемый курс! 1000+ успешных выпускников'}
                            {language === 'en' && '🏆 Best-selling course! 1000+ successful graduates'}
                          </p>
                        </div>
                      )}
                      
                      {index === 1 && (
                        <div className="mb-3 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                          <p className="text-sm text-yellow-800 font-medium">
                            {language === 'uz' && '💎 Premium kurs - individual mentorlik bilan'}
                            {language === 'ru' && '💎 Премиум курс - с индивидуальным менторством'}
                            {language === 'en' && '💎 Premium course - with individual mentorship'}
                          </p>
                        </div>
                      )}
                      
                      {index === 2 && (
                        <div className="mb-3 p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                          <p className="text-sm text-purple-800 font-medium">
                            {language === 'uz' && '🌟 Eksklyuziv dastur - faqat bizda mavjud'}
                            {language === 'ru' && '🌟 Эксклюзивная программа - доступна только у нас'}
                            {language === 'en' && '🌟 Exclusive program - available only here'}
                          </p>
                        </div>
                      )}
                      
                      <p className="text-muted-foreground mb-4 group-hover:text-foreground transition-colors duration-300">
                        {getLocalizedField(course, 'description', language)}
                      </p>
                      
                      {/* Additional benefits based on sticker */}
                      <div className="mb-4 space-y-1">
                        {index === 0 && (
                          <>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                              {language === 'uz' && '98% ishga joylashish kafolati'}
                              {language === 'ru' && '98% гарантия трудоустройства'}
                              {language === 'en' && '98% job placement guarantee'}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                              {language === 'uz' && 'Davlat sertifikati + xalqaro sertifikat'}
                              {language === 'ru' && 'Государственный + международный сертификат'}
                              {language === 'en' && 'State + international certificate'}
                            </div>
                          </>
                        )}
                        
                        {index === 1 && (
                          <>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                              {language === 'uz' && '1:1 shaxsiy mentor bilan ishlash'}
                              {language === 'ru' && 'Работа с персональным ментором 1:1'}
                              {language === 'en' && '1:1 personal mentor sessions'}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                              {language === 'uz' && 'Finlandiyaga sayohat imkoniyati'}
                              {language === 'ru' && 'Возможность поездки в Финляндию'}
                              {language === 'en' && 'Opportunity to visit Finland'}
                            </div>
                          </>
                        )}
                        
                        {index === 2 && (
                          <>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                              {language === 'uz' && 'Finlandiya universitetlari bilan hamkorlik'}
                              {language === 'ru' && 'Партнерство с университетами Финляндии'}
                              {language === 'en' && 'Partnership with Finnish universities'}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                              {language === 'uz' && 'Maxsus laboratoriya jihozlari'}
                              {language === 'ru' && 'Специальное лабораторное оборудование'}
                              {language === 'en' && 'Special laboratory equipment'}
                            </div>
                          </>
                        )}
                      </div>
                      
                      <Link to="/register">
                        <Button className="hover-gradient group-hover:scale-105 transition-transform duration-300">
                          {language === 'uz' ? "Ro'yxatdan o'tish" : language === 'ru' ? 'Записаться' : 'Enroll'}
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </Button>
                      </Link>
                    </div>
                  </div>
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