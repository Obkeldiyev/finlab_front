import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  GraduationCap, 
  Users, 
  Award, 
  Lightbulb,
  BookOpen,
  Cpu,
  Globe,
  Play
} from 'lucide-react';
import { useLanguage, getLocalizedField } from '@/contexts/LanguageContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ParticleBackground } from '@/components/ParticleBackground';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// Import gallery images
import gallery1 from '@/assets/gallery/gallery-1.jpg';
import gallery2 from '@/assets/gallery/gallery-2.jpg';
import gallery3 from '@/assets/gallery/gallery-3.jpg';
import gallery4 from '@/assets/gallery/gallery-4.jpg';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Index() {
  const { t, language } = useLanguage();

  const opportunities = [
    {
      icon: GraduationCap,
      title: { uz: '288 soatlik kurs', ru: '288-часовой курс', en: '288-hour course' },
      description: { 
        uz: "Xalqaro darajadagi malaka oshirish kursi Finlandiya ta'lim modeli asosida",
        ru: 'Международный курс повышения квалификации на основе финской модели образования',
        en: 'International qualification course based on Finnish education model'
      }
    },
    {
      icon: Lightbulb,
      title: { uz: 'STEAM yondashuvi', ru: 'STEAM подход', en: 'STEAM Approach' },
      description: {
        uz: "Loyiha asosida o'qitish va muammo asosida o'rganish metodologiyasi",
        ru: 'Методология обучения на основе проектов и проблемного обучения',
        en: 'Project-based learning and problem-based learning methodology'
      }
    },
    {
      icon: Cpu,
      title: { uz: 'VR/AR texnologiyalari', ru: 'VR/AR технологии', en: 'VR/AR Technologies' },
      description: {
        uz: 'Virtual va kengaytirilgan reallik texnologiyalari bilan amaliy mashg\'ulotlar',
        ru: 'Практические занятия с технологиями виртуальной и дополненной реальности',
        en: 'Hands-on practice with virtual and augmented reality technologies'
      }
    },
    {
      icon: Award,
      title: { uz: 'Xalqaro sertifikat', ru: 'Международный сертификат', en: 'International Certificate' },
      description: {
        uz: "Davlat namunasidagi attestat va xorijiy ta'lim tashkilotining sertifikati",
        ru: 'Государственный аттестат и сертификат иностранного образовательного учреждения',
        en: 'State diploma and certificate from foreign educational institution'
      }
    }
  ];

  const stats = [
    { value: '250+', label: { uz: 'Ilmiy ishlar', ru: 'Научных работ', en: 'Research Papers' } },
    { value: '500+', label: { uz: 'Bitiruvchilar', ru: 'Выпускников', en: 'Graduates' } },
    { value: '15+', label: { uz: "Xorijiy hamkorlar", ru: 'Иностранных партнеров', en: 'Foreign Partners' } },
    { value: '10+', label: { uz: "Yillik tajriba", ru: 'Лет опыта', en: 'Years Experience' } },
  ];

  const courses = [
    {
      hours: 288,
      title: { 
        uz: 'Malaka oshirish kursi', 
        ru: 'Курс повышения квалификации', 
        en: 'Professional Development Course' 
      },
      description: {
        uz: "144 soat laboratoriya, 72 soat xorijda, 72 soat to'g'ridan-to'g'ri ta'lim",
        ru: '144 часа в лаборатории, 72 часа за рубежом, 72 часа прямого обучения',
        en: '144 hours lab work, 72 hours abroad, 72 hours direct training'
      },
      features: ['STEAM', 'VR/AR', 'Robototexnika', 'Portfolio']
    },
    {
      hours: 72,
      title: { 
        uz: 'Qisqa muddatli kurs', 
        ru: 'Краткосрочный курс', 
        en: 'Short-term Course' 
      },
      description: {
        uz: "Finlandiya ta'lim modeli asosida intensiv kasbiy rivojlanish dasturi",
        ru: 'Интенсивная программа профессионального развития по финской модели',
        en: 'Intensive professional development program based on Finnish model'
      },
      features: ['3D printer', 'Digital Lab', 'Methodology']
    },
    {
      hours: 36,
      title: { 
        uz: 'Boshlang\'ich kurs', 
        ru: 'Начальный курс', 
        en: 'Introductory Course' 
      },
      description: {
        uz: "Finlandiya ta'lim tizimi asoslari bilan tanishish kursi",
        ru: 'Вводный курс по основам финской системы образования',
        en: 'Introduction to Finnish education system fundamentals'
      },
      features: ['Theory', 'Practice', 'Certificate']
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <ParticleBackground />
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-hero opacity-95" />
        
        <div className="container relative z-10 mx-auto px-4 py-20">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              variants={fadeInUp}
              className="flex items-center justify-center gap-4 mb-8"
            >
              <span className="text-4xl">🇫🇮</span>
              <span className="text-primary-foreground/60 text-2xl">×</span>
              <span className="text-4xl">🇺🇿</span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-primary-foreground mb-6"
            >
              {t('hero.title')}
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl text-primary-foreground/80 mb-12 max-w-2xl mx-auto"
            >
              {t('hero.subtitle')}
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/register">
                <Button size="lg" className="btn-hero group">
                  {t('hero.cta')}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/directions">
                <Button variant="outline" size="lg" className="btn-hero-outline">
                  <Play className="mr-2 h-5 w-5" />
                  {t('hero.learn_more')}
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-primary-foreground/60"
            />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 -mt-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {stats.map((stat, index) => (
              <Card key={index} className="card-elevated text-center">
                <CardContent className="pt-6">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {getLocalizedField(stat, 'label', language)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="section-padding relative z-10">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6">
                {t('about.title')}
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                {t('about.description')}
              </p>
              <div className="space-y-4">
                {[
                  { icon: BookOpen, text: { uz: "Finlandiya ta'lim modeli", ru: 'Финская модель образования', en: 'Finnish education model' } },
                  { icon: Users, text: { uz: 'Professional pedagoglar jamoasi', ru: 'Команда профессиональных педагогов', en: 'Team of professional educators' } },
                  { icon: Globe, text: { uz: 'Xalqaro hamkorlik', ru: 'Международное сотрудничество', en: 'International cooperation' } },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-accent">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-foreground font-medium">
                      {getLocalizedField(item, 'text', language)}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 gap-4"
            >
              <img
                src={gallery1}
                alt="Lab environment"
                className="rounded-2xl shadow-lg w-full h-48 object-cover"
              />
              <img
                src={gallery2}
                alt="Lab workspace"
                className="rounded-2xl shadow-lg w-full h-48 object-cover mt-8"
              />
              <img
                src={gallery3}
                alt="Lab activities"
                className="rounded-2xl shadow-lg w-full h-48 object-cover -mt-4"
              />
              <img
                src={gallery4}
                alt="Lab technology"
                className="rounded-2xl shadow-lg w-full h-48 object-cover mt-4"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Opportunities Section */}
      <section className="section-padding bg-accent/50 relative z-10">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              {t('opportunities.title')}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {opportunities.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="card-feature h-full">
                  <CardContent className="pt-6">
                    <div className="p-4 rounded-2xl bg-primary/10 w-fit mb-4">
                      <item.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-display font-semibold text-foreground mb-2">
                      {getLocalizedField(item, 'title', language)}
                    </h3>
                    <p className="text-muted-foreground">
                      {getLocalizedField(item, 'description', language)}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="section-padding relative z-10">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              {t('courses.title')}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="card-feature h-full flex flex-col">
                  <CardContent className="pt-6 flex-1 flex flex-col">
                    <div className="text-4xl font-bold text-primary mb-2">
                      {course.hours}
                      <span className="text-lg font-normal text-muted-foreground ml-2">
                        {t('courses.hours')}
                      </span>
                    </div>
                    <h3 className="text-xl font-display font-semibold text-foreground mb-3">
                      {getLocalizedField(course, 'title', language)}
                    </h3>
                    <p className="text-muted-foreground mb-4 flex-1">
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
                      <Button className="w-full">{t('courses.enroll')}</Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="section-padding bg-secondary relative z-10">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-secondary-foreground mb-4">
              {t('gallery.title')}
            </h2>
            <p className="text-secondary-foreground/80">
              {t('gallery.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[gallery1, gallery2, gallery3, gallery4].map((img, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative overflow-hidden rounded-xl aspect-square group"
              >
                <img
                  src={img}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors" />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-8"
          >
            <Link to="/gallery">
              <Button variant="secondary" size="lg">
                {t('gallery.title')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding relative z-10">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-primary rounded-3xl p-8 md:p-16 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-6">
              {language === 'uz' && "Kelajakdagi ta'limga qo'shiling!"}
              {language === 'ru' && 'Присоединяйтесь к образованию будущего!'}
              {language === 'en' && 'Join the education of the future!'}
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              {language === 'uz' && "Finlandiya ta'lim modeli asosida zamonaviy ko'nikmalarga ega bo'ling"}
              {language === 'ru' && 'Получите современные навыки на основе финской модели образования'}
              {language === 'en' && 'Gain modern skills based on the Finnish education model'}
            </p>
            <Link to="/register">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                {t('hero.cta')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
