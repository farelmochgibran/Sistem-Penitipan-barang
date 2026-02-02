<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Pelanggan extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'pelanggan';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'id_pelanggan',
        'nama',
        'no_hp',
        'alamat',
        'email',
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
            'is_active' => 'boolean',
        ];
    }

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($pelanggan) {
            if (empty($pelanggan->id_pelanggan)) {
                $pelanggan->id_pelanggan = self::generateIdPelanggan();
            }
        });
    }

    /**
     * Get the penitipan for this pelanggan.
     */
    public function penitipan(): HasMany
    {
        return $this->hasMany(Penitipan::class);
    }

    /**
     * Generate next ID Pelanggan.
     */
    public static function generateIdPelanggan(): string
    {
        $lastPelanggan = self::orderBy('id', 'desc')->first();
        
        if (!$lastPelanggan) {
            return 'PLG-001';
        }
        
        // Extract the number from the last ID
        $lastNumber = (int) substr($lastPelanggan->id_pelanggan, 4);
        $nextNumber = $lastNumber + 1;
        
        return 'PLG-' . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);
    }

    /**
     * Get active penitipan count
     */
    public function getActivePenitipanCountAttribute(): int
    {
        return $this->penitipan()->where('status', 'dititipkan')->count();
    }
}
