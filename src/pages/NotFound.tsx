import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ParticleBackground } from '@/components/ParticleBackground';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  const location = useLocation();
  const { language } = useLanguage();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100/60 via-blue-50/40 to-indigo-100/50">
      <ParticleBackground />
      <div className="text-center relative z-10 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto backdrop-blur-sm bg-white/80 p-8 rounded-2xl border border-blue-200/40 shadow-lg"
        >
          <div className="text-8xl font-bold text-primary mb-4">404</div>
          <h1 className="text-2xl font-display font-bold text-foreground mb-4">
            {language === 'uz' && 'Sahifa topilmadi'}
            {language === 'ru' && 'Страница не найдена'}
            {language === 'en' && 'Page Not Found'}
          </h1>
          <p className="text-muted-foreground mb-8">
            {language === 'uz' && 'Kechirasiz, siz qidirayotgan sahifa mavjud emas yoki ko\'chirilgan.'}
            {language === 'ru' && 'Извините, страница, которую вы ищете, не существует или была перемещена.'}
            {language === 'en' && 'Sorry, the page you are looking for does not exist or has been moved.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button className="w-full sm:w-auto">
                <Home className="mr-2 h-4 w-4" />
                {language === 'uz' && 'Bosh sahifaga qaytish'}
                {language === 'ru' && 'Вернуться на главную'}
                {language === 'en' && 'Return to Home'}
              </Button>
            </Link>
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {language === 'uz' && 'Orqaga'}
              {language === 'ru' && 'Назад'}
              {language === 'en' && 'Go Back'}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
