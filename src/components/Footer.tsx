import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, Send } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function Footer() {
  const { t } = useLanguage();

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'YouTube' },
    { icon: Send, href: '#', label: 'Telegram' },
  ];

  const quickLinks = [
    { href: '/directions', label: t('nav.directions') },
    { href: '/courses', label: t('nav.courses') },
    { href: '/news', label: t('nav.news') },
    { href: '/gallery', label: t('nav.gallery') },
  ];

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <img src="/main-logo.602cd3fa57577bd6675dd5cb6474efab.svg" alt="FinLab" className="h-12 w-auto" />
              <span className="font-display text-2xl font-bold">FinLab</span>
            </Link>
            <p className="text-secondary-foreground/80 text-sm leading-relaxed">
              Finlandiya ta'lim laboratoriyasi - zamonaviy pedagogik texnologiyalar markazi
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-secondary-foreground/10 hover:bg-secondary-foreground/20 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-4">
              {t('nav.home')}
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-secondary-foreground/80 hover:text-secondary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-4">
              {t('nav.contact')}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0 text-secondary-foreground/60" />
                <span className="text-secondary-foreground/80 text-sm">
                  Toshkent sh., Renessans ta'lim universiteti
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 flex-shrink-0 text-secondary-foreground/60" />
                <a
                  href="tel:+998712345678"
                  className="text-secondary-foreground/80 hover:text-secondary-foreground text-sm"
                >
                  +998 71 234 56 78
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 flex-shrink-0 text-secondary-foreground/60" />
                <a
                  href="mailto:finlab@renessans-edu.uz"
                  className="text-secondary-foreground/80 hover:text-secondary-foreground text-sm"
                >
                  finlab@renessans-edu.uz
                </a>
              </li>
            </ul>
          </div>

          {/* Working Hours */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-4">
              Ish vaqti
            </h3>
            <ul className="space-y-2 text-sm text-secondary-foreground/80">
              <li className="flex justify-between">
                <span>Dushanba - Juma</span>
                <span>09:00 - 18:00</span>
              </li>
              <li className="flex justify-between">
                <span>Shanba</span>
                <span>09:00 - 15:00</span>
              </li>
              <li className="flex justify-between">
                <span>Yakshanba</span>
                <span>Dam olish</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-secondary-foreground/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-secondary-foreground/60">
              © {new Date().getFullYear()} FinLab. {t('footer.rights')}
            </p>
            <div className="flex items-center gap-4 text-sm text-secondary-foreground/60">
              <span>🇫🇮 Finland</span>
              <span>×</span>
              <span>🇺🇿 Uzbekistan</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
