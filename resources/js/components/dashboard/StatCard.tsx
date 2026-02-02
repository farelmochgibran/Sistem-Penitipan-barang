import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'accent';
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  variant = 'default',
}: StatCardProps) {
  const getGradientClass = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-br from-primary to-primary/80';
      case 'accent':
        return 'bg-gradient-to-br from-accent to-accent/80';
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
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="card-elevated p-5 md:p-6 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
      {/* Background decoration */}
      <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-10 ${getGradientClass()}`} />
      
      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-1 md:space-y-2 min-w-0 flex-1">
          <p className="text-xs md:text-sm font-medium text-muted-foreground truncate">{title}</p>
          <p className="text-xl md:text-3xl font-bold text-foreground tracking-tight truncate">{value}</p>
          {trend && (
            <div
              className={`flex items-center gap-1 text-xs md:text-sm font-medium ${
                trend.isPositive ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {trend.isPositive ? (
                <TrendingUp className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
              ) : (
                <TrendingDown className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
              )}
              <span>{trend.value}%</span>
              <span className="text-muted-foreground font-normal hidden sm:inline">dari bulan lalu</span>
            </div>
          )}
        </div>
        <div
          className={`flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl border ${getIconBgClass()} group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}
        >
          <Icon className="h-5 w-5 md:h-6 md:w-6" />
        </div>
      </div>
    </div>
  );
}
