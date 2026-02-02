<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Penitipan extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'penitipan';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'id_penitipan',
        'pelanggan_id',
        'kategori_id',
        'nama_barang',
        'deskripsi',
        'tanggal_titip',
        'tanggal_ambil',
        'durasi_hari',
        'status',
        'biaya_per_hari',
        'denda_per_hari',
        'total_biaya',
        'total_denda',
        'catatan',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'tanggal_titip' => 'date',
            'tanggal_ambil' => 'date',
            'durasi_hari' => 'integer',
            'biaya_per_hari' => 'decimal:2',
            'denda_per_hari' => 'decimal:2',
            'total_biaya' => 'decimal:2',
            'total_denda' => 'decimal:2',
        ];
    }

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($penitipan) {
            if (empty($penitipan->id_penitipan)) {
                $penitipan->id_penitipan = self::generateIdPenitipan();
            }
        });
    }

    /**
     * Get the pelanggan that owns this penitipan.
     */
    public function pelanggan(): BelongsTo
    {
        return $this->belongsTo(Pelanggan::class);
    }

    /**
     * Get the kategori of this penitipan.
     */
    public function kategori(): BelongsTo
    {
        return $this->belongsTo(Kategori::class);
    }

    /**
     * Generate next ID Penitipan.
     */
    public static function generateIdPenitipan(): string
    {
        $lastPenitipan = self::orderBy('id', 'desc')->first();
        
        if (!$lastPenitipan) {
            return 'PTN-001';
        }
        
        // Extract the number from the last ID
        $lastNumber = (int) substr($lastPenitipan->id_penitipan, 4);
        $nextNumber = $lastNumber + 1;
        
        return 'PTN-' . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);
    }

    /**
     * Get planned end date
     */
    public function getTanggalJatuhTempoAttribute(): Carbon
    {
        return $this->tanggal_titip->addDays($this->durasi_hari);
    }

    /**
     * Check if penitipan is overdue
     */
    public function getIsOverdueAttribute(): bool
    {
        if ($this->status === 'diambil') {
            return false;
        }
        
        return now()->gt($this->tanggal_jatuh_tempo);
    }

    /**
     * Calculate days overdue
     */
    public function getDaysOverdueAttribute(): int
    {
        if (!$this->is_overdue) {
            return 0;
        }
        
        return now()->diffInDays($this->tanggal_jatuh_tempo);
    }

    /**
     * Calculate current estimated cost
     */
    public function getEstimatedTotalBiayaAttribute(): float
    {
        $baseCost = $this->durasi_hari * $this->biaya_per_hari;
        return (float) $baseCost;
    }

    /**
     * Calculate current estimated penalty
     */
    public function getEstimatedTotalDendaAttribute(): float
    {
        if (!$this->is_overdue) {
            return 0;
        }
        
        return (float) ($this->days_overdue * $this->denda_per_hari);
    }

    /**
     * Calculate total (cost + penalty)
     */
    public function getEstimatedGrandTotalAttribute(): float
    {
        return $this->estimated_total_biaya + $this->estimated_total_denda;
    }

    /**
     * Scope for active penitipan (not yet picked up)
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'dititipkan');
    }

    /**
     * Scope for completed penitipan
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', 'diambil');
    }

    /**
     * Scope for overdue penitipan
     */
    public function scopeOverdue($query)
    {
        return $query->where('status', 'dititipkan')
            ->whereRaw('DATE_ADD(tanggal_titip, INTERVAL durasi_hari DAY) < NOW()');
    }
}
