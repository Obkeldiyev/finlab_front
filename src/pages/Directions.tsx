import { motion } from 'framer-motion';
import { useLanguage, getLocalizedField } from '@/contexts/LanguageContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ParticleBackground } from '@/components/ParticleBackground';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Users, BookOpen } from 'lucide-react';

const mockDirections = [
  {
    id: 1,
    title_uz: "Maktabgacha ta'lim",
    title_ru: 'Дошкольное образование',
    title_en: 'Preschool Education',
    description_uz: "Maktabgacha ta'lim bosqichida Finlandiya metodikasi asosida innovatsion yondashuvlar va zamonaviy o'qitish usullari.",
    description_ru: 'Инновационные подходы и современные методы обучения на основе финской методологии в дошкольном образовании.',
    description_en: 'Innovative approaches and modern teaching methods based on Finnish methodology in preschool education.',
    icon: Users,
    courses: 3,
    students: 150
  },
  {
    id: 2,
    title_uz: "Umumiy o'rta ta'lim",
    title_ru: 'Общее среднее образование',
    title_en: 'General Secondary Education',
    description_uz: "O'rta maktab o'qituvchilari uchun pedagogik texnologiyalar va STEAM yondashuvi bo'yicha kurslar.",
    description_ru: 'Курсы по педагогическим технологиям и STEAM-подходу для учителей средних школ.',
    description_en: 'Courses on pedagogical technologies and STEAM approach for secondary school teachers.',
    icon: BookOpen,
    courses: 5,
    students: 280
  },
  {
    id: 3,
    title_uz: "Oliy ta'lim",
    title_ru: 'Высшее образование',
    title_en: 'Higher Education',
    description_uz: "Oliy ta'lim muassasalari o'qituvchilari uchun ilmiy-pedagogik malaka oshirish dasturlari.",
    description_ru: 'Программы научно-педагогического повышения квалификации для преподавателей высших учебных заведений.',
    description_en: 'Scientific-pedagogical professional development programs for higher education faculty.',
    icon: GraduationCap,
    courses: 4,
    students: 200
  },
];

export default function Directions() {
  const { t, language } = useLanguage();

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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockDirections.map((direction, index) => (
              <motion.div
                key={direction.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="card-feature h-full">
                  <CardHeader>
                    <div className="p-4 rounded-2xl bg-primary/10 w-fit mb-4">
                      <direction.icon className="h-8 w-8 text-primary" />
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
                        <span className="text-2xl font-bold text-primary">{direction.courses}</span>
                        <span className="text-muted-foreground ml-2">
                          {language === 'uz' && 'kurslar'}
                          {language === 'ru' && 'курсов'}
                          {language === 'en' && 'courses'}
                        </span>
                      </div>
                      <div>
                        <span className="text-2xl font-bold text-primary">{direction.students}+</span>
                        <span className="text-muted-foreground ml-2">
                          {language === 'uz' && 'tinglovchi'}
                          {language === 'ru' && 'слушателей'}
                          {language === 'en' && 'students'}
                        </span>
                      </div>
                    </div>
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
