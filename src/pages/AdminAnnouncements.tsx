import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Calendar, Clock, Eye, Menu, X } from 'lucide-react';
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
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Announcement | null>(null);

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

  const openViewModal = (item: Announcement) => {
    console.log('openViewModal called', item);
    alert('Opening view modal for: ' + item.title_uz);
    setSelectedItem(item);
    setShowViewModal(true);
    console.log('showViewModal set to:', true);
  };

  const openEditModal = (item: Announcement) => {
    console.log('openEditModal called', item);
    alert('Opening edit modal for: ' + item.title_uz);
    setSelectedItem(item);
    setFormData({
      title_en: item.title_en,
      title_ru: item.title_ru,
      title_uz: item.title_uz,
      content_en: item.content_en,
      content_ru: item.content_ru,
      content_uz: item.content_uz,
      ends_at: item.ends_at.split('T')[0],
    });
    setShowEditModal(true);
    console.log('showEditModal set to:', true);
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
        setShowCreateModal(false);
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
    if (!selectedItem) return;
    setIsSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
      const response = await api.updateAnnouncement(selectedItem.id, fd);
      if (response.success) {
        toast.success('Updated successfully');
        setShowEditModal(false);
        setSelectedItem(null);
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
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="h-4 w-4 mr-2" />Create
              </Button>
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
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => openViewModal(item)}><Eye className="h-4 w-4 mr-2" />View</Button>
                        <Button variant="outline" size="sm" onClick={() => openEditModal(item)}><Edit className="h-4 w-4" /></Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(item.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4" onClick={() => setShowCreateModal(false)}>
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-2xl font-bold">Create Announcement</h2>
              <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-gray-100 rounded-full"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              <div><Label>Title (EN)</Label><Input value={formData.title_en} onChange={(e) => setFormData({ ...formData, title_en: e.target.value })} required /></div>
              <div><Label>Content (EN)</Label><Textarea value={formData.content_en} onChange={(e) => setFormData({ ...formData, content_en: e.target.value })} rows={3} required /></div>
              <div><Label>Title (RU)</Label><Input value={formData.title_ru} onChange={(e) => setFormData({ ...formData, title_ru: e.target.value })} required /></div>
              <div><Label>Content (RU)</Label><Textarea value={formData.content_ru} onChange={(e) => setFormData({ ...formData, content_ru: e.target.value })} rows={3} required /></div>
              <div><Label>Title (UZ)</Label><Input value={formData.title_uz} onChange={(e) => setFormData({ ...formData, title_uz: e.target.value })} required /></div>
              <div><Label>Content (UZ)</Label><Textarea value={formData.content_uz} onChange={(e) => setFormData({ ...formData, content_uz: e.target.value })} rows={3} required /></div>
              <div><Label>End Date</Label><Input type="date" value={formData.ends_at} onChange={(e) => setFormData({ ...formData, ends_at: e.target.value })} required /></div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating...' : 'Create'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedItem && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4" onClick={() => setShowEditModal(false)}>
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-2xl font-bold">Edit Announcement</h2>
              <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-gray-100 rounded-full"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div><Label>Title (EN)</Label><Input value={formData.title_en} onChange={(e) => setFormData({ ...formData, title_en: e.target.value })} required /></div>
              <div><Label>Content (EN)</Label><Textarea value={formData.content_en} onChange={(e) => setFormData({ ...formData, content_en: e.target.value })} rows={3} required /></div>
              <div><Label>Title (RU)</Label><Input value={formData.title_ru} onChange={(e) => setFormData({ ...formData, title_ru: e.target.value })} required /></div>
              <div><Label>Content (RU)</Label><Textarea value={formData.content_ru} onChange={(e) => setFormData({ ...formData, content_ru: e.target.value })} rows={3} required /></div>
              <div><Label>Title (UZ)</Label><Input value={formData.title_uz} onChange={(e) => setFormData({ ...formData, title_uz: e.target.value })} required /></div>
              <div><Label>Content (UZ)</Label><Textarea value={formData.content_uz} onChange={(e) => setFormData({ ...formData, content_uz: e.target.value })} rows={3} required /></div>
              <div><Label>End Date</Label><Input type="date" value={formData.ends_at} onChange={(e) => setFormData({ ...formData, ends_at: e.target.value })} required /></div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowEditModal(false)}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Updating...' : 'Update'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedItem && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4" onClick={() => setShowViewModal(false)}>
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-2xl font-bold">View Announcement</h2>
              <button onClick={() => setShowViewModal(false)} className="p-2 hover:bg-gray-100 rounded-full"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex gap-4">
                <Badge><Calendar className="h-3 w-3 mr-1" />Published: {new Date(selectedItem.published_at).toLocaleDateString()}</Badge>
                <Badge><Clock className="h-3 w-3 mr-1" />Ends: {new Date(selectedItem.ends_at).toLocaleDateString()}</Badge>
              </div>
              <div><h3 className="font-semibold text-lg mb-2">English</h3><p className="font-medium">Title:</p><p className="text-muted-foreground mb-2">{selectedItem.title_en}</p><p className="font-medium">Content:</p><p className="text-muted-foreground whitespace-pre-wrap">{selectedItem.content_en}</p></div>
              <div><h3 className="font-semibold text-lg mb-2">Русский</h3><p className="font-medium">Заголовок:</p><p className="text-muted-foreground mb-2">{selectedItem.title_ru}</p><p className="font-medium">Содержание:</p><p className="text-muted-foreground whitespace-pre-wrap">{selectedItem.content_ru}</p></div>
              <div><h3 className="font-semibold text-lg mb-2">O'zbek</h3><p className="font-medium">Sarlavha:</p><p className="text-muted-foreground mb-2">{selectedItem.title_uz}</p><p className="font-medium">Mazmun:</p><p className="text-muted-foreground whitespace-pre-wrap">{selectedItem.content_uz}</p></div>
              <div className="flex justify-end pt-4"><Button onClick={() => setShowViewModal(false)}>Close</Button></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
