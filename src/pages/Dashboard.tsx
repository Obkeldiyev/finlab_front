import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User,
  BookOpen,
  Settings,
  LogOut,
  Bell,
  Calendar,
  Award,
  Clock,
  ChevronRight,
  Menu
} from 'lucide-react';
import { useLanguage, getLocalizedField } from '@/contexts/LanguageContext';
import { ParticleBackground } from '@/components/ParticleBackground';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import logo from '@/assets/logo.svg';

// Mock user data
const mockUser = {
  first_name: 'Alijon',
  last_name: 'Karimov',
  email: 'alijon@example.com',
  phone_number: '+998901234567',
  status: 'active',
  direction: { title_uz: "Umumiy o'rta ta'lim", title_ru: 'Общее среднее образование', title_en: 'General Secondary Education' },
  course: { title_uz: '288 soatlik malaka oshirish', title_ru: '288-часовое повышение квалификации', title_en: '288-hour Professional Development', hours: 288 }
};

const mockProgress = {
  completed: 96,
  total: 288,
  modules: [
    { name: { uz: 'Nazariy qism', ru: 'Теоретическая часть', en: 'Theory' }, progress: 100 },
    { name: { uz: 'Amaliy mashg\'ulotlar', ru: 'Практические занятия', en: 'Practice' }, progress: 45 },
    { name: { uz: 'Loyiha ishi', ru: 'Проектная работа', en: 'Project Work' }, progress: 0 },
  ]
};

export default function Dashboard() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const navItems = [
    { icon: User, label: { uz: 'Profil', ru: 'Профиль', en: 'Profile' }, active: true },
    { icon: BookOpen, label: { uz: 'Kurslarim', ru: 'Мои курсы', en: 'My Courses' }, active: false },
    { icon: Bell, label: { uz: 'Bildirishnomalar', ru: 'Уведомления', en: 'Notifications' }, active: false },
    { icon: Settings, label: { uz: 'Sozlamalar', ru: 'Настройки', en: 'Settings' }, active: false },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="FinLab" className="h-10 w-auto" />
          <span className="font-display text-xl font-bold text-primary">FinLab</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item, index) => (
          <button
            key={index}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
              item.active
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            }`}
          >
            <item.icon className="h-5 w-5" />
            {getLocalizedField(item, 'label', language)}
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

  return (
    <div className="min-h-screen bg-accent/30">
      <ParticleBackground />

      <div className="flex min-h-screen relative z-10">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 flex-col bg-card border-r border-border">
          <SidebarContent />
        </aside>

        {/* Mobile Sidebar */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="w-64 p-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <main className="flex-1">
          {/* Header */}
          <header className="bg-card border-b border-border px-4 lg:px-8 py-4">
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
                    {language === 'uz' ? 'Xush kelibsiz' : language === 'ru' ? 'Добро пожаловать' : 'Welcome'}, {mockUser.first_name}!
                  </h1>
                  <p className="text-muted-foreground">
                    {getLocalizedField(mockUser.course, 'title', language)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <div className="p-4 lg:p-8 space-y-6">
            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-primary/10">
                        <Clock className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {language === 'uz' ? "O'tilgan soatlar" : language === 'ru' ? 'Пройдено часов' : 'Hours Completed'}
                        </p>
                        <p className="text-2xl font-bold text-foreground">
                          {mockProgress.completed} / {mockProgress.total}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-green-500/10">
                        <Award className="h-6 w-6 text-green-500" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {language === 'uz' ? 'Progress' : language === 'ru' ? 'Прогресс' : 'Progress'}
                        </p>
                        <p className="text-2xl font-bold text-foreground">
                          {Math.round((mockProgress.completed / mockProgress.total) * 100)}%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-orange-500/10">
                        <Calendar className="h-6 w-6 text-orange-500" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {language === 'uz' ? 'Keyingi dars' : language === 'ru' ? 'Следующее занятие' : 'Next Class'}
                        </p>
                        <p className="text-lg font-bold text-foreground">
                          15 Feb, 09:00
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Course Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="font-display">
                    {language === 'uz' ? 'Kurs progressi' : language === 'ru' ? 'Прогресс курса' : 'Course Progress'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {mockProgress.modules.map((module, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{getLocalizedField(module, 'name', language)}</span>
                        <span className="text-muted-foreground">{module.progress}%</span>
                      </div>
                      <Progress value={module.progress} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="font-display">
                    {language === 'uz' ? 'Tezkor havolalar' : language === 'ru' ? 'Быстрые ссылки' : 'Quick Links'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { label: { uz: 'Darslar jadvali', ru: 'Расписание занятий', en: 'Class Schedule' }, icon: Calendar },
                      { label: { uz: 'Materiallar', ru: 'Материалы', en: 'Materials' }, icon: BookOpen },
                    ].map((item, index) => (
                      <button
                        key={index}
                        className="flex items-center justify-between p-4 rounded-xl bg-accent hover:bg-accent/80 transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="h-5 w-5 text-primary" />
                          <span className="font-medium">{getLocalizedField(item, 'label', language)}</span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
