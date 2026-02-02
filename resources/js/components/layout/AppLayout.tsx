import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { SidebarProvider, useSidebarContext } from '@/contexts/SidebarContext';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

function AppLayoutContent({ children, title, subtitle }: AppLayoutProps) {
  const { isCollapsed, isMobile } = useSidebarContext();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div
        className={cn(
          'transition-all duration-300 ease-in-out',
          isMobile ? 'pl-0' : isCollapsed ? 'pl-16' : 'pl-64'
        )}
      >
        <Header title={title} subtitle={subtitle} />
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

export function AppLayout({ children, title, subtitle }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <AppLayoutContent title={title} subtitle={subtitle}>
        {children}
      </AppLayoutContent>
    </SidebarProvider>
  );
}
