-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jan 27, 2026 at 11:22 AM
-- Server version: 8.4.3
-- PHP Version: 8.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `peminjaman_app`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` bigint UNSIGNED NOT NULL,
  `nama` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `nama`, `username`, `email`, `email_verified_at`, `password`, `is_active`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Administrator', 'admin', 'admin@penitipan.com', NULL, '$2y$12$kqiIHVtHEicekJERRllcjuZwwQGwkgg9CTKPIz7GnIFZ5nPRlNr6C', 1, NULL, '2026-01-24 10:35:07', '2026-01-24 10:35:07');

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint UNSIGNED NOT NULL,
  `reserved_at` int UNSIGNED DEFAULT NULL,
  `available_at` int UNSIGNED NOT NULL,
  `created_at` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `kategori`
--

CREATE TABLE `kategori` (
  `id` bigint UNSIGNED NOT NULL,
  `nama` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `biaya_per_hari` decimal(10,2) NOT NULL DEFAULT '10000.00',
  `denda_per_hari` decimal(10,2) NOT NULL DEFAULT '5000.00',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `kategori`
--

INSERT INTO `kategori` (`id`, `nama`, `biaya_per_hari`, `denda_per_hari`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Elektronik', 15000.00, 5000.00, 1, '2026-01-24 10:35:07', '2026-01-24 10:35:07'),
(2, 'Dokumen', 5000.00, 2000.00, 1, '2026-01-24 10:35:07', '2026-01-24 10:35:07'),
(3, 'Tas & Koper', 10000.00, 3000.00, 1, '2026-01-24 10:35:07', '2026-01-24 10:35:07'),
(4, 'Pakaian', 8000.00, 2500.00, 1, '2026-01-24 10:35:07', '2026-01-24 10:35:07'),
(5, 'Aksesoris', 12000.00, 4000.00, 1, '2026-01-24 10:35:07', '2026-01-24 10:35:07'),
(6, 'Lainnya', 7000.00, 2000.00, 1, '2026-01-24 10:35:07', '2026-01-24 10:35:07');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int UNSIGNED NOT NULL,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2024_01_01_000001_create_admins_table', 1),
(5, '2024_01_01_000002_create_kategori_table', 1),
(6, '2024_01_01_000003_create_pelanggan_table', 1),
(7, '2024_01_01_000004_create_penitipan_table', 1),
(8, '2026_01_24_160217_create_personal_access_tokens_table', 1),
(9, '2026_01_24_173200_drop_unused_columns', 2);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pelanggan`
--

