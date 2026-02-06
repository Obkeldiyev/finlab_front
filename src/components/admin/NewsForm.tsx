import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Image, Video, FileText, Plus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/services/api';
import { toast } from 'sonner';

interface NewsFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function NewsForm({ onSuccess, onCancel }: NewsFormProps) {
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    title_uz: '',
    title_ru: '',
    title_en: '',
    content_uz: '',
    content_ru: '',
    content_en: '',
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return Image;
    if (file.type.startsWith('video/')) return Video;
    return FileText;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title_uz || !formData.title_ru || !formData.title_en ||
        !formData.content_uz || !formData.content_ru || !formData.content_en) {
      toast.error('Please fill all required fields');
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.createNews(formData, selectedFiles);
      
      if (response.success) {
        toast.success('News created successfully!');
        onSuccess?.();
      } else {
        toast.error(response.message || 'Failed to create news');
      }
    } catch (error) {
      console.error('Create news error:', error);
      toast.error('Failed to create news');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-display">
            {language === 'uz' ? 'Yangilik yaratish' : language === 'ru' ? 'Создать новость' : 'Create News'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Titles */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title_uz">
                  {language === 'uz' ? 'Sarlavha (O\'zbek)' : language === 'ru' ? 'Заголовок (Узбекский)' : 'Title (Uzbek)'}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title_uz"
                  value={formData.title_uz}
                  onChange={(e) => setFormData({ ...formData, title_uz: e.target.value })}
                  placeholder="Yangilik sarlavhasi..."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title_ru">
                  {language === 'uz' ? 'Sarlavha (Rus)' : language === 'ru' ? 'Заголовок (Русский)' : 'Title (Russian)'}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title_ru"
                  value={formData.title_ru}
                  onChange={(e) => setFormData({ ...formData, title_ru: e.target.value })}
                  placeholder="Заголовок новости..."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title_en">
                  {language === 'uz' ? 'Sarlavha (Ingliz)' : language === 'ru' ? 'Заголовок (Английский)' : 'Title (English)'}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title_en"
                  value={formData.title_en}
                  onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                  placeholder="News title..."
                  required
                />
              </div>
            </div>

            {/* Content */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="content_uz">
                  {language === 'uz' ? 'Mazmun (O\'zbek)' : language === 'ru' ? 'Содержание (Узбекский)' : 'Content (Uzbek)'}
                  <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="content_uz"
                  value={formData.content_uz}
                  onChange={(e) => setFormData({ ...formData, content_uz: e.target.value })}
                  placeholder="Yangilik mazmuni..."
                  rows={6}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content_ru">
                  {language === 'uz' ? 'Mazmun (Rus)' : language === 'ru' ? 'Содержание (Русский)' : 'Content (Russian)'}
                  <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="content_ru"
                  value={formData.content_ru}
                  onChange={(e) => setFormData({ ...formData, content_ru: e.target.value })}
                  placeholder="Содержание новости..."
                  rows={6}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content_en">
                  {language === 'uz' ? 'Mazmun (Ingliz)' : language === 'ru' ? 'Содержание (Английский)' : 'Content (English)'}
                  <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="content_en"
                  value={formData.content_en}
                  onChange={(e) => setFormData({ ...formData, content_en: e.target.value })}
                  placeholder="News content..."
                  rows={6}
                  required
                />
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-4">
              <Label>
                {language === 'uz' ? 'Mediya fayllar' : language === 'ru' ? 'Медиа файлы' : 'Media Files'}
                <span className="text-sm text-muted-foreground ml-2">
                  ({language === 'uz' ? 'Ixtiyoriy' : language === 'ru' ? 'Необязательно' : 'Optional'})
                </span>
              </Label>
              
              <div className="border-2 border-dashed border-border rounded-lg p-6">
                <div className="text-center">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">
                    {language === 'uz' ? 'Fayllarni yuklang' : language === 'ru' ? 'Загрузите файлы' : 'Upload Files'}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    {language === 'uz' ? 'Rasm, video yoki boshqa fayllarni tanlang' : language === 'ru' ? 'Выберите изображения, видео или другие файлы' : 'Select images, videos or other files'}
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*,.pdf,.doc,.docx"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button type="button" variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>
                    <Plus className="h-4 w-4 mr-2" />
                    {language === 'uz' ? 'Fayl tanlash' : language === 'ru' ? 'Выбрать файлы' : 'Select Files'}
                  </Button>
                </div>
              </div>

              {/* Selected Files */}
              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    {language === 'uz' ? 'Tanlangan fayllar:' : language === 'ru' ? 'Выбранные файлы:' : 'Selected Files:'}
                  </p>
                  <div className="grid gap-2">
                    {selectedFiles.map((file, index) => {
                      const IconComponent = getFileIcon(file);
                      return (
                        <div key={index} className="flex items-center gap-3 p-3 bg-accent rounded-lg">
                          <IconComponent className="h-5 w-5 text-primary" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {file.type.split('/')[0]}
                          </Badge>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                  {language === 'uz' ? 'Bekor qilish' : language === 'ru' ? 'Отмена' : 'Cancel'}
                </Button>
              )}
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading 
                  ? (language === 'uz' ? 'Yuklanmoqda...' : language === 'ru' ? 'Загрузка...' : 'Creating...')
                  : (language === 'uz' ? 'Yaratish' : language === 'ru' ? 'Создать' : 'Create')
                }
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}