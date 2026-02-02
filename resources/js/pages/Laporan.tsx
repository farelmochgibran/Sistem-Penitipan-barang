import { useState, useMemo, useEffect } from 'react';
import { format, isToday } from 'date-fns';
import { id } from 'date-fns/locale';
import { FileText, Calendar, TrendingUp, Package, AlertCircle, FileSpreadsheet, File, DollarSign } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';
import { ReportStatCard } from '@/components/laporan/ReportStatCard';
import { penitipanApi, pelangganApi } from '@/lib/api';
import type { Penitipan, Pelanggan } from '@/types';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function LaporanPage() {
  const [reportType, setReportType] = useState<'all' | 'active' | 'completed'>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [penitipan, setPenitipan] = useState<Penitipan[]>([]);
  const [pelanggan, setPelanggan] = useState<Pelanggan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      penitipanApi.getAll({
        status: reportType === 'all' ? undefined : reportType === 'active' ? 'dititipkan' : 'diambil',
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
        all: true,
      }),
      pelangganApi.getAll({ all: true })
    ]).then(([penitipanRes, pelangganRes]) => {
      setPenitipan(penitipanRes.data);
      setPelanggan(pelangganRes.data);
      setLoading(false);
    });
  }, [reportType, dateFrom, dateTo]);

  const getPelanggan = (pelangganId: number) => {
    return pelanggan.find((p) => p.id === pelangganId);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Helper functions for penalty calculation
  const calculateDuration = (item: Penitipan) => {
    const endDate = item.tanggal_ambil ? new Date(item.tanggal_ambil) : new Date();
    const startDate = new Date(item.tanggal_titip);
    return Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
  };

  const calculateLateDays = (item: Penitipan) => {
    const actualDuration = calculateDuration(item);
    return Math.max(0, actualDuration - item.durasi_hari);
  };

  const calculatePenalty = (item: Penitipan) => {
    if (item.total_denda !== undefined) return item.total_denda;
    const lateDays = calculateLateDays(item);
    return lateDays * item.denda_per_hari;
  };

  // Export helpers
  const exportToExcel = (data: Penitipan[], filename: string) => {
    const rows = data.map((item) => {
      const pelangganData = getPelanggan(item.pelanggan_id);
      return {
        'ID PTN': item.id_penitipan,
        'Tanggal Titip': item.tanggal_titip,
        'Tanggal Ambil': item.tanggal_ambil || '-',
        'ID PLG': pelangganData?.id_pelanggan || '',
        'Nama Pelanggan': pelangganData?.nama || '',
        'Barang': item.nama_barang,
        'Status': item.status === 'dititipkan' ? 'Dititipkan' : 'Diambil',
        'Biaya': item.total_biaya || item.biaya_per_hari,
        'Denda': item.total_denda || 0,
      };
    });
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Laporan');
    XLSX.writeFile(wb, filename);
  };

  const exportToPDF = (data: Penitipan[], filename: string) => {
    const doc = new jsPDF();
    const rows = data.map((item) => {
      const pelangganData = getPelanggan(item.pelanggan_id);
      return [
        item.id_penitipan,
        item.tanggal_titip,
        item.tanggal_ambil || '-',
        pelangganData?.id_pelanggan || '',
        pelangganData?.nama || '',
        item.nama_barang,
        item.status === 'dititipkan' ? 'Dititipkan' : 'Diambil',
        item.total_biaya || item.biaya_per_hari,
        item.total_denda || 0,
      ];
    });
    autoTable(doc, {
      head: [[
        'ID PTN', 'Tanggal Titip', 'Tanggal Ambil', 'ID PLG', 'Nama Pelanggan', 'Barang', 'Status', 'Biaya', 'Denda'
      ]],
      body: rows,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [22, 160, 133] },
    });
    doc.save(filename);
  };

  // Daily report stats (today's data)
  const dailyStats = useMemo(() => {
    const todayPenitipan = penitipan.filter((p) => {
      const titipDate = new Date(p.tanggal_titip);
      return isToday(titipDate);
    });
    const todayAmbil = penitipan.filter((p) => {
      if (!p.tanggal_ambil) return false;
      const ambilDate = new Date(p.tanggal_ambil);
      return isToday(ambilDate);
    });
    const todayRevenue = todayAmbil.reduce((sum, p) => sum + (p.total_biaya || 0) + (p.total_denda || 0), 0);
    const todayDenda = todayAmbil.reduce((sum, p) => sum + (p.total_denda || 0), 0);
    return {
      barangMasuk: todayPenitipan.length,
      barangKeluar: todayAmbil.length,
      pendapatan: todayRevenue,
      denda: todayDenda,
      transaksiHariIni: todayPenitipan.length + todayAmbil.length,
    };
  }, [penitipan]);

  const stats = useMemo(() => {
    const completed = penitipan.filter((p) => p.status === 'diambil');
    const active = penitipan.filter((p) => p.status === 'dititipkan');
    const totalRevenue = completed.reduce((sum, p) => sum + (p.total_biaya || 0) + (p.total_denda || 0), 0);
    const totalDenda = completed.reduce((sum, p) => sum + (p.total_denda || 0), 0);
    return {
      total: penitipan.length,
      completed: completed.length,
      active: active.length,
      revenue: totalRevenue,
      denda: totalDenda,
    };
  }, [penitipan]);

  const chartData = useMemo(() => {
    const monthlyData: Record<string, { month: string; penitipan: number; pendapatan: number }> = {};
    penitipan.forEach((p) => {
      const month = format(new Date(p.tanggal_titip), 'MMM yyyy', { locale: id });
      if (!monthlyData[month]) {
        monthlyData[month] = { month, penitipan: 0, pendapatan: 0 };
      }
      monthlyData[month].penitipan++;
      if (p.total_biaya) {
        monthlyData[month].pendapatan += p.total_biaya;
      }
    });
    return Object.values(monthlyData);
  }, [penitipan]);

  const filteredPenitipan = useMemo(() => {
    let data = penitipan;
    // Status and date filter already handled in API call
    return data;
  }, [penitipan]);

  // Daily transactions
  const dailyTransactions = useMemo(() => {
    return penitipan.filter((p) => {
      const titipDate = new Date(p.tanggal_titip);
      const isNewToday = isToday(titipDate);
      const isTakenToday = p.tanggal_ambil ? isToday(new Date(p.tanggal_ambil)) : false;
      return isNewToday || isTakenToday;
    });
  }, [penitipan]);

  const handleExportDailyReport = (type: 'pdf' | 'excel') => {
    const dateStr = format(new Date(), 'dd-MM-yyyy');
    if (type === 'excel') {
      exportToExcel(dailyTransactions, `laporan-harian-${dateStr}.xlsx`);
    } else {
      exportToPDF(dailyTransactions, `laporan-harian-${dateStr}.pdf`);
    }
    toast.success(`Laporan harian ${dateStr} berhasil diexport ke ${type.toUpperCase()}`);
  };

  const handleExport = (type: 'pdf' | 'excel') => {
    if (type === 'excel') {
      exportToExcel(filteredPenitipan, 'laporan-penitipan.xlsx');
    } else {
      exportToPDF(filteredPenitipan, 'laporan-penitipan.pdf');
    }
    toast.success(`Laporan berhasil diexport ke ${type.toUpperCase()}`);
  };

  return (
    <AppLayout title="Laporan" subtitle="Laporan dan analisis data penitipan">
      <div className="space-y-6 animate-fade-in">
        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="daily">Laporan Harian</TabsTrigger>
            <TabsTrigger value="all">Laporan Keseluruhan</TabsTrigger>
          </TabsList>

          {/* Daily Report Tab */}
          <TabsContent value="daily" className="space-y-6 mt-6">
            {/* Date Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl md:text-2xl font-bold">Laporan Harian</h2>
                <p className="text-sm md:text-base text-muted-foreground">
                  {format(new Date(), 'EEEE, dd MMMM yyyy', { locale: id })}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2 flex-1 sm:flex-initial" onClick={() => handleExportDailyReport('excel')}>
                  <FileSpreadsheet className="h-4 w-4" />
                  <span className="hidden sm:inline">Export</span> Excel
                </Button>
                <Button variant="outline" size="sm" className="gap-2 flex-1 sm:flex-initial" onClick={() => handleExportDailyReport('pdf')}>
                  <File className="h-4 w-4" />
                  <span className="hidden sm:inline">Export</span> PDF
                </Button>
              </div>
            </div>

            {/* Daily Summary Cards */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
              <ReportStatCard
                title="Transaksi Hari Ini"
                value={dailyStats.transaksiHariIni}
                icon={FileText}
                variant="default"
              />
              <ReportStatCard
                title="Barang Masuk"
                value={dailyStats.barangMasuk}
                icon={Package}
                variant="primary"
              />
              <ReportStatCard
                title="Barang Keluar"
                value={dailyStats.barangKeluar}
                icon={TrendingUp}
                variant="success"
              />
              <ReportStatCard
                title="Pendapatan Hari Ini"
                value={formatCurrency(dailyStats.pendapatan)}
                icon={DollarSign}
                variant="accent"
              />
              <ReportStatCard
                title="Denda Hari Ini"
                value={formatCurrency(dailyStats.denda)}
                icon={AlertCircle}
                variant="destructive"
              />
            </div>

            {/* Daily Transactions Table */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="text-base md:text-lg">Transaksi Hari Ini</CardTitle>
                <CardDescription className="text-xs md:text-sm">Daftar barang masuk dan keluar hari ini</CardDescription>
              </CardHeader>
              <CardContent className="p-0 md:p-6">
                {dailyTransactions.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="whitespace-nowrap">ID PTN</TableHead>
                          <TableHead className="whitespace-nowrap">Waktu</TableHead>
                          <TableHead className="whitespace-nowrap">ID PLG</TableHead>
                          <TableHead className="whitespace-nowrap hidden sm:table-cell">Pelanggan</TableHead>
                          <TableHead className="whitespace-nowrap hidden md:table-cell">Barang</TableHead>
                          <TableHead className="whitespace-nowrap">Keterangan</TableHead>
                          <TableHead className="text-right whitespace-nowrap">Biaya</TableHead>
                          <TableHead className="text-right whitespace-nowrap">Denda</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {dailyTransactions.map((item) => {
                          const isNewToday = isToday(new Date(item.tanggal_titip));
                          const isTakenToday = item.tanggal_ambil ? isToday(new Date(item.tanggal_ambil)) : false;
                          const pelangganData = getPelanggan(item.pelanggan_id);
                          const penalty = calculatePenalty(item);
                          return (
                            <TableRow key={item.id}>
                              <TableCell className="font-mono text-xs text-primary">
                                {item.id_penitipan}
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                <div className="flex items-center gap-1 md:gap-2">
                                  <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                                  <span className="text-xs md:text-sm">
                                    {format(new Date(isNewToday ? item.tanggal_titip : item.tanggal_ambil!), 'HH:mm')}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="font-mono text-xs text-primary">
                                {pelangganData?.id_pelanggan}
                              </TableCell>
                              <TableCell className="hidden sm:table-cell text-xs md:text-sm">
                                {pelangganData?.nama}
                              </TableCell>
                              <TableCell className="hidden md:table-cell text-xs md:text-sm">{item.nama_barang}</TableCell>
                              <TableCell>
                                {isNewToday && isTakenToday ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] md:text-xs bg-primary/10 text-primary px-1.5 md:px-2 py-0.5 md:py-1 rounded-full whitespace-nowrap">
                                    Masuk & Keluar
                                  </span>
                                ) : isNewToday ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] md:text-xs bg-primary/10 text-primary px-1.5 md:px-2 py-0.5 md:py-1 rounded-full whitespace-nowrap">
                                    Masuk
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[10px] md:text-xs bg-status-taken/10 text-status-taken px-1.5 md:px-2 py-0.5 md:py-1 rounded-full whitespace-nowrap">
                                    Keluar
                                  </span>
                                )}
                              </TableCell>
                              <TableCell className="text-right font-medium text-xs md:text-sm">
                                {isTakenToday && item.total_biaya
                                  ? formatCurrency(item.total_biaya)
                                  : '-'}
                              </TableCell>
                              <TableCell className="text-right font-medium text-xs md:text-sm">
                                {isTakenToday && penalty > 0 ? (
                                  <span className="text-destructive">{formatCurrency(penalty)}</span>
                                ) : (
                                  '-'
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Belum ada transaksi hari ini</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* All Reports Tab */}
          <TabsContent value="all" className="space-y-6 mt-6">
            {/* Summary Cards */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
              <ReportStatCard
                title="Total Transaksi"
                value={stats.total}
                icon={FileText}
                variant="default"
              />
              <ReportStatCard
                title="Masih Dititipkan"
                value={stats.active}
                icon={Package}
                variant="primary"
              />
              <ReportStatCard
                title="Sudah Diambil"
                value={stats.completed}
                icon={TrendingUp}
                variant="success"
              />
              <ReportStatCard
                title="Total Pendapatan"
                value={formatCurrency(stats.revenue)}
                icon={DollarSign}
                variant="accent"
              />
              <ReportStatCard
                title="Total Denda"
                value={formatCurrency(stats.denda)}
                icon={AlertCircle}
                variant="destructive"
              />
            </div>

            {/* Chart */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="text-base md:text-lg">Grafik Penitipan Bulanan</CardTitle>
                <CardDescription className="text-xs md:text-sm">Jumlah transaksi penitipan per bulan</CardDescription>
              </CardHeader>
              <CardContent className="p-2 md:p-6">
                <div className="h-60 md:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={10} tick={{ fontSize: 10 }} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tick={{ fontSize: 10 }} width={30} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          fontSize: '12px',
                        }}
                      />
                      <Bar
                        dataKey="penitipan"
                        fill="hsl(186, 72%, 38%)"
                        radius={[4, 4, 0, 0]}
                        name="Jumlah Penitipan"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Date Filter */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="text-base md:text-lg">Filter Tanggal</CardTitle>
                <CardDescription className="text-xs md:text-sm">Filter laporan berdasarkan rentang tanggal</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                  <div className="space-y-2 flex-1">
                    <Label htmlFor="dateFrom" className="text-sm">Dari Tanggal</Label>
                    <Input
                      id="dateFrom"
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="input-focus"
                    />
                  </div>
                  <div className="space-y-2 flex-1">
                    <Label htmlFor="dateTo" className="text-sm">Sampai Tanggal</Label>
                    <Input
                      id="dateTo"
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="input-focus"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setDateFrom('');
                      setDateTo('');
                    }}
                    className="w-full sm:w-auto"
                  >
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Report Table */}
            <Card className="card-elevated">
              <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle className="text-base md:text-lg">Detail Laporan</CardTitle>
                  <CardDescription className="text-xs md:text-sm">
                    {filteredPenitipan.length} data ditemukan
                  </CardDescription>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                  <Select value={reportType} onValueChange={v => setReportType(v as 'all' | 'active' | 'completed')}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua</SelectItem>
                      <SelectItem value="active">Masih Dititipkan</SelectItem>
                      <SelectItem value="completed">Sudah Diambil</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2 flex-1 sm:flex-initial" onClick={() => handleExport('excel')}>
                      <FileSpreadsheet className="h-4 w-4" />
                      <span className="hidden sm:inline">Export</span> Excel
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 flex-1 sm:flex-initial" onClick={() => handleExport('pdf')}>
                      <File className="h-4 w-4" />
                      <span className="hidden sm:inline">Export</span> PDF
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 md:p-6">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="whitespace-nowrap">ID PTN</TableHead>
                        <TableHead className="whitespace-nowrap">Tanggal</TableHead>
                        <TableHead className="whitespace-nowrap">ID PLG</TableHead>
                        <TableHead className="whitespace-nowrap hidden sm:table-cell">Pelanggan</TableHead>
                        <TableHead className="whitespace-nowrap hidden md:table-cell">Barang</TableHead>
                        <TableHead className="whitespace-nowrap">Status</TableHead>
                        <TableHead className="text-right whitespace-nowrap">Biaya</TableHead>
                        <TableHead className="text-right whitespace-nowrap">Denda</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPenitipan.map((item) => {
                        const pelangganData = getPelanggan(item.pelanggan_id);
                        const penalty = calculatePenalty(item);
                        const lateDays = calculateLateDays(item);
                        return (
                          <TableRow key={item.id}>
                            <TableCell className="font-mono text-xs text-primary">
                              {item.id_penitipan}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              <div className="flex items-center gap-1 md:gap-2">
                                <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                                <span className="text-xs md:text-sm">
                                  {format(new Date(item.tanggal_titip), 'dd MMM yyyy', { locale: id })}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="font-mono text-xs text-primary">
                              {pelangganData?.id_pelanggan}
                            </TableCell>
                            <TableCell className="hidden sm:table-cell text-xs md:text-sm">
                              {pelangganData?.nama}
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-xs md:text-sm">{item.nama_barang}</TableCell>
                            <TableCell>
                              <span
                                className={`text-[10px] md:text-xs ${
                                  item.status === 'diambil'
                                    ? 'status-taken'
                                    : item.is_overdue
                                      ? 'status-overdue'
                                      : 'status-stored'
                                }`}
                              >
                                {item.status === 'diambil'
                                  ? 'Diambil'
                                  : item.is_overdue
                                    ? 'Terlambat'
                                    : 'Dititipkan'}
                              </span>
                            </TableCell>
                            <TableCell className="text-right font-medium text-xs md:text-sm">
                              {item.total_biaya
                                ? formatCurrency(item.total_biaya)
                                : formatCurrency(item.biaya_per_hari) + '/hari'}
                            </TableCell>
                            <TableCell className="text-right font-medium text-xs md:text-sm">
                              {item.status === 'diambil' ? (
                                penalty > 0 ? (
                                  <span className="text-destructive">{formatCurrency(penalty)}</span>
                                ) : (
                                  '-'
                                )
                              ) : item.is_overdue && item.estimated_total_denda > 0 ? (
                                <span className="text-destructive">{formatCurrency(item.estimated_total_denda)}</span>
                              ) : (
                                '-'
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Warning for unpicked items */}
            {stats.active > 0 && (
              <Card className="border-accent/50 bg-accent/5">
                <CardHeader className="flex flex-row items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-accent" />
                  <div>
                    <CardTitle className="text-accent">Perhatian</CardTitle>
                    <CardDescription>
                      Terdapat {stats.active} barang yang masih dititipkan dan belum diambil
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