CREATE TABLE `pelanggan` (
  `id` bigint UNSIGNED NOT NULL,
  `id_pelanggan` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nama` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `no_hp` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `alamat` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `pelanggan`
--

INSERT INTO `pelanggan` (`id`, `id_pelanggan`, `nama`, `no_hp`, `alamat`, `created_at`, `updated_at`) VALUES
(1, 'PLG-001', 'Ahmad Rizki', '081234567890', 'Jl. Merdeka No. 123, Jakarta Pusat', '2026-01-24 10:35:07', '2026-01-24 10:35:07'),
(2, 'PLG-002', 'Siti Nurhaliza', '082345678901', 'Jl. Sudirman No. 45, Jakarta Selatan', '2026-01-24 10:35:07', '2026-01-24 10:35:07'),
(3, 'PLG-003', 'Budi Santoso', '083456789012', 'Jl. Gatot Subroto No. 67, Bandung', '2026-01-24 10:35:07', '2026-01-24 10:35:07'),
(4, 'PLG-004', 'Dewi Lestari', '084567890123', 'Jl. Diponegoro No. 89, Surabaya', '2026-01-24 10:35:07', '2026-01-24 10:35:07'),
(5, 'PLG-005', 'Eko Prasetyo', '085678901234', 'Jl. Ahmad Yani No. 12, Semarang', '2026-01-24 10:35:07', '2026-01-24 10:35:07'),
(6, 'PLG-006', 'Fitri Handayani', '086789012345', 'Jl. Pahlawan No. 34, Yogyakarta', '2026-01-24 10:35:07', '2026-01-24 10:35:07'),
(7, 'PLG-007', 'Gunawan Wibowo', '087890123456', 'Jl. Veteran No. 56, Malang', '2026-01-24 10:35:07', '2026-01-24 10:35:07'),
(8, 'PLG-008', 'Hana Permata', '088901234567', 'Jl. Kartini No. 78, Denpasar', '2026-01-24 10:35:07', '2026-01-24 10:35:07'),
(9, 'PLG-009', 'Muhammad Fahreza', '085624811727', 'Gacc', '2026-01-24 10:37:33', '2026-01-24 10:37:33');

-- --------------------------------------------------------

--
-- Table structure for table `penitipan`
--

CREATE TABLE `penitipan` (
  `id` bigint UNSIGNED NOT NULL,
  `id_penitipan` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pelanggan_id` bigint UNSIGNED NOT NULL,
  `kategori_id` bigint UNSIGNED NOT NULL,
  `nama_barang` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `deskripsi` text COLLATE utf8mb4_unicode_ci,
  `tanggal_titip` date NOT NULL,
  `tanggal_ambil` date DEFAULT NULL,
  `durasi_hari` int NOT NULL,
  `status` enum('dititipkan','diambil') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'dititipkan',
  `biaya_per_hari` decimal(10,2) NOT NULL,
  `denda_per_hari` decimal(10,2) NOT NULL,
  `total_biaya` decimal(12,2) DEFAULT NULL,
  `total_denda` decimal(12,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `penitipan`
--

INSERT INTO `penitipan` (`id`, `id_penitipan`, `pelanggan_id`, `kategori_id`, `nama_barang`, `deskripsi`, `tanggal_titip`, `tanggal_ambil`, `durasi_hari`, `status`, `biaya_per_hari`, `denda_per_hari`, `total_biaya`, `total_denda`, `created_at`, `updated_at`) VALUES
(1, 'PTN-001', 1, 1, 'Laptop ASUS ROG', 'Laptop gaming ASUS ROG 15 inch, warna hitam', '2026-01-21', NULL, 7, 'dititipkan', 15000.00, 5000.00, NULL, NULL, '2026-01-24 10:35:07', '2026-01-24 10:35:07'),
(2, 'PTN-002', 2, 3, 'Koper Rimowa', 'Koper besar warna silver, ukuran 28 inch', '2026-01-19', NULL, 14, 'dititipkan', 10000.00, 3000.00, NULL, NULL, '2026-01-24 10:35:07', '2026-01-24 10:35:07'),
(3, 'PTN-003', 3, 2, 'Berkas Penting', 'Map berisi dokumen sertifikat dan ijazah', '2026-01-22', NULL, 5, 'dititipkan', 5000.00, 2000.00, NULL, NULL, '2026-01-24 10:35:07', '2026-01-24 10:35:07'),
(4, 'PTN-004', 4, 5, 'Jam Tangan Rolex', 'Jam tangan Rolex Submariner, warna hitam emas', '2026-01-23', NULL, 3, 'dititipkan', 12000.00, 4000.00, NULL, NULL, '2026-01-24 10:35:07', '2026-01-24 10:35:07'),
(5, 'PTN-005', 5, 4, 'Jas Formal', 'Jas formal warna navy blue, ukuran L', '2026-01-14', NULL, 5, 'dititipkan', 8000.00, 2500.00, NULL, NULL, '2026-01-24 10:35:07', '2026-01-24 10:54:30'),
(6, 'PTN-006', 6, 1, 'iPad Pro', 'iPad Pro 12.9 inch dengan Apple Pencil', '2026-01-12', '2026-01-24', 7, 'diambil', 15000.00, 5000.00, 105000.00, 25000.00, '2026-01-24 10:35:07', '2026-01-24 11:00:52'),
(7, 'PTN-007', 7, 3, 'Ransel Tumi', 'Ransel laptop Tumi warna hitam', '2026-01-09', '2026-01-16', 7, 'diambil', 10000.00, 3000.00, 70000.00, 0.00, '2026-01-24 10:35:07', '2026-01-24 10:35:07'),
(8, 'PTN-008', 8, 6, 'Payung Golf', 'Payung golf besar warna biru', '2026-01-04', '2026-01-17', 10, 'diambil', 7000.00, 2000.00, 70000.00, 6000.00, '2026-01-24 10:35:07', '2026-01-24 10:35:07'),
(9, 'PTN-009', 9, 4, 'Jas Formal', 'Pakaian Penting', '2026-01-25', NULL, 7, 'dititipkan', 8000.00, 2500.00, NULL, NULL, '2026-01-24 10:37:59', '2026-01-24 10:37:59');

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint UNSIGNED NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\Admin', 1, 'auth-token', '4e0fccba0c201c8848f062ab64759d3e231fb3e3e9434d96a3db6383235ad157', '[\"*\"]', '2026-01-25 10:26:15', NULL, '2026-01-24 10:35:53', '2026-01-25 10:26:15');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('gHaJv9FFMnHSb8vTvu98TkbaimZ1FVnIIVXFTMNG', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiN28ybkpqd2lHcFNEOFpRbHZRbEd2TTBmNDQ3TlZzQjE3Q01KTmlaTSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvcGVsYW5nZ2FuP2FsbD10cnVlIjtzOjU6InJvdXRlIjtzOjE1OiJwZWxhbmdnYW4uaW5kZXgiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1769361975),
('IVzB6qZi5UTUTd6qS0NNwRMCowdF1jJYUVIXyyHd', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicVlMWTJidHJoQzA0Ym1MUTQ5OHR2TFFyVU1JT2xKNXNCbnQxM05vbCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvcGVsYW5nZ2FuP2FsbD10cnVlIjtzOjU6InJvdXRlIjtzOjE1OiJwZWxhbmdnYW4uaW5kZXgiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1769277801);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `admins_username_unique` (`username`),
  ADD UNIQUE KEY `admins_email_unique` (`email`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `kategori`
--
ALTER TABLE `kategori`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `kategori_nama_unique` (`nama`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `pelanggan`
--
ALTER TABLE `pelanggan`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `pelanggan_id_pelanggan_unique` (`id_pelanggan`);

--
-- Indexes for table `penitipan`
--
ALTER TABLE `penitipan`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `penitipan_id_penitipan_unique` (`id_penitipan`),
  ADD KEY `penitipan_pelanggan_id_foreign` (`pelanggan_id`),
  ADD KEY `penitipan_kategori_id_foreign` (`kategori_id`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kategori`
--
ALTER TABLE `kategori`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `pelanggan`
--
ALTER TABLE `pelanggan`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `penitipan`
--
ALTER TABLE `penitipan`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `penitipan`
--
ALTER TABLE `penitipan`
  ADD CONSTRAINT `penitipan_kategori_id_foreign` FOREIGN KEY (`kategori_id`) REFERENCES `kategori` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `penitipan_pelanggan_id_foreign` FOREIGN KEY (`pelanggan_id`) REFERENCES `pelanggan` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
