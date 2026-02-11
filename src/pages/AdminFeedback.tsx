import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Trash2,
  MessageSquare,
  Menu,
  Mail,
  Phone,
  Calendar,
} from 'lucide-react';
import { ParticleBackground } from '@/components/ParticleBackground';
import { AdminSidebar } from '@/components/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { api } from '@/services/api';
import { toast } from 'sonner';

interface Feedback {
  id: number;
  phone_number: string;
  email: string;
  message: string;
  created_at: string;
}

export default function AdminFeedback() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewingFeedback, setViewingFeedback] = useState<Feedback | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  useEffect(() => {
    if (!api.isAuthenticated()) {
      navigate('/admin/login');
      return;
    }
    loadFeedback();
  }, [navigate]);

  const loadFeedback = async () => {
    try {
      const response = await api.getFeedback();
      if (response.success) {
        setFeedback(response.data);
      }
    } catch (error) {
      console.error('Failed to load feedback:', error);
      toast.error('Failed to load feedback');
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (item: Feedback) => {
    setViewingFeedback(item);
    setIsViewDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this feedback?')) {
      return;
    }

    try {
      const response = await api.deleteFeedback(id);
      if (response.success) {
        toast.success('Feedback deleted successfully');
        loadFeedback();
      } else {
        toast.error('Failed to delete feedback');
      }
    } catch (error) {
      console.error('Delete feedback error:', error);
      toast.error('Failed to delete feedback');
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <ParticleBackground />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center bg-white p-8 rounded-2xl border shadow-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading feedback...</p>
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
                    User Feedback
                  </h1>
                  <p className="text-slate-300">
                    View and manage user feedback
                  </p>
                </div>
              </div>
              <div className="text-white">
                <span className="text-sm">Total: {feedback.length}</span>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="p-4 lg:p-8">
            <div className="grid gap-6">
              {feedback.length === 0 ? (
                <Card className="backdrop-blur-sm bg-white/75 border-blue-200/40">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No feedback yet</h3>
                    <p className="text-muted-foreground text-center">
                      User feedback will appear here
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {feedback.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="backdrop-blur-sm bg-white/75 border-blue-200/40 hover:shadow-lg transition-all">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                {formatDate(item.created_at)}
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-4 w-4 text-primary" />
                                <span>{item.phone_number}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="h-4 w-4 text-primary" />
                                <span>{item.email}</span>
                              </div>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleDelete(item.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground line-clamp-3 mb-4">
                            {item.message}
                          </p>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleView(item)}
                          >
                            View Full Message
                          </Button>
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

      {/* View Feedback Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Feedback Details</DialogTitle>
          </DialogHeader>
          {viewingFeedback && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {formatDate(viewingFeedback.created_at)}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number</label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>{viewingFeedback.phone_number}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>{viewingFeedback.email}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="whitespace-pre-wrap">{viewingFeedback.message}</p>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsViewDialogOpen(false)}
                >
                  Close
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setIsViewDialogOpen(false);
                    handleDelete(viewingFeedback.id);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
