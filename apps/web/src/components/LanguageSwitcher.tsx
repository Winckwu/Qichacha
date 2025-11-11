import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'zh' ? 'en' : 'zh';
    i18n.changeLanguage(newLang);
    localStorage.setItem('i18nextLng', newLang);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2"
      title={i18n.language === 'zh' ? 'Switch to English' : '切换到中文'}
    >
      <Languages className="h-4 w-4" />
      <span className="font-medium">
        {i18n.language === 'zh' ? 'EN' : '中文'}
      </span>
    </Button>
  );
}
