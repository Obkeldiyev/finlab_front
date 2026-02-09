import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus,
  Edit,
  Trash2,
  Image,
  Video,
  FileText,
  Calendar,
  Eye,
  Menu,
  LogOut,
  Shield,
  Users,
  BookOpen,
  Building,
  Award,
  Clock
} from 'lucide-react';
import { useLanguage, getLocalizedField } from '@/contexts/LanguageContext';
import { ParticleBackground } from '@/components/ParticleBackground';
import { AdminSidebar } from '@/components/AdminSidebar';
import { OpportunityForm } from '@/components/admin/OpportunityForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { dataService, type Opportunity } from '@/services/dataService';
import { api } from '@/services/api';
import { toast } from 'sonner';

export default function AdminOpportunities() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const navItems = [
    { 
      icon: Shield, 
      label: { uz: 'Dashboard', ru: 'Панель', en: 'Dashboard' }, 
      active: false,
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
      active: true,
      path: '/admin/opportunities'
    },
  ];

  useEffect(() => {
    const loadOpportunities = async () => {
      try {
        const opportunitiesData = await dataService.getOpportunities();
        setOpportunities(opportunitiesData);
      } catch (error) {
        console.error('Failed to load opportunities:', error);
        toast.error('Failed to load opportunities');
      } finally {
        setIsLoading(false);
      }
    };

    // Check if user is authenticated as admin
    if (!api.isAuthenticated()) {
      navigate('/admin/login');
      return;
    }

    loadOpportunities();
  }, [navigate]);

  const handleLogout = () => {
    api.logout();
    navigate('/admin/login');
  };

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    // Reload opportunities data
    loadOpportunities();
  };

  const loadOpportunities = async () => {
    try {
      const opportunitiesData = await dataService.getOpportunities();
      setOpportunities(opportunitiesData);
    } catch (error) {
      console.error('Failed to load opportunities:', error);
      toast.error('Failed to load opportunities');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this opportunity?')) {
      return;
    }

    try {
      const response = await api.deleteOpportunity(id);
      if (response.success) {
        toast.success('Opportunity deleted successfully');
        loadOpportunities();
      } else {
        toast.error('Failed to delete opportunity');
      }
    } catch (error) {
      console.error('Delete opportunity error:', error);
      toast.error('Failed to delete opportunity');
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(language === 'ru' ? 'ru-RU' : language === 'uz' ? 'uz-UZ' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'image':
        return Image;
      case 'video':
        return Video;
      default:
        return FileText;
    }
  };

  const isExpired = (dateStr: string) => {
    return new Date(dateStr) < new Date();
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <Link to="/" className="flex items-center gap-3">
          <img src="/main-logo.602cd3fa57577bd6675dd5cb6474efab.svg" alt="FinLab" className="h-10 w-auto" />
          <span className="font-display text-xl font-bold text-primary">FinLab Admin</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
              item.active
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span className="font-medium">{item.label[language] || item.label.en}</span>
          </Link>
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
      <div className="min-h-screen bg-white">
        <ParticleBackground />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center bg-white p-8 rounded-2xl border shadow-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Imkoniyatlar yuklanmoqda...</p>
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
                    Elon boshqaruvi
                  </h1>
                  <p className="text-slate-300">
                    Elon yaratish va boshqarish
                  </p>
                </div>
              </div>
              <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Elon yaratish
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      Yangi elon
                    </DialogTitle>
                  </DialogHeader>
                  <OpportunityForm 
                    onSuccess={handleCreateSuccess}
                    onCancel={() => setShowCreateForm(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </header>

          {/* Content */}
          <div className="p-4 lg:p-8">
            <div className="grid gap-6">
              {opportunities.length === 0 ? (
                <Card className="backdrop-blur-sm bg-white/75 border-blue-200/40">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Award className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      {language === 'uz' ? 'Imkoniyat topilmadi' : language === 'ru' ? 'Возможности не найдены' : 'No opportunities found'}
                    </h3>
                    <p className="text-muted-foreground text-center mb-4">
                      {language === 'uz' ? 'Birinchi imkoniyatni yarating' : language === 'ru' ? 'Создайте первую возможность' : 'Create your first opportunity'}
                    </p>
                    <Button onClick={() => setShowCreateForm(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      {language === 'uz' ? 'Imkoniyat yaratish' : language === 'ru' ? 'Создать возможность' : 'Create Opportunity'}
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {opportunities.map((opportunity, index) => (
                    <motion.div
                      key={opportunity.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="backdrop-blur-sm bg-white/75 border-blue-200/40 hover:shadow-lg transition-all overflow-hidden">
                        {/* Media Preview */}
                        {opportunity.medias && opportunity.medias.length > 0 && (
                          <div className="relative h-48">
                            {opportunity.medias[0].type === 'image' ? (
                              <img
                                src={`${import.meta.env.VITE_API_URL || '/api'}${opportunity.medias[0].url}`}
                                alt="Opportunity media"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            ) : opportunity.medias[0].type === 'video' ? (
                              <video
                                src={`${import.meta.env.VITE_API_URL || '/api'}${opportunity.medias[0].url}`}
                                className="w-full h-full object-cover"
                                muted
                                preload="metadata"
                              />
                            ) : (
                              <div className="w-full h-full bg-accent flex items-center justify-center">
                                <FileText className="h-12 w-12 text-muted-foreground" />
                              </div>
                            )}
                            
                            {opportunity.medias.length > 1 && (
                              <div className="absolute top-2 right-2">
                                <Badge variant="secondary" className="bg-black/60 text-white">
                                  +{opportunity.medias.length - 1}
                                </Badge>
                              </div>
                            )}
                          </div>
                        )}

                        <CardHeader>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              {formatDate(opportunity.published_at)}
                            </div>
                            <div className="flex items-center gap-2">
                              {opportunity.medias && opportunity.medias.length > 0 && (
                                <Badge variant="outline" className="text-xs">
                                  {opportunity.medias.length} {language === 'uz' ? 'fayl' : language === 'ru' ? 'файлов' : 'files'}
                                </Badge>
                              )}
                              {isExpired(opportunity.ends_at) ? (
                                <Badge variant="destructive" className="text-xs">
                                  {language === 'uz' ? 'Tugagan' : language === 'ru' ? 'Истекший' : 'Expired'}
                                </Badge>
                              ) : (
                                <Badge variant="default" className="text-xs bg-green-500">
                                  {language === 'uz' ? 'Faol' : language === 'ru' ? 'Активный' : 'Active'}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <CardTitle className="text-lg line-clamp-2">
                            {getLocalizedField(opportunity, 'title', language)}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                            {getLocalizedField(opportunity, 'description', language)}
                          </p>
                          
                          {/* End Date */}
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                            <Clock className="h-4 w-4" />
                            {language === 'uz' ? 'Tugaydi:' : language === 'ru' ? 'Заканчивается:' : 'Ends:'} {formatDate(opportunity.ends_at)}
                          </div>
                          
                          {/* Media Types */}
                          {opportunity.medias && opportunity.medias.length > 0 && (
                            <div className="flex items-center gap-2 mb-4">
                              {Array.from(new Set(opportunity.medias.map(m => m.type))).map(type => {
                                const IconComponent = getMediaIcon(type);
                                return (
                                  <Badge key={type} variant="outline" className="text-xs">
                                    <IconComponent className="h-3 w-3 mr-1" />
                                    {type}
                                  </Badge>
                                );
                              })}
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1">
                              <Eye className="h-4 w-4 mr-2" />
                              {language === 'uz' ? 'Ko\'rish' : language === 'ru' ? 'Просмотр' : 'View'}
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleDelete(opportunity.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}