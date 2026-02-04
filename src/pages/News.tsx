import { motion } from 'framer-motion';
import { useLanguage, getLocalizedField } from '@/contexts/LanguageContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ParticleBackground } from '@/components/ParticleBackground';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

const mockNews = [
  {
    id: 1,
    title_uz: 'Yangi akademik yil boshlandi',
    title_ru: 'Начался новый учебный год',
    title_en: 'New Academic Year Started',
    content_uz: "FinLab da yangi akademik yil boshlandi. 2026-yil fevral oyidan boshlab barcha yo'nalishlar bo'yicha kurslar ochilmoqda.",
    content_ru: 'В FinLab начался новый учебный год. С февраля 2026 года открываются курсы по всем направлениям.',
    content_en: 'New academic year has started at FinLab. Courses in all directions are opening from February 2026.',
    published_at: '2026-02-01',
    image: null
  },
  {
    id: 2,
    title_uz: 'Finlandiya delegatsiyasi tashrifi',
    title_ru: 'Визит делегации из Финляндии',
    title_en: 'Visit of Finnish Delegation',
    content_uz: "Finlandiya ta'lim vazirligi delegatsiyasi laboratoriyamizga tashrif buyurdi va hamkorlik to'g'risida muzokaralar olib borildi.",
    content_ru: 'Делегация Министерства образования Финляндии посетила нашу лабораторию и провела переговоры о сотрудничестве.',
    content_en: 'A delegation from the Finnish Ministry of Education visited our laboratory and held cooperation talks.',
    published_at: '2026-01-25',
    image: null
  },
  {
    id: 3,
    title_uz: 'VR/AR texnologiyalari bo\'yicha seminar',
    title_ru: 'Семинар по VR/AR технологиям',
    title_en: 'VR/AR Technologies Seminar',
    content_uz: "Laboratoriyada virtual va kengaytirilgan reallik texnologiyalari bo'yicha amaliy seminar o'tkazildi.",
    content_ru: 'В лаборатории прошел практический семинар по технологиям виртуальной и дополненной реальности.',
    content_en: 'A practical seminar on virtual and augmented reality technologies was held at the laboratory.',
    published_at: '2026-01-18',
    image: null
  },
  {
    id: 4,
    title_uz: 'STEAM metodikasi bo\'yicha trening',
    title_ru: 'Тренинг по методике STEAM',
    title_en: 'STEAM Methodology Training',
    content_uz: "Pedagoglar uchun STEAM yondashuvi va loyihaga asoslangan o'qitish bo'yicha trening tashkil etildi.",
    content_ru: 'Для педагогов был организован тренинг по STEAM-подходу и проектному обучению.',
    content_en: 'A training on STEAM approach and project-based learning was organized for educators.',
    published_at: '2026-01-10',
    image: null
  },
];

export default function News() {
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
            {t('news.title')}
          </motion.h1>
        </div>
      </section>

      {/* News Grid */}
      <section className="section-padding relative z-10">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {mockNews.map((news, index) => (
              <motion.div
                key={news.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="card-feature h-full">
                  <CardHeader>
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(news.published_at)}
                    </div>
                    <CardTitle className="text-xl font-display">
                      {getLocalizedField(news, 'title', language)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {getLocalizedField(news, 'content', language)}
                    </p>
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
