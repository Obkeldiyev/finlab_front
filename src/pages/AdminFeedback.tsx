import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Trash2, Check, Star, X } from 'lucide-react';

interface Feedback {
  id: number;
  full_name: string;
  workplace: string;
  phone_number: string;
  email: string;
  rating: number;
  message: string;
  is_approved: boolean;
  created_at: string;
}

export default function AdminFeedback() {
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const loadFeedbacks = async () => {
    try {
      const response = await api.getAllFeedbacks();
      if (response.success) {
        setFeedbacks(response.data);
      }
    } catch (error) {
      console.error('Failed to load feedbacks:', error);
      toast.error('Failed to load feedbacks');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      const response = await api.approveFeedback(id);
      if (response.success) {
        toast.success('Feedback approved');
        loadFeedbacks();
      }
    } catch (error) {
      console.error('Failed to approve feedback:', error);
      toast.error('Failed to approve feedback');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this feedback?')) return;

    try {
      const response = await api.deleteFeedback(id);
      if (response.success) {
        toast.success('Feedback deleted');
        loadFeedbacks();
      }
    } catch (error) {
      console.error('Failed to delete feedback:', error);
      toast.error('Failed to delete feedback');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Feedbacks</h1>
          <Button onClick={() => navigate('/admin/dashboard')}>
            Back to Dashboard
          </Button>
        </div>

        <div className="grid gap-6">
          {feedbacks.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center text-muted-foreground">
                No feedbacks yet
              </CardContent>
            </Card>
          ) : (
            feedbacks.map((feedback) => (
              <Card key={feedback.id} className={feedback.is_approved ? 'border-green-500' : ''}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{feedback.full_name}</CardTitle>
                      <p className="text-sm text-muted-foreground mb-2">{feedback.workplace}</p>
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < feedback.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {feedback.email} • {feedback.phone_number}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(feedback.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {!feedback.is_approved && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleApprove(feedback.id)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      )}
                      {feedback.is_approved && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Check className="h-3 w-3 mr-1" />
                          Approved
                        </span>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(feedback.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">{feedback.message}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
