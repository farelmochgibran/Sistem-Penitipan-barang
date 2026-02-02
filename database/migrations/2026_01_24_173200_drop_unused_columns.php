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
        // Drop unused columns from users
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'email_verified_at')) {
                $table->dropColumn('email_verified_at');
            }
        });

        // Drop unused columns from penitipan
        Schema::table('penitipan', function (Blueprint $table) {
            if (Schema::hasColumn('penitipan', 'catatan')) {
                $table->dropColumn('catatan');
            }
        });

        // Drop unused columns from kategori
        Schema::table('kategori', function (Blueprint $table) {
            if (Schema::hasColumn('kategori', 'deskripsi')) {
                $table->dropColumn('deskripsi');
            }
        });

        // Drop unused columns from pelanggan
        Schema::table('pelanggan', function (Blueprint $table) {
            if (Schema::hasColumn('pelanggan', 'is_active')) {
                $table->dropColumn('is_active');
            }
            if (Schema::hasColumn('pelanggan', 'email')) {
                $table->dropColumn('email');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Add columns back if needed (types must match original)
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'email_verified_at')) {
                $table->timestamp('email_verified_at')->nullable();
            }
        });
        Schema::table('penitipan', function (Blueprint $table) {
            if (!Schema::hasColumn('penitipan', 'catatan')) {
                $table->text('catatan')->nullable();
            }
        });
        Schema::table('kategori', function (Blueprint $table) {
            if (!Schema::hasColumn('kategori', 'deskripsi')) {
                $table->string('deskripsi')->nullable();
            }
        });
        Schema::table('pelanggan', function (Blueprint $table) {
            if (!Schema::hasColumn('pelanggan', 'is_active')) {
                $table->boolean('is_active')->default(true);
            }
            if (!Schema::hasColumn('pelanggan', 'email')) {
                $table->string('email')->nullable();
            }
        });
    }
};
