import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Phone, Mail, User, Building, ChevronRight } from 'lucide-react';
import { useLanguage, getLocalizedField } from '@/contexts/LanguageContext';
import { ParticleBackground } from '@/components/ParticleBackground';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toast } from 'sonner';
import logo from '@/assets/logo.svg';

// Mock data for directions and courses (in real app, fetch from API)
const mockDirections = [
  { id: 1, title_uz: "Maktabgacha ta'lim", title_ru: 'Дошкольное образование', title_en: 'Preschool Education' },
  { id: 2, title_uz: "Umumiy o'rta ta'lim", title_ru: 'Общее среднее образование', title_en: 'General Secondary Education' },
  { id: 3, title_uz: "Oliy ta'lim", title_ru: 'Высшее образование', title_en: 'Higher Education' },
];

const mockCourses = [
  { id: 1, direction_id: 1, title_uz: '288 soatlik malaka oshirish', title_ru: '288-часовое повышение квалификации', title_en: '288-hour Professional Development' },
  { id: 2, direction_id: 1, title_uz: '72 soatlik qisqa muddatli', title_ru: '72-часовой краткосрочный', title_en: '72-hour Short-term' },
  { id: 3, direction_id: 2, title_uz: '288 soatlik malaka oshirish', title_ru: '288-часовое повышение квалификации', title_en: '288-hour Professional Development' },
  { id: 4, direction_id: 2, title_uz: '36 soatlik boshlang\'ich', title_ru: '36-часовой начальный', title_en: '36-hour Introductory' },
  { id: 5, direction_id: 3, title_uz: '288 soatlik malaka oshirish', title_ru: '288-часовое повышение квалификации', title_en: '288-hour Professional Development' },
  { id: 6, direction_id: 3, title_uz: '72 soatlik qisqa muddatli', title_ru: '72-часовой краткосрочный', title_en: '72-hour Short-term' },
];

type Step = 'phone' | 'verify' | 'details' | 'selection';

