import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Award, BookOpen, Lightbulb, Cpu, Users, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage, getLocalizedField } from '@/contexts/LanguageContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ParticleBackground } from '@/components/ParticleBackground';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import teamData from '@/data/team.json';

interface TeamMember {
  id: number;
  name: string;
  position_uz: string;
  position_ru: string;
  position_en: string;
  title_uz: string;
  title_ru: string;
  title_en: string;
  bio_uz: string;
  bio_ru: string;
  bio_en: string;
  achievements: Array<{
    uz: string;
    ru: string;
    en: string;
  }>;
  image: string;
}

export default function Team() {
  const { language } = useLanguage();
  const [team, setTeam] = useState<TeamMember[]>([]);

  useEffect(() => {
    setTeam(teamData as TeamMember[]);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100/60 via-blue-50/40 to-indigo-100/50">
      <ParticleBackground />
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-hero relative">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <Link to="/" className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-6 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              {language === 'uz' && 'Bosh sahifaga qaytish'}
              {language === 'ru' && 'Вернуться на главную'}
              {language === 'en' && 'Back to Home'}
            </Link>
            
            <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-6">
              {language === 'uz' && 'Bizning jamoa'}
              {language === 'ru' && 'Наша команда'}
              {language === 'en' && 'Our Team'}
            </h1>
            
            <p className="text-xl text-primary-foreground/80">
              {language === 'uz' && 'Finlandiya ta\'lim laboratoriyasi rahbariyati va mutaxassislari'}
              {language === 'ru' && 'Руководство и специалисты Финской образовательной лаборатории'}
              {language === 'en' && 'Leadership and specialists of the Finnish Education Laboratory'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team Members */}
      <section className="section-padding relative z-10">
        <div className="container mx-auto">
          {team.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="mb-16 last:mb-0"
            >
              <Card className="card-feature overflow-hidden">
                <div className="lg:flex">
                  {/* Photo Section */}
                  <div className="lg:w-96 bg-gradient-primary p-8 flex flex-col items-center justify-center text-center">
                    <div className="w-48 h-48 rounded-full bg-white/20 flex items-center justify-center mb-6">
                      <Users className="h-24 w-24 text-white" />
                    </div>
                    <h3 className="text-2xl font-display font-bold text-white mb-2">
                      {member.name}
                    </h3>
                    <p className="text-white/90 font-medium">
                      {getLocalizedField(member, 'position', language)}
                    </p>
                  </div>
                  
                  {/* Content Section */}
                  <div className="flex-1 p-8">
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-foreground mb-3">
                        {language === 'uz' && 'Akademik unvon va lavozim'}
                        {language === 'ru' && 'Академическое звание и должность'}
                        {language === 'en' && 'Academic Title and Position'}
                      </h4>
                      <p className="text-muted-foreground leading-relaxed">
                        {getLocalizedField(member, 'title', language)}
                      </p>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-foreground mb-3">
                        {language === 'uz' && 'Biografiya'}
                        {language === 'ru' && 'Биография'}
                        {language === 'en' && 'Biography'}
                      </h4>
                      <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                        {getLocalizedField(member, 'bio', language)}
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-foreground mb-4">
                        {language === 'uz' && 'Asosiy yutuqlar'}
                        {language === 'ru' && 'Основные достижения'}
                        {language === 'en' && 'Key Achievements'}
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {member.achievements.map((achievement, i) => (
                          <div key={i} className="flex items-start gap-3 p-4 bg-accent/50 rounded-lg">
                            <div className="p-2 rounded-lg bg-primary/10 mt-0.5">
                              {i === 0 && <Award className="h-4 w-4 text-primary" />}
                              {i === 1 && <Lightbulb className="h-4 w-4 text-primary" />}
                              {i === 2 && <BookOpen className="h-4 w-4 text-primary" />}
                              {i === 3 && <Cpu className="h-4 w-4 text-primary" />}
                            </div>
                            <p className="text-sm text-foreground font-medium">
                              {getLocalizedField(achievement, '', language)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="border-t border-border pt-6">
                      <h4 className="text-lg font-semibold text-foreground mb-4">
                        {language === 'uz' && 'Aloqa'}
                        {language === 'ru' && 'Контакты'}
                        {language === 'en' && 'Contact'}
                      </h4>
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          <span className="text-sm">director@finlab.uz</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          <span className="text-sm">+998 (71) 123-45-67</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <Card className="bg-gradient-primary text-primary-foreground p-8">
              <CardContent className="pt-0">
                <h3 className="text-2xl font-display font-bold mb-4">
                  {language === 'uz' && 'Bizga qo\'shiling!'}
                  {language === 'ru' && 'Присоединяйтесь к нам!'}
                  {language === 'en' && 'Join Us!'}
                </h3>
                <p className="text-primary-foreground/90 mb-6 max-w-2xl mx-auto">
                  {language === 'uz' && 'Finlandiya ta\'lim modeli asosida kasbiy rivojlanish yo\'lingizni boshlang va innovatsion ta\'lim jamoasining bir qismi bo\'ling.'}
                  {language === 'ru' && 'Начните свой путь профессионального развития на основе финской модели образования и станьте частью инновационной образовательной команды.'}
                  {language === 'en' && 'Start your professional development journey based on the Finnish education model and become part of an innovative educational team.'}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/register">
                    <Button variant="secondary" size="lg">
                      {language === 'uz' && 'Ro\'yxatdan o\'tish'}
                      {language === 'ru' && 'Регистрация'}
                      {language === 'en' && 'Register'}
                    </Button>
                  </Link>
                  <Link to="/opportunities">
                    <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                      {language === 'uz' && 'Imkoniyatlar'}
                      {language === 'ru' && 'Возможности'}
                      {language === 'en' && 'Opportunities'}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}