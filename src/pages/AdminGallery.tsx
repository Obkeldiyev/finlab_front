import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus,
  Edit,
  Trash2,
  Image as ImageIcon,
  Video,
  Menu,
  LogOut,
  Shield,
  Users,
  BookOpen,
  Building,
  Award,
  FileText
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ParticleBackground } from '@/components/ParticleBackground';
import { AdminSidebar } from '@/components/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { api } from '@/services/api';
import { toast } from 'sonner';

interface GalleryItem {
  id: number;
  title_en: string;
  title_ru: string;
  title_uz: string;
  url: string;
  type: string;
  created_at: string;
}

export default function AdminGallery() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [createFormData, setCreateFormData] = useState({
    title_en: '',
    title_ru: '',
    title_uz: '',
  });
  const [createFile, setCreateFile] = useState<File | null>(null);

  const [editFormData, setEditFormData] = useState({
    title_en: '',
    title_ru: '',
    title_uz: '',
  });
  const [editFile, setEditFile] = useState<File | null>(null);

  useEffect(() => {
    if (!api.isAuthenticated()) {
      navigate('/admin/login');
      return;
    }
    loadGallery();
  }, [navigate]);

  const loadGallery = async () => {
    try {
      const response = await api.getGallery();
      if (response.success) {
        setGallery(response.data);
      }
    } catch (error) {
      console.error('Failed to load gallery:', error);
      toast.error('Failed to load gallery');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createFile) {
      toast.error('Please select a file');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.createGalleryItem(createFormData, createFile);
      toast.success('Gallery item created successfully');
      setIsCreateDialogOpen(false);
      setCreateFormData({ title_en: '', title_ru: '', title_uz: '' });
      setCreateFile(null);
      loadGallery();
    } catch (error) {
      console.error('Create gallery error:', error);
      toast.error('Failed to create gallery item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setEditFormData({
      title_en: item.title_en,
      title_ru: item.title_ru,
      title_uz: item.title_uz,
    });
    setEditFile(null);
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setIsSubmitting(true);
    try {
      await api.updateGalleryItem(editingItem.id, editFormData, editFile);
      toast.success('Gallery item updated successfully');
      setIsEditDialogOpen(false);
      setEditingItem(null);
      setEditFormData({ title_en: '', title_ru: '', title_uz: '' });
      setEditFile(null);
      loadGallery();
    } catch (error) {
      console.error('Update gallery error:', error);
      toast.error('Failed to update gallery item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this gallery item?')) {
      return;
    }

    try {
      const response = await api.deleteGalleryItem(id);
      if (response.success) {
        toast.success('Gallery item deleted successfully');
        loadGallery();
      } else {
        toast.error('Failed to delete gallery item');
      }
    } catch (error) {
      console.error('Delete gallery error:', error);
      toast.error('Failed to delete gallery item');
    }
  };

  const handleLogout = () => {
    api.logout();
    navigate('/admin/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <ParticleBackground />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center bg-white p-8 rounded-2xl border shadow-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading gallery...</p>
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
                    Gallery Management
                  </h1>
                  <p className="text-slate-300">
                    Manage photos and videos
                  </p>
                </div>
              </div>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Media
              </Button>
            </div>
          </header>

          {/* Content */}
          <div className="p-4 lg:p-8">
            <div className="grid gap-6">
              {gallery.length === 0 ? (
                <Card className="backdrop-blur-sm bg-white/75 border-blue-200/40">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No gallery items found</h3>
                    <p className="text-muted-foreground text-center mb-4">
                      Add your first photo or video
                    </p>
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Media
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {gallery.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="backdrop-blur-sm bg-white/75 border-blue-200/40 hover:shadow-lg transition-all overflow-hidden">
                        {/* Media Preview */}
                        <div className="relative h-48">
                          {item.type === 'image' ? (
                            <img
                              src={`${import.meta.env.VITE_API_URL || '/api'}${item.url}`}
                              alt={item.title_en}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <video
                              src={`${import.meta.env.VITE_API_URL || '/api'}${item.url}`}
                              className="w-full h-full object-cover"
                              muted
                              preload="metadata"
                            />
                          )}
                          <div className="absolute top-2 right-2">
                            {item.type === 'image' ? (
                              <ImageIcon className="h-5 w-5 text-white drop-shadow-lg" />
                            ) : (
                              <Video className="h-5 w-5 text-white drop-shadow-lg" />
                            )}
                          </div>
                        </div>

                        <CardHeader>
                          <CardTitle className="text-sm line-clamp-2">
                            {language === 'uz' ? item.title_uz : language === 'ru' ? item.title_ru : item.title_en}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1"
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
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Gallery Item</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Title (English)</Label>
              <Input
                value={createFormData.title_en}
                onChange={(e) => setCreateFormData({ ...createFormData, title_en: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Заголовок (Русский)</Label>
              <Input
                value={createFormData.title_ru}
                onChange={(e) => setCreateFormData({ ...createFormData, title_ru: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Sarlavha (O'zbek)</Label>
              <Input
                value={createFormData.title_uz}
                onChange={(e) => setCreateFormData({ ...createFormData, title_uz: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Media File</Label>
              <Input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setCreateFile(e.target.files?.[0] || null)}
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Gallery Item</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Title (English)</Label>
              <Input
                value={editFormData.title_en}
                onChange={(e) => setEditFormData({ ...editFormData, title_en: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Заголовок (Русский)</Label>
              <Input
                value={editFormData.title_ru}
                onChange={(e) => setEditFormData({ ...editFormData, title_ru: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Sarlavha (O'zbek)</Label>
              <Input
                value={editFormData.title_uz}
                onChange={(e) => setEditFormData({ ...editFormData, title_uz: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Replace Media File (Optional)</Label>
              <Input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setEditFile(e.target.files?.[0] || null)}
              />
              <p className="text-sm text-muted-foreground">
                Leave empty to keep existing media
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
                {isSubmitting ? 'Updating...' : 'Update'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
