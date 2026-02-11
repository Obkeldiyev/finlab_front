import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NotificationContainer, useNotifications } from "@/components/ui/notification";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useRef } from "react";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Gallery from "./pages/Gallery";
import Directions from "./pages/Directions";
import Courses from "./pages/Courses";
import News from "./pages/News";
import Opportunities from "./pages/Opportunities";
import Team from "./pages/Team";
import NotFound from "./pages/NotFound";
// Admin pages
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminNews from "./pages/AdminNews";
import AdminDirections from "./pages/AdminDirections";
import AdminCourses from "./pages/AdminCourses";
import AdminOpportunities from "./pages/AdminOpportunities";
import AdminGallery from "./pages/AdminGallery";
import AdminPartners from "./pages/AdminPartners";
import AdminFeedback from "./pages/AdminFeedback";

const queryClient = new QueryClient();

function AppContent() {
  const { t } = useLanguage();
  const { notifications, removeNotification, showInfo } = useNotifications();
  const hasShownWelcome = useRef(false);

  useEffect(() => {
    // Show welcome notification only once
    if (!hasShownWelcome.current) {
      const timer = setTimeout(() => {
        showInfo(
          t('notification.welcome'),
          'Zamonaviy ta\'lim texnologiyalari va xalqaro tajriba bilan tanishing!'
        );
        hasShownWelcome.current = true;
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showInfo, t]); // Include dependencies but use ref to prevent multiple calls

  return (
    <>
      <NotificationContainer 
        notifications={notifications} 
        onClose={removeNotification} 
      />
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/directions" element={<Directions />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/news" element={<News />} />
          <Route path="/opportunities" element={<Opportunities />} />
          <Route path="/opportunities/:id" element={<Opportunities />} />
          <Route path="/team" element={<Team />} />
          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/news" element={<AdminNews />} />
          <Route path="/admin/directions" element={<AdminDirections />} />
          <Route path="/admin/courses" element={<AdminCourses />} />
          <Route path="/admin/opportunities" element={<AdminOpportunities />} />
          <Route path="/admin/gallery" element={<AdminGallery />} />
          <Route path="/admin/partners" element={<AdminPartners />} />
          <Route path="/admin/feedback" element={<AdminFeedback />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppContent />
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
