<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="csrf-token" content="{{ csrf_token() }}">
    
    <title>Sistem Penitipan Barang</title>
    <meta name="description" content="Sistem Penitipan Barang - Aplikasi Manajemen Penitipan" />
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    
    @if(app()->environment('production'))
        <link rel="stylesheet" href="/build/assets/main-CFslkeKz.css">
        <script type="module" src="/build/assets/main-C5JRxsK5.js"></script>
    @else
        @viteReactRefresh
        @vite(['resources/js/main.tsx'])
    @endif
</head>
<body>
    <div id="root"></div>
</body>
</html>
