import { Package, Shield, Clock, BarChart3, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const features = [
    {
      icon: Package,
      title: 'Kelola Barang',
      description: 'Catat dan pantau semua barang yang dititipkan dengan mudah',
    },
    {
      icon: Shield,
      title: 'Aman & Terpercaya',
      description: 'Data pelanggan dan barang tersimpan dengan aman',
    },
    {
      icon: Clock,
      title: 'Perhitungan Otomatis',
      description: 'Biaya penitipan dihitung otomatis berdasarkan durasi',
    },
    {
      icon: BarChart3,
      title: 'Laporan Lengkap',
      description: 'Lihat laporan transaksi dan statistik penitipan',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">TitipBarang</h1>
              <p className="text-xs text-muted-foreground">Sistem Penitipan</p>
            </div>
          </div>
          <Button onClick={() => navigate('/login')} className="gap-2">
            Login Admin
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
            <Package className="w-4 h-4" />
            Sistem Informasi Penitipan Barang
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
            Kelola Penitipan Barang dengan{' '}
            <span className="text-primary">Mudah & Efisien</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Sistem manajemen penitipan barang berbasis web untuk mencatat data pelanggan, 
            barang titipan, durasi penitipan, hingga laporan transaksi secara lengkap.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" onClick={() => navigate('/login')} className="gap-2">
              Masuk ke Dashboard
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Fitur Unggulan</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Sistem lengkap untuk mengelola bisnis penitipan barang Anda
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-primary text-primary-foreground max-w-3xl mx-auto">
          <CardContent className="py-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Siap Mengelola Penitipan Barang?</h2>
            <p className="mb-6 opacity-90">
              Login sebagai admin untuk mengakses dashboard dan mulai mengelola data
            </p>
            <Button 
              variant="secondary" 
              size="lg" 
              onClick={() => navigate('/login')}
              className="gap-2"
            >
              Login Sekarang
              <ArrowRight className="w-5 h-5" />
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p className="text-sm">
            © 2026 TitipBarang - Sistem Informasi Penitipan Barang
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
