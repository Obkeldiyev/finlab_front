import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Phone, Mail, User } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ParticleBackground } from '@/components/ParticleBackground';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toast } from 'sonner';
import { api } from '@/services/api';

type Step = 'phone' | 'verify' | 'details';

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

  // Handle phone number input - fixed +998 prefix with exactly 9 digits
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Always keep +998 prefix
    if (!value.startsWith('+998')) {
      return;
    }
    
    // Extract only the numbers after +998
    const numbers = value.slice(4).replace(/\D/g, '');
    
    // Limit to exactly 9 digits after +998
    if (numbers.length <= 9) {
      setPhoneNumber('+998' + numbers);
    }
  };

  // Format phone number for backend (remove + and keep 998XXXXXXXXX format)
  const formatPhoneForBackend = (phone: string) => {
    return phone.replace('+', ''); // +998901234567 -> 998901234567
  };

  const handleRequestCode = async () => {
    if (phoneNumber.length !== 13) {
      toast.error(language === 'uz' ? 'Telefon raqamini to\'liq kiriting' : 'Введите полный номер телефона');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await api.registerRequestCode(formatPhoneForBackend(phoneNumber));
      
      if (response.success) {
        setStep('verify');
        toast.success(language === 'uz' ? 'Kod yuborildi' : 'Код отправлен');
      } else {
        toast.error(response.message || (language === 'uz' ? 'Xatolik yuz berdi' : 'Произошла ошибка'));
      }
    } catch (error) {
      console.error('Register request error:', error);
      toast.error(language === 'uz' ? 'Xatolik yuz berdi' : 'Произошла ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 5) {
      toast.error(language === 'uz' ? 'Kodni to\'liq kiriting' : 'Введите код полностью');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Verify the code without creating the user
      const response = await api.verifyCodeOnly(formatPhoneForBackend(phoneNumber), verificationCode);
      
      if (response.success) {
        // Code is valid, move to details step
        setStep('details');
        toast.success(language === 'uz' ? 'Kod tasdiqlandi' : 'Код подтвержден');
      } else {
        // Code is invalid, show error and stay on verify step
        toast.error(response.message || (language === 'uz' ? 'Noto\'g\'ri kod' : 'Неверный код'));
      }
    } catch (error) {
      console.error('Verify code error:', error);
      toast.error(language === 'uz' ? 'Noto\'g\'ri kod' : 'Неверный код');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDetailsNext = () => {
    if (!formData.first_name || !formData.last_name || !formData.email) {
      toast.error(language === 'uz' ? 'Barcha maydonlarni to\'ldiring' : 'Заполните все поля');
      return;
    }
    // Directly register the user instead of going to selection step
    handleRegister();
  };

  const handleRegister = async () => {
    if (!formData.first_name || !formData.last_name || !formData.email) {
      toast.error(language === 'uz' ? 'Barcha maydonlarni to\'ldiring' : 'Заполните все поля');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await api.registerVerifyCode({
        code: verificationCode,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        middle_name: formData.middle_name,
        phone_number: formatPhoneForBackend(phoneNumber),
      });
      
      if (response.success && response.token) {
        // Store token in localStorage
        localStorage.setItem('token', response.token);
        toast.success(language === 'uz' ? 'Muvaffaqiyatli ro\'yxatdan o\'tdingiz!' : 'Регистрация успешна!');
        navigate('/dashboard');
      } else {
        toast.error(response.message || (language === 'uz' ? 'Xatolik yuz berdi' : 'Произошла ошибка'));
      }
    } catch (error) {
      console.error('Register verify error:', error);
      toast.error(language === 'uz' ? 'Xatolik yuz berdi' : 'Произошла ошибка');
    } finally {
      setIsLoading(false);
    }
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
                  placeholder="+998901234567"
                  value={phoneNumber || '+998'}
                  onChange={handlePhoneChange}
                  onKeyDown={(e) => {
                    // Prevent deletion of +998 prefix
                    if ((e.key === 'Backspace' || e.key === 'Delete') && phoneNumber.length <= 4) {
                      e.preventDefault();
                    }
                  }}
                  onFocus={(e) => {
                    // Ensure +998 is always present when focused
                    if (!phoneNumber || phoneNumber.length < 4) {
                      setPhoneNumber('+998');
                    }
                  }}
                  className="pl-10"
                  maxLength={13}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {language === 'uz' && 'Format: +998XXXXXXXXX (9 ta raqam)'}
                {language === 'ru' && 'Формат: +998XXXXXXXXX (9 цифр)'}
                {language === 'en' && 'Format: +998XXXXXXXXX (9 digits)'}
              </p>
            </div>
            <Button 
              onClick={handleRequestCode} 
              className="w-full" 
              disabled={isLoading || phoneNumber.length !== 13}
            >
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
                maxLength={5}
                value={verificationCode}
                onChange={(value) => setVerificationCode(value)}
              >
                <InputOTPGroup className="gap-2 justify-center w-full">
                  {[0, 1, 2, 3, 4].map((i) => (
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
              <Button onClick={handleDetailsNext} className="flex-1" disabled={isLoading}>
                {isLoading ? t('common.loading') : t('auth.register')}
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
  ];

  const currentStepIndex = steps.findIndex(s => s.key === step);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-100/60 via-blue-50/40 to-indigo-100/50">
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

        <Card className="card-elevated backdrop-blur-sm bg-white/80 border-blue-200/40 shadow-lg">
          <CardHeader className="text-center">
            <Link to="/" className="flex justify-center mb-4">
              <img src="/PRIME EDUCATION FINLAND.png" alt="FinLab" className="h-16 w-auto" />
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
