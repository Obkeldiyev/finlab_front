import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Menu,
  Plus,
  Search,
  ArrowLeft,
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
  User,
  Calendar,
  MapPin
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ParticleBackground } from '@/components/ParticleBackground';
import { AdminSidebar } from '@/components/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { api } from '@/services/api';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  phone_number: string;
  status: string;
  role: string;
  created_at: string;
  course_id?: number;
  direction_id?: number;
  course?: {
    title_uz: string;
    title_ru: string;
    title_en: string;
  };
  direction?: {
    title_uz: string;
    title_ru: string;
    title_en: string;
  };
}

export default function AdminUsers() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Helper function to get localized text
  const getLocalizedText = (item: any, field: string): string => {
    if (!item) return '';
    return item[`${field}_${language}`] || item[`${field}_en`] || '';
  };

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await api.getAllUsers();
        if (response.success) {
          setUsers(response.data);
        } else {
          toast.error('Failed to load users');
        }
      } catch (error) {
        console.error('Failed to load users:', error);
        toast.error('Failed to load users');
        // If unauthorized, redirect to admin login
        navigate('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };
    
    // Check if user is authenticated
    if (!api.isAuthenticated()) {
      navigate('/admin/login');
      return;
    }
    
    loadUsers();
  }, [navigate]);

  const handleLogout = () => {
    api.logout();
    navigate('/');
  };

  const SidebarContent = () => <AdminSidebar />;

  const filteredUsers = users.filter(user => 
    user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone_number.includes(searchTerm)
  );

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <ParticleBackground />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center bg-white p-8 rounded-2xl border shadow-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">
              Foydalanuvchilar yuklanmoqda...
            </p>
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
                <Link
                  to="/admin/dashboard"
                  className="inline-flex items-center text-slate-300 hover:text-white transition-colors"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Boshqaruv paneli
                </Link>
                <div>
                  <h1 className="text-2xl font-display font-bold text-white">
                    Foydalanuvchilar
                  </h1>
                  <p className="text-slate-300">
                    Barcha ro'yxatdan o'tgan foydalanuvchilar
                  </p>
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="p-4 lg:p-8 space-y-6">
            {/* Search and Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Foydalanuvchilarni qidirish..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Yangi foydalanuvchi
              </Button>
            </div>

            {/* Users Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border shadow-lg">
                <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-900 text-white border-b border-slate-700">
                  <CardTitle className="font-display">
                    Foydalanuvchilar ro'yxati ({filteredUsers.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-slate-700 hover:bg-slate-700">
                          <TableHead className="w-12 text-white">#</TableHead>
                          <TableHead className="text-white">To'liq ism</TableHead>
                          <TableHead className="text-white">Telefon raqam</TableHead>
                          <TableHead className="text-white">Kurs</TableHead>
                          <TableHead className="text-white">Yo'nalish</TableHead>
                          <TableHead className="text-white">Amallar</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map((user, index) => (
                          <TableRow key={user.id} className="hover:bg-slate-50">
                            <TableCell className="font-medium text-muted-foreground">
                              {index + 1}
                            </TableCell>
                            <TableCell className="font-medium">
                              <div className="flex flex-col">
                                <span>{user.first_name} {user.middle_name} {user.last_name}</span>
                                <span className="text-sm text-muted-foreground">{user.email}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                {user.phone_number}
                              </div>
                            </TableCell>
                            <TableCell>
                              {user.course ? (
                                <Badge variant="outline">
                                  {getLocalizedText(user.course, 'title')}
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground text-sm">
                                  {language === 'uz' ? 'Tanlanmagan' : language === 'ru' ? 'Не выбран' : 'Not selected'}
                                </span>
                              )}
                            </TableCell>
                            <TableCell>
                              {user.direction ? (
                                <Badge variant="secondary">
                                  {getLocalizedText(user.direction, 'title')}
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground text-sm">
                                  {language === 'uz' ? 'Tanlanmagan' : language === 'ru' ? 'Не выбрано' : 'Not selected'}
                                </span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewUser(user)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {filteredUsers.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      {searchTerm 
                        ? (language === 'uz' ? 'Hech qanday foydalanuvchi topilmadi' : language === 'ru' ? 'Пользователи не найдены' : 'No users found')
                        : (language === 'uz' ? 'Hali foydalanuvchilar yo\'q' : language === 'ru' ? 'Пока нет пользователей' : 'No users yet')
                      }
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* User Details Modal */}
            <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
              <DialogContent className="max-w-2xl backdrop-blur-md bg-white/85 border-blue-200/40">
                <DialogHeader>
                  <DialogTitle className="font-display">
                    {language === 'uz' ? 'Foydalanuvchi ma\'lumotlari' : language === 'ru' ? 'Информация о пользователе' : 'User Information'}
                  </DialogTitle>
                </DialogHeader>
                
                {selectedUser && (
                  <div className="space-y-6">
                    {/* Personal Information */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            {language === 'uz' ? 'To\'liq ism' : language === 'ru' ? 'Полное имя' : 'Full Name'}
                          </label>
                          <div className="flex items-center gap-2 mt-1">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">
                              {selectedUser.first_name} {selectedUser.middle_name} {selectedUser.last_name}
                            </span>
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Email</label>
                          <div className="flex items-center gap-2 mt-1">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{selectedUser.email}</span>
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            {language === 'uz' ? 'Telefon raqam' : language === 'ru' ? 'Номер телефона' : 'Phone Number'}
                          </label>
                          <div className="flex items-center gap-2 mt-1">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{selectedUser.phone_number}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            {language === 'uz' ? 'Holat' : language === 'ru' ? 'Статус' : 'Status'}
                          </label>
                          <div className="mt-1">
                            <Badge variant={selectedUser.status === 'ACTIVE' ? 'default' : 'secondary'}>
                              {selectedUser.status}
                            </Badge>
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            {language === 'uz' ? 'Ro\'yxatdan o\'tgan sana' : language === 'ru' ? 'Дата регистрации' : 'Registration Date'}
                          </label>
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {new Date(selectedUser.created_at).toLocaleDateString(
                                language === 'ru' ? 'ru-RU' : language === 'uz' ? 'uz-UZ' : 'en-US'
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Course and Direction Information */}
                    <div className="border-t pt-6">
                      <h3 className="font-medium mb-4">
                        {language === 'uz' ? 'Ta\'lim ma\'lumotlari' : language === 'ru' ? 'Образовательная информация' : 'Educational Information'}
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            {language === 'uz' ? 'Tanlangan kurs' : language === 'ru' ? 'Выбранный курс' : 'Selected Course'}
                          </label>
                          <div className="mt-1">
                            {selectedUser.course ? (
                              <Badge variant="outline" className="text-sm">
                                {getLocalizedText(selectedUser.course, 'title')}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground text-sm">
                                {language === 'uz' ? 'Tanlanmagan' : language === 'ru' ? 'Не выбран' : 'Not selected'}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            {language === 'uz' ? 'Tanlangan yo\'nalish' : language === 'ru' ? 'Выбранное направление' : 'Selected Direction'}
                          </label>
                          <div className="mt-1">
                            {selectedUser.direction ? (
                              <Badge variant="secondary" className="text-sm">
                                {getLocalizedText(selectedUser.direction, 'title')}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground text-sm">
                                {language === 'uz' ? 'Tanlanmagan' : language === 'ru' ? 'Не выбрано' : 'Not selected'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </main>
      </div>
    </div>
  );
}