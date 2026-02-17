import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Calendar, Clock, Eye, Menu } from 'lucide-react';
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
}

export default function AdminAnnouncements() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<Announcement | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState<Announcement | null>(null);
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

  const handleEdit = (item: Announcement) => {
    console.log('handleEdit called with:', item);
    setEditingItem(item);
    setFormData({
      title_en: item.title_en,
      title_ru: item.title_ru,
      title_uz: item.title_uz,
      content_en: item.content_en,
      content_ru: item.content_ru,
      content_uz: item.content_uz,
      ends_at: item.ends_at.split('T')[0],
    });
    console.log('Setting isEditDialogOpen to true');
    setIsEditDialogOpen(true);
    console.log('isEditDialogOpen should now be true');
  };

  const handleView = (item: Announcement) => {
    console.log('handleView called with:', item);
    setViewingItem(item);
    console.log('Setting isViewDialogOpen to true');
    setIsViewDialogOpen(true);
    console.log('isViewDialogOpen should now be true');
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
      const response = await api.createAnnouncement(fd);
      if (response.success) {
        toast.success('Created successfully');
        setShowCreateDialog(false);
        setFormData({ title_en: '', title_ru: '', title_uz: '', content_en: '', content_ru: '', content_uz: '', ends_at: '' });
        loadData();
      }
    } catch (error) {
      toast.error('Failed to create');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setIsSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
      const response = await api.updateAnnouncement(editingItem.id, fd);
      if (response.success) {
        toast.success('Updated successfully');
        setIsEditDialogOpen(false);
        setEditingItem(null);
        loadData();
      }
    } catch (error) {
      toast.error('Failed to update');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this announcement?')) return;
    try {
      const response = await api.deleteAnnouncement(id);
      if (response.success) {
        toast.success('Deleted successfully');
        loadData();
      }
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <ParticleBackground />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center bg-white p-8 rounded-2xl border shadow-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
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
                  <h1 className="text-2xl font-display font-bold text-white">E'lonlar</h1>
                  <p className="text-slate-300">Manage announcements</p>
                </div>
              </div>
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button><Plus className="h-4 w-4 mr-2" />Create</Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader><DialogTitle>Create Announcement</DialogTitle></DialogHeader>
                  <form onSubmit={handleCreateSubmit} className="space-y-4">
                    <div><Label>Title (EN)</Label><Input value={formData.title_en} onChange={(e) => setFormData({...formData, title_en: e.target.value})} required /></div>
                    <div><Label>Content (EN)</Label><Textarea value={formData.content_en} onChange={(e) => setFormData({...formData, content_en: e.target.value})} required /></div>
                    <div><Label>Title (RU)</Label><Input value={formData.title_ru} onChange={(e) => setFormData({...formData, title_ru: e.target.value})} required /></div>
                    <div><Label>Content (RU)</Label><Textarea value={formData.content_ru} onChange={(e) => setFormData({...formData, content_ru: e.target.value})} required /></div>
                    <div><Label>Title (UZ)</Label><Input value={formData.title_uz} onChange={(e) => setFormData({...formData, title_uz: e.target.value})} required /></div>
                    <div><Label>Content (UZ)</Label><Textarea value={formData.content_uz} onChange={(e) => setFormData({...formData, content_uz: e.target.value})} required /></div>
                    <div><Label>End Date</Label><Input type="date" value={formData.ends_at} onChange={(e) => setFormData({...formData, ends_at: e.target.value})} required /></div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
                      <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating...' : 'Create'}</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </header>

          <div className="p-4 lg:p-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {announcements.map((item, index) => (
                <motion.div key={item.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                  <Card className="backdrop-blur-sm bg-white/75 border-blue-200/40 hover:shadow-lg transition-all">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline"><Calendar className="h-3 w-3 mr-1" />{new Date(item.published_at).toLocaleDateString()}</Badge>
                        <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />{new Date(item.ends_at).toLocaleDateString()}</Badge>
                      </div>
                      <CardTitle className="text-lg line-clamp-2">{getLocalizedField(item, 'title', language)}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm line-clamp-3 mb-4">{getLocalizedField(item, 'content', language)}</p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => { console.log('VIEW CLICKED', item.id); handleView(item); }}><Eye className="h-4 w-4 mr-2" />View</Button>
                        <Button variant="outline" size="sm" onClick={() => { console.log('EDIT CLICKED', item.id); handleEdit(item); }}><Edit className="h-4 w-4" /></Button>
                        <Button variant="outline" size="sm" onClick={() => { console.log('DELETE CLICKED', item.id); handleDelete(item.id); }} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </main>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={(open) => { console.log('Edit dialog onOpenChange:', open); setIsEditDialogOpen(open); }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Edit Announcement</DialogTitle></DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div><Label>Title (EN)</Label><Input value={formData.title_en} onChange={(e) => setFormData({...formData, title_en: e.target.value})} required /></div>
            <div><Label>Content (EN)</Label><Textarea value={formData.content_en} onChange={(e) => setFormData({...formData, content_en: e.target.value})} required /></div>
            <div><Label>Title (RU)</Label><Input value={formData.title_ru} onChange={(e) => setFormData({...formData, title_ru: e.target.value})} required /></div>
            <div><Label>Content (RU)</Label><Textarea value={formData.content_ru} onChange={(e) => setFormData({...formData, content_ru: e.target.value})} required /></div>
            <div><Label>Title (UZ)</Label><Input value={formData.title_uz} onChange={(e) => setFormData({...formData, title_uz: e.target.value})} required /></div>
            <div><Label>Content (UZ)</Label><Textarea value={formData.content_uz} onChange={(e) => setFormData({...formData, content_uz: e.target.value})} required /></div>
            <div><Label>End Date</Label><Input type="date" value={formData.ends_at} onChange={(e) => setFormData({...formData, ends_at: e.target.value})} required /></div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Updating...' : 'Update'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewDialogOpen} onOpenChange={(open) => { console.log('View dialog onOpenChange:', open); setIsViewDialogOpen(open); }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>View Announcement</DialogTitle></DialogHeader>
          {viewingItem && (
            <div className="space-y-6">
              <div className="flex gap-4 text-sm">
                <Badge><Calendar className="h-3 w-3 mr-1" />Published: {new Date(viewingItem.published_at).toLocaleDateString()}</Badge>
                <Badge><Clock className="h-3 w-3 mr-1" />Ends: {new Date(viewingItem.ends_at).toLocaleDateString()}</Badge>
              </div>
              <div><h3 className="font-semibold">English</h3><p className="font-medium">Title:</p><p className="text-muted-foreground">{viewingItem.title_en}</p><p className="font-medium mt-2">Content:</p><p className="text-muted-foreground whitespace-pre-wrap">{viewingItem.content_en}</p></div>
              <div><h3 className="font-semibold">Русский</h3><p className="font-medium">Заголовок:</p><p className="text-muted-foreground">{viewingItem.title_ru}</p><p className="font-medium mt-2">Содержание:</p><p className="text-muted-foreground whitespace-pre-wrap">{viewingItem.content_ru}</p></div>
              <div><h3 className="font-semibold">O'zbek</h3><p className="font-medium">Sarlavha:</p><p className="text-muted-foreground">{viewingItem.title_uz}</p><p className="font-medium mt-2">Mazmun:</p><p className="text-muted-foreground whitespace-pre-wrap">{viewingItem.content_uz}</p></div>
              <div className="flex justify-end"><Button onClick={() => setIsViewDialogOpen(false)}>Close</Button></div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
