<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pelanggan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PelangganController extends Controller
{
    /**
     * Display a listing of pelanggan.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Pelanggan::query();

        // Search filter
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                  ->orWhere('id_pelanggan', 'like', "%{$search}%")
                  ->orWhere('no_hp', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('alamat', 'like', "%{$search}%");
            });
        }

        // Active filter
        if ($request->has('is_active')) {
            $query->where('is_active', $request->is_active === 'true' || $request->is_active === '1');
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Include penitipan count
        $query->withCount(['penitipan', 'penitipan as active_penitipan_count' => function ($q) {
            $q->where('status', 'dititipkan');
        }]);

        // Pagination
        $perPage = $request->get('per_page', 10);
        
        if ($request->get('all') === 'true') {
            $pelanggan = $query->get();
            return response()->json([
                'success' => true,
                'data' => $pelanggan,
            ]);
        }

        $pelanggan = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $pelanggan->items(),
            'meta' => [
                'current_page' => $pelanggan->currentPage(),
                'last_page' => $pelanggan->lastPage(),
                'per_page' => $pelanggan->perPage(),
                'total' => $pelanggan->total(),
            ],
        ]);
    }

    /**
     * Store a newly created pelanggan.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'no_hp' => 'required|string|max:20',
            'alamat' => 'required|string',
            'email' => 'nullable|email|max:255',
            'is_active' => 'boolean',
        ]);

        // Generate ID Pelanggan
        $validated['id_pelanggan'] = Pelanggan::generateIdPelanggan();

        $pelanggan = Pelanggan::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Pelanggan berhasil ditambahkan',
            'data' => $pelanggan,
        ], 201);
    }

    /**
     * Display the specified pelanggan.
     */
    public function show(Pelanggan $pelanggan): JsonResponse
    {
        $pelanggan->load(['penitipan' => function ($q) {
            $q->with('kategori')->orderBy('created_at', 'desc');
        }]);
        
        $pelanggan->loadCount(['penitipan', 'penitipan as active_penitipan_count' => function ($q) {
            $q->where('status', 'dititipkan');
        }]);

        return response()->json([
            'success' => true,
            'data' => $pelanggan,
        ]);
    }

    /**
     * Update the specified pelanggan.
     */
    public function update(Request $request, Pelanggan $pelanggan): JsonResponse
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'no_hp' => 'required|string|max:20',
            'alamat' => 'required|string',
            'email' => 'nullable|email|max:255',
            'is_active' => 'boolean',
        ]);

        $pelanggan->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Pelanggan berhasil diubah',
            'data' => $pelanggan,
        ]);
    }

    /**
     * Remove the specified pelanggan.
     */
    public function destroy(Pelanggan $pelanggan): JsonResponse
    {
        // Check if pelanggan has active penitipan
        if ($pelanggan->penitipan()->where('status', 'dititipkan')->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Pelanggan tidak dapat dihapus karena masih memiliki barang yang dititipkan',
            ], 422);
        }

        $pelanggan->delete();

        return response()->json([
            'success' => true,
            'message' => 'Pelanggan berhasil dihapus',
        ]);
    }

    /**
     * Get next ID Pelanggan for preview.
     */
    public function getNextId(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'next_id' => Pelanggan::generateIdPelanggan(),
            ],
        ]);
    }
}
