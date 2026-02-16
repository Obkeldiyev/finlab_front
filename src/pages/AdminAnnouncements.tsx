import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

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
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [formData, setFormData] = useState({
    title_uz: '',
    title_ru: '',
    title_en: '',
    content_uz: '',
    content_ru: '',
    content_en: '',
    ends_at: '',
  });
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      const response = await api.getAnnouncements();
      if (response.success && response.data) {
        setAnnouncements(response.data);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load announcements',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      
      mediaFiles.forEach((file) => {
        formDataToSend.append('media', file);
      });

      let response;
      if (editingAnnouncement) {
        response = await api.updateAnnouncement(editingAnnouncement.id, formDataToSend);
      } else {
        response = await api.createAnnouncement(formDataToSend);
      }

      if (response.success) {
        toast({
          title: 'Success',
          description: editingAnnouncement ? 'Announcement updated' : 'Announcement created',
        });
        setIsModalOpen(false);
        resetForm();
        loadAnnouncements();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save announcement',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;

    try {
      const response = await api.deleteAnnouncement(id);
      if (response.success) {
        toast({
          title: 'Success',
          description: 'Announcement deleted',
        });
        loadAnnouncements();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete announcement',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (announcement: Announcement) => {
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
    setIsModalOpen(true);
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

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">E'lonlar / Announcements</h1>
        <Button onClick={() => { resetForm(); setIsModalOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Add Announcement
        </Button>
      </div>

      <div className="grid gap-4">
        {announcements.map((announcement) => (
          <Card key={announcement.id} className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">{announcement.title_uz}</h3>
                <p className="text-muted-foreground mb-4 line-clamp-2">{announcement.content_uz}</p>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(announcement.published_at).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Ends: {new Date(announcement.ends_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(announcement)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(announcement.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold mb-4">
              {editingAnnouncement ? 'Edit Announcement' : 'Add Announcement'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label>Title (UZ)</Label>
                  <Input
                    value={formData.title_uz}
                    onChange={(e) => setFormData({ ...formData, title_uz: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Title (RU)</Label>
                  <Input
                    value={formData.title_ru}
                    onChange={(e) => setFormData({ ...formData, title_ru: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Title (EN)</Label>
                  <Input
                    value={formData.title_en}
                    onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label>Content (UZ)</Label>
                  <Textarea
                    value={formData.content_uz}
                    onChange={(e) => setFormData({ ...formData, content_uz: e.target.value })}
                    rows={4}
                    required
                  />
                </div>
                <div>
                  <Label>Content (RU)</Label>
                  <Textarea
                    value={formData.content_ru}
                    onChange={(e) => setFormData({ ...formData, content_ru: e.target.value })}
                    rows={4}
                    required
                  />
                </div>
                <div>
                  <Label>Content (EN)</Label>
                  <Textarea
                    value={formData.content_en}
                    onChange={(e) => setFormData({ ...formData, content_en: e.target.value })}
                    rows={4}
                    required
                  />
                </div>
              </div>

              <div>
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={formData.ends_at}
                  onChange={(e) => setFormData({ ...formData, ends_at: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label>Media Files</Label>
                <Input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={(e) => setMediaFiles(Array.from(e.target.files || []))}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => { setIsModalOpen(false); resetForm(); }}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingAnnouncement ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
