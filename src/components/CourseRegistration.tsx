import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building, MapPin, Briefcase, User, CheckCircle } from 'lucide-react';
import { useLanguage, getLocalizedField } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { dataService, type Direction, type Course } from '@/services/dataService';
import { api } from '@/services/api';

interface CourseRegistrationProps {
  onRegistrationSuccess?: () => void;
}

export function CourseRegistration({ onRegistrationSuccess }: CourseRegistrationProps) {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [directions, setDirections] = useState<Direction[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedDirection, setSelectedDirection] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [formData, setFormData] = useState({
    address: '',
    workplace: '',
    position: '',
  });

  // Load directions when dialog opens
  useEffect(() => {
    if (isOpen) {
      loadDirections();
    }
  }, [isOpen]);

  // Load courses when direction changes
  useEffect(() => {
    if (selectedDirection) {
      loadCourses(Number(selectedDirection));
    } else {
      setCourses([]);
    }
  }, [selectedDirection]);

  const loadDirections = async () => {
    try {
      const directionsData = await dataService.getDirections();
      setDirections(directionsData);
    } catch (error) {
      console.error('Failed to load directions:', error);
      toast.error('Failed to load directions');
    }
  };

  const loadCourses = async (directionId: number) => {
    try {
      const coursesData = await dataService.getCourses(directionId);
      setCourses(coursesData);
    } catch (error) {
      console.error('Failed to load courses:', error);
      toast.error('Failed to load courses');
    }
  };

  const handleSubmit = async () => {
    if (!selectedDirection || !selectedCourse) {
      toast.error(
        language === 'uz' 
          ? 'Yo\'nalish va kursni tanlang' 
          : language === 'ru' 
          ? 'Выберите направление и курс' 
          : 'Please select direction and course'
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.registerForCourse({
        course_id: Number(selectedCourse),
        direction_id: Number(selectedDirection),
        address: formData.address || undefined,
        workplace: formData.workplace || undefined,
        position: formData.position || undefined,
      });

      if (response.success) {
        toast.success(
          language === 'uz' 
            ? 'Kursga muvaffaqiyatli ro\'yxatdan o\'tdingiz!' 
            : language === 'ru' 
            ? 'Успешно зарегистрированы на курс!' 
            : 'Successfully registered for the course!'
        );
        setIsOpen(false);
        resetForm();
        onRegistrationSuccess?.();
      } else {
        toast.error(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Course registration error:', error);
      toast.error('Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedDirection('');
    setSelectedCourse('');
    setFormData({
      address: '',
      workplace: '',
      position: '',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <CheckCircle className="mr-2 h-4 w-4" />
          {language === 'uz' && 'Kursga ro\'yxatdan o\'tish'}
          {language === 'ru' && 'Записаться на курс'}
          {language === 'en' && 'Register for Course'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {language === 'uz' && 'Kursga ro\'yxatdan o\'tish'}
            {language === 'ru' && 'Регистрация на курс'}
            {language === 'en' && 'Course Registration'}
          </DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Direction Selection */}
          <div className="space-y-2">
            <Label>
              {language === 'uz' && 'Yo\'nalishni tanlang'}
              {language === 'ru' && 'Выберите направление'}
              {language === 'en' && 'Select Direction'}
            </Label>
            <Select value={selectedDirection} onValueChange={(val) => { 
              setSelectedDirection(val); 
              setSelectedCourse(''); 
            }}>
              <SelectTrigger>
                <Building className="mr-2 h-4 w-4" />
                <SelectValue placeholder={
                  language === 'uz' ? 'Yo\'nalishni tanlang' :
                  language === 'ru' ? 'Выберите направление' :
                  'Select Direction'
                } />
              </SelectTrigger>
              <SelectContent>
                {directions.map((dir) => (
                  <SelectItem key={dir.id} value={String(dir.id)}>
                    {getLocalizedField(dir, 'title', language)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Course Selection */}
          <div className="space-y-2">
            <Label>
              {language === 'uz' && 'Kursni tanlang'}
              {language === 'ru' && 'Выберите курс'}
              {language === 'en' && 'Select Course'}
            </Label>
            <Select value={selectedCourse} onValueChange={setSelectedCourse} disabled={!selectedDirection}>
              <SelectTrigger>
                <SelectValue placeholder={
                  language === 'uz' ? 'Kursni tanlang' :
                  language === 'ru' ? 'Выберите курс' :
                  'Select Course'
                } />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={String(course.id)}>
                    {getLocalizedField(course, 'title', language)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Additional Information */}
          <div className="space-y-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              {language === 'uz' && 'Qo\'shimcha ma\'lumotlar (ixtiyoriy)'}
              {language === 'ru' && 'Дополнительная информация (необязательно)'}
              {language === 'en' && 'Additional Information (Optional)'}
            </p>

            <div className="space-y-2">
              <Label htmlFor="address">
                {language === 'uz' && 'Yashash manzili'}
                {language === 'ru' && 'Адрес проживания'}
                {language === 'en' && 'Address'}
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="pl-10"
                  placeholder={
                    language === 'uz' ? 'Manzilni kiriting' :
                    language === 'ru' ? 'Введите адрес' :
                    'Enter address'
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="workplace">
                {language === 'uz' && 'Ish joyi'}
                {language === 'ru' && 'Место работы'}
                {language === 'en' && 'Workplace'}
              </Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="workplace"
                  value={formData.workplace}
                  onChange={(e) => setFormData({ ...formData, workplace: e.target.value })}
                  className="pl-10"
                  placeholder={
                    language === 'uz' ? 'Ish joyini kiriting' :
                    language === 'ru' ? 'Введите место работы' :
                    'Enter workplace'
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">
                {language === 'uz' && 'Lavozim'}
                {language === 'ru' && 'Должность'}
                {language === 'en' && 'Position'}
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="pl-10"
                  placeholder={
                    language === 'uz' ? 'Lavozimni kiriting' :
                    language === 'ru' ? 'Введите должность' :
                    'Enter position'
                  }
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
              {language === 'uz' && 'Bekor qilish'}
              {language === 'ru' && 'Отмена'}
              {language === 'en' && 'Cancel'}
            </Button>
            <Button onClick={handleSubmit} className="flex-1" disabled={isLoading}>
              {isLoading 
                ? (language === 'uz' ? 'Yuklanmoqda...' : language === 'ru' ? 'Загрузка...' : 'Loading...')
                : (language === 'uz' ? 'Ro\'yxatdan o\'tish' : language === 'ru' ? 'Зарегистрироваться' : 'Register')
              }
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}