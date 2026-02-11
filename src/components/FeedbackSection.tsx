import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { api } from '@/services/api';
import { FeedbackCarousel } from './FeedbackCarousel';

export function FeedbackSection({ language }: { language: string }) {
  const [fullName, setFullName] = useState('');
  const [workplace, setWorkplace] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !workplace || !phoneNumber || !email || !message) {
      toast.error(
        language === 'uz'
          ? "Barcha maydonlarni to'ldiring"
          : language === 'ru'
          ? 'Заполните все поля'
          : 'Fill all fields'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.submitFeedback(
        fullName,
        workplace,
        phoneNumber,
        email,
        rating,
        message
      );
      if (response.success) {
        toast.success(
          language === 'uz'
            ? "Fikringiz yuborildi! Tasdiqlangandan so'ng ko'rsatiladi."
            : language === 'ru'
            ? 'Ваш отзыв отправлен! Будет показан после одобрения.'
            : 'Feedback submitted! Will be shown after approval.'
        );
        setFullName('');
        setWorkplace('');
        setPhoneNumber('');
        setEmail('');
        setRating(5);
        setMessage('');
      } else {
        toast.error(
          language === 'uz'
            ? 'Xatolik yuz berdi'
            : language === 'ru'
            ? 'Произошла ошибка'
            : 'An error occurred'
        );
      }
    } catch (error) {
      console.error('Feedback error:', error);
      toast.error(
        language === 'uz'
          ? 'Xatolik yuz berdi'
          : language === 'ru'
          ? 'Произошла ошибка'
          : 'An error occurred'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Approved Feedbacks Carousel */}
      <section className="section-padding relative z-10 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              {language === 'uz' && 'Tinglovchilarimiz fikrlari'}
              {language === 'ru' && 'Отзывы наших слушателей'}
              {language === 'en' && 'Our Students Feedback'}
            </h2>
            <p className="text-lg text-muted-foreground">
              {language === 'uz' && 'Laboratoriyamiz haqida nima deyishadi'}
              {language === 'ru' && 'Что говорят о нашей лаборатории'}
              {language === 'en' && 'What they say about our laboratory'}
            </p>
          </motion.div>

          <FeedbackCarousel />
        </div>
      </section>

      {/* Feedback Form */}
      <section className="section-padding relative z-10 bg-white">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              {language === 'uz' && 'Fikringizni bildiring'}
              {language === 'ru' && 'Поделитесь своим мнением'}
              {language === 'en' && 'Share Your Feedback'}
            </h2>
            <p className="text-lg text-muted-foreground">
              {language === 'uz' && 'Sizning fikringiz biz uchun muhim'}
              {language === 'ru' && 'Ваше мнение важно для нас'}
              {language === 'en' && 'Your opinion matters to us'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Card className="shadow-xl">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {language === 'uz' && "To'liq ism"}
                      {language === 'ru' && 'Полное имя'}
                      {language === 'en' && 'Full Name'}
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={
                        language === 'uz'
                          ? 'Ismingiz va familiyangiz'
                          : language === 'ru'
                          ? 'Ваше имя и фамилия'
                          : 'Your full name'
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Workplace and Position */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {language === 'uz' && 'Ish joyi va lavozimi'}
                      {language === 'ru' && 'Место работы и должность'}
                      {language === 'en' && 'Workplace and Position'}
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      value={workplace}
                      onChange={(e) => setWorkplace(e.target.value)}
                      placeholder={
                        language === 'uz'
                          ? 'Masalan: 25-maktab, Matematika o\'qituvchisi'
                          : language === 'ru'
                          ? 'Например: Школа №25, Учитель математики'
                          : 'E.g.: School #25, Math Teacher'
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Phone Number */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        {language === 'uz' && 'Telefon raqam'}
                        {language === 'ru' && 'Номер телефона'}
                        {language === 'en' && 'Phone Number'}
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+998901234567"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        {language === 'uz' && 'Email'}
                        {language === 'ru' && 'Электронная почта'}
                        {language === 'en' && 'Email'}
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@email.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {language === 'uz' && 'Baholang'}
                      {language === 'ru' && 'Оцените'}
                      {language === 'en' && 'Rate Us'}
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoveredStar(star)}
                          onMouseLeave={() => setHoveredStar(0)}
                          className="transition-transform hover:scale-125"
                        >
                          <Star
                            className={`h-8 w-8 ${
                              star <= (hoveredStar || rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-2 text-sm text-muted-foreground">
                        ({rating}/5)
                      </span>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {language === 'uz' && 'Sizning fikringiz'}
                      {language === 'ru' && 'Ваше мнение'}
                      {language === 'en' && 'Your Feedback'}
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={6}
                      placeholder={
                        language === 'uz'
                          ? 'Laboratoriya haqida fikringizni yozing...'
                          : language === 'ru'
                          ? 'Напишите свое мнение о лаборатории...'
                          : 'Write your opinion about the laboratory...'
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      required
                    />
                  </div>

                  <div className="flex justify-center">
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      className="px-8"
                    >
                      {isSubmitting
                        ? language === 'uz'
                          ? 'Yuborilmoqda...'
                          : language === 'ru'
                          ? 'Отправка...'
                          : 'Submitting...'
                        : language === 'uz'
                        ? 'Yuborish'
                        : language === 'ru'
                        ? 'Отправить'
                        : 'Submit'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </>
  );
}
