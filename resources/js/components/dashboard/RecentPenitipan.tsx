import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { Package, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Penitipan } from '@/types';
import { Button } from '@/components/ui/button';

interface RecentPenitipanProps {
  penitipan: Penitipan[];
}

export function RecentPenitipan({ penitipan }: RecentPenitipanProps) {
  const recentItems = penitipan.slice(0, 5);

  return (
    <div className="card-elevated">
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Penitipan Terbaru
          </h3>
          <p className="text-sm text-muted-foreground">
            5 transaksi terakhir
          </p>
        </div>
        <Link to="/penitipan">
          <Button variant="ghost" size="sm" className="gap-2">
            Lihat Semua
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
      <div className="divide-y divide-border">
        {recentItems.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            Belum ada data penitipan
          </div>
        ) : (
          recentItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-foreground truncate">
                    {item.nama_barang}
                  </p>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono">
                    {item.id_penitipan}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {item.pelanggan?.id_pelanggan} - {item.pelanggan?.nama || 'Unknown'}
                </p>
              </div>
              <div className="text-right">
                <span
                  className={
                    item.status === 'dititipkan' 
                      ? item.is_overdue 
                        ? 'status-overdue' 
                        : 'status-stored' 
                      : 'status-taken'
                  }
                >
                  {item.status === 'dititipkan' 
                    ? item.is_overdue 
                      ? 'Terlambat' 
                      : 'Dititipkan' 
                    : 'Diambil'}
                </span>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(new Date(item.tanggal_titip), {
                    addSuffix: true,
                    locale: id,
                  })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
