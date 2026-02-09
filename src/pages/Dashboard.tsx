import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User,
  BookOpen,
  LogOut,
  Calendar,
  Award,
  Clock,
  ChevronRight,
  Menu,
  FileText,
  Building,
  GraduationCap,
  Star,
  TrendingUp,
  Users,
  Globe,
  Plus,
  Eye,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  Image,
  Video
} from 'lucide-react';
import { useLanguage, getLocalizedField } from '@/contexts/LanguageContext';
import { ParticleBackground } from '@/components/ParticleBackground';
import { CourseRegistration } from '@/components/CourseRegistration';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sticker } from '@/components/ui/sticker';
import { dataService, type User as UserType, type NewsItem, type Course, type Direction } from '@/services/dataService';
import { api } from '@/services/api';
import { toast } from 'sonner';

export default function Dashboard() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    courses: 0,
    directions: 0,
    news: 0,
    completedCourses: 0
  });
  const [latestNews, setLatestNews] = useState<NewsItem[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [availableDirections, setAvailableDirections] = useState<Direction[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await dataService.getUserProfile();
        setUser(userData);
        
        // Load dashboard data with error handling
        const [coursesData, directionsData, newsData] = await Promise.all([
          dataService.getCourses().catch(() => []),
          dataService.getDirections().catch(() => []),
          dataService.getNews().catch(() => [])
        ]);
        
        // Filter out any null/undefined items
        const validCourses = (coursesData || []).filter(c => c != null);
        const validDirections = (directionsData || []).filter(d => d != null);
        const validNews = (newsData || []).filter(n => n != null);
        
        setStats({
          courses: validCourses.length,
          directions: validDirections.length,
          news: validNews.length,
          completedCourses: 0 // This would come from user's progress data
        });
        
        setLatestNews(validNews);
        setAvailableCourses(validCourses);
        setAvailableDirections(validDirections);
        
      } catch (error) {
        console.error('Failed to load user data:', error);
        toast.error('Failed to load user data');
        // If user data fails to load, redirect to login
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };
    
    // Check if user is authenticated
    if (!api.isAuthenticated()) {
      navigate('/login');
      return;
    }
    
    loadUserData();
  }, [navigate]);

  // Helper function to safely get localized text
  const getLocalizedText = (item: any, field: string, lang: string): string => {
    if (!item) return '';
    
    const localizedValue = item[`${field}_${lang}`] || item[`${field}_en`] || '';
    
    // Ensure we return a string, not an object
    if (typeof localizedValue === 'string') {
      return localizedValue;
    } else if (typeof localizedValue === 'object' && localizedValue !== null) {
      // If it's an object, try to extract a string value
      return String(localizedValue);
    }
    
    return '';
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'enrolled':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'completed':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return language === 'uz' ? 'Faol' : language === 'ru' ? 'Активный' : 'Active';
      case 'enrolled':
        return language === 'uz' ? 'Ro\'yxatdan o\'tgan' : language === 'ru' ? 'Зарегистрирован' : 'Enrolled';
      case 'pending':
        return language === 'uz' ? 'Kutilmoqda' : language === 'ru' ? 'Ожидание' : 'Pending';
      case 'completed':
        return language === 'uz' ? 'Yakunlangan' : language === 'ru' ? 'Завершен' : 'Completed';
      default:
        return status || '';
    }
  };

  const refreshUserData = async () => {
    try {
      const userData = await dataService.getUserProfile();
      setUser(userData);
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };

  const handleLogout = () => {
    api.logout();
    navigate('/');
  };

  const navItems = [
    { 
      icon: User, 
      label: { uz: 'Umumiy ko\'rinish', ru: 'Обзор', en: 'Overview' }, 
      active: activeTab === 'overview',
      onClick: () => setActiveTab('overview'),
      description: { 
        uz: 'Shaxsiy profil, statistika va asosiy ma\'lumotlar', 
        ru: 'Личный профиль, статистика и основная информация', 
        en: 'Personal profile, statistics and main information' 
      }
    },
    { 
      icon: BookOpen, 
      label: { uz: 'Kurslar', ru: 'Курсы', en: 'Courses' }, 
      active: activeTab === 'courses',
      onClick: () => setActiveTab('courses'),
      description: { 
        uz: 'Barcha mavjud kurslar va ro\'yxatdan o\'tish imkoniyati', 
        ru: 'Все доступные курсы и возможность записи', 
        en: 'All available courses and enrollment opportunities' 
      }
    },
    { 
      icon: FileText, 
      label: { uz: 'Yangiliklar', ru: 'Новости', en: 'News' }, 
      active: activeTab === 'news',
      onClick: () => setActiveTab('news'),
      description: { 
        uz: 'So\'nggi yangiliklar, e\'lonlar va muhim xabarlar', 
        ru: 'Последние новости, объявления и важные сообщения', 
        en: 'Latest news, announcements and important messages' 
      }
    },
    { 
      icon: Building, 
      label: { uz: 'Yo\'nalishlar', ru: 'Направления', en: 'Directions' }, 
      active: activeTab === 'directions',
      onClick: () => setActiveTab('directions'),
      description: { 
        uz: 'Ta\'lim yo\'nalishlari va ixtisoslik sohalari', 
        ru: 'Образовательные направления и специализации', 
        en: 'Educational directions and specialization areas' 
      }
    },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <Link to="/" className="flex items-center gap-3">
          <img src="/main-logo.602cd3fa57577bd6675dd5cb6474efab.png" alt="FinLab" className="h-10 w-auto" />
          <span className="font-display text-xl font-bold text-primary">FinLab</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            className={`w-full flex flex-col gap-2 px-4 py-3 rounded-lg text-left transition-colors ${
              item.active
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-3">
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label[language] || item.label.en}</span>
            </div>
            <p className={`text-xs ml-8 ${item.active ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
              {item.description[language] || item.description.en}
            </p>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          {language === 'uz' ? 'Chiqish' : language === 'ru' ? 'Выход' : 'Logout'}
        </button>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100/60 via-blue-50/40 to-indigo-100/50">
        <ParticleBackground />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center backdrop-blur-sm bg-white/75 p-8 rounded-2xl border border-blue-200/40 shadow-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">
              {language === 'uz' ? 'Dashboard yuklanmoqda...' : language === 'ru' ? 'Загрузка панели...' : 'Loading dashboard...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100/60 via-blue-50/40 to-indigo-100/50">
        <ParticleBackground />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center backdrop-blur-sm bg-white/75 p-8 rounded-2xl border border-blue-200/40 shadow-lg">
            <p className="text-muted-foreground mb-4">
              {language === 'uz' ? 'Foydalanuvchi ma\'lumotlari yuklanmadi' : language === 'ru' ? 'Не удалось загрузить данные пользователя' : 'Failed to load user data'}
            </p>
            <Button onClick={() => navigate('/login')} className="mt-4">
              {language === 'uz' ? 'Tizimga kirish' : language === 'ru' ? 'Войти в систему' : 'Go to Login'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100/60 via-blue-50/40 to-indigo-100/50">
      <ParticleBackground />

      <div className="flex min-h-screen relative z-10">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 flex-col backdrop-blur-md bg-white/80 border-r border-blue-200/40 shadow-sm">
          <SidebarContent />
        </aside>

        {/* Mobile Sidebar */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="w-64 p-0 backdrop-blur-md bg-white/85">
            <SidebarContent />
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <main className="flex-1">
          {/* Header */}
          <header className="backdrop-blur-md bg-white/80 border-b border-blue-200/40 px-4 lg:px-8 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="lg:hidden">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                </Sheet>
                <div>
                  <h1 className="text-2xl font-display font-bold text-foreground">
                    {language === 'uz' ? 'Xush kelibsiz' : language === 'ru' ? 'Добро пожаловать' : 'Welcome'}, {user.first_name}!
                  </h1>
                  <p className="text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setActiveTab('courses')}
                  className="backdrop-blur-sm bg-white/60 hover:bg-white/80 border-blue-200/50"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {language === 'uz' ? 'Kursga yozilish' : language === 'ru' ? 'Записаться на курс' : 'Enroll in Course'}
                </Button>
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <div className="p-4 lg:p-8">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid md:grid-cols-4 gap-4">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className="backdrop-blur-sm bg-white/75 border-blue-200/40 shadow-md hover:shadow-lg transition-all">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-xl bg-blue-500/10">
                            <BookOpen className="h-6 w-6 text-blue-500" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              {language === 'uz' ? 'Mavjud kurslar' : language === 'ru' ? 'Доступные курсы' : 'Available Courses'}
                            </p>
                            <p className="text-2xl font-bold text-foreground">{String(stats.courses)}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <Card className="backdrop-blur-sm bg-white/70 border-white/20 shadow-lg hover:shadow-xl transition-all">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-xl bg-green-500/10">
                            <Building className="h-6 w-6 text-green-500" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              {language === 'uz' ? 'Yo\'nalishlar' : language === 'ru' ? 'Направления' : 'Directions'}
                            </p>
                            <p className="text-2xl font-bold text-foreground">{String(stats.directions)}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <Card className="backdrop-blur-sm bg-white/70 border-white/20 shadow-lg hover:shadow-xl transition-all">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-xl bg-orange-500/10">
                            <FileText className="h-6 w-6 text-orange-500" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              {language === 'uz' ? 'Yangiliklar' : language === 'ru' ? 'Новости' : 'News'}
                            </p>
                            <p className="text-2xl font-bold text-foreground">{String(stats.news)}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <Card className="backdrop-blur-sm bg-white/70 border-white/20 shadow-lg hover:shadow-xl transition-all">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-xl bg-purple-500/10">
                            <Award className="h-6 w-6 text-purple-500" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              {language === 'uz' ? 'Joriy kurs' : language === 'ru' ? 'Текущий курс' : 'Current Course'}
                            </p>
                            <p className="text-2xl font-bold text-foreground">
                              {user?.course ? getLocalizedText(user.course, 'title', language) : 
                                (language === 'uz' ? 'Tanlanmagan' : language === 'ru' ? 'Не выбран' : 'Not selected')
                              }
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                {/* User Profile Card */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                  <Card className="backdrop-blur-sm bg-white/75 border-blue-200/40 shadow-md">
                    <CardHeader>
                      <CardTitle className="font-display">
                        {language === 'uz' ? 'Profil ma\'lumotlari' : language === 'ru' ? 'Информация профиля' : 'Profile Information'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">
                              {language === 'uz' ? 'To\'liq ism' : language === 'ru' ? 'Полное имя' : 'Full Name'}
                            </p>
                            <p className="font-medium text-lg">
                              {user?.first_name} {user?.middle_name} {user?.last_name}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Email</p>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <p className="font-medium">{user?.email}</p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">
                              {language === 'uz' ? 'Telefon raqam' : language === 'ru' ? 'Номер телефона' : 'Phone Number'}
                            </p>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <p className="font-medium">{user?.phone_number}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">
                              {language === 'uz' ? 'Ro\'yxatdan o\'tgan sana' : language === 'ru' ? 'Дата регистрации' : 'Registration Date'}
                            </p>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <p className="font-medium">
                                {user?.created_at ? new Date(user.created_at).toLocaleDateString(
                                  language === 'ru' ? 'ru-RU' : language === 'uz' ? 'uz-UZ' : 'en-US'
                                ) : '-'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Quick Apply Section */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                  <Card className="bg-gradient-primary text-primary-foreground">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-display font-bold mb-2">
                            {user?.course ? 
                              (language === 'uz' ? 'Joriy kurs' : language === 'ru' ? 'Текущий курс' : 'Current Course') :
                              (language === 'uz' ? 'Kursga ro\'yxatdan o\'ting' : language === 'ru' ? 'Зарегистрируйтесь на курс' : 'Register for a Course')
                            }
                          </h3>
                          <p className="text-primary-foreground/90">
                            {user?.course ? 
                              `${getLocalizedText(user.course, 'title', language)} - ${getStatusText(user.status)}` :
                              (language === 'uz' ? 'Kurslardan birini tanlab ro\'yxatdan o\'ting' : language === 'ru' ? 'Выберите и зарегистрируйтесь на один из курсов' : 'Choose and register for one of our courses')
                            }
                          </p>
                        </div>
                        {!user?.course && (
                          <CourseRegistration onRegistrationSuccess={refreshUserData} />
                        )}
                        {user?.course && (
                          <Button 
                            variant="secondary" 
                            size="lg"
                            onClick={() => setActiveTab('courses')}
                          >
                            <Eye className="h-5 w-5 mr-2" />
                            {language === 'uz' ? 'Kurs tafsilotlari' : language === 'ru' ? 'Детали курса' : 'Course Details'}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            )}

            {/* Courses Tab */}
            {activeTab === 'courses' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-display font-bold">
                    {language === 'uz' ? 'Barcha kurslar' : language === 'ru' ? 'Все курсы' : 'All Courses'}
                  </h2>
                  <Badge variant="secondary">
                    {String(stats.courses)} {language === 'uz' ? 'kurs mavjud' : language === 'ru' ? 'курсов доступно' : 'courses available'}
                  </Badge>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {availableCourses.filter(c => c != null).map((course, index) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="h-full hover:shadow-lg transition-shadow backdrop-blur-sm bg-white/70 border-white/20 shadow-lg hover-lift hover-glow cursor-pointer group relative overflow-hidden">
                        {/* Stickers */}
                        <div className="absolute top-4 right-4 z-10">
                          {index === 0 && <Sticker type="popular" size="sm" />}
                          {index === 1 && <Sticker type="recommended" size="sm" />}
                          {index === 2 && <Sticker type="new" size="sm" />}
                          {index > 2 && index % 3 === 0 && <Sticker type="premium" size="sm" />}
                          {index > 2 && index % 3 === 1 && <Sticker type="limited" size="sm" />}
                          {index > 2 && index % 3 === 2 && <Sticker type="exclusive" size="sm" />}
                        </div>
                        
                        <CardHeader>
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline" className="group-hover:border-primary transition-colors duration-300">
                              <Clock className="h-3 w-3 mr-1" />
                              {String(course.hours || 0)} {language === 'uz' ? 'soat' : language === 'ru' ? 'часов' : 'hours'}
                            </Badge>
                            {user?.course_id === course.id ? (
                              <Badge variant="default" className="bg-green-500">
                                {language === 'uz' ? 'Ro\'yxatdan o\'tgan' : language === 'ru' ? 'Зарегистрирован' : 'Enrolled'}
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                {language === 'uz' ? 'Mavjud' : language === 'ru' ? 'Доступен' : 'Available'}
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
                            {getLocalizedText(course, 'title', language) || 'Untitled Course'}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col">
                          {/* Sticker explanation */}
                          {index === 0 && (
                            <div className="mb-3 p-2 bg-orange-50 rounded-lg border-l-2 border-orange-500">
                              <p className="text-xs text-orange-800 font-medium">
                                {language === 'uz' && '🔥 Eng mashhur tanlov - 500+ tinglovchi'}
                                {language === 'ru' && '🔥 Самый популярный выбор - 500+ слушателей'}
                                {language === 'en' && '🔥 Most popular choice - 500+ students'}
                              </p>
                            </div>
                          )}
                          
                          {index === 1 && (
                            <div className="mb-3 p-2 bg-teal-50 rounded-lg border-l-2 border-teal-500">
                              <p className="text-xs text-teal-800 font-medium">
                                {language === 'uz' && '⭐ Mutaxassislar tavsiyasi - yuqori sifat'}
                                {language === 'ru' && '⭐ Рекомендация специалистов - высокое качество'}
                                {language === 'en' && '⭐ Expert recommendation - high quality'}
                              </p>
                            </div>
                          )}
                          
                          {index === 2 && (
                            <div className="mb-3 p-2 bg-green-50 rounded-lg border-l-2 border-green-500">
                              <p className="text-xs text-green-800 font-medium">
                                {language === 'uz' && '✨ Yangi dastur - 2024 yil uchun'}
                                {language === 'ru' && '✨ Новая программа - для 2024 года'}
                                {language === 'en' && '✨ New program - for 2024'}
                              </p>
                            </div>
                          )}

                          <p className="text-muted-foreground mb-4 flex-1 group-hover:text-foreground transition-colors duration-300">
                            {getLocalizedText(course, 'description', language) || 'No description available'}
                          </p>
                          <div className="flex items-center gap-2 mb-4">
                            <Calendar className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                              {language === 'uz' ? 'Boshlanish:' : language === 'ru' ? 'Начало:' : 'Start:'} {course.start_date ? new Date(course.start_date).toLocaleDateString(
                                language === 'ru' ? 'ru-RU' : language === 'uz' ? 'uz-UZ' : 'en-US'
                              ) : 'TBA'}
                            </span>
                          </div>
                          {user?.course_id === course.id ? (
                            <Button className="w-full" disabled>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              {language === 'uz' ? "Ro'yxatdan o'tgan" : language === 'ru' ? 'Зарегистрирован' : 'Enrolled'}
                            </Button>
                          ) : (
                            <CourseRegistration onRegistrationSuccess={refreshUserData} />
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* News Tab */}
            {activeTab === 'news' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-display font-bold">
                    {language === 'uz' ? 'Barcha yangiliklar' : language === 'ru' ? 'Все новости' : 'All News'}
                  </h2>
                  <Badge variant="secondary">
                    {String(stats.news)} {language === 'uz' ? 'yangilik' : language === 'ru' ? 'новостей' : 'news items'}
                  </Badge>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {latestNews.map((newsItem, index) => (
                    <motion.div
                      key={newsItem.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden">
                        {/* Media Preview */}
                        {newsItem.medias && newsItem.medias.length > 0 && (
                          <div className="relative h-48">
                            {newsItem.medias[0].type === 'image' ? (
                              <img
                                src={`${import.meta.env.VITE_API_URL || '/api'}${newsItem.medias[0].url}`}
                                alt="News media"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            ) : newsItem.medias[0].type === 'video' ? (
                              <video
                                src={`${import.meta.env.VITE_API_URL || '/api'}${newsItem.medias[0].url}`}
                                className="w-full h-full object-cover"
                                muted
                                preload="metadata"
                              />
                            ) : (
                              <div className="w-full h-full bg-accent flex items-center justify-center">
                                <FileText className="h-12 w-12 text-muted-foreground" />
                              </div>
                            )}
                            
                            {newsItem.medias.length > 1 && (
                              <div className="absolute top-2 right-2">
                                <Badge variant="secondary" className="bg-black/60 text-white">
                                  +{newsItem.medias.length - 1}
                                </Badge>
                              </div>
                            )}
                          </div>
                        )}

                        <CardHeader>
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="h-4 w-4 text-primary" />
                            <span className="text-sm text-muted-foreground">
                              {newsItem.published_at ? new Date(newsItem.published_at).toLocaleDateString(
                                language === 'ru' ? 'ru-RU' : language === 'uz' ? 'uz-UZ' : 'en-US'
                              ) : 'No date'}
                            </span>
                          </div>
                          <CardTitle className="text-xl">
                            {getLocalizedText(newsItem, 'title', language) || 'Untitled'}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground line-clamp-3">
                            {getLocalizedText(newsItem, 'content', language) || 'No content available'}
                          </p>
                          
                          {/* Media Summary */}
                          {newsItem.medias && newsItem.medias.length > 0 && (
                            <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                              {Array.from(new Set(newsItem.medias.map(m => m.type))).map(type => (
                                <Badge key={type} variant="outline" className="text-xs">
                                  {type === 'image' && <Image className="h-3 w-3 mr-1" />}
                                  {type === 'video' && <Video className="h-3 w-3 mr-1" />}
                                  {type === 'file' && <FileText className="h-3 w-3 mr-1" />}
                                  {type === 'image' ? 
                                    (language === 'uz' ? 'Rasm' : language === 'ru' ? 'Изображение' : 'Image') :
                                    type === 'video' ?
                                    (language === 'uz' ? 'Video' : language === 'ru' ? 'Видео' : 'Video') :
                                    (language === 'uz' ? 'Fayl' : language === 'ru' ? 'Файл' : 'File')
                                  }
                                </Badge>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Directions Tab */}
            {activeTab === 'directions' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-display font-bold">
                    {language === 'uz' ? 'Ta\'lim yo\'nalishlari' : language === 'ru' ? 'Образовательные направления' : 'Educational Directions'}
                  </h2>
                  <Badge variant="secondary">
                    {String(stats.directions)} {language === 'uz' ? 'yo\'nalish' : language === 'ru' ? 'направлений' : 'directions'}
                  </Badge>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {availableDirections.filter(d => d != null).map((direction, index) => (
                    <motion.div
                      key={direction.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="h-full hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="p-4 rounded-2xl bg-primary/10 w-fit mb-4">
                            <Building className="h-8 w-8 text-primary" />
                          </div>
                          <CardTitle className="text-xl">
                            {getLocalizedText(direction, 'title', language) || 'Untitled Direction'}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col">
                          <p className="text-muted-foreground mb-6 flex-1">
                            {getLocalizedText(direction, 'description', language) || 'No description available'}
                          </p>
                          <div className="flex gap-6 text-sm">
                            <div>
                              <span className="text-2xl font-bold text-primary">{String(direction.courses || 0)}</span>
                              <span className="text-muted-foreground ml-2">
                                {language === 'uz' && 'kurslar'}
                                {language === 'ru' && 'курсов'}
                                {language === 'en' && 'courses'}
                              </span>
                            </div>
                            <div>
                              <span className="text-2xl font-bold text-primary">{String(direction.students || 0)}+</span>
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
            )}
          </div>
        </main>
      </div>
    </div>
  );
}