import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { CategoryFilter } from './components/CategoryFilter';
import { WallpaperGrid } from './components/WallpaperGrid';
import { WallpaperModal } from './components/WallpaperModal';
import { AuthModal } from './components/AuthModal';
import { mockWallpapers, mockCategories } from './data/mockData';
import { WallpaperService } from './services/wallpaperService';
import { useAuth } from './hooks/useAuth';
import { Wallpaper } from './types';

function App() {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>(mockWallpapers);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { user, loading: authLoading } = useAuth();

  // Cargar wallpapers desde Supabase si está conectado
  useEffect(() => {
    const loadWallpapers = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let supabaseWallpapers: Wallpaper[];
        
        if (user) {
          supabaseWallpapers = await WallpaperService.getWallpapersForUser(user.id);
        } else {
          supabaseWallpapers = await WallpaperService.getAllWallpapers();
        }
        
        // Si obtenemos datos de Supabase, usarlos; sino, usar mock
        if (supabaseWallpapers && supabaseWallpapers.length > 0) {
          setWallpapers(supabaseWallpapers);
        } else {
          console.log('No hay wallpapers en Supabase, usando datos mock');
          setWallpapers(mockWallpapers);
        }
      } catch (error) {
        console.error('Error loading wallpapers:', error);
        setError('Error al cargar wallpapers');
        // Fallback a datos mock
        setWallpapers(mockWallpapers);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      loadWallpapers();
    }
  }, [user, authLoading]);

  // Filtrar wallpapers
  const filteredWallpapers = useMemo(() => {
    return wallpapers.filter(wallpaper => {
      const matchesCategory = !selectedCategory || wallpaper.category === selectedCategory;
      const matchesSearch = !searchQuery || 
        wallpaper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wallpaper.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });
  }, [wallpapers, selectedCategory, searchQuery]);

  const handleLike = async (id: string) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    try {
      const wallpaper = wallpapers.find(w => w.id === id);
      if (!wallpaper) return;

      // Optimistic update
      const newIsLiked = !wallpaper.isLiked;
      const newLikes = newIsLiked ? wallpaper.likes + 1 : wallpaper.likes - 1;

      setWallpapers(prev => prev.map(w => 
        w.id === id 
          ? { 
              ...w, 
              isLiked: newIsLiked,
              likes: newLikes
            }
          : w
      ));
      
      // Actualizar wallpaper seleccionado si está abierto
      if (selectedWallpaper?.id === id) {
        setSelectedWallpaper(prev => prev ? {
          ...prev,
          isLiked: newIsLiked,
          likes: newLikes
        } : null);
      }

      // Realizar operación en Supabase
      if (newIsLiked) {
        await WallpaperService.likeWallpaper(user.id, id);
      } else {
        await WallpaperService.unlikeWallpaper(user.id, id);
      }

    } catch (error) {
      console.error('Error toggling like:', error);
      
      // Revertir cambio optimista en caso de error
      setWallpapers(prev => prev.map(w => 
        w.id === id 
          ? { 
              ...w, 
              isLiked: !w.isLiked,
              likes: w.isLiked ? w.likes + 1 : w.likes - 1
            }
          : w
      ));

      if (selectedWallpaper?.id === id) {
        setSelectedWallpaper(prev => prev ? {
          ...prev,
          isLiked: !prev.isLiked,
          likes: prev.isLiked ? prev.likes + 1 : prev.likes - 1
        } : null);
      }
    }
  };

  const handleDownload = async (id: string) => {
    // Optimistic update
    setWallpapers(prev => prev.map(wallpaper => 
      wallpaper.id === id 
        ? { ...wallpaper, downloads: wallpaper.downloads + 1 }
        : wallpaper
    ));
    
    // Actualizar wallpaper seleccionado si está abierto
    if (selectedWallpaper?.id === id) {
      setSelectedWallpaper(prev => prev ? {
        ...prev,
        downloads: prev.downloads + 1
      } : null);
    }

    // Registrar descarga en Supabase si hay usuario
    if (user) {
      try {
        await WallpaperService.recordDownload(user.id, id);
      } catch (error) {
        console.error('Error recording download:', error);
      }
    }
    
    // Simular descarga
    const wallpaper = wallpapers.find(w => w.id === id);
    if (wallpaper) {
      const link = document.createElement('a');
      link.href = wallpaper.url;
      link.download = `${wallpaper.title}.jpg`;
      link.click();
    }
  };

  const handleViewWallpaper = (wallpaper: Wallpaper) => {
    setSelectedWallpaper(wallpaper);
    setIsModalOpen(true);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-brutal-lime flex items-center justify-center">
        <div className="bg-brutal-black border-6 border-brutal-black p-8 shadow-brutal-lg">
          <h2 className="text-4xl font-brutal font-black text-brutal-white uppercase text-center">
            INICIANDO...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brutal-lime">
      <Header
        onSearchChange={setSearchQuery}
        onAuthClick={() => setIsAuthModalOpen(true)}
      />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-6xl md:text-8xl font-brutal font-black text-brutal-black uppercase mb-4">
            BRUTALES
          </h2>
          <div className="bg-brutal-black border-4 border-brutal-black p-4 inline-block shadow-brutal">
            <p className="text-xl font-brutal font-bold text-brutal-white uppercase">
              {filteredWallpapers.length} wallpapers disponibles
            </p>
          </div>
          
          {user && (
            <div className="mt-4 bg-brutal-pink border-4 border-brutal-black p-3 inline-block shadow-brutal">
              <p className="font-brutal font-bold text-brutal-black uppercase">
                ¡CONECTADO COMO {user.email}!
              </p>
            </div>
          )}

          {error && (
            <div className="mt-4 bg-brutal-red border-4 border-brutal-black p-3 inline-block shadow-brutal">
              <p className="font-brutal font-bold text-brutal-white uppercase">
                ⚠️ {error}
              </p>
            </div>
          )}
        </div>

        <CategoryFilter
          categories={mockCategories}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />

        {loading ? (
          <div className="text-center py-16">
            <div className="bg-brutal-cyan border-4 border-brutal-black p-8 inline-block shadow-brutal">
              <h3 className="text-3xl font-brutal font-black text-brutal-black uppercase">
                CARGANDO WALLPAPERS...
              </h3>
            </div>
          </div>
        ) : (
          <WallpaperGrid
            wallpapers={filteredWallpapers}
            onLike={handleLike}
            onDownload={handleDownload}
            onView={handleViewWallpaper}
          />
        )}
      </main>

      <WallpaperModal
        wallpaper={selectedWallpaper}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLike={handleLike}
        onDownload={handleDownload}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-brutal-black border-t-6 border-brutal-black p-8 mt-16">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-4xl font-brutal font-black text-brutal-white uppercase mb-4">
            WALLPAPERS BRUTALES
          </h3>
          <p className="font-brutal font-bold text-brutal-white">
            DISEÑO NEOBRUTALIST • 2025 • HECHO CON ❤️ Y MUCHO CONTRASTE
          </p>
          {user && (
            <p className="mt-2 font-brutal font-bold text-brutal-yellow">
              POWERED BY SUPABASE ⚡
            </p>
          )}
        </div>
      </footer>
    </div>
  );
}

export default App;
