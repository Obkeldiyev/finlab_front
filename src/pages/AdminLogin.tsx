import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Lock, Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ParticleBackground } from '@/components/ParticleBackground';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { api } from '@/services/api';

export default function AdminLogin() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      toast.error(language === 'uz' ? 'Username va parolni kiriting' : 'Введите имя пользователя и пароль');
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('Attempting admin login...'); // Debug log
      const response = await api.adminLogin(username, password);
      console.log('Admin login response:', response); // Debug log
      
      if (response.success && response.token) {
        console.log('Login successful, token received:', response.token.substring(0, 20) + '...'); // Debug log
        toast.success(language === 'uz' ? 'Xush kelibsiz, Admin!' : 'Добро пожаловать, Админ!');
        
        // Add a small delay before navigation to ensure token is stored
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 500);
      } else {
        console.error('Login failed:', response.message);
        toast.error(response.message || (language === 'uz' ? 'Noto\'g\'ri ma\'lumotlar' : 'Неверные данные'));
      }
    } catch (error) {
      console.error('Admin login error:', error);
      toast.error(language === 'uz' ? 'Noto\'g\'ri ma\'lumotlar' : 'Неверные данные');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
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
          {language === 'uz' ? 'Orqaga' : 'Назад'}
        </Link>

        <Card className="card-elevated">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-2xl bg-primary/10">
                <Shield className="h-12 w-12 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-display">
              {language === 'uz' ? 'Admin Paneli' : 'Панель Администратора'}
            </CardTitle>
            <CardDescription>
              {language === 'uz' && 'Admin hisobingizga kiring'}
              {language === 'ru' && 'Войдите в админ аккаунт'}
              {language === 'en' && 'Sign in to admin account'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <Label htmlFor="username">
                  {language === 'uz' ? 'Foydalanuvchi nomi' : 'Имя пользователя'}
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder={language === 'uz' ? 'Foydalanuvchi nomi' : 'Имя пользователя'}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">
                  {language === 'uz' ? 'Parol' : 'Пароль'}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder={language === 'uz' ? 'Parol' : 'Пароль'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Button 
                onClick={handleLogin} 
                className="w-full" 
                disabled={isLoading || !username || !password}
              >
                {isLoading ? (language === 'uz' ? 'Yuklanmoqda...' : 'Загрузка...') : (language === 'uz' ? 'Kirish' : 'Войти')}
              </Button>
            </motion.div>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              {language === 'uz' && 'Foydalanuvchi hisobingiz bormi? '}
              {language === 'ru' && 'Есть пользовательский аккаунт? '}
              {language === 'en' && 'Have a user account? '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                {language === 'uz' ? 'Foydalanuvchi kirish' : 'Пользовательский вход'}
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}