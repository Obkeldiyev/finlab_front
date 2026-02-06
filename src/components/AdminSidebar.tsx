import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Users,
  BookOpen,
  Settings,
  LogOut,
  Shield,
  FileText,
  Building,
  Award
} from 'lucide-react';
import { api } from '@/services/api';

export function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    api.logout();
    navigate('/');
  };

  const navItems = [
    { 
      icon: Shield, 
      label: 'Boshqaruv paneli', 
      path: '/admin/dashboard'
    },
    { 
      icon: Users, 
      label: 'Foydalanuvchilar', 
      path: '/admin/users'
    },
    { 
      icon: FileText, 
      label: 'Yangiliklar', 
      path: '/admin/news'
    },
    { 
      icon: Building, 
      label: 'Yo\'nalishlar', 
      path: '/admin/directions'
    },
    { 
      icon: BookOpen, 
      label: 'Kurslar', 
      path: '/admin/courses'
    },
    { 
      icon: Award, 
      label: 'Elon', 
      path: '/admin/opportunities'
    },
  ];

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="p-4 border-b border-slate-700">
        <Link to="/" className="flex items-center gap-3">
          <img src="/PRIME EDUCATION FINLAND.png" alt="FinLab" className="h-10 w-auto" />
          <span className="font-display text-xl font-bold text-white">FinLab Admin</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={index}
              to={item.path}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                isActive
                  ? 'bg-primary text-white shadow-lg shadow-primary/50'
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200"
        >
          <LogOut className="h-5 w-5" />
          Chiqish
        </button>
      </div>
    </div>
  );
}