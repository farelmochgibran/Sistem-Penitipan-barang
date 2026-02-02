import { useEffect, useState } from 'react';
import { Package, Users, ClipboardList, Wallet, AlertTriangle } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { RecentPenitipan } from '@/components/dashboard/RecentPenitipan';
import { StatusChart } from '@/components/dashboard/StatusChart';
import { penitipanApi, pelangganApi } from '@/lib/api';
import { DashboardStatistics } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function Dashboard() {
  const [statistics, setStatistics] = useState<DashboardStatistics | null>(null);
  const [totalPelanggan, setTotalPelanggan] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const [statsResponse, pelangganResponse] = await Promise.all([
          penitipanApi.getStatistics(),
          pelangganApi.getAll({ all: true }),
        ]);
        
        if (statsResponse.success) {
          setStatistics(statsResponse.data);
        }
        
        if (pelangganResponse.success) {
          setTotalPelanggan(pelangganResponse.data.length);
        }
      } catch (err) {
        setError('Gagal memuat data dashboard');
        console.error('Dashboard error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  if (isLoading) {
    return (
      <AppLayout
        title="Dashboard"
        subtitle="Selamat datang di Sistem Penitipan Barang"
      >
        <div className="space-y-8 animate-fade-in">
          <div className="grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
          <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
            <Skeleton className="lg:col-span-2 h-96 rounded-xl" />
            <Skeleton className="lg:col-span-1 h-96 rounded-xl" />
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout
        title="Dashboard"
        subtitle="Selamat datang di Sistem Penitipan Barang"
      >
        <div className="flex flex-col items-center justify-center py-12">
          <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
          <p className="text-lg text-muted-foreground">{error}</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title="Dashboard"
      subtitle="Selamat datang di Sistem Penitipan Barang"
    >
      <div className="space-y-8 animate-fade-in">
        {/* Stats Grid */}
        <div className="grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Penitipan"
            value={statistics?.total_penitipan || 0}
            icon={ClipboardList}
            variant="primary"
          />
          <StatCard
            title="Sedang Dititipkan"
            value={`${statistics?.active_penitipan || 0}${statistics?.overdue_penitipan ? ` (${statistics.overdue_penitipan} terlambat)` : ''}`}
            icon={Package}
            variant="default"
          />
          <StatCard
            title="Total Pelanggan"
            value={totalPelanggan}
            icon={Users}
            variant="default"
          />
          <StatCard
            title="Pendapatan"
            value={formatCurrency(statistics?.total_revenue || 0)}
            icon={Wallet}
            variant="accent"
          />
        </div>

        {/* Charts and Recent Activity */}
        <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecentPenitipan penitipan={statistics?.recent_penitipan || []} />
          </div>
          <div className="lg:col-span-1">
            <StatusChart
               dititipkan={statistics?.active_penitipan || 0}
               diambil={statistics?.completed_penitipan || 0}
               terlambat={statistics?.overdue_penitipan || 0}
             />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
