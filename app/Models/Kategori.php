<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Kategori extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'kategori';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nama',
        'deskripsi',
        'biaya_per_hari',
        'denda_per_hari',
        'is_active',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'biaya_per_hari' => 'decimal:2',
            'denda_per_hari' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get the penitipan for this kategori.
     */
    public function penitipan(): HasMany
    {
        return $this->hasMany(Penitipan::class);
    }
}
