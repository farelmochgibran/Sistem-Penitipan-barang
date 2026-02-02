<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Kategori;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class KategoriController extends Controller
{
    /**
     * Display a listing of kategori.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Kategori::query();

        // Search filter
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                  ->orWhere('deskripsi', 'like', "%{$search}%");
            });
        }

        // Active filter
        if ($request->has('is_active')) {
            $query->where('is_active', $request->is_active === 'true' || $request->is_active === '1');
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'nama');
        $sortOrder = $request->get('sort_order', 'asc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->get('per_page', 10);
        
        if ($request->get('all') === 'true') {
            $kategori = $query->get();
            return response()->json([
                'success' => true,
                'data' => $kategori,
            ]);
        }

        $kategori = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $kategori->items(),
            'meta' => [
                'current_page' => $kategori->currentPage(),
                'last_page' => $kategori->lastPage(),
                'per_page' => $kategori->perPage(),
                'total' => $kategori->total(),
            ],
        ]);
    }

    /**
     * Store a newly created kategori.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255|unique:kategori,nama',
            'deskripsi' => 'nullable|string',
            'biaya_per_hari' => 'required|numeric|min:0',
            'denda_per_hari' => 'required|numeric|min:0',
            'is_active' => 'boolean',
        ]);

        $kategori = Kategori::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Kategori berhasil ditambahkan',
            'data' => $kategori,
        ], 201);
    }

    /**
     * Display the specified kategori.
     */
    public function show(Kategori $kategori): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $kategori,
        ]);
    }

    /**
     * Update the specified kategori.
     */
    public function update(Request $request, Kategori $kategori): JsonResponse
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255|unique:kategori,nama,' . $kategori->id,
            'deskripsi' => 'nullable|string',
            'biaya_per_hari' => 'required|numeric|min:0',
            'denda_per_hari' => 'required|numeric|min:0',
            'is_active' => 'boolean',
        ]);

        $kategori->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Kategori berhasil diubah',
            'data' => $kategori,
        ]);
    }

    /**
     * Remove the specified kategori.
     */
    public function destroy(Kategori $kategori): JsonResponse
    {
        // Check if kategori is being used
        if ($kategori->penitipan()->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Kategori tidak dapat dihapus karena masih digunakan oleh data penitipan',
            ], 422);
        }

        $kategori->delete();

        return response()->json([
            'success' => true,
            'message' => 'Kategori berhasil dihapus',
        ]);
    }
}
