import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage, getLocalizedField } from '@/contexts/LanguageContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ParticleBackground } from '@/components/ParticleBackground';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, ArrowRight } from 'lucide-react';

const mockCourses = [
  {
    id: 1,
    hours: 288,
    title_uz: 'Malaka oshirish kursi',
    title_ru: 'Курс повышения квалификации',
    title_en: 'Professional Development Course',
    description_uz: "Xalqaro darajadagi kasbiy rivojlanish kursi. 144 soat laboratoriya ishlari, 72 soat xorijda ta'lim va 72 soat to'g'ridan-to'g'ri mashg'ulotlar.",
    description_ru: 'Международный курс профессионального развития. 144 часа лабораторных работ, 72 часа обучения за рубежом и 72 часа прямых занятий.',
    description_en: 'International professional development course. 144 hours lab work, 72 hours training abroad, and 72 hours direct sessions.',
    direction_uz: "Maktabgacha ta'lim",
    direction_ru: 'Дошкольное образование',
    direction_en: 'Preschool Education',
    start_date: '2026-03-15',
    features: ['STEAM', 'VR/AR', 'Robototexnika', 'Portfolio', 'Sertifikat']
  },
  {
    id: 2,
    hours: 72,
    title_uz: 'Qisqa muddatli intensiv kurs',
    title_ru: 'Краткосрочный интенсивный курс',
    title_en: 'Short-term Intensive Course',
    description_uz: "Finlandiya ta'lim modeli asosida intensiv kasbiy rivojlanish dasturi. Amaliy mashg'ulotlar va loyiha ishlari.",
    description_ru: 'Интенсивная программа профессионального развития на основе финской модели образования. Практические занятия и проектная работа.',
    description_en: 'Intensive professional development program based on Finnish education model. Practical sessions and project work.',
    direction_uz: "Umumiy o'rta ta'lim",
    direction_ru: 'Общее среднее образование',
    direction_en: 'General Secondary Education',
    start_date: '2026-02-20',
    features: ['3D printer', 'Digital Lab', 'Methodology', 'Certificate']
  },
  {
    id: 3,
    hours: 36,
    title_uz: "Boshlang'ich tanishuv kursi",
    title_ru: 'Начальный ознакомительный курс',
    title_en: 'Introductory Course',
    description_uz: "Finlandiya ta'lim tizimi asoslari bilan tanishish. Nazariy bilimlar va amaliy ko'nikmalar.",
    description_ru: 'Знакомство с основами финской системы образования. Теоретические знания и практические навыки.',
    description_en: 'Introduction to Finnish education system fundamentals. Theoretical knowledge and practical skills.',
    direction_uz: "Oliy ta'lim",
    direction_ru: 'Высшее образование',
    direction_en: 'Higher Education',
    start_date: '2026-02-10',
    features: ['Theory', 'Practice', 'Certificate']
  },
];

export default function Courses() {
  const { t, language } = useLanguage();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(language === 'ru' ? 'ru-RU' : language === 'uz' ? 'uz-UZ' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
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
            {t('courses.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-primary-foreground/80 max-w-2xl mx-auto"
          >
            {language === 'uz' && "Finlandiya ta'lim modeli asosida kasbiy rivojlanish kurslari"}
            {language === 'ru' && 'Курсы профессионального развития на основе финской модели образования'}
            {language === 'en' && 'Professional development courses based on Finnish education model'}
          </motion.p>
        </div>
      </section>

      {/* Courses List */}
      <section className="section-padding relative z-10">
        <div className="container mx-auto">
          <div className="space-y-8">
            {mockCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="card-feature overflow-hidden">
                  <div className="md:flex">
                    {/* Hours Badge */}
                    <div className="md:w-48 bg-gradient-primary p-6 flex flex-col items-center justify-center text-center">
                      <div className="text-5xl font-bold text-primary-foreground">{course.hours}</div>
                      <div className="text-primary-foreground/80">{t('courses.hours')}</div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 p-6">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <Badge variant="secondary">
                          {getLocalizedField(course, 'direction', language)}
                        </Badge>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(course.start_date)}
                        </div>
                      </div>
                      
                      <CardTitle className="text-2xl font-display mb-3">
                        {getLocalizedField(course, 'title', language)}
                      </CardTitle>
                      
                      <p className="text-muted-foreground mb-4">
                        {getLocalizedField(course, 'description', language)}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-6">
                        {course.features.map((feature, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 text-sm rounded-full bg-accent text-accent-foreground"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                      
                      <Link to="/register">
                        <Button>
                          {t('courses.enroll')}
                          <ArrowRight className="ml-2 h-4 w-4" />
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
