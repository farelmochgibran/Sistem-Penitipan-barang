import { LucideIcon } from 'lucide-react';

interface ReportStatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  variant?: 'default' | 'primary' | 'accent' | 'success' | 'destructive';
}

export function ReportStatCard({
  title,
  value,
  icon: Icon,
  variant = 'default',
}: ReportStatCardProps) {
  const getGradientClass = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-br from-primary to-primary/80';
      case 'accent':
        return 'bg-gradient-to-br from-accent to-accent/80';
      case 'success':
        return 'bg-gradient-to-br from-status-taken to-status-taken/80';
      case 'destructive':
        return 'bg-gradient-to-br from-destructive to-destructive/80';
      default:
        return 'bg-gradient-to-br from-secondary to-secondary/80';
    }
  };

  const getIconBgClass = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'accent':
        return 'bg-accent/10 text-accent-foreground border-accent/20';
      case 'success':
        return 'bg-status-taken/10 text-status-taken border-status-taken/20';
      case 'destructive':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getValueClass = () => {
    switch (variant) {
      case 'primary':
        return 'text-primary';
      case 'accent':
        return 'text-accent';
      case 'success':
        return 'text-status-taken';
      case 'destructive':
        return 'text-destructive';
      default:
        return 'text-foreground';
    }
  };

  return (
    <div className="card-elevated p-4 md:p-5 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
      {/* Background decoration */}
      <div className={`absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-10 ${getGradientClass()}`} />
      
      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-1 min-w-0 flex-1">
          <p className="text-xs md:text-sm font-medium text-muted-foreground truncate">{title}</p>
          <p className={`text-lg md:text-2xl font-bold tracking-tight truncate ${getValueClass()}`}>{value}</p>
        </div>
        <div
          className={`flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-xl border ${getIconBgClass()} group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}
        >
          <Icon className="h-4 w-4 md:h-5 md:w-5" />
        </div>
      </div>
    </div>
  );
}
