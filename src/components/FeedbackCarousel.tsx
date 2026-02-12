import { useEffect, useState, useRef } from 'react';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef(0);

  useEffect(() => {
    loadFeedbacks();
  }, []);

  useEffect(() => {
    if (feedbacks.length === 0 || !containerRef.current) return;

    const container = containerRef.current;
    const firstChild = container.firstElementChild as HTMLElement;
    if (!firstChild) return;

    // Calculate the width of one set of items (including gap)
    const itemWidth = 384 + 24; // w-96 (384px) + gap-6 (24px)
    const setWidth = itemWidth * feedbacks.length;

    let animationFrameId: number;

    const animate = () => {
      scrollPositionRef.current += 0.5; // Speed of scroll
      
      // Reset position when we've scrolled past one complete set
      if (scrollPositionRef.current >= setWidth) {
        scrollPositionRef.current = 0;
      }
      
      container.style.transform = `translateX(-${scrollPositionRef.current}px)`;
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [feedbacks]);

  const loadFeedbacks = async () => {
    try {
      const response = await api.getApprovedFeedbacks();
      if (response.success && response.data && response.data.length > 0) {
        setFeedbacks(response.data);
      }
    } catch (error) {
      console.error('Failed to load feedbacks:', error);
    }
  };

  if (feedbacks.length === 0) return null;

  // Triple the content for seamless looping
  const tripleContent = [...feedbacks, ...feedbacks, ...feedbacks];

  return (
    <div className="relative overflow-hidden py-8">
      <div 
        ref={containerRef}
        className="flex gap-6"
        style={{ willChange: 'transform' }}
      >
        {tripleContent.map((feedback, index) => (
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
      </div>
    </div>
  );
}
