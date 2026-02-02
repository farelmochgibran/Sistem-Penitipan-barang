import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  FileText,
  LogOut,
  Box,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSidebarContext } from '@/contexts/SidebarContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Pelanggan', href: '/pelanggan', icon: Users },
  { name: 'Penitipan', href: '/penitipan', icon: ClipboardList },
  { name: 'Laporan', href: '/laporan', icon: FileText },
];

function NavItem({
  item,
  isActive,
  isCollapsed,
}: {
  item: (typeof navigation)[0];
  isActive: boolean;
  isCollapsed: boolean;
}) {
  const content = (
    <Link
      to={item.href}
      className={cn(
        'nav-item',
        isActive && 'active',
        isCollapsed && 'justify-center px-2'
      )}
    >
      <item.icon className="h-5 w-5 flex-shrink-0" />
      {!isCollapsed && <span>{item.name}</span>}
    </Link>
  );

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right">
          <p>{item.name}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { isCollapsed, isMobileOpen, toggleSidebar, closeMobileSidebar, isMobile } =
    useSidebarContext();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNavClick = () => {
    if (isMobile) {
      closeMobileSidebar();
    }
  };

  const sidebarContent = (
    <>
      {/* Logo */}
      <div
        className={cn(
          'flex h-16 items-center border-b border-sidebar-border',
          isCollapsed ? 'justify-center px-2' : 'gap-3 px-6'
        )}
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary flex-shrink-0">
          <Box className="h-5 w-5 text-sidebar-primary-foreground" />
        </div>
        {!isCollapsed && (
          <div className="overflow-hidden">
            <h1 className="text-base font-semibold text-sidebar-accent-foreground truncate">
              TitipBarang
            </h1>
            <p className="text-xs text-sidebar-foreground truncate">Management System</p>
          </div>
        )}
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto text-sidebar-foreground hover:text-sidebar-accent-foreground"
            onClick={closeMobileSidebar}
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <TooltipProvider delayDuration={0}>
        <nav className="flex-1 space-y-1 px-3 py-4" onClick={handleNavClick}>
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <NavItem
                key={item.name}
                item={item}
                isActive={isActive}
                isCollapsed={isCollapsed && !isMobile}
              />
            );
          })}
        </nav>
      </TooltipProvider>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-3" onClick={handleNavClick}>
        <TooltipProvider delayDuration={0}>
          {isCollapsed && !isMobile ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleLogout}
                  className="nav-item w-full justify-center px-2 hover:text-destructive"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Keluar</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <button
              onClick={handleLogout}
              className="nav-item w-full text-left hover:text-destructive"
            >
              <LogOut className="h-5 w-5" />
              Keluar
            </button>
          )}
        </TooltipProvider>
      </div>

      {/* Collapse Toggle (Desktop only) */}
      {!isMobile && (
        <div className="border-t border-sidebar-border p-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className={cn(
              'w-full text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent',
              isCollapsed && 'justify-center px-2'
            )}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-2" />
                <span>Minimize</span>
              </>
            )}
          </Button>
        </div>
      )}
    </>
  );

  // Mobile: overlay sidebar
  if (isMobile) {
    return (
      <>
        {/* Overlay */}
        {isMobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 transition-opacity"
            onClick={closeMobileSidebar}
          />
        )}
        {/* Sidebar */}
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-sidebar transition-transform duration-300 ease-in-out',
            isMobileOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          {sidebarContent}
        </aside>
      </>
    );
  }

  // Desktop: collapsible sidebar
  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-50 flex flex-col bg-sidebar transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {sidebarContent}
    </aside>
  );
}
