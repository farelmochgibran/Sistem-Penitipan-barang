<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Penitipan;
use App\Models\Kategori;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PenitipanController extends Controller
{
    /**
     * Display a listing of penitipan.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Penitipan::with(['pelanggan', 'kategori']);

        // Search filter
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('id_penitipan', 'like', "%{$search}%")
                  ->orWhere('nama_barang', 'like', "%{$search}%")
                  ->orWhere('deskripsi', 'like', "%{$search}%")
                  ->orWhereHas('pelanggan', function ($q2) use ($search) {
                      $q2->where('nama', 'like', "%{$search}%")
                         ->orWhere('id_pelanggan', 'like', "%{$search}%");
                  });
            });
        }

        // Status filter
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        // Kategori filter
        if ($request->has('kategori_id') && $request->kategori_id) {
            $query->where('kategori_id', $request->kategori_id);
        }

        // Pelanggan filter
        if ($request->has('pelanggan_id') && $request->pelanggan_id) {
            $query->where('pelanggan_id', $request->pelanggan_id);
        }

        // Date range filter
        if ($request->has('date_from') && $request->date_from) {
            $query->whereDate('tanggal_titip', '>=', $request->date_from);
        }
        if ($request->has('date_to') && $request->date_to) {
            $query->whereDate('tanggal_titip', '<=', $request->date_to);
        }

        // Overdue filter
        if ($request->has('overdue') && $request->overdue === 'true') {
            $query->overdue();
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->get('per_page', 10);
        
        if ($request->get('all') === 'true') {
            $penitipan = $query->get()->map(function ($item) {
                return $this->transformPenitipan($item);
            });
            return response()->json([
                'success' => true,
                'data' => $penitipan,
            ]);
        }

        $penitipan = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => collect($penitipan->items())->map(function ($item) {
                return $this->transformPenitipan($item);
            }),
            'meta' => [
                'current_page' => $penitipan->currentPage(),
                'last_page' => $penitipan->lastPage(),
                'per_page' => $penitipan->perPage(),
                'total' => $penitipan->total(),
            ],
        ]);
    }

    /**
     * Store a newly created penitipan.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'pelanggan_id' => 'required|exists:pelanggan,id',
            'kategori_id' => 'required|exists:kategori,id',
            'nama_barang' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'tanggal_titip' => 'required|date',
            'durasi_hari' => 'required|integer|min:1',
            'biaya_per_hari' => 'nullable|numeric|min:0',
            'denda_per_hari' => 'nullable|numeric|min:0',
            'catatan' => 'nullable|string',
        ]);

        // Get kategori for default pricing
        $kategori = Kategori::find($validated['kategori_id']);
        
        // Use kategori pricing if not provided
        $validated['biaya_per_hari'] = $validated['biaya_per_hari'] ?? $kategori->biaya_per_hari;
        $validated['denda_per_hari'] = $validated['denda_per_hari'] ?? $kategori->denda_per_hari;

        // Generate ID Penitipan
        $validated['id_penitipan'] = Penitipan::generateIdPenitipan();
        $validated['status'] = 'dititipkan';

        $penitipan = Penitipan::create($validated);
        $penitipan->load(['pelanggan', 'kategori']);

        return response()->json([
            'success' => true,
            'message' => 'Penitipan berhasil ditambahkan',
            'data' => $this->transformPenitipan($penitipan),
        ], 201);
    }

    /**
     * Display the specified penitipan.
     */
    public function show(Penitipan $penitipan): JsonResponse
    {
        $penitipan->load(['pelanggan', 'kategori']);

        return response()->json([
            'success' => true,
            'data' => $this->transformPenitipan($penitipan),
        ]);
    }

    /**
     * Update the specified penitipan.
     */
    public function update(Request $request, Penitipan $penitipan): JsonResponse
    {
        $validated = $request->validate([
            'pelanggan_id' => 'required|exists:pelanggan,id',
            'kategori_id' => 'required|exists:kategori,id',
            'nama_barang' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'tanggal_titip' => 'required|date',
            'durasi_hari' => 'required|integer|min:1',
            'biaya_per_hari' => 'nullable|numeric|min:0',
            'denda_per_hari' => 'nullable|numeric|min:0',
            'catatan' => 'nullable|string',
        ]);

        $penitipan->update($validated);
        $penitipan->load(['pelanggan', 'kategori']);

        return response()->json([
            'success' => true,
            'message' => 'Penitipan berhasil diubah',
            'data' => $this->transformPenitipan($penitipan),
        ]);
    }

    /**
     * Remove the specified penitipan.
     */
    public function destroy(Penitipan $penitipan): JsonResponse
    {
        if ($penitipan->status === 'dititipkan') {
            return response()->json([
                'success' => false,
                'message' => 'Penitipan yang masih aktif tidak dapat dihapus. Silakan selesaikan penitipan terlebih dahulu.',
            ], 422);
        }

        $penitipan->delete();

        return response()->json([
            'success' => true,
            'message' => 'Penitipan berhasil dihapus',
        ]);
    }

    /**
     * Mark penitipan as picked up (diambil).
     */
    public function pickup(Request $request, Penitipan $penitipan): JsonResponse
    {
        if ($penitipan->status === 'diambil') {
            return response()->json([
                'success' => false,
                'message' => 'Barang sudah diambil sebelumnya',
            ], 422);
        }

        $tanggalAmbil = $request->get('tanggal_ambil', now()->toDateString());
        $tanggalAmbil = Carbon::parse($tanggalAmbil);

        // Calculate total cost
        $totalBiaya = $penitipan->durasi_hari * $penitipan->biaya_per_hari;
        
        // Calculate penalty if overdue
        $totalDenda = 0;
        $tanggalJatuhTempo = $penitipan->tanggal_titip->copy()->addDays($penitipan->durasi_hari);
        $daysOverdue = 0;
        if ($tanggalAmbil->gt($tanggalJatuhTempo)) {
            $daysOverdue = $tanggalAmbil->diffInDays($tanggalJatuhTempo);
            $totalDenda = abs($daysOverdue * $penitipan->denda_per_hari);
        }

        $penitipan->update([
            'status' => 'diambil',
            'tanggal_ambil' => $tanggalAmbil,
            'total_biaya' => $totalBiaya,
            'total_denda' => $totalDenda,
        ]);

        $penitipan->load(['pelanggan', 'kategori']);

        return response()->json([
            'success' => true,
            'message' => 'Barang berhasil diambil',
            'data' => $this->transformPenitipan($penitipan),
        ]);
    }

    /**
     * Get next ID Penitipan for preview.
     */
    public function getNextId(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'next_id' => Penitipan::generateIdPenitipan(),
            ],
        ]);
    }

    /**
     * Get dashboard statistics.
     */
    public function statistics(): JsonResponse
    {
        $totalPenitipan = Penitipan::count();
        $activePenitipan = Penitipan::active()->count();
        $completedPenitipan = Penitipan::completed()->count();
        $overduePenitipan = Penitipan::overdue()->count();

        $totalRevenue = Penitipan::completed()->sum('total_biaya') + Penitipan::completed()->sum('total_denda');
        $totalPenalty = Penitipan::completed()->sum('total_denda');

        // Get recent penitipan
        $recentPenitipan = Penitipan::with(['pelanggan', 'kategori'])
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($item) {
                return $this->transformPenitipan($item);
            });

        // Status distribution
        $statusDistribution = [
            ['status' => 'dititipkan', 'count' => $activePenitipan],
            ['status' => 'diambil', 'count' => $completedPenitipan],
            ['status' => 'terlambat', 'count' => $overduePenitipan],
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'total_penitipan' => $totalPenitipan,
                'active_penitipan' => $activePenitipan,
                'completed_penitipan' => $completedPenitipan,
                'overdue_penitipan' => $overduePenitipan,
                'total_revenue' => (float) $totalRevenue,
                'total_penalty' => (float) $totalPenalty,
                'recent_penitipan' => $recentPenitipan,
                'status_distribution' => $statusDistribution,
            ],
        ]);
    }

    /**
     * Transform penitipan data with computed properties.
     */
    private function transformPenitipan(Penitipan $penitipan): array
    {
        return [
            'id' => $penitipan->id,
            'id_penitipan' => $penitipan->id_penitipan,
            'pelanggan_id' => $penitipan->pelanggan_id,
            'pelanggan' => $penitipan->pelanggan ? [
                'id' => $penitipan->pelanggan->id,
                'id_pelanggan' => $penitipan->pelanggan->id_pelanggan,
                'nama' => $penitipan->pelanggan->nama,
                'no_hp' => $penitipan->pelanggan->no_hp,
            ] : null,
            'kategori_id' => $penitipan->kategori_id,
            'kategori' => $penitipan->kategori ? [
                'id' => $penitipan->kategori->id,
                'nama' => $penitipan->kategori->nama,
            ] : null,
            'nama_barang' => $penitipan->nama_barang,
            'deskripsi' => $penitipan->deskripsi,
            'tanggal_titip' => $penitipan->tanggal_titip->toDateString(),
            'tanggal_ambil' => $penitipan->tanggal_ambil?->toDateString(),
            'tanggal_jatuh_tempo' => $penitipan->tanggal_jatuh_tempo->toDateString(),
            'durasi_hari' => $penitipan->durasi_hari,
            'status' => $penitipan->status,
            'biaya_per_hari' => (float) $penitipan->biaya_per_hari,
            'denda_per_hari' => (float) $penitipan->denda_per_hari,
            'total_biaya' => $penitipan->total_biaya ? (float) $penitipan->total_biaya : null,
            'total_denda' => $penitipan->total_denda ? (float) $penitipan->total_denda : null,
            'estimated_total_biaya' => $penitipan->estimated_total_biaya,
            'estimated_total_denda' => $penitipan->estimated_total_denda,
            'estimated_grand_total' => $penitipan->estimated_grand_total,
            'is_overdue' => $penitipan->is_overdue,
            'days_overdue' => $penitipan->days_overdue,
            'catatan' => $penitipan->catatan,
            'created_at' => $penitipan->created_at->toISOString(),
            'updated_at' => $penitipan->updated_at->toISOString(),
        ];
    }
}
