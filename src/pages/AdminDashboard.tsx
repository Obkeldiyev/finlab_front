import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  BookOpen,
  Settings,
  LogOut,
  Bell,
  Calendar,
  Award,
  Clock,
  ChevronRight,
  Menu,
  Shield,
  FileText,
  GraduationCap,
  Building,
  TrendingUp,
  Eye
} from 'lucide-react';
import { useLanguage, getLocalizedField } from '@/contexts/LanguageContext';
import { ParticleBackground } from '@/components/ParticleBackground';
import { AdminSidebar } from '@/components/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { api } from '@/services/api';
import { dataService } from '@/services/dataService';
import { toast } from 'sonner';

interface AdminUser {
  id: string;
  username: string;
  role: string;
}

export default function AdminDashboard() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState({
    users: 0,
    courses: 0,
    news: 0,
    directions: 0,
    opportunities: 0
  });

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        // Add a small delay to ensure token is properly set
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const response = await api.getAdminProfile();
        console.log('Admin profile response:', response); // Debug log
        
        if (response.success) {
          setAdmin(response.data);
          
          // Load dashboard stats - ALL FROM BACKEND
          try {
            const [coursesData, directionsData, newsData, usersResponse, opportunitiesData] = await Promise.all([
              dataService.getCourses(),
              dataService.getDirections(),
              dataService.getNews(),
              api.getAllUsers(),
              dataService.getOpportunities()
            ]);
            
            // Set users data
            if (usersResponse.success) {
              setUsers(usersResponse.data);
            }
            
            setStats({
              users: usersResponse.success ? usersResponse.data.length : 0,
              courses: coursesData.length,
              news: newsData.length,
              directions: directionsData.length,
              opportunities: opportunitiesData.length
            });
          } catch (error) {
            console.error('Failed to load stats:', error);
            toast.error('Failed to load dashboard statistics');
          }
        } else {
          console.error('Failed to load admin profile:', response.message);
          navigate('/admin/login');
        }
      } catch (error) {
        console.error('Failed to load admin data:', error);
        // Check if it's an authentication error
        if (error instanceof Error && error.message.includes('401')) {
          toast.error('Session expired. Please login again.');
        }
        navigate('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };
    
    // Check if user is authenticated
    if (!api.isAuthenticated()) {
      console.log('Not authenticated, redirecting to admin login');
      navigate('/admin/login');
      return;
    }
    
    loadAdminData();
  }, [navigate]);

  const handleLogout = () => {
    api.logout();
    navigate('/');
  };

  const navItems = [
    { 
      icon: Shield, 
      label: { uz: 'Dashboard', ru: 'Панель', en: 'Dashboard' }, 
      active: true,
      path: '/admin/dashboard'
    },
    { 
      icon: Users, 
      label: { uz: 'Foydalanuvchilar', ru: 'Пользователи', en: 'Users' }, 
      active: false,
      path: '/admin/users'
    },
    { 
      icon: FileText, 
      label: { uz: 'Yangiliklar', ru: 'Новости', en: 'News' }, 
      active: false,
      path: '/admin/news'
    },
    { 
      icon: Building, 
      label: { uz: 'Yo\'nalishlar', ru: 'Направления', en: 'Directions' }, 
      active: false,
      path: '/admin/directions'
    },
    { 
      icon: BookOpen, 
      label: { uz: 'Kurslar', ru: 'Курсы', en: 'Courses' }, 
      active: false,
      path: '/admin/courses'
    },
    { 
      icon: Award, 
      label: { uz: 'Imkoniyatlar', ru: 'Возможности', en: 'Opportunities' }, 
      active: false,
      path: '/admin/opportunities'
    },
  ];

  const getLocalizedField = (item: any, field: string, lang: string) => {
    return item[field][lang] || item[field]['en'] || '';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <ParticleBackground />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="min-h-screen bg-background">
        <ParticleBackground />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-muted-foreground">Failed to load admin data</p>
            <Button onClick={() => navigate('/admin/login')} className="mt-4">
              Go to Admin Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <ParticleBackground />

      <div className="flex min-h-screen relative z-10">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 flex-col">
          <AdminSidebar />
        </aside>

        {/* Mobile Sidebar */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="w-64 p-0">
            <AdminSidebar />
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <main className="flex-1">
          {/* Header - Dark Blue */}
          <header className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 px-4 lg:px-8 py-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="lg:hidden text-white hover:bg-slate-700">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                </Sheet>
                <div>
                  <h1 className="text-2xl font-display font-bold text-white">
                    Xush kelibsiz, {admin?.username}!
                  </h1>
                  <p className="text-slate-300">
                    Administrator paneli
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-white hover:bg-slate-700">
                  <Bell className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <div className="p-4 lg:p-8 space-y-6">
            {/* Quick Stats */}
            <div className="grid md:grid-cols-5 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-blue-600">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-white/20">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-white/90">
                          Foydalanuvchilar
                        </p>
                        <p className="text-2xl font-bold text-white">{stats.users}</p>
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
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-blue-600">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-white/20">
                        <BookOpen className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-white/90">
                          Kurslar
                        </p>
                        <p className="text-2xl font-bold text-white">{stats.courses}</p>
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
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-blue-600">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-white/20">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-white/90">
                          Yangiliklar
                        </p>
                        <p className="text-2xl font-bold text-white">{stats.news}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-blue-600">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-white/20">
                        <Building className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-white/90">
                          {language === 'uz' ? 'Yo\'nalishlar' : language === 'ru' ? 'Направления' : 'Directions'}
                        </p>
                        <p className="text-2xl font-bold text-white">{stats.directions}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-blue-600">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-white/20">
                        <Award className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-white/90">
                          {language === 'uz' ? 'Elon' : language === 'ru' ? 'Объявления' : 'Announcements'}
                        </p>
                        <p className="text-2xl font-bold text-white">{stats.opportunities}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-blue-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white border-b">
                  <CardTitle className="font-display">
                    {language === 'uz' ? 'Tezkor harakatlar' : language === 'ru' ? 'Быстрые действия' : 'Quick Actions'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    <Link
                      to="/admin/users"
                      className="flex items-center justify-between p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors text-left border border-blue-200"
                    >
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-blue-600" />
                        <span className="font-medium text-blue-900">
                          {language === 'uz' ? 'Foydalanuvchilarni boshqarish' : language === 'ru' ? 'Управление пользователями' : 'Manage Users'}
                        </span>
                      </div>
                      <ChevronRight className="h-5 w-5 text-blue-600" />
                    </Link>
                    
                    <Link
                      to="/admin/news"
                      className="flex items-center justify-between p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors text-left border border-blue-200"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <span className="font-medium text-blue-900">
                          {language === 'uz' ? 'Yangiliklar' : language === 'ru' ? 'Новости' : 'News'}
                        </span>
                      </div>
                      <ChevronRight className="h-5 w-5 text-blue-600" />
                    </Link>
                    
                    <Link
                      to="/admin/courses"
                      className="flex items-center justify-between p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors text-left border border-blue-200"
                    >
                      <div className="flex items-center gap-3">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                        <span className="font-medium text-blue-900">
                          {language === 'uz' ? 'Kurslar' : language === 'ru' ? 'Курсы' : 'Courses'}
                        </span>
                      </div>
                      <ChevronRight className="h-5 w-5 text-blue-600" />
                    </Link>
                    
                    <Link
                      to="/admin/directions"
                      className="flex items-center justify-between p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors text-left border border-blue-200"
                    >
                      <div className="flex items-center gap-3">
                        <Building className="h-5 w-5 text-blue-600" />
                        <span className="font-medium text-blue-900">
                          {language === 'uz' ? 'Yo\'nalishlar' : language === 'ru' ? 'Направления' : 'Directions'}
                        </span>
                      </div>
                      <ChevronRight className="h-5 w-5 text-blue-600" />
                    </Link>
                    
                    <Link
                      to="/admin/opportunities"
                      className="flex items-center justify-between p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors text-left border border-blue-200"
                    >
                      <div className="flex items-center gap-3">
                        <Award className="h-5 w-5 text-blue-600" />
                        <span className="font-medium text-blue-900">
                          {language === 'uz' ? 'Elon' : language === 'ru' ? 'Объявления' : 'Announcements'}
                        </span>
                      </div>
                      <ChevronRight className="h-5 w-5 text-blue-600" />
                    </Link>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white border border-blue-700">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="h-5 w-5" />
                        <div>
                          <span className="font-medium block">
                            {language === 'uz' ? 'Umumiy statistika' : language === 'ru' ? 'Общая статистика' : 'Overall Stats'}
                          </span>
                          <span className="text-sm opacity-90">
                            {language === 'uz' ? 'Barcha ma\'lumotlar' : language === 'ru' ? 'Все данные' : 'All data'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Users Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="border-blue-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white border-b">
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-display">
                      {language === 'uz' ? "Ro'yxatdan o'tgan foydalanuvchilar" : language === 'ru' ? 'Зарегистрированные пользователи' : 'Registered Users'}
                    </CardTitle>
                    <Link to="/admin/users">
                      <Button variant="secondary" size="sm">
                        {language === 'uz' ? 'Barchasini ko\'rish' : language === 'ru' ? 'Посмотреть все' : 'View All'}
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-blue-600 hover:bg-blue-600">
                          <TableHead className="text-white">
                            {language === 'uz' ? "To'liq ism" : language === 'ru' ? 'Полное имя' : 'Full Name'}
                          </TableHead>
                          <TableHead className="text-white">
                            {language === 'uz' ? 'Kurs' : language === 'ru' ? 'Курс' : 'Course'}
                          </TableHead>
                          <TableHead className="text-white">
                            {language === 'uz' ? "Yo'nalish" : language === 'ru' ? 'Направление' : 'Direction'}
                          </TableHead>
                          <TableHead className="text-white">
                            {language === 'uz' ? 'Boshlanish sanasi' : language === 'ru' ? 'Дата начала' : 'Start Date'}
                          </TableHead>
                          <TableHead className="text-white">
                            {language === 'uz' ? 'Status' : language === 'ru' ? 'Статус' : 'Status'}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                              {language === 'uz' ? 'Foydalanuvchilar topilmadi' : language === 'ru' ? 'Пользователи не найдены' : 'No users found'}
                            </TableCell>
                          </TableRow>
                        ) : (
                          users.slice(0, 10).map((user) => (
                            <TableRow key={user.id} className="hover:bg-blue-50">
                              <TableCell className="font-medium">
                                {user.first_name} {user.last_name}
                              </TableCell>
                              <TableCell>
                                {user.course ? getLocalizedField(user.course, 'title', language) : '-'}
                              </TableCell>
                              <TableCell>
                                {user.direction ? getLocalizedField(user.direction, 'title', language) : '-'}
                              </TableCell>
                              <TableCell>
                                {user.course?.start_date ? (
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-blue-600" />
                                    {new Date(user.course.start_date).toLocaleDateString(
                                      language === 'uz' ? 'uz-UZ' : language === 'ru' ? 'ru-RU' : 'en-US',
                                      { year: 'numeric', month: 'short', day: 'numeric' }
                                    )}
                                  </div>
                                ) : '-'}
                              </TableCell>
                              <TableCell>
                                <Badge 
                                  variant={
                                    user.status === 'ACTIVE' || user.status === 'ENROLLED' ? 'default' : 
                                    user.status === 'PENDING' ? 'secondary' : 
                                    'destructive'
                                  }
                                  className={
                                    user.status === 'ACTIVE' || user.status === 'ENROLLED' ? 'bg-green-500' : ''
                                  }
                                >
                                  {user.status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {users.length > 10 && (
                    <div className="p-4 border-t border-blue-100 text-center bg-blue-50">
                      <Link to="/admin/users">
                        <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-100">
                          {language === 'uz' ? `Yana ${users.length - 10} ta foydalanuvchi ko'rish` : 
                           language === 'ru' ? `Посмотреть еще ${users.length - 10} пользователей` : 
                           `View ${users.length - 10} more users`}
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}