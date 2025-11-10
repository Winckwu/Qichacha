import { type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Home,
  MessageSquare,
  Users,
  Activity,
  Shield,
  BarChart3,
  Target,
  FlaskConical,
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: '功能总览', href: '/', icon: Home },
  { name: '对话演示', href: '/chat', icon: MessageSquare },
  { name: '模式识别', href: '/patterns', icon: Users },
  { name: '置信度评分', href: '/confidence', icon: Activity },
  { name: '技能监控', href: '/skills', icon: Target },
  { name: '置信度校准', href: '/calibration', icon: BarChart3 },
  { name: '隐私保护', href: '/privacy', icon: Shield },
  { name: '测试场景', href: '/scenarios', icon: FlaskConical },
];

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center px-4">
          <div className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-xl font-bold">M</span>
            </div>
            <div>
              <h1 className="text-lg font-bold">MCA System</h1>
              <p className="text-xs text-muted-foreground">元认知协作智能体 - 交互式原型</p>
            </div>
          </div>

          <div className="ml-auto flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-sm">
              <span className="text-muted-foreground">版本:</span>
              <span className="font-mono text-primary">v1.0.0-demo</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 border-r bg-background lg:block">
          <nav className="flex flex-col space-y-1 p-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="absolute bottom-4 left-4 right-4 rounded-lg border bg-muted/50 p-4">
            <p className="text-xs font-medium text-muted-foreground">
              📘 演示模式
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              所有数据均为模拟数据，无需数据库连接
            </p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="container mx-auto p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background lg:hidden">
        <div className="grid grid-cols-4 gap-1 p-2">
          {navigation.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex flex-col items-center justify-center space-y-1 rounded-lg p-2 text-xs',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="truncate">{item.name.split('').slice(0, 4).join('')}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
