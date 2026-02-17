import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus,
  Edit,
  Trash2,
  Calendar,
  Clock,
  Eye,
  Menu,
  FileText
} from 'lucide-react';
import { useLanguage, getLocalizedField } from '@/contexts/LanguageContext';
import { ParticleBackground } from '@/components/ParticleBackground';
import { AdminSidebar } from '@/components/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { api } from '@/services/api';
import { toast } from 'sonner';

interface Announcement {
  id: number;
  title_uz: string;
  title_ru: string;
  title_en: string;
  content_uz: string;
  content_ru: string;
  content_en: string;
  published_at: string;
  ends_at: string;
  medias: { id: number; url: string; type: string }[];
}

export default function AdminAnnouncements() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [viewingAnnouncement, setViewingAnnouncement] = useState<Announcement | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title_en: '',
    title_ru: '',
    title_uz: '',
    content_en: '',
    content_ru: '',
    content_uz: '',
    ends_at: '',
  });
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadAnnouncements = async () => {
      try {
        const response = await api.getAnnouncements();
        if (response.success && response.data) {
          setAnnouncements(response.data);
        }
      } catch (error) {
        console.error('Failed to load announcements:', error);
        toast.error('Failed to load announcements');
      } finally {
        setIsLoading(false);
      }
    };

    if (!api.isAuthenticated()) {
      navigate('/admin/login');
      return;
    }

    loadAnnouncements();
  }, [navigate]);

  const loadAnnouncements = async () => {
    try {
      const response = await api.getAnnouncements();
      if (response.success && response.data) {
        setAnnouncements(response.data);
      }
    } catch (error) {
      console.error('Failed to load announcements:', error);
      toast.error('Failed to load announcements');
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      
      mediaFiles.forEach((file) => {
        formDataToSend.append('medias', file);
      });

      const response = await api.createAnnouncement(formDataToSend);

      if (response.success) {
        toast.success('Announcement created successfully');
        setShowCreateForm(false);
        resetForm();
        loadAnnouncements();
      }
    } catch (error) {
      toast.error('Failed to create announcement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (announcement: Announcement) => {
    alert('Edit clicked for: ' + announcement.title_uz);
    setEditingAnnouncement(announcement);
    setFormData({
      title_uz: announcement.title_uz,
      title_ru: announcement.title_ru,
      title_en: announcement.title_en,
      content_uz: announcement.content_uz,
      content_ru: announcement.content_ru,
      content_en: announcement.content_en,
      ends_at: announcement.ends_at.split('T')[0],
    });
    setMediaFiles([]);
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAnnouncement) return;
    
    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      
      mediaFiles.forEach((file) => {
        formDataToSend.append('medias', file);
      });

      const response = await api.updateAnnouncement(editingAnnouncement.id, formDataToSend);
      
      if (response.success) {
        toast.success('Announcement updated successfully');
        setIsEditDialogOpen(false);
        setEditingAnnouncement(null);
        resetForm();
        loadAnnouncements();
      }
    } catch (error) {
      console.error('Update announcement error:', error);
      toast.error('Failed to update announcement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this announcement?')) {
      return;
    }

    try {
      const response = await api.deleteAnnouncement(id);
      if (response.success) {
        toast.success('Announcement deleted successfully');
        loadAnnouncements();
      } else {
        toast.error('Failed to delete announcement');
      }
    } catch (error) {
      console.error('Delete announcement error:', error);
      toast.error('Failed to delete announcement');
    }
  };

  const resetForm = () => {
    setFormData({
      title_uz: '',
      title_ru: '',
      title_en: '',
      content_uz: '',
      content_ru: '',
      content_en: '',
      ends_at: '',
    });
    setMediaFiles([]);
    setEditingAnnouncement(null);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(language === 'ru' ? 'ru-RU' : language === 'uz' ? 'uz-UZ' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <ParticleBackground />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center bg-white p-8 rounded-2xl border shadow-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">E'lonlar yuklanmoqda...</p>
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
          {/* Header */}
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
                    E'lonlar boshqaruvi
                  </h1>
                  <p className="text-slate-300">
                    E'lonlar yaratish va boshqarish
                  </p>
                </div>
              </div>
              <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    E'lon yaratish
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Yangi e'lon</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateSubmit} className="space-y-6">
                    {/* English */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">English</h3>
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          value={formData.title_en}
                          onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Content</Label>
                        <Textarea
                          value={formData.content_en}
                          onChange={(e) => setFormData({ ...formData, content_en: e.target.value })}
                          rows={4}
                          required
                        />
                      </div>
                    </div>

                    {/* Russian */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Русский</h3>
                      <div className="space-y-2">
                        <Label>Заголовок</Label>
                        <Input
                          value={formData.title_ru}
                          onChange={(e) => setFormData({ ...formData, title_ru: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Содержание</Label>
                        <Textarea
                          value={formData.content_ru}
                          onChange={(e) => setFormData({ ...formData, content_ru: e.target.value })}
                          rows={4}
                          required
                        />
                      </div>
                    </div>

                    {/* Uzbek */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">O'zbek</h3>
                      <div className="space-y-2">
                        <Label>Sarlavha</Label>
                        <Input
                          value={formData.title_uz}
                          onChange={(e) => setFormData({ ...formData, title_uz: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Mazmun</Label>
                        <Textarea
                          value={formData.content_uz}
                          onChange={(e) => setFormData({ ...formData, content_uz: e.target.value })}
                          rows={4}
                          required
                        />
                      </div>
                    </div>

                    {/* End Date */}
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Input
                        type="date"
                        value={formData.ends_at}
                        onChange={(e) => setFormData({ ...formData, ends_at: e.target.value })}
                        required
                      />
                    </div>

                    {/* Media */}
                    <div className="space-y-2">
                      <Label>Media Files</Label>
                      <Input
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        onChange={(e) => setMediaFiles(Array.from(e.target.files || []))}
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => { setShowCreateForm(false); resetForm(); }}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Creating...' : 'Create'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </header>

          {/* Content */}
          <div className="p-4 lg:p-8">
            <div className="grid gap-6">
              {announcements.length === 0 ? (
                <Card className="backdrop-blur-sm bg-white/75 border-blue-200/40">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">E'lon topilmadi</h3>
                    <p className="text-muted-foreground text-center mb-4">
                      Birinchi e'lonni yarating
                    </p>
                    <Button onClick={() => setShowCreateForm(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      E'lon yaratish
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {announcements.map((announcement, index) => (
                    <motion.div
                      key={announcement.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="backdrop-blur-sm bg-white/75 border-blue-200/40 hover:shadow-lg transition-all">
                        <CardHeader>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              {formatDate(announcement.published_at)}
                            </div>
                            <Badge variant="outline" className="text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatDate(announcement.ends_at)}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg line-clamp-2">
                            {getLocalizedField(announcement, 'title', language)}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                            {getLocalizedField(announcement, 'content', language)}
                          </p>

                          {/* Actions */}
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                alert('View clicked for: ' + announcement.title_uz);
                                setViewingAnnouncement(announcement);
                                setIsViewDialogOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Ko'rish
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(announcement);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(announcement.id);
                              }}
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

      {/* Edit Dialog */}
      {console.log('Edit Dialog render - isEditDialogOpen:', isEditDialogOpen, 'editingAnnouncement:', editingAnnouncement?.id)}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>E'lonni tahrirlash</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-6">
            {/* English */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">English</h3>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={formData.title_en}
                  onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Content</Label>
                <Textarea
                  value={formData.content_en}
                  onChange={(e) => setFormData({ ...formData, content_en: e.target.value })}
                  rows={4}
                  required
                />
              </div>
            </div>

            {/* Russian */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Русский</h3>
              <div className="space-y-2">
                <Label>Заголовок</Label>
                <Input
                  value={formData.title_ru}
                  onChange={(e) => setFormData({ ...formData, title_ru: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Содержание</Label>
                <Textarea
                  value={formData.content_ru}
                  onChange={(e) => setFormData({ ...formData, content_ru: e.target.value })}
                  rows={4}
                  required
                />
              </div>
            </div>

            {/* Uzbek */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">O'zbek</h3>
              <div className="space-y-2">
                <Label>Sarlavha</Label>
                <Input
                  value={formData.title_uz}
                  onChange={(e) => setFormData({ ...formData, title_uz: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Mazmun</Label>
                <Textarea
                  value={formData.content_uz}
                  onChange={(e) => setFormData({ ...formData, content_uz: e.target.value })}
                  rows={4}
                  required
                />
              </div>
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input
                type="date"
                value={formData.ends_at}
                onChange={(e) => setFormData({ ...formData, ends_at: e.target.value })}
                required
              />
            </div>

            {/* Media */}
            <div className="space-y-2">
              <Label>Replace Media Files (Optional)</Label>
              <Input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={(e) => setMediaFiles(Array.from(e.target.files || []))}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => { setIsEditDialogOpen(false); resetForm(); }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      {console.log('View Dialog render - isViewDialogOpen:', isViewDialogOpen, 'viewingAnnouncement:', viewingAnnouncement?.id)}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>E'lonni ko'rish</DialogTitle>
          </DialogHeader>
          {viewingAnnouncement && (
            <div className="space-y-6">
              {/* Dates */}
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Published: {formatDate(viewingAnnouncement.published_at)}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Ends: {formatDate(viewingAnnouncement.ends_at)}
                </div>
              </div>

              {/* English */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">English</h3>
                <div className="space-y-1">
                  <p className="font-medium">Title:</p>
                  <p className="text-muted-foreground">{viewingAnnouncement.title_en}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Content:</p>
                  <p className="text-muted-foreground whitespace-pre-wrap">{viewingAnnouncement.content_en}</p>
                </div>
              </div>

              {/* Russian */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Русский</h3>
                <div className="space-y-1">
                  <p className="font-medium">Заголовок:</p>
                  <p className="text-muted-foreground">{viewingAnnouncement.title_ru}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Содержание:</p>
                  <p className="text-muted-foreground whitespace-pre-wrap">{viewingAnnouncement.content_ru}</p>
                </div>
              </div>

              {/* Uzbek */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">O'zbek</h3>
                <div className="space-y-1">
                  <p className="font-medium">Sarlavha:</p>
                  <p className="text-muted-foreground">{viewingAnnouncement.title_uz}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Mazmun:</p>
                  <p className="text-muted-foreground whitespace-pre-wrap">{viewingAnnouncement.content_uz}</p>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
