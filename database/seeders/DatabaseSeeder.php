<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Kategori;
use App\Models\Pelanggan;
use App\Models\Penitipan;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create Admin
        Admin::create([
            'nama' => 'Administrator',
            'username' => 'admin',
            'password' => Hash::make('admin123'),
            'email' => 'admin@penitipan.com',
        ]);

        // Create Kategori
        $kategori = [
            [
                'nama' => 'Elektronik',
                'biaya_per_hari' => 15000,
                'denda_per_hari' => 5000,
            ],
            [
                'nama' => 'Dokumen',
                'biaya_per_hari' => 5000,
                'denda_per_hari' => 2000,
            ],
            [
                'nama' => 'Tas & Koper',
                'biaya_per_hari' => 10000,
                'denda_per_hari' => 3000,
            ],
            [
                'nama' => 'Pakaian',
                'biaya_per_hari' => 8000,
                'denda_per_hari' => 2500,
            ],
            [
                'nama' => 'Aksesoris',
                'biaya_per_hari' => 12000,
                'denda_per_hari' => 4000,
            ],
            [
                'nama' => 'Lainnya',
                'biaya_per_hari' => 7000,
                'denda_per_hari' => 2000,
            ],
        ];

        foreach ($kategori as $k) {
            Kategori::create($k);
        }

        // Create Pelanggan
        $pelanggan = [
            [
                'nama' => 'Ahmad Rizki',
                'no_hp' => '081234567890',
                'alamat' => 'Jl. Merdeka No. 123, Jakarta Pusat',
            ],
            [
                'nama' => 'Siti Nurhaliza',
                'no_hp' => '082345678901',
                'alamat' => 'Jl. Sudirman No. 45, Jakarta Selatan',
            ],
            [
                'nama' => 'Budi Santoso',
                'no_hp' => '083456789012',
                'alamat' => 'Jl. Gatot Subroto No. 67, Bandung',
            ],
            [
                'nama' => 'Dewi Lestari',
                'no_hp' => '084567890123',
                'alamat' => 'Jl. Diponegoro No. 89, Surabaya',
            ],
            [
                'nama' => 'Eko Prasetyo',
                'no_hp' => '085678901234',
                'alamat' => 'Jl. Ahmad Yani No. 12, Semarang',
            ],
            [
                'nama' => 'Fitri Handayani',
                'no_hp' => '086789012345',
                'alamat' => 'Jl. Pahlawan No. 34, Yogyakarta',
            ],
            [
                'nama' => 'Gunawan Wibowo',
                'no_hp' => '087890123456',
                'alamat' => 'Jl. Veteran No. 56, Malang',
            ],
            [
                'nama' => 'Hana Permata',
                'no_hp' => '088901234567',
                'alamat' => 'Jl. Kartini No. 78, Denpasar',
            ],
        ];

        foreach ($pelanggan as $p) {
            Pelanggan::create($p);
        }

        // Create Penitipan
        $penitipan = [
            [
                'pelanggan_id' => 1,
                'kategori_id' => 1, // Elektronik
                'nama_barang' => 'Laptop ASUS ROG',
                'deskripsi' => 'Laptop gaming ASUS ROG 15 inch, warna hitam',
                'tanggal_titip' => Carbon::now()->subDays(3)->format('Y-m-d'),
                'durasi_hari' => 7,
                'biaya_per_hari' => 15000,
                'denda_per_hari' => 5000,
                'status' => 'dititipkan',
            ],
            [
                'pelanggan_id' => 2,
                'kategori_id' => 3, // Tas & Koper
                'nama_barang' => 'Koper Rimowa',
                'deskripsi' => 'Koper besar warna silver, ukuran 28 inch',
                'tanggal_titip' => Carbon::now()->subDays(5)->format('Y-m-d'),
                'durasi_hari' => 14,
                'biaya_per_hari' => 10000,
                'denda_per_hari' => 3000,
                'status' => 'dititipkan',
            ],
            [
                'pelanggan_id' => 3,
                'kategori_id' => 2, // Dokumen
                'nama_barang' => 'Berkas Penting',
                'deskripsi' => 'Map berisi dokumen sertifikat dan ijazah',
                'tanggal_titip' => Carbon::now()->subDays(2)->format('Y-m-d'),
                'durasi_hari' => 5,
                'biaya_per_hari' => 5000,
                'denda_per_hari' => 2000,
                'status' => 'dititipkan',
            ],
            [
                'pelanggan_id' => 4,
                'kategori_id' => 5, // Aksesoris
                'nama_barang' => 'Jam Tangan Rolex',
                'deskripsi' => 'Jam tangan Rolex Submariner, warna hitam emas',
                'tanggal_titip' => Carbon::now()->subDays(1)->format('Y-m-d'),
                'durasi_hari' => 3,
                'biaya_per_hari' => 12000,
                'denda_per_hari' => 4000,
                'status' => 'dititipkan',
            ],
            [
                'pelanggan_id' => 5,
                'kategori_id' => 4, // Pakaian
                'nama_barang' => 'Jas Formal',
                'deskripsi' => 'Jas formal warna navy blue, ukuran L',
                'tanggal_titip' => Carbon::now()->subDays(10)->format('Y-m-d'),
                'durasi_hari' => 5,
                'biaya_per_hari' => 8000,
                'denda_per_hari' => 2500,
                'status' => 'dititipkan',
            ],
            [
                'pelanggan_id' => 6,
                'kategori_id' => 1, // Elektronik
                'nama_barang' => 'iPad Pro',
                'deskripsi' => 'iPad Pro 12.9 inch dengan Apple Pencil',
                'tanggal_titip' => Carbon::now()->subDays(12)->format('Y-m-d'),
                'durasi_hari' => 7,
                'biaya_per_hari' => 15000,
                'denda_per_hari' => 5000,
                'status' => 'dititipkan',
            ],
            [
                'pelanggan_id' => 7,
                'kategori_id' => 3, // Tas & Koper
                'nama_barang' => 'Ransel Tumi',
                'deskripsi' => 'Ransel laptop Tumi warna hitam',
                'tanggal_titip' => Carbon::now()->subDays(15)->format('Y-m-d'),
                'durasi_hari' => 7,
                'tanggal_ambil' => Carbon::now()->subDays(8)->format('Y-m-d'),
                'biaya_per_hari' => 10000,
                'denda_per_hari' => 3000,
                'total_biaya' => 70000,
                'total_denda' => 0,
                'status' => 'diambil',
            ],
            [
                'pelanggan_id' => 8,
                'kategori_id' => 6, // Lainnya
                'nama_barang' => 'Payung Golf',
                'deskripsi' => 'Payung golf besar warna biru',
                'tanggal_titip' => Carbon::now()->subDays(20)->format('Y-m-d'),
                'durasi_hari' => 10,
                'tanggal_ambil' => Carbon::now()->subDays(7)->format('Y-m-d'),
                'biaya_per_hari' => 7000,
                'denda_per_hari' => 2000,
                'total_biaya' => 70000,
                'total_denda' => 6000,
                'status' => 'diambil',
            ],
        ];

        foreach ($penitipan as $p) {
            Penitipan::create($p);
        }
    }
}
