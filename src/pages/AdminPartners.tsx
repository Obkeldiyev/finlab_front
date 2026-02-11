import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Menu,
} from 'lucide-react';
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

interface Partner {
  id: number;
  name: string;
  logo_url: string;
  website_url: string;
  created_at: string;
}

export default function AdminPartners() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [createName, setCreateName] = useState('');
  const [createWebsiteUrl, setCreateWebsiteUrl] = useState('');
  const [createLogo, setCreateLogo] = useState<File | null>(null);

  const [editName, setEditName] = useState('');
  const [editWebsiteUrl, setEditWebsiteUrl] = useState('');
  const [editLogo, setEditLogo] = useState<File | null>(null);

  useEffect(() => {
    if (!api.isAuthenticated()) {
      navigate('/admin/login');
      return;
    }
    loadPartners();
  }, [navigate]);

  const loadPartners = async () => {
    try {
      const response = await api.getPartners();
      if (response.success) {
        setPartners(response.data);
      }
    } catch (error) {
      console.error('Failed to load partners:', error);
      toast.error('Failed to load partners');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createLogo) {
      toast.error('Please select a logo');
      return;
    }
    if (!createName.trim() || !createWebsiteUrl.trim()) {
      toast.error('Please fill all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.createPartner(createName, createWebsiteUrl, createLogo);
      toast.success('Partner created successfully');
      setIsCreateDialogOpen(false);
      setCreateName('');
      setCreateWebsiteUrl('');
      setCreateLogo(null);
      loadPartners();
    } catch (error) {
      console.error('Create partner error:', error);
      toast.error('Failed to create partner');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (partner: Partner) => {
    setEditingPartner(partner);
    setEditName(partner.name);
    setEditWebsiteUrl(partner.website_url);
    setEditLogo(null);
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPartner) return;
    if (!editName.trim() || !editWebsiteUrl.trim()) {
      toast.error('Please fill all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.updatePartner(editingPartner.id, editName, editWebsiteUrl, editLogo);
      toast.success('Partner updated successfully');
      setIsEditDialogOpen(false);
      setEditingPartner(null);
      setEditName('');
      setEditWebsiteUrl('');
      setEditLogo(null);
      loadPartners();
    } catch (error) {
      console.error('Update partner error:', error);
      toast.error('Failed to update partner');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this partner?')) {
      return;
    }

    try {
      const response = await api.deletePartner(id);
      if (response.success) {
        toast.success('Partner deleted successfully');
        loadPartners();
      } else {
        toast.error('Failed to delete partner');
      }
    } catch (error) {
      console.error('Delete partner error:', error);
      toast.error('Failed to delete partner');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <ParticleBackground />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center bg-white p-8 rounded-2xl border shadow-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading partners...</p>
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
                    Partners Management
                  </h1>
                  <p className="text-slate-300">
                    Manage partner organizations
                  </p>
                </div>
              </div>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Partner
              </Button>
            </div>
          </header>

          {/* Content */}
          <div className="p-4 lg:p-8">
            <div className="grid gap-6">
              {partners.length === 0 ? (
                <Card className="backdrop-blur-sm bg-white/75 border-blue-200/40">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <ExternalLink className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No partners found</h3>
                    <p className="text-muted-foreground text-center mb-4">
                      Add your first partner organization
                    </p>
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Partner
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {partners.map((partner, index) => (
                    <motion.div
                      key={partner.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="backdrop-blur-sm bg-white/75 border-blue-200/40 hover:shadow-lg transition-all overflow-hidden">
                        {/* Logo */}
                        <div className="relative h-32 bg-gray-50 flex items-center justify-center p-4">
                          <img
                            src={`${import.meta.env.VITE_API_URL || '/api'}${partner.logo_url}`}
                            alt={partner.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>

                        <CardHeader>
                          <CardTitle className="text-sm line-clamp-2">
                            {partner.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <a
                              href={partner.website_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline flex items-center gap-1"
                            >
                              <ExternalLink className="h-3 w-3" />
                              Visit Website
                            </a>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1"
                                onClick={() => handleEdit(partner)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleDelete(partner.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Partner</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Partner Name</Label>
              <Input
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                placeholder="Enter partner name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Website URL</Label>
              <Input
                value={createWebsiteUrl}
                onChange={(e) => setCreateWebsiteUrl(e.target.value)}
                placeholder="https://example.com"
                type="url"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Logo (Image)</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setCreateLogo(e.target.files?.[0] || null)}
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Partner</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Partner Name</Label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Enter partner name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Website URL</Label>
              <Input
                value={editWebsiteUrl}
                onChange={(e) => setEditWebsiteUrl(e.target.value)}
                placeholder="https://example.com"
                type="url"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Replace Logo (Optional)</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setEditLogo(e.target.files?.[0] || null)}
              />
              <p className="text-sm text-muted-foreground">
                Leave empty to keep existing logo
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
