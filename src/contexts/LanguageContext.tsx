import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type Language = 'uz' | 'ru' | 'en';

interface Translations {
  [key: string]: {
    uz: string;
    ru: string;
    en: string;
  };
}

const translations: Translations = {
  // Navigation
  'nav.home': { uz: 'Bosh sahifa', ru: 'Главная', en: 'Home' },
  'nav.about': { uz: 'Biz haqimizda', ru: 'О нас', en: 'About' },
  'nav.courses': { uz: 'Kurslar', ru: 'Курсы', en: 'Courses' },
  'nav.directions': { uz: "Yo'nalishlar", ru: 'Направления', en: 'Directions' },
  'nav.news': { uz: 'Yangiliklar', ru: 'Новости', en: 'News' },
  'nav.gallery': { uz: 'Galereya', ru: 'Галерея', en: 'Gallery' },
  'nav.contact': { uz: 'Aloqa', ru: 'Контакты', en: 'Contact' },
  'nav.login': { uz: 'Kirish', ru: 'Войти', en: 'Login' },
  'nav.register': { uz: "Ro'yxatdan o'tish", ru: 'Регистрация', en: 'Register' },
  'nav.dashboard': { uz: 'Dashboard', ru: 'Панель', en: 'Dashboard' },
  
  // Hero Section
  'hero.title': { 
    uz: 'Finlandiya Ta\'lim Laboratoriyasi', 
    ru: 'Финская Образовательная Лаборатория', 
    en: 'Finland Education Laboratory' 
  },
  'hero.subtitle': { 
    uz: 'Innovatsion ta\'lim texnologiyalari va xalqaro tajriba', 
    ru: 'Инновационные образовательные технологии и международный опыт', 
    en: 'Innovative educational technologies and international experience' 
  },
  'hero.cta': { uz: 'Kursga yozilish', ru: 'Записаться на курс', en: 'Enroll Now' },
  'hero.learn_more': { uz: 'Batafsil', ru: 'Подробнее', en: 'Learn More' },

  // About Section
  'about.title': { uz: 'Laboratoriya haqida', ru: 'О лаборатории', en: 'About Laboratory' },
  'about.description': { 
    uz: 'Renessans ta\'lim universiteti Finlandiya ta\'lim laboratoriyasi – zamonaviy pedagogik texnologiyalar va innovatsion ta\'lim muhitlarini yaratish markazi.',
    ru: 'Финская образовательная лаборатория Университета Ренессанс – центр создания современных педагогических технологий и инновационных образовательных сред.',
    en: 'Finland Education Laboratory of Renaissance University – a center for creating modern pedagogical technologies and innovative educational environments.'
  },

  // Opportunities
  'opportunities.title': { uz: 'Imkoniyatlar', ru: 'Возможности', en: 'Opportunities' },
  'opportunities.courses': { uz: 'Kasbiy rivojlanish kurslari', ru: 'Курсы профессионального развития', en: 'Professional Development Courses' },
  'opportunities.steam': { uz: 'STEAM yondashuvi', ru: 'STEAM подход', en: 'STEAM Approach' },
  'opportunities.tech': { uz: 'VR/AR texnologiyalari', ru: 'VR/AR технологии', en: 'VR/AR Technologies' },
  'opportunities.robotics': { uz: 'Robototexnika', ru: 'Робототехника', en: 'Robotics' },

  // Courses
  'courses.title': { uz: 'Bizning kurslar', ru: 'Наши курсы', en: 'Our Courses' },
  'courses.hours': { uz: 'soat', ru: 'часов', en: 'hours' },
  'courses.enroll': { uz: "Ro'yxatdan o'tish", ru: 'Записаться', en: 'Enroll' },
  'courses.288': { 
    uz: '288 soatlik malaka oshirish kursi',
    ru: '288-часовой курс повышения квалификации',
    en: '288-hour professional development course'
  },
  'courses.72': { 
    uz: '72 soatlik qisqa muddatli kurs',
    ru: '72-часовой краткосрочный курс',
    en: '72-hour short-term course'
  },
  'courses.36': { 
    uz: '36 soatlik qisqa muddatli kurs',
    ru: '36-часовой краткосрочный курс',
    en: '36-hour short-term course'
  },

  // Director
  'director.title': { uz: 'Laboratoriya mudiri', ru: 'Директор лаборатории', en: 'Laboratory Director' },
  'director.name': { uz: 'Supiyeva Buxolida Abduvaliyevna', ru: 'Супиева Бухолида Абдувалиевна', en: 'Supiyeva Bukholida Abduvaliyevna' },
  'director.position': { 
    uz: 'Pedagogika fanlari bo\'yicha falsafa doktori (PhD), dotsent',
    ru: 'Доктор философии (PhD) по педагогике, доцент',
    en: 'Doctor of Philosophy (PhD) in Pedagogy, Associate Professor'
  },

  // News
  'news.title': { uz: 'So\'nggi yangiliklar', ru: 'Последние новости', en: 'Latest News' },
  'news.view_all': { uz: 'Barcha yangiliklar', ru: 'Все новости', en: 'View All News' },

  // Gallery
  'gallery.title': { uz: 'Galereya', ru: 'Галерея', en: 'Gallery' },
  'gallery.subtitle': { uz: 'Laboratoriya muhiti', ru: 'Среда лаборатории', en: 'Laboratory Environment' },

  // Auth
  'auth.login': { uz: 'Tizimga kirish', ru: 'Вход в систему', en: 'Login' },
  'auth.register': { uz: "Ro'yxatdan o'tish", ru: 'Регистрация', en: 'Register' },
  'auth.phone': { uz: 'Telefon raqami', ru: 'Номер телефона', en: 'Phone Number' },
  'auth.email': { uz: 'Elektron pochta', ru: 'Электронная почта', en: 'Email' },
  'auth.code': { uz: 'Tasdiqlash kodi', ru: 'Код подтверждения', en: 'Verification Code' },
  'auth.send_code': { uz: 'Kod yuborish', ru: 'Отправить код', en: 'Send Code' },
  'auth.verify': { uz: 'Tasdiqlash', ru: 'Подтвердить', en: 'Verify' },
  'auth.first_name': { uz: 'Ism', ru: 'Имя', en: 'First Name' },
  'auth.last_name': { uz: 'Familiya', ru: 'Фамилия', en: 'Last Name' },
  'auth.middle_name': { uz: 'Otasining ismi', ru: 'Отчество', en: 'Middle Name' },
  'auth.select_direction': { uz: "Yo'nalishni tanlang", ru: 'Выберите направление', en: 'Select Direction' },
  'auth.select_course': { uz: 'Kursni tanlang', ru: 'Выберите курс', en: 'Select Course' },

  // Footer
  'footer.rights': { uz: 'Barcha huquqlar himoyalangan', ru: 'Все права защищены', en: 'All rights reserved' },
  'footer.address': { uz: 'Manzil', ru: 'Адрес', en: 'Address' },
  'footer.phone': { uz: 'Telefon', ru: 'Телефон', en: 'Phone' },

  // Common
  'common.loading': { uz: 'Yuklanmoqda...', ru: 'Загрузка...', en: 'Loading...' },
  'common.error': { uz: 'Xatolik yuz berdi', ru: 'Произошла ошибка', en: 'An error occurred' },
  'common.success': { uz: 'Muvaffaqiyatli', ru: 'Успешно', en: 'Success' },
  'common.submit': { uz: 'Yuborish', ru: 'Отправить', en: 'Submit' },
  'common.cancel': { uz: 'Bekor qilish', ru: 'Отмена', en: 'Cancel' },
  'common.save': { uz: 'Saqlash', ru: 'Сохранить', en: 'Save' },
  'common.back': { uz: 'Orqaga', ru: 'Назад', en: 'Back' },
  'common.next': { uz: 'Keyingi', ru: 'Далее', en: 'Next' },

  // Notifications and Messages
  'notification.welcome': { 
    uz: 'Finlandiya Ta\'lim Laboratoriyasiga xush kelibsiz!', 
    ru: 'Добро пожаловать в Финскую Образовательную Лабораторию!', 
    en: 'Welcome to Finland Education Laboratory!' 
  },
  'notification.course_enrolled': { 
    uz: 'Siz kursga muvaffaqiyatli ro\'yxatdan o\'tdingiz!', 
    ru: 'Вы успешно записались на курс!', 
    en: 'You have successfully enrolled in the course!' 
  },
  'notification.profile_updated': { 
    uz: 'Profilingiz yangilandi', 
    ru: 'Ваш профиль обновлен', 
    en: 'Your profile has been updated' 
  },
  'notification.code_sent': { 
    uz: 'Tasdiqlash kodi yuborildi', 
    ru: 'Код подтверждения отправлен', 
    en: 'Verification code sent' 
  },
  'notification.invalid_code': { 
    uz: 'Noto\'g\'ri tasdiqlash kodi', 
    ru: 'Неверный код подтверждения', 
    en: 'Invalid verification code' 
  },

  // Stickers and Labels
  'sticker.new': { uz: 'YANGI', ru: 'НОВОЕ', en: 'NEW' },
  'sticker.popular': { uz: 'MASHHUR', ru: 'ПОПУЛЯРНОЕ', en: 'POPULAR' },
  'sticker.limited': { uz: 'CHEKLANGAN', ru: 'ОГРАНИЧЕННОЕ', en: 'LIMITED' },
  'sticker.free': { uz: 'BEPUL', ru: 'БЕСПЛАТНО', en: 'FREE' },
  'sticker.premium': { uz: 'PREMIUM', ru: 'ПРЕМИУМ', en: 'PREMIUM' },
  'sticker.bestseller': { uz: 'ENG YAXSHI', ru: 'БЕСТСЕЛЛЕР', en: 'BESTSELLER' },
  'sticker.exclusive': { uz: 'EKSKLYUZIV', ru: 'ЭКСКЛЮЗИВ', en: 'EXCLUSIVE' },
  'sticker.recommended': { uz: 'TAVSIYA ETILADI', ru: 'РЕКОМЕНДУЕТСЯ', en: 'RECOMMENDED' },

  // Course Features
  'feature.certificate': { uz: 'Sertifikat bilan', ru: 'С сертификатом', en: 'With Certificate' },
  'feature.online': { uz: 'Onlayn', ru: 'Онлайн', en: 'Online' },
  'feature.offline': { uz: 'Oflayn', ru: 'Оффлайн', en: 'Offline' },
  'feature.hybrid': { uz: 'Aralash', ru: 'Смешанный', en: 'Hybrid' },
  'feature.practical': { uz: 'Amaliy', ru: 'Практический', en: 'Practical' },
  'feature.theoretical': { uz: 'Nazariy', ru: 'Теоретический', en: 'Theoretical' },

  // Status Messages
  'status.active': { uz: 'Faol', ru: 'Активный', en: 'Active' },
  'status.pending': { uz: 'Kutilmoqda', ru: 'Ожидание', en: 'Pending' },
  'status.completed': { uz: 'Yakunlangan', ru: 'Завершен', en: 'Completed' },
  'status.enrolled': { uz: 'Ro\'yxatdan o\'tgan', ru: 'Зарегистрирован', en: 'Enrolled' },
  'status.expired': { uz: 'Muddati tugagan', ru: 'Истекший', en: 'Expired' },

  // Dashboard
  'dashboard.welcome': { uz: 'Xush kelibsiz', ru: 'Добро пожаловать', en: 'Welcome' },
  'dashboard.overview': { uz: 'Umumiy ko\'rinish', ru: 'Обзор', en: 'Overview' },
  'dashboard.my_courses': { uz: 'Mening kurslarim', ru: 'Мои курсы', en: 'My Courses' },
  'dashboard.progress': { uz: 'Jarayon', ru: 'Прогресс', en: 'Progress' },
  'dashboard.achievements': { uz: 'Yutuqlar', ru: 'Достижения', en: 'Achievements' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('uz');

  const t = useCallback((key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translation[language];
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export function getLocalizedField<T extends Record<string, any>>(
  item: T | null | undefined,
  field: string,
  language: Language
): string {
  if (!item) return '';
  const localizedKey = `${field}_${language}`;
  return item[localizedKey] || item[`${field}_en`] || '';
}
