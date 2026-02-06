import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Menu,
  Plus,
  Search,
  ArrowLeft,
  Edit,
  Trash2
} from 'lucide-react';
import { useLanguage, getLocalizedField } from '@/contexts/LanguageContext';
import { ParticleBackground } from '@/components/ParticleBackground';
import { AdminSidebar } from '@/components/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { api } from '@/services/api';
import { dataService, type Course, type Direction } from '@/services/dataService';
import { toast } from 'sonner';

// CourseForm component defined outside to prevent re-rendering issues
const CourseForm = ({ 
  formData, 
  setFormData, 
  directions,
  language,
  getLocalizedField,
  isEdit = false, 
  isSubmitting, 
  onSubmit, 
  onCancel 
}: { 
  formData: any; 
  setFormData: (data: any) => void; 
  directions: any[];
  language: string;
  getLocalizedField: (item: any, field: string, lang: string) => string;
  isEdit?: boolean; 
  isSubmitting: boolean; 
  onSubmit: () => void; 
  onCancel: () => void; 
}) => (
  <div className="space-y-4">
    <div className="grid grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label>Nomi (Ingliz tili)</Label>
        <Input
          value={formData.title_en}
          onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
          placeholder="English title"
        />
      </div>
      <div className="space-y-2">
        <Label>Nomi (Rus tili)</Label>
        <Input
          value={formData.title_ru}
          onChange={(e) => setFormData({ ...formData, title_ru: e.target.value })}
          placeholder="Russian title"
        />
      </div>
      <div className="space-y-2">
        <Label>Nomi (O'zbek tili)</Label>
        <Input
          value={formData.title_uz}
          onChange={(e) => setFormData({ ...formData, title_uz: e.target.value })}
          placeholder="Uzbek title"
        />
      </div>
    </div>

    <div className="grid grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label>Tavsif (Ingliz tili)</Label>
        <Textarea
          value={formData.description_en}
          onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
          placeholder="English description"
          rows={4}
        />
      </div>
      <div className="space-y-2">
        <Label>Tavsif (Rus tili)</Label>
        <Textarea
          value={formData.description_ru}
          onChange={(e) => setFormData({ ...formData, description_ru: e.target.value })}
          placeholder="Russian description"
          rows={4}
        />
      </div>
      <div className="space-y-2">
        <Label>Tavsif (O'zbek tili)</Label>
        <Textarea
          value={formData.description_uz}
          onChange={(e) => setFormData({ ...formData, description_uz: e.target.value })}
          placeholder="Uzbek description"
          rows={4}
        />
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Yo'nalish</Label>
        <Select value={formData.direction_id} onValueChange={(value) => setFormData({ ...formData, direction_id: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Yo'nalishni tanlang" />
          </SelectTrigger>
          <SelectContent>
            {directions.map((direction) => (
              <SelectItem key={direction.id} value={String(direction.id)}>
                {getLocalizedField(direction, 'title', language)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Boshlanish sanasi</Label>
        <Input
          type="date"
          value={formData.start_date}
          onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>Tugash sanasi</Label>
        <Input
          type="date"
          value={formData.ends_at}
          onChange={(e) => setFormData({ ...formData, ends_at: e.target.value })}
        />
      </div>
    </div>

    <div className="flex justify-end gap-2 pt-4">
      <Button variant="outline" onClick={onCancel}>
        Bekor qilish
      </Button>
      <Button onClick={onSubmit} disabled={isSubmitting}>
        {isSubmitting ? 'Saqlanmoqda...' : (isEdit ? 'Yangilash' : 'Yaratish')}
      </Button>
    </div>
  </div>
);

export default function AdminCourses() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [directions, setDirections] = useState<Direction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title_en: '',
    title_ru: '',
    title_uz: '',
    description_en: '',
    description_ru: '',
    description_uz: '',
    start_date: '',
    ends_at: '',
    direction_id: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [coursesData, directionsData] = await Promise.all([
        dataService.getCourses(),
        dataService.getDirections()
      ]);
      setCourses(coursesData);
      setDirections(directionsData);
    } catch (error) {
      console.error('Failed to load data:', error);
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    api.logout();
    navigate('/');
  };

  const resetForm = () => {
    setFormData({
      title_en: '',
      title_ru: '',
      title_uz: '',
      description_en: '',
      description_ru: '',
      description_uz: '',
      start_date: '',
      ends_at: '',
      direction_id: '',
    });
  };

  const handleCreate = async () => {
    if (!formData.title_en || !formData.title_ru || !formData.title_uz || 
        !formData.description_en || !formData.description_ru || !formData.description_uz ||
        !formData.start_date || !formData.ends_at || !formData.direction_id) {
      toast.error('All fields are required');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.createCourse({
        ...formData,
        direction_id: Number(formData.direction_id)
      });
      if (response.success) {
        toast.success('Course created successfully');
        setIsCreateDialogOpen(false);
        resetForm();
        loadData();
      } else {
        toast.error(response.message || 'Failed to create course');
      }
    } catch (error) {
      console.error('Failed to create course:', error);
      toast.error('Failed to create course');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title_en: course.title_en,
      title_ru: course.title_ru,
      title_uz: course.title_uz,
      description_en: course.description_en,
      description_ru: course.description_ru,
      description_uz: course.description_uz,
      start_date: course.start_date.split('T')[0],
      ends_at: course.ends_at.split('T')[0],
      direction_id: String(course.direction_id),
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingCourse) return;

    setIsSubmitting(true);
    try {
      const response = await api.updateCourse(editingCourse.id, {
        ...formData,
        direction_id: Number(formData.direction_id)
      });
      if (response.success) {
        toast.success('Course updated successfully');
        setIsEditDialogOpen(false);
        setEditingCourse(null);
        resetForm();
        loadData();
      } else {
        toast.error(response.message || 'Failed to update course');
      }
    } catch (error) {
      console.error('Failed to update course:', error);
      toast.error('Failed to update course');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this course?')) return;

    try {
      const response = await api.deleteCourse(id);
      if (response.success) {
        toast.success('Course deleted successfully');
        loadData();
      } else {
        toast.error(response.message || 'Failed to delete course');
      }
    } catch (error) {
      console.error('Failed to delete course:', error);
      toast.error('Failed to delete course');
    }
  };

  const filteredCourses = courses.filter(item => 
    item.title_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.title_ru.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.title_uz.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const SidebarContent = () => <AdminSidebar />;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <ParticleBackground />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center bg-white p-8 rounded-2xl border shadow-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Kurslar yuklanmoqda...</p>
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
                <Link
                  to="/admin/dashboard"
                  className="inline-flex items-center text-slate-300 hover:text-white transition-colors"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Boshqaruv paneli
                </Link>
                <div>
                  <h1 className="text-2xl font-display font-bold text-white">
                    Kurslar
                  </h1>
                  <p className="text-slate-300">
                    Ta'lim kurslarini boshqarish
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
                  placeholder={language === 'uz' ? 'Kurslar qidirish...' : 'Поиск курсов...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    {language === 'uz' ? 'Yangi kurs' : 'Новый курс'}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{language === 'uz' ? 'Yangi kurs yaratish' : 'Создать курс'}</DialogTitle>
                  </DialogHeader>
                  <CourseForm 
                    formData={formData}
                    setFormData={setFormData}
                    directions={directions}
                    language={language}
                    getLocalizedField={getLocalizedField}
                    isSubmitting={isSubmitting}
                    onSubmit={handleCreate}
                    onCancel={() => {
                      setIsCreateDialogOpen(false);
                      resetForm();
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>

            {/* Courses Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border shadow-lg">
                <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-900 text-white border-b border-slate-700">
                  <CardTitle className="font-display">
                    Kurslar ro'yxati ({filteredCourses.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-slate-700 hover:bg-slate-700">
                          <TableHead className="text-white">Nomi</TableHead>
                          <TableHead className="text-white">Yo'nalish</TableHead>
                          <TableHead className="text-white">Boshlanish</TableHead>
                          <TableHead className="text-white">Tugash</TableHead>
                          <TableHead className="text-white">Harakatlar</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredCourses.map((item) => (
                          <TableRow key={item.id} className="hover:bg-slate-50">
                            <TableCell className="font-medium">
                              {getLocalizedField(item, 'title', language)}
                            </TableCell>
                            <TableCell>
                              {item.direction ? getLocalizedField(item.direction, 'title', language) : '-'}
                            </TableCell>
                            <TableCell>
                              {new Date(item.start_date).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              {new Date(item.ends_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEdit(item)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDelete(item.id)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {filteredCourses.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      {searchTerm 
                        ? (language === 'uz' ? 'Hech qanday kurs topilmadi' : 'Курсы не найдены')
                        : (language === 'uz' ? 'Hali kurslar yo\'q' : 'Пока нет курсов')
                      }
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{language === 'uz' ? 'Kursni tahrirlash' : 'Редактировать курс'}</DialogTitle>
          </DialogHeader>
          <CourseForm 
            formData={formData}
            setFormData={setFormData}
            directions={directions}
            language={language}
            getLocalizedField={getLocalizedField}
            isEdit
            isSubmitting={isSubmitting}
            onSubmit={handleUpdate}
            onCancel={() => {
              setIsEditDialogOpen(false);
              setEditingCourse(null);
              resetForm();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}