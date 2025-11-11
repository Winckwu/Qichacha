import { Link, useLocation } from 'react-router-dom';
import { MessageSquare, BarChart3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <nav className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold">
                  M
                </div>
                <span className="text-xl font-bold">MCA System</span>
              </Link>

              <div className="flex space-x-1">
                <Link
                  to="/"
                  className={cn(
                    'flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    location.pathname === '/'
                      ? 'bg-primary text-white'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                  )}
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>{t('nav.chat')}</span>
                </Link>
                <Link
                  to="/dashboard"
                  className={cn(
                    'flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    location.pathname === '/dashboard'
                      ? 'bg-primary text-white'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                  )}
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>{t('nav.dashboard')}</span>
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-muted-foreground">
                {t('nav.pattern')}: <span className="font-semibold text-primary">A</span>
              </div>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
