import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Phone, Mail } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ParticleBackground } from '@/components/ParticleBackground';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toast } from 'sonner';
import logo from '@/assets/logo.svg';

type Step = 'credentials' | 'verify';

export default function Login() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  const [step, setStep] = useState<Step>('credentials');
  const [isLoading, setIsLoading] = useState(false);
  
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  const handleRequestCode = async () => {
    if (!email || !phoneNumber) {
      toast.error(language === 'uz' ? 'Barcha maydonlarni to\'ldiring' : 'Заполните все поля');
      return;
    }
    
    setIsLoading(true);
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
      toast.success(language === 'uz' ? 'Xush kelibsiz!' : 'Добро пожаловать!');
      navigate('/dashboard');
    }, 1000);
  };

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
            <CardTitle className="text-2xl font-display">{t('auth.login')}</CardTitle>
            <CardDescription>
              {language === 'uz' && 'Hisobingizga kiring'}
              {language === 'ru' && 'Войдите в свой аккаунт'}
              {language === 'en' && 'Sign in to your account'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {step === 'credentials' ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="email">{t('auth.email')}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
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
            ) : (
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
                  <Button variant="outline" onClick={() => setStep('credentials')} className="flex-1">
                    {t('common.back')}
                  </Button>
                  <Button onClick={handleVerifyCode} className="flex-1" disabled={isLoading}>
                    {isLoading ? t('common.loading') : t('auth.login')}
                  </Button>
                </div>
              </motion.div>
            )}

            <div className="mt-6 text-center text-sm text-muted-foreground">
              {language === 'uz' && 'Hisobingiz yo\'qmi? '}
              {language === 'ru' && 'Нет аккаунта? '}
              {language === 'en' && 'Don\'t have an account? '}
              <Link to="/register" className="text-primary hover:underline font-medium">
                {t('auth.register')}
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
