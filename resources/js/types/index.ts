export interface Pelanggan {
  id: number;
  id_pelanggan: string;
  nama: string;
  no_hp: string;
  alamat: string;
  email?: string;
  is_active: boolean;
  penitipan_count?: number;
  active_penitipan_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Kategori {
  id: number;
  nama: string;
  deskripsi?: string;
  biaya_per_hari: number;
  denda_per_hari: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Penitipan {
  id: number;
  id_penitipan: string;
  pelanggan_id: number;
  pelanggan?: {
    id: number;
    id_pelanggan: string;
    nama: string;
    no_hp: string;
  };
  kategori_id: number;
  kategori?: {
    id: number;
    nama: string;
  };
  nama_barang: string;
  deskripsi?: string;
  tanggal_titip: string;
  tanggal_ambil?: string;
  tanggal_jatuh_tempo: string;
  durasi_hari: number;
  status: 'dititipkan' | 'diambil';
  biaya_per_hari: number;
  denda_per_hari: number;
  total_biaya?: number;
  total_denda?: number;
  estimated_total_biaya: number;
  estimated_total_denda: number;
  estimated_grand_total: number;
  is_overdue: boolean;
  days_overdue: number;
  catatan?: string;
  created_at?: string;
  updated_at?: string;
}

export type StatusPenitipan = 'dititipkan' | 'diambil';

export interface DashboardStatistics {
  total_penitipan: number;
  active_penitipan: number;
  completed_penitipan: number;
  overdue_penitipan: number;
  total_revenue: number;
  total_penalty: number;
  recent_penitipan: Penitipan[];
  status_distribution: {
    status: string;
    count: number;
  }[];
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  meta?: PaginationMeta;
}

// Legacy types for backward compatibility
export interface Barang {
  id: string;
  nama: string;
  kategori: string;
  deskripsi: string;
}
