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
  Play,
  TrendingUp,
  Star,
  Target,
  FileText,
  Microscope,
  BookMarked,
  Building
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLanguage, getLocalizedField } from '@/contexts/LanguageContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AdaptiveParticleBackground } from '@/components/AdaptiveParticleBackground';
import { VideoBackground } from '@/components/VideoBackground';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sticker } from '@/components/ui/sticker';
import { opportunities as opportunitiesData } from '@/data/opportunities';
import { OpportunityDialog } from '@/components/OpportunityDialog';
import { dataService, type Course } from '@/services/dataService';
import { api } from '@/services/api';
import { toast } from 'sonner';
import { FeedbackSection } from '@/components/FeedbackSection';
import { PartnersCarousel } from '@/components/PartnersCarousel';
import { AnnouncementsSection } from '@/components/AnnouncementsSection';

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

// Counter animation hook - Fixed version
const useCounter = (end: number, duration: number = 2000, start: number = 0) => {
  const [count, setCount] = useState(start);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Use easeOutCubic for smoother animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentCount = Math.floor(easeOutCubic * (end - start) + start);

      setCount(currentCount);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end); // Ensure we end at the exact target
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration, start, isVisible]);

  return { count, setIsVisible };
};

export default function Index() {
  const { t, language } = useLanguage();
  const [selectedOpportunity, setSelectedOpportunity] = useState<typeof opportunitiesData[0] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [directions, setDirections] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [isLoadingPartners, setIsLoadingPartners] = useState(true);
  const [isLoadingDirections, setIsLoadingDirections] = useState(true);

  // Load courses from backend
  useEffect(() => {
    const loadCourses = async () => {
      try {
        const coursesData = await dataService.getCourses();
        const validCourses = (coursesData || []).filter(c => c != null);
        setCourses(validCourses.slice(0, 3)); // Show only first 3 courses
      } catch (error) {
        console.error('Failed to load courses:', error);
        toast.error('Failed to load courses');
        setCourses([]); // Set empty array on error
      } finally {
        setIsLoadingCourses(false);
      }
    };
    loadCourses();
  }, []);

  // Load directions from backend
  useEffect(() => {
    const loadDirections = async () => {
      try {
        const directionsData = await dataService.getDirections();
        const validDirections = (directionsData || []).filter(d => d != null);
        setDirections(validDirections.slice(0, 3)); // Show only first 3 directions
      } catch (error) {
        console.error('Failed to load directions:', error);
        toast.error('Failed to load directions');
        setDirections([]); // Set empty array on error
      } finally {
        setIsLoadingDirections(false);
      }
    };
    loadDirections();
  }, []);

  // Load partners from backend
  useEffect(() => {
    const loadPartners = async () => {
      try {
        const response = await api.getPartners();
        if (response.success) {
          setPartners(response.data);
        }
      } catch (error) {
        console.error('Failed to load partners:', error);
        setPartners([]);
      } finally {
        setIsLoadingPartners(false);
      }
    };
    loadPartners();
  }, []);

  const handleOpportunityClick = (opportunity: typeof opportunitiesData[0]) => {
    setSelectedOpportunity(opportunity);
    setIsDialogOpen(true);
  };

  // StatCard component with animation - Fixed version with fallback
  const StatCard = ({ stat, index }: { stat: any, index: number }) => {
    const { count, setIsVisible } = useCounter(stat.value, 1500 + index * 300);
    const [hasTriggered, setHasTriggered] = useState(false);
    const IconComponent = stat.icon;

    // Fallback trigger after component mounts
    useEffect(() => {
      const timer = setTimeout(() => {
        if (!hasTriggered) {
          setIsVisible(true);
          setHasTriggered(true);
        }
      }, 1000 + index * 200);

      return () => clearTimeout(timer);
    }, [hasTriggered, index, setIsVisible]);

    return (
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.8 }}
        whileInView={{
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration: 0.6,
            delay: index * 0.1,
            type: "spring",
            stiffness: 100
          }
        }}
        viewport={{ once: true, margin: "-50px" }}
        onViewportEnter={() => {
          if (!hasTriggered) {
            setIsVisible(true);
            setHasTriggered(true);
          }
        }}
        className="group"
      >
        <Card className="text-center hover-lift hover-glow cursor-pointer group relative overflow-hidden h-full border-2 border-slate-200 hover:border-primary shadow-xl bg-white transition-all duration-300">
          {/* Animated background gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-all duration-500`} />

          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <CardContent className="pt-6 pb-6 px-6 relative z-10">
            {/* Icon with animated background */}
            <div className="mb-4 flex justify-center">
              <div className={`relative p-4 rounded-2xl bg-gradient-to-br ${stat.color} group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                <IconComponent className="h-8 w-8 text-white relative z-10" />
                {/* Glow effect */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.color} blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300`} />
              </div>
            </div>

            {/* Animated Counter with enhanced styling */}
            <div className="mb-3 relative">
              <div className="flex items-center justify-center">
                <span className="text-4xl md:text-5xl font-bold text-primary group-hover:scale-110 transition-transform duration-300 inline-block relative">
                  {count}
                  {/* Number glow effect */}
                  <span className="absolute inset-0 text-4xl md:text-5xl font-bold text-primary blur-sm opacity-0 group-hover:opacity-30 transition-opacity duration-300">
                    {count}
                  </span>
                </span>
                <span className="text-2xl md:text-3xl font-bold text-primary/70 ml-1 group-hover:text-primary transition-colors duration-300">
                  {stat.suffix}
                </span>
              </div>

              {/* Progress bar animation */}
              <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 + 0.5, duration: 1.5, ease: "easeOut" }}
                  className={`h-full bg-gradient-to-r ${stat.color} rounded-full`}
                />
              </div>
            </div>

            {/* Label with enhanced typography */}
            <div className="text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
              {getLocalizedField(stat, 'label', language)}
            </div>

            {/* Description with better spacing */}
            <div className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors duration-300">
              {getLocalizedField(stat, 'description', language)}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

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
    {
      value: 250,
      suffix: '+',
      label: { uz: 'Ilmiy ishlar', ru: 'Научных работ', en: 'Research Papers' },
      description: {
        uz: 'Nashr etilgan va amaliyotga joriy etilgan ilmiy-metodik ishlar soni',
        ru: 'Количество опубликованных и внедренных научно-методических работ',
        en: 'Number of published and implemented scientific-methodological works'
      },
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-500',
      sticker: 'popular'
    },
    {
      value: 500,
      suffix: '+',
      label: { uz: 'Bitiruvchilar', ru: 'Выпускников', en: 'Graduates' },
      description: {
        uz: 'Muvaffaqiyatli tugatgan va ishga joylashgan bitiruvchilar soni',
        ru: 'Количество успешно окончивших и трудоустроенных выпускников',
        en: 'Number of successfully graduated and employed alumni'
      },
      icon: Users,
      color: 'from-green-500 to-emerald-500',
      sticker: 'bestseller'
    },
    {
      value: 15,
      suffix: '+',
      label: { uz: "Xorijiy hamkorlar", ru: 'Иностранных партнеров', en: 'Foreign Partners' },
      description: {
        uz: 'Finlandiya va boshqa Yevropa davlatlari bilan hamkorlik',
        ru: 'Сотрудничество с Финляндией и другими европейскими странами',
        en: 'Partnerships with Finland and other European countries'
      },
      icon: Globe,
      color: 'from-purple-500 to-pink-500',
      sticker: 'exclusive'
    },
    {
      value: 10,
      suffix: '+',
      label: { uz: "Yillik tajriba", ru: 'Лет опыта', en: 'Years Experience' },
      description: {
        uz: 'Zamonaviy ta\'lim texnologiyalari sohasidagi tajriba',
        ru: 'Опыт в области современных образовательных технологий',
        en: 'Experience in modern educational technologies'
      },
      icon: Award,
      color: 'from-orange-500 to-red-500',
      sticker: 'premium'
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section - Video (Full viewport) */}
      <section className="relative w-full overflow-hidden" style={{ height: '100vh', minHeight: '700px' }}>
        <VideoBackground
          videoSrc="/Comp 1.mp4"
          className="w-full h-full flex items-center justify-center"
        >
          <div className="w-full relative z-10 px-4 py-16 mt-16 md:mt-20">
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
                <span className="text-white/60 text-2xl">×</span>
                <span className="text-4xl">🇺🇿</span>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-6"
              >
                {t('hero.title')}
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-lg md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto"
              >
                {t('hero.subtitle')}
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Link to="/register">
                  <Button size="lg" className="btn-hero group bg-white text-primary hover:bg-white/90 hover-lift hover-glow">
                    {t('hero.cta')}
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300" />
                  </Button>
                </Link>
                <Link to="/directions">
                  <Button variant="outline" size="lg" className="btn-hero-outline border-white/30 text-white hover:bg-white/10 hover:border-white/50 hover-bounce">
                    <Play className="mr-2 h-5 w-5 group-hover:scale-125 transition-transform duration-300" />
                    {t('hero.learn_more')}
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Scroll indicator - More prominent */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30"
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-white/80 text-sm font-medium">
                {language === 'uz' && 'Pastga aylantiring'}
                {language === 'ru' && 'Прокрутите вниз'}
                {language === 'en' && 'Scroll down'}
              </span>
              <div className="w-6 h-10 rounded-full border-2 border-white/50 flex items-start justify-center p-2">
                <motion.div
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full bg-white/80"
                />
              </div>
            </div>
          </motion.div>
        </VideoBackground>
      </section>

      {/* Enhanced Stats Section - WHITE BACKGROUND with BLUE PARTICLES */}
      <section className="relative z-10 pt-16 pb-20 bg-white overflow-hidden">
        {/* Blue particles on white background */}
        <AdaptiveParticleBackground color="white" />

        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />

        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-medium mb-4">
              <Star className="h-4 w-4" />
              <span>
                {language === 'uz' && 'Bizning natijalarimiz'}
                {language === 'ru' && 'Наши результаты'}
                {language === 'en' && 'Our Results'}
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              {language === 'uz' && 'Raqamlar orqasidagi muvaffaqiyat'}
              {language === 'ru' && 'Успех за цифрами'}
              {language === 'en' && 'Success Behind Numbers'}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {language === 'uz' && 'Har bir raqam bizning mehnat va sadoqatimizning natijasidir'}
              {language === 'ru' && 'Каждая цифра - результат нашего труда и преданности'}
              {language === 'en' && 'Every number represents our dedication and hard work'}
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <StatCard key={index} stat={stat} index={index} />
            ))}
          </div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="text-center"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full text-white shadow-lg">
                <TrendingUp className="h-5 w-5" />
                <span className="font-medium">
                  {language === 'uz' && 'Har yili 25% o\'sish'}
                  {language === 'ru' && 'Рост 25% ежегодно'}
                  {language === 'en' && '25% annual growth'}
                </span>
              </div>

              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full text-white shadow-lg">
                <Target className="h-5 w-5" />
                <span className="font-medium">
                  {language === 'uz' && '98% mamnunlik darajasi'}
                  {language === 'ru' && '98% удовлетворенности'}
                  {language === 'en' && '98% satisfaction rate'}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Announcements Section */}
      <AnnouncementsSection />

      {/* About Section - BLUE BACKGROUND with WHITE PARTICLES */}
      <section className="section-padding relative z-10 bg-gradient-to-br from-primary via-primary/95 to-secondary overflow-hidden">
        {/* White particles on blue background */}
        <AdaptiveParticleBackground color="blue" />

        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-white font-medium mb-6">
                <BookOpen className="h-4 w-4" />
                <span>
                  {language === 'uz' && 'Bizning missiyamiz'}
                  {language === 'ru' && 'Наша миссия'}
                  {language === 'en' && 'Our Mission'}
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
                {t('about.title')}
              </h2>

              <div className="space-y-4 mb-8">
                <p className="text-lg text-white/90 leading-relaxed">
                  {t('about.description')}
                </p>

                <p className="text-base text-white/80 leading-relaxed">
                  {language === 'uz' && 'Bizning laboratoriyamiz Finlandiya Ta\'lim vazirligining rasmiy hamkorligi ostida faoliyat yuritadi va dunyodagi eng ilg\'or ta\'lim texnologiyalarini O\'zbekistonga olib keladi. Biz har bir o\'quvchining individual ehtiyojlarini hisobga olgan holda, zamonaviy VR/AR texnologiyalar, 3D printing va robototexnika orqali ta\'lim beramiz.'}
                  {language === 'ru' && 'Наша лаборатория работает под официальным партнерством Министерства образования Финляндии и привносит самые передовые образовательные технологии в Узбекистан. Мы обучаем с учетом индивидуальных потребностей каждого студента, используя современные VR/AR технологии, 3D-печать и робототехнику.'}
                  {language === 'en' && 'Our laboratory operates under the official partnership of the Finnish Ministry of Education and brings the most advanced educational technologies to Uzbekistan. We teach considering the individual needs of each student, using modern VR/AR technologies, 3D printing and robotics.'}
                </p>

                <p className="text-base text-white/80 leading-relaxed">
                  {language === 'uz' && 'Laboratoriyamizda o\'qituvchilar uchun maxsus malaka oshirish kurslari, talabalar uchun amaliy mashg\'ulotlar va tadqiqotchilar uchun ilmiy loyihalar amalga oshiriladi. Bizning maqsadimiz - O\'zbekiston ta\'lim tizimini jahon standartlariga moslashtirishdir.'}
                  {language === 'ru' && 'В нашей лаборатории проводятся специальные курсы повышения квалификации для учителей, практические занятия для студентов и научные проекты для исследователей. Наша цель - адаптировать систему образования Узбекистана к мировым стандартам.'}
                  {language === 'en' && 'Our laboratory conducts special professional development courses for teachers, practical sessions for students, and research projects for researchers. Our goal is to adapt Uzbekistan\'s education system to world standards.'}
                </p>
              </div>

              <div className="space-y-6 bg-white/5 p-6 rounded-2xl backdrop-blur-sm">
                {/* Item 1: Scientific and methodological activities */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0, duration: 0.5 }}
                  className="flex items-start gap-4 hover-lift cursor-pointer group p-6 rounded-xl bg-white/5 hover:bg-white/15 transition-all duration-300 border border-white/10"
                >
                  <div className="p-4 rounded-xl bg-white/30 group-hover:bg-white group-hover:scale-110 transition-all duration-300 flex-shrink-0 shadow-lg">
                    <BookOpen className="h-7 w-7 text-white group-hover:text-primary group-hover:rotate-12 transition-all duration-300" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-bold text-xl group-hover:translate-x-2 transition-all duration-300 block mb-3 drop-shadow-lg">
                      {language === 'uz' && "Ilmiy-metodik faoliyat"}
                      {language === 'ru' && 'Научно-методическая деятельность'}
                      {language === 'en' && 'Scientific and methodological activities'}
                    </h4>
                    <p className="text-lg text-white group-hover:text-white transition-colors duration-300 leading-relaxed drop-shadow-md">
                      {language === 'uz' && 'Zamonaviy ta\'lim metodlari va texnologiyalari'}
                      {language === 'ru' && 'Современные методы и технологии обучения'}
                      {language === 'en' && 'Modern teaching methods and technologies'}
                    </p>
                  </div>
                </motion.div>

                {/* Item 2: Professional development courses */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="flex items-start gap-4 hover-lift cursor-pointer group p-6 rounded-xl bg-white/5 hover:bg-white/15 transition-all duration-300 border border-white/10"
                >
                  <div className="p-4 rounded-xl bg-white/30 group-hover:bg-white group-hover:scale-110 transition-all duration-300 flex-shrink-0 shadow-lg">
                    <Users className="h-7 w-7 text-white group-hover:text-primary group-hover:rotate-12 transition-all duration-300" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-bold text-xl group-hover:translate-x-2 transition-all duration-300 block mb-3 drop-shadow-lg">
                      {language === 'uz' && 'Malaka oshirish kurslari'}
                      {language === 'ru' && 'Курсы повышения квалификации'}
                      {language === 'en' && 'Professional development courses'}
                    </h4>
                    <p className="text-lg text-white group-hover:text-white transition-colors duration-300 leading-relaxed drop-shadow-md">
                      {language === 'uz' && 'O\'qituvchilar uchun maxsus dasturlar'}
                      {language === 'ru' && 'Специальные программы для учителей'}
                      {language === 'en' && 'Special programs for teachers'}
                    </p>
                  </div>
                </motion.div>

                {/* Item 3: International cooperation */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="flex items-start gap-4 hover-lift cursor-pointer group p-6 rounded-xl bg-white/5 hover:bg-white/15 transition-all duration-300 border border-white/10"
                >
                  <div className="p-4 rounded-xl bg-white/30 group-hover:bg-white group-hover:scale-110 transition-all duration-300 flex-shrink-0 shadow-lg">
                    <Globe className="h-7 w-7 text-white group-hover:text-primary group-hover:rotate-12 transition-all duration-300" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-bold text-xl group-hover:translate-x-2 transition-all duration-300 block mb-3 drop-shadow-lg">
                      {language === 'uz' && 'Xalqaro hamkorlik'}
                      {language === 'ru' && 'Международное сотрудничество'}
                      {language === 'en' && 'International cooperation'}
                    </h4>
                    <p className="text-lg text-white group-hover:text-white transition-colors duration-300 leading-relaxed drop-shadow-md">
                      {language === 'uz' && 'Finlandiya va Yevropa universitetlari bilan'}
                      {language === 'ru' && 'С университетами Финляндии и Европы'}
                      {language === 'en' && 'With Finnish and European universities'}
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 gap-4"
            >
              <motion.img
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ duration: 0.3 }}
                src={gallery1}
                alt="Lab environment"
                className="rounded-2xl shadow-lg w-full h-48 object-cover hover:shadow-xl transition-shadow duration-300"
              />
              <motion.img
                whileHover={{ scale: 1.05, rotate: -2 }}
                transition={{ duration: 0.3 }}
                src={gallery2}
                alt="Lab workspace"
                className="rounded-2xl shadow-lg w-full h-48 object-cover mt-8 hover:shadow-xl transition-shadow duration-300"
              />
              <motion.img
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ duration: 0.3 }}
                src={gallery3}
                alt="Lab activities"
                className="rounded-2xl shadow-lg w-full h-48 object-cover -mt-4 hover:shadow-xl transition-shadow duration-300"
              />
              <motion.img
                whileHover={{ scale: 1.05, rotate: -2 }}
                transition={{ duration: 0.3 }}
                src={gallery4}
                alt="Lab technology"
                className="rounded-2xl shadow-lg w-full h-48 object-cover mt-4 hover:shadow-xl transition-shadow duration-300"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Finnish Education Model - BLUE BACKGROUND with WHITE PARTICLES */}
      <section className="section-padding relative z-10 bg-gradient-to-br from-primary via-primary/95 to-secondary overflow-hidden">
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
              {language === 'uz' && "Nima uchun aynan Finlandiya ta'lim modeli?"}
              {language === 'ru' && 'Почему именно финская модель образования?'}
              {language === 'en' && 'Why the Finnish Education Model?'}
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              {language === 'uz' && "Finlandiya ta'lim tizimi dunyodagi eng ilg'or va samarali modellardan biri hisoblanadi"}
              {language === 'ru' && 'Финская система образования считается одной из самых передовых и эффективных в мире'}
              {language === 'en' && 'The Finnish education system is considered one of the most advanced and effective in the world'}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Reason 1: Internationally Recognized */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-display font-bold text-foreground mb-4 text-center">
                {language === 'uz' && "Xalqaro tan olingan"}
                {language === 'ru' && 'Международно признанная'}
                {language === 'en' && 'Internationally Recognized'}
              </h3>
              <p className="text-muted-foreground text-center leading-relaxed">
                {language === 'uz' && "Finlandiya ta'lim modeli o'zining yuqori samaradorligi va barqaror natijalari bilan xalqaro miqyosda tan olingan. PISA testlari bo'yicha doimiy ravishda yuqori o'rinlarda turadi va dunyoning ko'plab mamlakatlari uchun namuna bo'lib xizmat qiladi."}
                {language === 'ru' && 'Финская модель образования признана на международном уровне благодаря своей высокой эффективности и стабильным результатам. Постоянно занимает высокие позиции по тестам PISA и служит образцом для многих стран мира.'}
                {language === 'en' && 'The Finnish education model is internationally recognized for its high efficiency and consistent results. It consistently ranks high in PISA tests and serves as a model for many countries around the world.'}
              </p>
            </motion.div>

            {/* Reason 2: Competency-Based Approach */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-display font-bold text-foreground mb-4 text-center">
                {language === 'uz' && "Kompetensiyaviy yondashuv"}
                {language === 'ru' && 'Компетентностный подход'}
                {language === 'en' && 'Competency-Based Approach'}
              </h3>
              <p className="text-muted-foreground text-center leading-relaxed">
                {language === 'uz' && "Finlandiya ta'limi kompetensiyaviy yondashuvga tayanadi, ya'ni o'quvchilar nafaqat bilim olishadi, balki real hayotda qo'llash uchun zarur bo'lgan ko'nikmalarni egallaydilar. Bu yondashuv o'quvchilarni kelajakdagi kasbiy faoliyatga tayyorlaydi."}
                {language === 'ru' && 'Финское образование основано на компетентностном подходе, то есть студенты не только получают знания, но и приобретают навыки, необходимые для применения в реальной жизни. Этот подход готовит студентов к будущей профессиональной деятельности.'}
                {language === 'en' && 'Finnish education is based on a competency-based approach, meaning students not only gain knowledge but also acquire skills necessary for real-life application. This approach prepares students for future professional activities.'}
              </p>
            </motion.div>

            {/* Reason 3: Phenomenon-Based Learning */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Lightbulb className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-display font-bold text-foreground mb-4 text-center">
                {language === 'uz' && "Fenomen asosida o'qitish"}
                {language === 'ru' && 'Феноменальное обучение'}
                {language === 'en' && 'Phenomenon-Based Learning'}
              </h3>
              <p className="text-muted-foreground text-center leading-relaxed">
                {language === 'uz' && "Mazkur modelda fenomen yondashuv muhim o'rin tutadi, ya'ni o'quvchilar real hayotdagi hodisalar va muammolarni o'rganish orqali bilim olishadi. Bu usul o'quvchilarning tanqidiy fikrlash va muammolarni hal qilish qobiliyatlarini rivojlantiradi."}
                {language === 'ru' && 'В данной модели феноменальный подход занимает важное место, то есть студенты получают знания через изучение реальных явлений и проблем. Этот метод развивает критическое мышление и способность решать проблемы.'}
                {language === 'en' && 'This model emphasizes phenomenon-based learning, where students gain knowledge by studying real-life phenomena and problems. This method develops critical thinking and problem-solving abilities.'}
              </p>
            </motion.div>

            {/* Reason 4: Trust and Freedom */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-display font-bold text-foreground mb-4 text-center">
                {language === 'uz' && "Ishonch va erkinlik"}
                {language === 'ru' && 'Доверие и свобода'}
                {language === 'en' && 'Trust and Freedom'}
              </h3>
              <p className="text-muted-foreground text-center leading-relaxed">
                {language === 'uz' && "Finlandiya ta'limi ishonch va erkinlik tamoyiliga asoslanadi. O'qituvchilarga yuqori darajada avtonomiya beriladi va o'quvchilar o'z ta'lim yo'llarini tanlashda erkinlikka ega. Bu yondashuv o'quvchilarning motivatsiyasini oshiradi va o'z-o'zini boshqarish ko'nikmalarini rivojlantiradi."}
                {language === 'ru' && 'Финское образование основано на принципах доверия и свободы. Учителям предоставляется высокая степень автономии, а студенты имеют свободу в выборе своего образовательного пути. Этот подход повышает мотивацию студентов и развивает навыки самоуправления.'}
                {language === 'en' && 'Finnish education is based on principles of trust and freedom. Teachers are given a high degree of autonomy, and students have freedom in choosing their educational path. This approach increases student motivation and develops self-management skills.'}
              </p>
            </motion.div>

            {/* Reason 5: Equality and Justice */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 md:col-span-2 lg:col-span-1"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-display font-bold text-foreground mb-4 text-center">
                {language === 'uz' && "Tenglik va adolat"}
                {language === 'ru' && 'Равенство и справедливость'}
                {language === 'en' && 'Equality and Justice'}
              </h3>
              <p className="text-muted-foreground text-center leading-relaxed">
                {language === 'uz' && "Finlandiya modeli tenglik va adolat tamoyillariga tayanadi. Barcha o'quvchilar ijtimoiy-iqtisodiy holatidan qat'i nazar, sifatli ta'lim olish imkoniyatiga ega. Bu yondashuv jamiyatda tenglik va adolatni ta'minlashga yordam beradi."}
                {language === 'ru' && 'Финская модель основана на принципах равенства и справедливости. Все студенты, независимо от социально-экономического положения, имеют возможность получить качественное образование. Этот подход способствует обеспечению равенства и справедливости в обществе.'}
                {language === 'en' && 'The Finnish model is based on principles of equality and justice. All students, regardless of socio-economic status, have the opportunity to receive quality education. This approach helps ensure equality and justice in society.'}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Finland Education Laboratory Video Section */}
      <section className="relative z-10 min-h-screen">
        <VideoBackground
          videoSrc="/Comp 1.mp4"
          posterSrc={gallery1}
          className="min-h-screen flex items-center"
        >
          <div className="container mx-auto px-4 py-20">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <div className="flex items-center justify-center gap-4 mb-8">
                <span className="text-5xl">🇫🇮</span>
                <GraduationCap className="h-12 w-12 text-white" />
                <span className="text-5xl">🔬</span>
              </div>

              <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
                {language === 'uz' && "Finlandiya Ta'lim Laboratoriyasi"}
                {language === 'ru' && 'Финская Образовательная Лаборатория'}
                {language === 'en' && 'Finland Education Laboratory'}
              </h2>

              <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
                {language === 'uz' && "Zamonaviy texnologiyalar va innovatsion ta'lim metodlari bilan jihozlangan laboratoriya"}
                {language === 'ru' && 'Лаборатория, оснащенная современными технологиями и инновационными методами обучения'}
                {language === 'en' && 'Laboratory equipped with modern technologies and innovative teaching methods'}
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-12">
                {[
                  {
                    icon: Cpu,
                    title: { uz: 'VR/AR Texnologiyalar', ru: 'VR/AR Технологии', en: 'VR/AR Technologies' },
                    desc: { uz: 'Virtual reallik tajribasi', ru: 'Опыт виртуальной реальности', en: 'Virtual reality experience' }
                  },
                  {
                    icon: Lightbulb,
                    title: { uz: '3D Printing', ru: '3D Печать', en: '3D Printing' },
                    desc: { uz: 'Prototiplash va dizayn', ru: 'Прототипирование и дизайн', en: 'Prototyping and design' }
                  },
                  {
                    icon: Award,
                    title: { uz: 'Robotika', ru: 'Робототехника', en: 'Robotics' },
                    desc: { uz: 'Programmalashtirish va avtomatlashtirish', ru: 'Программирование и автоматизация', en: 'Programming and automation' }
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2, duration: 0.6 }}
                    className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
                  >
                    <item.icon className="h-12 w-12 text-white mb-4 mx-auto" />
                    <h3 className="text-xl font-display font-semibold text-white mb-2">
                      {getLocalizedField(item, 'title', language)}
                    </h3>
                    <p className="text-white/80">
                      {getLocalizedField(item, 'desc', language)}
                    </p>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Link to="/gallery">
                  <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                    <Play className="mr-2 h-5 w-5" />
                    {language === 'uz' && 'Laboratoriyani ko\'ring'}
                    {language === 'ru' && 'Посмотреть лабораторию'}
                    {language === 'en' && 'Explore Laboratory'}
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="lg" className="text-lg px-8 py-6 bg-white text-primary hover:bg-white/90">
                    {t('hero.cta')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </VideoBackground>
      </section>

      {/* Opportunities Section - WHITE BACKGROUND with BLUE PARTICLES */}
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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-medium mb-4">
              <Lightbulb className="h-4 w-4" />
              <span>Imkoniyatlar</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Laboratoriya Imkoniyatlari
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Finlandiya ta'lim modeli asosida kasbiy rivojlanish uchun keng imkoniyatlar
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {opportunitiesData.map((opportunity, index) => {
              const icons = [GraduationCap, FileText, Microscope];
              const IconComponent = icons[index];
              const colors = [
                'from-blue-500 to-cyan-500',
                'from-green-500 to-emerald-500',
                'from-purple-500 to-pink-500'
              ];

              return (
                <motion.div
                  key={opportunity.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleOpportunityClick(opportunity)}
                  className="cursor-pointer"
                >
                  <Card className="h-full group hover:shadow-2xl transition-all duration-300 border-2 border-slate-200 hover:border-primary bg-white shadow-lg">
                    <CardContent className="pt-8 pb-6 px-6">
                      {/* Icon with gradient background */}
                      <div className="mb-6 flex justify-center">
                        <div className={`relative p-4 rounded-2xl bg-gradient-to-br ${colors[index]} group-hover:scale-110 transition-all duration-300 shadow-xl`}>
                          <IconComponent className="h-10 w-10 text-white relative z-10" />
                          {/* Glow effect */}
                          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${colors[index]} blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300`} />
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-display font-bold text-foreground mb-4 text-center group-hover:text-primary transition-colors duration-300">
                        {opportunity.title}
                      </h3>

                      {/* Short Description */}
                      <p className="text-sm text-muted-foreground leading-relaxed mb-6 text-center line-clamp-3">
                        {opportunity.shortDescription}
                      </p>

                      {/* Read More Button */}
                      <div className="flex justify-center">
                        <Button
                          variant="outline"
                          className="group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300 border-2"
                        >
                          Batafsil o'qish
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </Button>
                      </div>

                      {/* Decorative bottom line */}
                      <div className={`mt-6 h-1 bg-gradient-to-r ${colors[index]} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Opportunity Dialog */}
      <OpportunityDialog
        opportunity={selectedOpportunity}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />

      {/* Team Leadership Section - BLUE BACKGROUND with WHITE PARTICLES */}
      <section className="section-padding relative z-10 bg-gradient-to-br from-primary via-primary/95 to-secondary overflow-hidden">
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
              {language === 'uz' && 'Laboratoriya rahbariyati'}
              {language === 'ru' && 'Руководство лаборатории'}
              {language === 'en' && 'Laboratory Leadership'}
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              {language === 'uz' && 'Tajribali mutaxassislar va innovator olimlar jamoasi'}
              {language === 'ru' && 'Команда опытных специалистов и ученых-новаторов'}
              {language === 'en' && 'Team of experienced specialists and innovative scientists'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="card-feature overflow-hidden">
              <div className="md:flex">
                {/* Director Photo */}
                <div className="md:w-80 bg-gradient-primary flex items-center justify-center">
                  <img 
                    src="/photo_2026-02-16_10-55-13.jpg" 
                    alt="Supiyeva Buxolida Abduvaliyevna"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Director Info */}
                <div className="flex-1 p-8">
                  <h3 className="text-2xl font-display font-bold text-foreground mb-2">
                    Supiyeva Buxolida Abduvaliyevna
                  </h3>
                  <p className="text-primary font-semibold mb-4">
                    {language === 'uz' && 'Laboratoriya mudiri'}
                    {language === 'ru' && 'Директор лаборатории'}
                    {language === 'en' && 'Laboratory Director'}
                  </p>
                  <p className="text-muted-foreground mb-4 text-sm">
                    {language === 'uz' && 'Pedagogika fanlari bo\'yicha falsafa doktori (PhD), dotsent, shoira, O\'zbekiston Yozuvchilar uyushmasi a\'zosi'}
                    {language === 'ru' && 'Доктор философии (PhD) по педагогическим наукам, доцент, поэтесса, член Союза писателей Узбекистана'}
                    {language === 'en' && 'Doctor of Philosophy (PhD) in Pedagogical Sciences, Associate Professor, Poet, Member of the Writers\' Union of Uzbekistan'}
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-3">
                      <Award className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          {language === 'uz' && '250+ ilmiy-metodik ishlar'}
                          {language === 'ru' && '250+ научно-методических работ'}
                          {language === 'en' && '250+ scientific-methodological works'}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {language === 'uz' && 'Nashr etilgan va amaliyotga joriy etilgan'}
                          {language === 'ru' && 'Опубликованы и внедрены в практику'}
                          {language === 'en' && 'Published and implemented in practice'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Lightbulb className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          {language === 'uz' && 'O\'zbekistonda birinchi onlayn darslar muallifi (2011)'}
                          {language === 'ru' && 'Первый автор онлайн-уроков в Узбекистане (2011)'}
                          {language === 'en' && 'First author of online lessons in Uzbekistan (2011)'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <BookOpen className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          {language === 'uz' && 'Dunyoda birinchi QR-kodli she\'riy to\'plam muallifi (2019)'}
                          {language === 'ru' && 'Первый в мире автор поэтического сборника с QR-кодом (2019)'}
                          {language === 'en' && 'World\'s first author of QR-coded poetry collection (2019)'}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {language === 'uz' && '"Qalbim ko\'zgusi" - avangard elektron janr'}
                          {language === 'ru' && '"Зеркало моего сердца" - авангардный электронный жанр'}
                          {language === 'en' && '"Mirror of My Heart" - avant-garde electronic genre'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Cpu className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          {language === 'uz' && 'VR/AR texnologiyalarini ta\'limga joriy etish eksperti'}
                          {language === 'ru' && 'Эксперт по внедрению VR/AR технологий в образование'}
                          {language === 'en' && 'Expert in implementing VR/AR technologies in education'}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {language === 'uz' && 'Buyuk allomalar hayotini VR/AR orqali o\'rgatish'}
                          {language === 'ru' && 'Обучение жизни великих ученых через VR/AR'}
                          {language === 'en' && 'Teaching the lives of great scholars through VR/AR'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Link to="/team">
                    <Button variant="outline" className="w-full md:w-auto">
                      {language === 'uz' && 'Batafsil ma\'lumot'}
                      {language === 'ru' && 'Подробнее'}
                      {language === 'en' && 'Learn More'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Directions Section - WHITE BACKGROUND with BLUE PARTICLES */}
      <section className="section-padding relative z-10 bg-white overflow-hidden">
        {/* Blue particles on white background */}
        <AdaptiveParticleBackground color="white" />

        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-medium mb-4">
              <Building className="h-4 w-4" />
              <span>
                {language === 'uz' && "Ta'lim yo'nalishlari"}
                {language === 'ru' && 'Образовательные направления'}
                {language === 'en' && 'Educational Directions'}
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              {language === 'uz' && "Kasbiy rivojlanish yo'nalishlari"}
              {language === 'ru' && 'Направления профессионального развития'}
              {language === 'en' && 'Professional Development Directions'}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {language === 'uz' && "Turli sohalarda malaka oshirish uchun maxsus yo'nalishlar"}
              {language === 'ru' && 'Специальные направления для повышения квалификации в различных областях'}
              {language === 'en' && 'Special directions for professional development in various fields'}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {isLoadingDirections ? (
              <div className="col-span-3 text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">
                  {language === 'uz' && "Yo'nalishlar yuklanmoqda..."}
                  {language === 'ru' && 'Загрузка направлений...'}
                  {language === 'en' && 'Loading directions...'}
                </p>
              </div>
            ) : directions.length === 0 ? (
              <div className="col-span-3 text-center py-12">
                <Building className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {language === 'uz' && "Hozircha yo'nalishlar mavjud emas"}
                  {language === 'ru' && 'Направления пока недоступны'}
                  {language === 'en' && 'No directions available yet'}
                </p>
              </div>
            ) : (
              directions.filter(d => d != null).map((direction, index) => {
                const icons = [GraduationCap, BookOpen, Microscope];
                const IconComponent = icons[index % icons.length];
                return (
                  <motion.div
                    key={direction.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link to={`/courses?direction=${direction.id}`}>
                      <Card className="card-feature h-full hover-lift cursor-pointer group relative overflow-hidden border-2 border-slate-200 hover:border-primary shadow-lg bg-white transition-all duration-300">
                        {/* Stickers for directions */}
                        <div className="absolute top-4 right-4 z-10">
                          {index === 0 && <Sticker type="popular" size="md" />}
                          {index === 1 && <Sticker type="recommended" size="md" />}
                          {index === 2 && <Sticker type="new" size="md" />}
                        </div>

                        <CardContent className="pt-6">
                          <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                            <IconComponent className="h-8 w-8 text-primary" />
                          </div>

                          <h3 className="text-2xl font-display font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                            {direction ? getLocalizedField(direction, 'title', language) : 'Untitled'}
                          </h3>

                          <p className="text-muted-foreground mb-4 line-clamp-3 group-hover:text-foreground transition-colors duration-300">
                            {direction ? getLocalizedField(direction, 'description', language) : ''}
                          </p>

                          <div className="flex items-center justify-between pt-4 border-t border-border">
                            <div className="flex items-center gap-2">
                              <BookOpen className="h-5 w-5 text-primary" />
                              <span className="text-sm font-semibold text-primary">
                                {direction.courses?.length || 0} {language === 'uz' ? 'ta kurs' : language === 'ru' ? 'курсов' : 'courses'}
                              </span>
                            </div>
                            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-2 transition-all duration-300" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })
            )}
          </div>

          <div className="text-center">
            <Link to="/directions">
              <Button size="lg" className="hover-gradient group">
                {language === 'uz' && "Barcha yo'nalishlar"}
                {language === 'ru' && 'Все направления'}
                {language === 'en' && 'All Directions'}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Courses Section - WHITE BACKGROUND with BLUE PARTICLES */}
      <section className="section-padding relative z-10 bg-white overflow-hidden">
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
              {t('courses.title')}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {isLoadingCourses ? (
              <div className="col-span-3 text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">
                  {language === 'uz' && 'Kurslar yuklanmoqda...'}
                  {language === 'ru' && 'Загрузка курсов...'}
                  {language === 'en' && 'Loading courses...'}
                </p>
              </div>
            ) : courses.length === 0 ? (
              <div className="col-span-3 text-center py-12">
                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {language === 'uz' && 'Hozircha kurslar mavjud emas'}
                  {language === 'ru' && 'Курсы пока недоступны'}
                  {language === 'en' && 'No courses available yet'}
                </p>
              </div>
            ) : (
              courses.filter(c => c != null).map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full flex flex-col hover-lift hover-glow cursor-pointer group relative overflow-hidden border-2 border-slate-200 hover:border-primary shadow-lg bg-white transition-all duration-300">
                    {/* Stickers */}
                    <div className="absolute top-4 right-4 z-10">
                      {index === 0 && <Sticker type="popular" size="md" />}
                      {index === 1 && <Sticker type="recommended" size="md" />}
                      {index === 2 && <Sticker type="new" size="md" />}
                    </div>

                    <CardContent className="pt-6 flex-1 flex flex-col">
                      <div className="text-4xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform duration-300">
                        {course.hours || 40}
                        <span className="text-lg font-normal text-muted-foreground ml-2">
                          {t('courses.hours')}
                        </span>
                      </div>
                      <h3 className="text-xl font-display font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                        {course ? getLocalizedField(course, 'title', language) : 'Untitled Course'}
                      </h3>

                      {/* Sticker explanation text */}
                      {index === 0 && (
                        <div className="mb-3 p-2 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                          <p className="text-sm text-orange-800 font-medium">
                            {language === 'uz' && '🔥 Eng ko\'p tanlanadigan kurs! 500+ tinglovchi'}
                            {language === 'ru' && '🔥 Самый популярный курс! 500+ слушателей'}
                            {language === 'en' && '🔥 Most popular course! 500+ students enrolled'}
                          </p>
                        </div>
                      )}

                      {index === 1 && (
                        <div className="mb-3 p-2 bg-teal-50 rounded-lg border-l-4 border-teal-500">
                          <p className="text-sm text-teal-800 font-medium">
                            {language === 'uz' && '⭐ Ekspertlar tomonidan tavsiya etiladi'}
                            {language === 'ru' && '⭐ Рекомендовано экспертами'}
                            {language === 'en' && '⭐ Recommended by experts'}
                          </p>
                        </div>
                      )}

                      {index === 2 && (
                        <div className="mb-3 p-2 bg-green-50 rounded-lg border-l-4 border-green-500">
                          <p className="text-sm text-green-800 font-medium">
                            {language === 'uz' && '✨ Yangi dastur! 2024-yil uchun yangilangan'}
                            {language === 'ru' && '✨ Новая программа! Обновлено для 2024 года'}
                            {language === 'en' && '✨ New program! Updated for 2024'}
                          </p>
                        </div>
                      )}

                      <p className="text-muted-foreground mb-4 flex-1 group-hover:text-foreground transition-colors duration-300 line-clamp-4">
                        {course ? getLocalizedField(course, 'description', language) : ''}
                      </p>

                      {/* Course dates */}
                      <div className="mb-4 space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="w-2 h-2 bg-primary rounded-full"></span>
                          {language === 'uz' && `Boshlanish: ${new Date(course.start_date).toLocaleDateString()}`}
                          {language === 'ru' && `Начало: ${new Date(course.start_date).toLocaleDateString()}`}
                          {language === 'en' && `Starts: ${new Date(course.start_date).toLocaleDateString()}`}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="w-2 h-2 bg-primary rounded-full"></span>
                          {language === 'uz' && `Tugash: ${new Date(course.ends_at).toLocaleDateString()}`}
                          {language === 'ru' && `Окончание: ${new Date(course.ends_at).toLocaleDateString()}`}
                          {language === 'en' && `Ends: ${new Date(course.ends_at).toLocaleDateString()}`}
                        </div>
                        {course.direction && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="w-2 h-2 bg-primary rounded-full"></span>
                            {course.direction ? getLocalizedField(course.direction, 'title', language) : ''}
                          </div>
                        )}
                      </div>

                      <Link to="/register">
                        <Button className="w-full hover-gradient group-hover:scale-105 transition-transform duration-300">
                          {t('courses.enroll')}
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Gallery Preview - BLUE BACKGROUND with WHITE PARTICLES */}
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
              {t('gallery.title')}
            </h2>
            <p className="text-white/90">
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

      {/* Partners Section */}
      <section className="section-padding relative z-10 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              {language === 'uz' && 'Bizning Hamkorlarimiz'}
              {language === 'ru' && 'Наши Партнеры'}
              {language === 'en' && 'Our Partners'}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {language === 'uz' && 'Biz ishonchli tashkilotlar bilan hamkorlik qilamiz'}
              {language === 'ru' && 'Мы сотрудничаем с надежными организациями'}
              {language === 'en' && 'We partner with trusted organizations'}
            </p>
          </motion.div>

          <PartnersCarousel />
        </div>
      </section>

      {/* CTA Section - WHITE BACKGROUND with BLUE PARTICLES */}
      <section className="section-padding relative z-10 bg-white overflow-hidden">
        {/* Blue particles on white background */}
        <AdaptiveParticleBackground color="white" />

        <div className="container mx-auto relative z-10">
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

      {/* Feedback Section */}
      <FeedbackSection language={language} />

      <Footer />
    </div>
  );
}

