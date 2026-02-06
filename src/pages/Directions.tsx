import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage, getLocalizedField } from '@/contexts/LanguageContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ParticleBackground } from '@/components/ParticleBackground';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GraduationCap, Users, BookOpen, Search, Filter } from 'lucide-react';
import { dataService, type Direction } from '@/services/dataService';
import { toast } from 'sonner';

export default function Directions() {
  const { t, language } = useLanguage();
  const [directions, setDirections] = useState<Direction[]>([]);
  const [filteredDirections, setFilteredDirections] = useState<Direction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('name');

  useEffect(() => {
    const loadDirections = async () => {
      try {
        const directionsData = await dataService.getDirections();
        setDirections(directionsData);
        setFilteredDirections(directionsData);
      } catch (error) {
        console.error('Failed to load directions:', error);
        toast.error('Failed to load directions');
      } finally {
        setIsLoading(false);
      }
    };
    loadDirections();
  }, []);

  useEffect(() => {
    let filtered = [...directions];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(direction =>
        getLocalizedField(direction, 'title', language).toLowerCase().includes(searchTerm.toLowerCase()) ||
        getLocalizedField(direction, 'description', language).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    if (sortBy === 'name') {
      filtered.sort((a, b) => 
        getLocalizedField(a, 'title', language).localeCompare(getLocalizedField(b, 'title', language))
      );
    } else if (sortBy === 'courses') {
      filtered.sort((a, b) => {
        const aCount = Array.isArray(a.courses) ? a.courses.length : 0;
        const bCount = Array.isArray(b.courses) ? b.courses.length : 0;
        return bCount - aCount;
      });
    }

    setFilteredDirections(filtered);
  }, [searchTerm, sortBy, directions, language]);

  const getIcon = (index: number) => {
    const icons = [Users, BookOpen, GraduationCap];
    return icons[index % icons.length];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100/60 via-blue-50/40 to-indigo-100/50">
        <ParticleBackground />
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center backdrop-blur-sm bg-white/75 p-8 rounded-2xl border border-blue-200/40 shadow-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading directions...</p>
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
            {t('nav.directions')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-primary-foreground/80 max-w-2xl mx-auto"
          >
            {language === 'uz' && "Ta'lim yo'nalishlari va kasbiy rivojlanish dasturlari"}
            {language === 'ru' && 'Образовательные направления и программы профессионального развития'}
            {language === 'en' && 'Educational directions and professional development programs'}
          </motion.p>
        </div>
      </section>

      {/* Directions Grid */}
      <section className="section-padding relative z-10">
        <div className="container mx-auto">
          {/* Filters */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder={language === 'uz' ? "Yo'nalishlarni qidirish..." : language === 'ru' ? 'Поиск направлений...' : 'Search directions...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/75 backdrop-blur-sm border-blue-200/40"
                />
              </div>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48 bg-white/75 backdrop-blur-sm border-blue-200/40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">
                    {language === 'uz' ? 'Nom bo\'yicha' : language === 'ru' ? 'По названию' : 'By Name'}
                  </SelectItem>
                  <SelectItem value="courses">
                    {language === 'uz' ? 'Kurslar soni' : language === 'ru' ? 'По количеству курсов' : 'By Courses Count'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Results count */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="h-4 w-4" />
              <span>
                {language === 'uz' && `${filteredDirections.length} ta yo'nalish topildi`}
                {language === 'ru' && `Найдено ${filteredDirections.length} направлений`}
                {language === 'en' && `Found ${filteredDirections.length} directions`}
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDirections.map((direction, index) => {
              const IconComponent = getIcon(index);
              return (
              <motion.div
                key={direction.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/courses?direction=${direction.id}`}>
                  <Card className="card-feature h-full hover-lift cursor-pointer">
                    <CardHeader>
                    <div className="p-4 rounded-2xl bg-primary/10 w-fit mb-4">
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-display">
                      {getLocalizedField(direction, 'title', language)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-6">
                      {getLocalizedField(direction, 'description', language)}
                    </p>
                    <div className="flex gap-6 text-sm">
                      <div>
                        <span className="text-2xl font-bold text-primary">
                          {Array.isArray(direction.courses) ? direction.courses.length : 0}
                        </span>
                        <span className="text-muted-foreground ml-2">
                          {language === 'uz' && 'kurslar'}
                          {language === 'ru' && 'курсов'}
                          {language === 'en' && 'courses'}
                        </span>
                      </div>
                      <div>
                        <span className="text-2xl font-bold text-primary">50+</span>
                        <span className="text-muted-foreground ml-2">
                          {language === 'uz' && 'tinglovchi'}
                          {language === 'ru' && 'слушателей'}
                          {language === 'en' && 'students'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
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