export default function Register() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  const [step, setStep] = useState<Step>('phone');
  const [isLoading, setIsLoading] = useState(false);
  
  // Form data
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    middle_name: '',
    email: '',
  });
  const [directionId, setDirectionId] = useState<string>('');
  const [courseId, setCourseId] = useState<string>('');

  const filteredCourses = mockCourses.filter(c => c.direction_id === Number(directionId));

  const handleRequestCode = async () => {
    if (!phoneNumber || phoneNumber.length < 9) {
      toast.error(language === 'uz' ? 'Telefon raqamini kiriting' : 'Введите номер телефона');
      return;
    }
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep('verify');
      toast.success(language === 'uz' ? 'Kod yuborildi' : 'Код отправлен');
    }, 1000);
  };

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 6) {
      toast.error(language === 'uz' ? 'Kodni to\'liq kiriting' : 'Введите код полностью');
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('details');
    }, 1000);
  };

  const handleDetailsNext = () => {
    if (!formData.first_name || !formData.last_name || !formData.email) {
      toast.error(language === 'uz' ? 'Barcha maydonlarni to\'ldiring' : 'Заполните все поля');
      return;
    }
    setStep('selection');
  };

  const handleRegister = async () => {
    if (!directionId || !courseId) {
      toast.error(language === 'uz' ? 'Yo\'nalish va kursni tanlang' : 'Выберите направление и курс');
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success(language === 'uz' ? 'Muvaffaqiyatli ro\'yxatdan o\'tdingiz!' : 'Регистрация успешна!');
      navigate('/dashboard');
    }, 1500);
  };

  const renderStep = () => {
    switch (step) {
      case 'phone':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="phone">{t('auth.phone')}</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+998 90 123 45 67"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button onClick={handleRequestCode} className="w-full" disabled={isLoading}>
              {isLoading ? t('common.loading') : t('auth.send_code')}
            </Button>
          </motion.div>
        );

      case 'verify':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <Label>{t('auth.code')}</Label>
              <p className="text-sm text-muted-foreground">
                {language === 'uz' && `Kod ${phoneNumber} raqamiga yuborildi`}
                {language === 'ru' && `Код отправлен на ${phoneNumber}`}
                {language === 'en' && `Code sent to ${phoneNumber}`}
              </p>
              <InputOTP
                maxLength={6}
                value={verificationCode}
                onChange={(value) => setVerificationCode(value)}
              >
                <InputOTPGroup className="gap-2 justify-center w-full">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <InputOTPSlot key={i} index={i} className="w-12 h-12 text-lg" />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep('phone')} className="flex-1">
                {t('common.back')}
              </Button>
              <Button onClick={handleVerifyCode} className="flex-1" disabled={isLoading}>
                {isLoading ? t('common.loading') : t('auth.verify')}
              </Button>
            </div>
          </motion.div>
        );

      case 'details':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">{t('auth.first_name')}</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">{t('auth.last_name')}</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="middle_name">{t('auth.middle_name')}</Label>
              <Input
                id="middle_name"
                value={formData.middle_name}
                onChange={(e) => setFormData({ ...formData, middle_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.email')}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => setStep('verify')} className="flex-1">
                {t('common.back')}
              </Button>
              <Button onClick={handleDetailsNext} className="flex-1">
                {t('common.next')}
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        );

      case 'selection':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label>{t('auth.select_direction')}</Label>
              <Select value={directionId} onValueChange={(val) => { setDirectionId(val); setCourseId(''); }}>
                <SelectTrigger>
                  <Building className="mr-2 h-4 w-4" />
                  <SelectValue placeholder={t('auth.select_direction')} />
                </SelectTrigger>
                <SelectContent>
                  {mockDirections.map((dir) => (
                    <SelectItem key={dir.id} value={String(dir.id)}>
                      {getLocalizedField(dir, 'title', language)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t('auth.select_course')}</Label>
              <Select value={courseId} onValueChange={setCourseId} disabled={!directionId}>
                <SelectTrigger>
                  <SelectValue placeholder={t('auth.select_course')} />
                </SelectTrigger>
                <SelectContent>
                  {filteredCourses.map((course) => (
                    <SelectItem key={course.id} value={String(course.id)}>
                      {getLocalizedField(course, 'title', language)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => setStep('details')} className="flex-1">
                {t('common.back')}
              </Button>
              <Button onClick={handleRegister} className="flex-1" disabled={isLoading}>
                {isLoading ? t('common.loading') : t('common.submit')}
              </Button>
            </div>
          </motion.div>
        );
    }
  };

  const steps = [
    { key: 'phone', label: { uz: 'Telefon', ru: 'Телефон', en: 'Phone' } },
    { key: 'verify', label: { uz: 'Tasdiqlash', ru: 'Подтверждение', en: 'Verify' } },
    { key: 'details', label: { uz: "Ma'lumotlar", ru: 'Данные', en: 'Details' } },
    { key: 'selection', label: { uz: 'Tanlash', ru: 'Выбор', en: 'Selection' } },
  ];

  const currentStepIndex = steps.findIndex(s => s.key === step);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-accent/30">
      <ParticleBackground />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <Link
          to="/"
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('common.back')}
        </Link>

        <Card className="card-elevated">
          <CardHeader className="text-center">
            <Link to="/" className="flex justify-center mb-4">
              <img src={logo} alt="FinLab" className="h-16 w-auto" />
            </Link>
            <CardTitle className="text-2xl font-display">{t('auth.register')}</CardTitle>
            <CardDescription>
              {language === 'uz' && 'Yangi hisob yarating'}
              {language === 'ru' && 'Создайте новый аккаунт'}
              {language === 'en' && 'Create a new account'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8">
              {steps.map((s, index) => (
                <div key={s.key} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      index <= currentStepIndex
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {index + 1}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-8 md:w-12 h-0.5 mx-1 transition-colors ${
                        index < currentStepIndex ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {renderStep()}

            <div className="mt-6 text-center text-sm text-muted-foreground">
              {language === 'uz' && 'Hisobingiz bormi? '}
              {language === 'ru' && 'Уже есть аккаунт? '}
              {language === 'en' && 'Already have an account? '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                {t('auth.login')}
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
