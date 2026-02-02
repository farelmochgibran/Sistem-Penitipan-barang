<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('penitipan', function (Blueprint $table) {
            $table->id();
            $table->string('id_penitipan')->unique(); // PTN-001, PTN-002, etc.
            $table->foreignId('pelanggan_id')->constrained('pelanggan')->onDelete('cascade');
            $table->foreignId('kategori_id')->constrained('kategori')->onDelete('restrict');
            $table->string('nama_barang');
            $table->text('deskripsi')->nullable();
            $table->date('tanggal_titip');
            $table->date('tanggal_ambil')->nullable();
            $table->integer('durasi_hari'); // Planned duration
            $table->enum('status', ['dititipkan', 'diambil'])->default('dititipkan');
            $table->decimal('biaya_per_hari', 10, 2);
            $table->decimal('denda_per_hari', 10, 2);
            $table->decimal('total_biaya', 12, 2)->nullable();
            $table->decimal('total_denda', 12, 2)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('penitipan');
    }
};
