import { useState, useEffect } from 'react';
import { Plus, Search, MoreHorizontal, Pencil, Trash2, Phone, MapPin, Loader2 } from 'lucide-react';
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
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { pelangganApi } from '@/lib/api';
import { Pelanggan } from '@/types';
import { toast } from 'sonner';

export default function PelangganPage() {
  const [pelanggan, setPelanggan] = useState<Pelanggan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingPelanggan, setEditingPelanggan] = useState<Pelanggan | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nama: '',
    no_hp: '',
    alamat: '',
  });

  // Fetch pelanggan data
  const fetchPelanggan = async () => {
    try {
      setIsLoading(true);
      const response = await pelangganApi.getAll({ 
        search: searchQuery || undefined,
        all: true 
      });
      if (response.success) {
        setPelanggan(response.data);
      }
    } catch (error) {
      toast.error('Gagal memuat data pelanggan');
      console.error('Fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Robust debounced fetch (like Penitipan)
  useEffect(() => {
    if (searchQuery === '') {
      fetchPelanggan();
      return;
    }
    setIsLoading(true);
    const timer = setTimeout(() => {
      fetchPelanggan();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleOpenDialog = (pelangganToEdit?: Pelanggan) => {
    if (pelangganToEdit) {
      setEditingPelanggan(pelangganToEdit);
      setFormData({
        nama: pelangganToEdit.nama,
        no_hp: pelangganToEdit.no_hp,
        alamat: pelangganToEdit.alamat,
      });
    } else {
      setEditingPelanggan(null);
      setFormData({ nama: '', no_hp: '', alamat: '' });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (editingPelanggan) {
        const response = await pelangganApi.update(editingPelanggan.id, formData);
        if (response.success) {
          toast.success('Data pelanggan berhasil diperbarui');
          fetchPelanggan();
        }
      } else {
        const response = await pelangganApi.create(formData);
        if (response.success) {
          toast.success('Pelanggan baru berhasil ditambahkan');
          fetchPelanggan();
        }
      }
      setIsDialogOpen(false);
      setFormData({ nama: '', no_hp: '', alamat: '' });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Gagal menyimpan data';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      const response = await pelangganApi.delete(deleteId);
      if (response.success) {
        toast.success('Pelanggan berhasil dihapus');
        fetchPelanggan();
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Gagal menghapus pelanggan';
      toast.error(errorMessage);
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <AppLayout title="Data Pelanggan" subtitle="Kelola data pelanggan penitipan">
      <div className="space-y-6 animate-fade-in">
        {/* Header Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari pelanggan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 input-focus"
            />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()} className="gap-2 btn-primary-gradient">
                <Plus className="h-4 w-4" />
                Tambah Pelanggan
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingPelanggan ? 'Edit Pelanggan' : 'Tambah Pelanggan Baru'}
                </DialogTitle>
                <DialogDescription>
                  {editingPelanggan
                    ? 'Perbarui informasi pelanggan'
                    : 'Masukkan data pelanggan baru'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nama">Nama Lengkap</Label>
                  <Input
                    id="nama"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    placeholder="Masukkan nama lengkap"
                    required
                    className="input-focus"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="no_hp">No. Handphone</Label>
                  <Input
                    id="no_hp"
                    value={formData.no_hp}
                    onChange={(e) => setFormData({ ...formData, no_hp: e.target.value })}
                    placeholder="08xxxxxxxxxx"
                    required
                    className="input-focus"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alamat">Alamat</Label>
                  <Input
                    id="alamat"
                    value={formData.alamat}
                    onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                    placeholder="Masukkan alamat lengkap"
                    required
                    className="input-focus"
                  />
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
                    {editingPelanggan ? 'Simpan Perubahan' : 'Tambah Pelanggan'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Table */}
        <div className="table-container">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Pelanggan</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>No. Handphone</TableHead>
                <TableHead className="hidden md:table-cell">Alamat</TableHead>
                <TableHead className="hidden sm:table-cell">Terdaftar</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-48" /></TableCell>
                    <TableCell className="hidden sm:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                  </TableRow>
                ))
              ) : (
                <>
                  {pelanggan.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/50">
                      <TableCell>
                        <span className="font-mono text-sm font-medium text-primary">{item.id_pelanggan}</span>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-foreground">{item.nama}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          {item.no_hp}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-2 text-muted-foreground max-w-xs truncate">
                          <MapPin className="h-4 w-4 shrink-0" />
                          {item.alamat}
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground">
                        {item.created_at && format(new Date(item.created_at), 'dd MMM yyyy', { locale: id })}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpenDialog(item)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeleteId(item.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {pelanggan.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                        Tidak ada data pelanggan ditemukan
                      </TableCell>
                    </TableRow>
                  )}
                </>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus Pelanggan</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin menghapus pelanggan ini? Tindakan ini tidak dapat dibatalkan.
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
