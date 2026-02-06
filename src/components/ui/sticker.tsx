import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface StickerProps {
  type: 'new' | 'popular' | 'limited' | 'free' | 'premium' | 'bestseller' | 'exclusive' | 'recommended';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const stickerStyles = {
  new: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white',
  popular: 'bg-gradient-to-r from-orange-500 to-red-500 text-white',
  limited: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
  free: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white',
  premium: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white',
  bestseller: 'bg-gradient-to-r from-red-500 to-pink-500 text-white',
  exclusive: 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white',
  recommended: 'bg-gradient-to-r from-teal-500 to-green-500 text-white',
};

const stickerSizes = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base',
};

export function Sticker({ type, className, size = 'sm' }: StickerProps) {
  const { t } = useLanguage();
  
  return (
    <div
      className={cn(
        'inline-flex items-center justify-center font-bold rounded-full shadow-lg transform rotate-12 hover:rotate-0 transition-transform duration-300 hover:scale-110',
        stickerStyles[type],
        stickerSizes[size],
        className
      )}
    >
      {t(`sticker.${type}`)}
    </div>
  );
}