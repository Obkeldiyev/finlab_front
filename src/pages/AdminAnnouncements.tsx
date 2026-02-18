import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Calendar, Clock, Eye, Menu } from 'lucide-react';
import { useLanguage, getLocalizedField } from '@/contexts/LanguageContext';
import { ParticleBackground } from '@/components/ParticleBackground';
import { AdminSidebar } from '@/components/AdminSidebar';
import { AnnouncementForm } from '@/components/admin/AnnouncementForm';
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
  medias?: { id: number; url: string; type: string }[];
}

export default function AdminAnnouncements() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Announcement | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState<Announcement | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title_en: '',
    title_ru: '',
    title_uz: '',
    content_en: '',
    content_ru: '',
    content_uz: '',
    ends_at: '',
  });
  const [editFiles, setEditFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!api.isAuthenticated()) {
      navigate('/admin/login');
      return;
    }
    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      const response = await api.getAnnouncements();
      if (response.success && response.data) {
        setAnnouncements(response.data);
      }
    } catch (error) {
      toast.error('Failed to load announcements');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    loadData();
  };

  const handleEdit = (item: Announcement) => {
    setEditingItem(item);
    setEditFormData({
      title_en: item.title_en,
      title_ru: item.title_ru,
      title_uz: item.title_uz,
      content_en: item.content_en,
      content_ru: item.content_ru,
      content_uz: item.content_uz,
      ends_at: item.ends_at.split('T')[0],
    });
    setEditFiles([]);
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    
    setIsSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(editFormData).forEach(([k, v]) => fd.append(k, v));
      editFiles.forEach(file => fd.append('medias', file));
      
      const response = await api.updateAnnouncement(editingItem.id, fd);
      if (response.success) {
        toast.success('Announcement updated successfully');
        setIsEditDialogOpen(false);
        setEditingItem(null);
        setEditFormData({
          title_en: '',
          title_ru: '',
          title_uz: '',
          content_en: '',
          content_ru: '',
          content_uz: '',
          ends_at: '',
        });
        setEditFiles([]);
        loadData();
      }
    } catch (error) {
      toast.error('Failed to update announcement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;
    try {
      const response = await api.deleteAnnouncement(id);
      if (response.success) {
        toast.success('Announcement deleted successfully');
        loadData();
      }
    } catch (error) {
      toast.error('Failed to delete announcement');
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
        <aside className="hidden lg:flex w-64 flex-col">
          <AdminSidebar />
        </aside>

        <Sheet>
          <SheetContent side="left" className="w-64 p-0">
            <AdminSidebar />
          </SheetContent>
        </Sheet>

        <main className="flex-1">
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
                  <h1 className="text-2xl font-display font-bold text-white">E'lonlar boshqaruvi</h1>
                  <p className="text-slate-300">E'lonlar yaratish va boshqarish</p>
                </div>
              </div>
              <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    E'lon yaratish
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {language === 'uz' ? 'Yangi e\'lon' : language === 'ru' ? 'Новое объявление' : 'New Announcement'}
                    </DialogTitle>
                  </DialogHeader>
                  <AnnouncementForm 
                    onSuccess={handleCreateSuccess}
                    onCancel={() => setShowCreateForm(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </header>

          <div className="p-4 lg:p-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {announcements.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="backdrop-blur-sm bg-white/75 border-blue-200/40 hover:shadow-lg transition-all">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(item.published_at)}
                        </Badge>
                        <Badge variant="outline">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDate(item.ends_at)}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg line-clamp-2">
                        {getLocalizedField(item, 'title', language)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                        {getLocalizedField(item, 'content', language)}
                      </p>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => {
                            setViewingItem(item);
                            setIsViewDialogOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          {language === 'uz' ? 'Ko\'rish' : language === 'ru' ? 'Просмотр' : 'View'}
                        </Button>
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
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Announcement</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">English</h3>
              <div className="space-y-2">
                <Label>Title (English)</Label>
                <Input
                  value={editFormData.title_en}
                  onChange={(e) => setEditFormData({ ...editFormData, title_en: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Content (English)</Label>
                <Textarea
                  value={editFormData.content_en}
                  onChange={(e) => setEditFormData({ ...editFormData, content_en: e.target.value })}
                  rows={4}
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Русский</h3>
              <div className="space-y-2">
                <Label>Заголовок (Русский)</Label>
                <Input
                  value={editFormData.title_ru}
                  onChange={(e) => setEditFormData({ ...editFormData, title_ru: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Содержание (Русский)</Label>
                <Textarea
                  value={editFormData.content_ru}
                  onChange={(e) => setEditFormData({ ...editFormData, content_ru: e.target.value })}
                  rows={4}
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">O'zbek</h3>
              <div className="space-y-2">
                <Label>Sarlavha (O'zbek)</Label>
                <Input
                  value={editFormData.title_uz}
                  onChange={(e) => setEditFormData({ ...editFormData, title_uz: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Mazmun (O'zbek)</Label>
                <Textarea
                  value={editFormData.content_uz}
                  onChange={(e) => setEditFormData({ ...editFormData, content_uz: e.target.value })}
                  rows={4}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>
              <Input
                type="date"
                value={editFormData.ends_at}
                onChange={(e) => setEditFormData({ ...editFormData, ends_at: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Replace Media Files (Optional)</Label>
              <Input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={(e) => setEditFiles(Array.from(e.target.files || []))}
              />
              <p className="text-sm text-muted-foreground">
                Leave empty to keep existing media. Upload new files to replace all media.
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update Announcement'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>View Announcement</DialogTitle>
          </DialogHeader>
          {viewingItem && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {formatDate(viewingItem.published_at)}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Ends: {formatDate(viewingItem.ends_at)}
              </div>

              {viewingItem.medias && viewingItem.medias.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Media ({viewingItem.medias.length})</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {viewingItem.medias.map((media, index) => (
                      <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
                        {media.type === 'image' ? (
                          <img
                            src={`${import.meta.env.VITE_API_URL || '/api'}${media.url}`}
                            alt={`Media ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <video
                            src={`${import.meta.env.VITE_API_URL || '/api'}${media.url}`}
                            controls
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <h3 className="text-lg font-semibold">English</h3>
                <div className="space-y-1">
                  <p className="font-medium">Title:</p>
                  <p className="text-muted-foreground">{viewingItem.title_en}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Content:</p>
                  <p className="text-muted-foreground whitespace-pre-wrap">{viewingItem.content_en}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Русский</h3>
                <div className="space-y-1">
                  <p className="font-medium">Заголовок:</p>
                  <p className="text-muted-foreground">{viewingItem.title_ru}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Содержание:</p>
                  <p className="text-muted-foreground whitespace-pre-wrap">{viewingItem.content_ru}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold">O'zbek</h3>
                <div className="space-y-1">
                  <p className="font-medium">Sarlavha:</p>
                  <p className="text-muted-foreground">{viewingItem.title_uz}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Mazmun:</p>
                  <p className="text-muted-foreground whitespace-pre-wrap">{viewingItem.content_uz}</p>
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
