import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { api } from '@/services/api';

interface Feedback {
  id: number;
  full_name: string;
  workplace: string;
  rating: number;
  message: string;
  created_at: string;
}

export function FeedbackCarousel() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const loadFeedbacks = async () => {
    try {
      const response = await api.getApprovedFeedbacks();
      if (response.success && response.data) {
        // Duplicate feedbacks for seamless loop
        setFeedbacks([...response.data, ...response.data, ...response.data]);
      }
    } catch (error) {
      console.error('Failed to load feedbacks:', error);
    }
  };

  if (feedbacks.length === 0) return null;

  return (
    <div className="relative overflow-hidden py-8">
      <motion.div
        className="flex gap-6"
        animate={{
          x: [0, -100 * (feedbacks.length / 3) + '%'],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: feedbacks.length * 5,
            ease: "linear",
          },
        }}
      >
        {feedbacks.map((feedback, index) => (
          <div
            key={`${feedback.id}-${index}`}
            className="flex-shrink-0 w-96 bg-white rounded-2xl shadow-lg p-6 border-2 border-slate-200"
          >
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < feedback.rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-gray-700 mb-4 line-clamp-4 leading-relaxed">
              "{feedback.message}"
            </p>
            <div className="border-t pt-4">
              <p className="font-bold text-foreground">{feedback.full_name}</p>
              <p className="text-sm text-muted-foreground">{feedback.workplace}</p>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
