import { useState, useEffect } from 'react';
import { Plus, Search, MoreHorizontal, Pencil, Trash2, CheckCircle, Package, Calendar, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { penitipanApi, pelangganApi, kategoriApi } from '@/lib/api';
import { Penitipan, Pelanggan, Kategori } from '@/types';
import { toast } from 'sonner';

export default function PenitipanPage() {
  const [penitipan, setPenitipan] = useState<Penitipan[]>([]);
  const [pelangganList, setPelangganList] = useState<Pelanggan[]>([]);
  const [kategoriList, setKategoriList] = useState<Kategori[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingPenitipan, setEditingPenitipan] = useState<Penitipan | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [pickupId, setPickupId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    pelanggan_id: '',
    kategori_id: '',
    nama_barang: '',
    deskripsi: '',
    tanggal_titip: format(new Date(), 'yyyy-MM-dd'),
    durasi_hari: '7',
    biaya_per_hari: '',
    denda_per_hari: '',
  });

  // Fetch data
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [penitipanRes, pelangganRes, kategoriRes] = await Promise.all([
        penitipanApi.getAll({ 
          search: searchQuery || undefined,
          status: statusFilter !== 'all' ? statusFilter as any : undefined,
          all: true 
        }),
        pelangganApi.getAll({ all: true }),
        kategoriApi.getAll({ all: true, is_active: true }),
      ]);
      
      if (penitipanRes.success) setPenitipan(penitipanRes.data);
      if (pelangganRes.success) setPelangganList(pelangganRes.data);
      if (kategoriRes.success) setKategoriList(kategoriRes.data);
    } catch (error) {
      toast.error('Gagal memuat data');
      console.error('Fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, statusFilter]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handleKategoriChange = (kategoriId: string) => {
    const kategori = kategoriList.find(k => k.id.toString() === kategoriId);
    if (kategori) {
      setFormData({
        ...formData,
        kategori_id: kategoriId,
        biaya_per_hari: kategori.biaya_per_hari.toString(),
        denda_per_hari: kategori.denda_per_hari.toString(),
      });
    }
  };

  const handleOpenDialog = (penitipanToEdit?: Penitipan) => {
    if (penitipanToEdit) {
      setEditingPenitipan(penitipanToEdit);
      setFormData({
        pelanggan_id: penitipanToEdit.pelanggan_id.toString(),
        kategori_id: penitipanToEdit.kategori_id.toString(),
        nama_barang: penitipanToEdit.nama_barang,
        deskripsi: penitipanToEdit.deskripsi || '',
        tanggal_titip: penitipanToEdit.tanggal_titip,
        durasi_hari: penitipanToEdit.durasi_hari.toString(),
        biaya_per_hari: penitipanToEdit.biaya_per_hari.toString(),
        denda_per_hari: penitipanToEdit.denda_per_hari.toString(),
      });
    } else {
      setEditingPenitipan(null);
      setFormData({
        pelanggan_id: '',
        kategori_id: '',
        nama_barang: '',
        deskripsi: '',
        tanggal_titip: format(new Date(), 'yyyy-MM-dd'),
        durasi_hari: '7',
        biaya_per_hari: '',
        denda_per_hari: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        pelanggan_id: parseInt(formData.pelanggan_id),
        kategori_id: parseInt(formData.kategori_id),
        nama_barang: formData.nama_barang,
        deskripsi: formData.deskripsi || undefined,
        tanggal_titip: formData.tanggal_titip,
        durasi_hari: parseInt(formData.durasi_hari),
        biaya_per_hari: parseFloat(formData.biaya_per_hari),
        denda_per_hari: parseFloat(formData.denda_per_hari),
      };

      if (editingPenitipan) {
        const response = await penitipanApi.update(editingPenitipan.id, payload);
        if (response.success) {
          toast.success('Data penitipan berhasil diperbarui');
          fetchData();
        }
      } else {
        const response = await penitipanApi.create(payload);
        if (response.success) {
          toast.success('Penitipan baru berhasil ditambahkan');
          fetchData();
        }
      }
      setIsDialogOpen(false);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Gagal menyimpan data';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePickup = async () => {
    if (!pickupId) return;

    try {
      const response = await penitipanApi.pickup(pickupId);
      if (response.success) {
        toast.success('Barang berhasil diambil');
        fetchData();
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Gagal memproses pengambilan';
      toast.error(errorMessage);
    } finally {
      setPickupId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const response = await penitipanApi.delete(deleteId);
      if (response.success) {
        toast.success('Data penitipan berhasil dihapus');
        fetchData();
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Gagal menghapus data';
      toast.error(errorMessage);
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <AppLayout title="Data Penitipan" subtitle="Kelola transaksi penitipan barang">
      <div className="space-y-6 animate-fade-in">
        {/* Header Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari barang..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 input-focus"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="dititipkan">Dititipkan</SelectItem>
                <SelectItem value="diambil">Diambil</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()} className="gap-2 btn-primary-gradient">
                <Plus className="h-4 w-4" />
                Tambah Penitipan
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editingPenitipan ? 'Edit Penitipan' : 'Tambah Penitipan Baru'}
                </DialogTitle>
                <DialogDescription>
                  {editingPenitipan
                    ? 'Perbarui informasi penitipan'
                    : 'Masukkan data penitipan baru'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pelanggan">Pelanggan</Label>
                  <Select
                    value={formData.pelanggan_id}
                    onValueChange={(value) => setFormData({ ...formData, pelanggan_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih pelanggan" />
                    </SelectTrigger>
                    <SelectContent>
                      {pelangganList.map((p) => (
                        <SelectItem key={p.id} value={p.id.toString()}>
                          <span className="font-medium">{p.id_pelanggan}</span>
                          <span className="text-muted-foreground ml-2">- {p.nama}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nama_barang">Nama Barang</Label>
                    <Input
                      id="nama_barang"
                      value={formData.nama_barang}
                      onChange={(e) => setFormData({ ...formData, nama_barang: e.target.value })}
                      placeholder="Nama barang"
                      required
                      className="input-focus"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="kategori">Kategori</Label>
                    <Select
                      value={formData.kategori_id}
                      onValueChange={handleKategoriChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        {kategoriList.map((k) => (
                          <SelectItem key={k.id} value={k.id.toString()}>
                            {k.nama}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deskripsi">Deskripsi</Label>
                  <Textarea
                    id="deskripsi"
                    value={formData.deskripsi}
                    onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                    placeholder="Deskripsi barang"
                    rows={3}
                    className="input-focus"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tanggal_titip">Tanggal Titip</Label>
                    <Input
                      id="tanggal_titip"
                      type="date"
                      value={formData.tanggal_titip}
                      onChange={(e) => setFormData({ ...formData, tanggal_titip: e.target.value })}
                      required
                      className="input-focus"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="durasi_hari">Durasi (Hari)</Label>
                    <Input
                      id="durasi_hari"
                      type="number"
                      value={formData.durasi_hari}
                      onChange={(e) => setFormData({ ...formData, durasi_hari: e.target.value })}
                      placeholder="7"
                      required
                      min="1"
                      className="input-focus"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="biaya_per_hari">Biaya/Hari (Rp)</Label>
                    <Input
                      id="biaya_per_hari"
                      type="number"
                      value={formData.biaya_per_hari}
                      onChange={(e) => setFormData({ ...formData, biaya_per_hari: e.target.value })}
                      placeholder="10000"
                      required
                      className="input-focus"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="denda_per_hari">Denda/Hari (Rp)</Label>
                    <Input
                      id="denda_per_hari"
                      type="number"
                      value={formData.denda_per_hari}
                      onChange={(e) => setFormData({ ...formData, denda_per_hari: e.target.value })}
                      placeholder="2000"
                      required
                      className="input-focus"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    disabled={isSubmitting}
                  >
                    Batal
                  </Button>
                  <Button type="submit" className="btn-primary-gradient" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {editingPenitipan ? 'Simpan Perubahan' : 'Tambah Penitipan'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Table */}
        <div className="table-container overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">ID</TableHead>
                <TableHead>Barang</TableHead>
                <TableHead>Pelanggan</TableHead>
                <TableHead>Tanggal Titip</TableHead>
                <TableHead>Durasi</TableHead>
                <TableHead>Biaya</TableHead>
                <TableHead>Denda</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    {[...Array(9)].map((_, j) => (
                      <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <>
                  {penitipan.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/50">
                      <TableCell className="font-mono text-xs text-primary">
                        {item.id_penitipan}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                            <Package className="h-5 w-5 text-secondary-foreground" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{item.nama_barang}</p>
                            <p className="text-sm text-muted-foreground">{item.kategori?.nama}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-mono text-xs text-primary">{item.pelanggan?.id_pelanggan}</p>
                          <p className="text-foreground">{item.pelanggan?.nama}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(item.tanggal_titip), 'dd MMM yyyy', { locale: id })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-foreground">{item.durasi_hari} hari</p>
                          {item.is_overdue && item.status === 'dititipkan' && (
                            <p className="text-xs text-destructive">+{item.days_overdue} hari terlambat</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-foreground">
                            {formatCurrency(item.total_biaya || item.estimated_total_biaya)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatCurrency(item.biaya_per_hari)}/hari
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {(item.total_denda || item.estimated_total_denda) > 0 ? (
                          <div>
                            <p className="font-medium text-destructive">
                              {item.status === 'diambil'
                                ? formatCurrency(Math.abs(item.total_denda || 0))
                                : item.is_overdue && item.estimated_total_denda > 0
                                  ? formatCurrency(item.estimated_total_denda)
                                  : '-'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatCurrency(item.denda_per_hari)}/hari
                            </p>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
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
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {item.status === 'dititipkan' && (
                              <>
                                <DropdownMenuItem onClick={() => setPickupId(item.id)}>
                                  <CheckCircle className="mr-2 h-4 w-4 text-status-taken" />
                                  Proses Pengambilan
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleOpenDialog(item)}>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                              </>
                            )}
                            {item.status === 'diambil' && (
                              <DropdownMenuItem
                                onClick={() => setDeleteId(item.id)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Hapus
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {penitipan.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={9} className="h-32 text-center text-muted-foreground">
                        Tidak ada data penitipan ditemukan
                      </TableCell>
                    </TableRow>
                  )}
                </>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pickup Confirmation Dialog */}
        <AlertDialog open={!!pickupId} onOpenChange={(open) => !open && setPickupId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Proses Pengambilan</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin memproses pengambilan barang ini? Biaya dan denda akan dihitung otomatis.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={handlePickup} className="bg-primary">
                Proses Pengambilan
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus Penitipan</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin menghapus data penitipan ini? Tindakan ini tidak dapat dibatalkan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Hapus
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  );
}
