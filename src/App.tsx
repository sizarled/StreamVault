import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import HeroSection from './components/HeroSection';
import {
  FeaturesSection,
  SearchSection,
  MoviesSection,
  IPTVSection,
  SeriesSection,
  MembershipSection,
  AppsSection,
  SupportSection,
} from './components/Sections';
import Footer from './components/Footer';
import WatchPage from './pages/WatchPage';
import { fetchTrendingMovies, fetchTrendingTV } from './lib/tmdb';

function getRoute(): { page: string; params: URLSearchParams } {
  // Check hash-based routing first
  const hash = window.location.hash;
  if (hash.startsWith('#/watch')) {
    const params = new URLSearchParams(hash.split('?')[1] || '');
    return { page: 'watch', params };
  }
  // Check pathname
  const path = window.location.pathname;
  if (path === '/watch.html' || path === '/watch') {
    return { page: 'watch', params: new URLSearchParams(window.location.search) };
  }
  return { page: 'home', params: new URLSearchParams() };
}

export default function App() {
  const [route, setRoute] = useState(getRoute());
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [movies, setMovies] = useState<any[]>([]);
  const [series, setSeries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Listen for hash changes
  useEffect(() => {
    const handleHashChange = () => {
      setRoute(getRoute());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [moviesData, seriesData] = await Promise.all([
          fetchTrendingMovies(),
          fetchTrendingTV(),
        ]);
        setMovies(moviesData);
        setSeries(seriesData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  // Watch Page
  if (route.page === 'watch') {
    return <WatchPage />;
  }

  // Home Page
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#1877F2] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Loading StreamVault...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-['Inter',sans-serif]">
      {/* Header */}
      <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />

      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        className="fixed bottom-6 left-6 z-50 lg:hidden w-12 h-12 bg-[#1877F2] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#166FE5] transition"
      >
        {mobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-30 lg:hidden" onClick={() => setMobileSidebarOpen(false)}>
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 fixed left-0 top-14 bottom-0 z-40`}>
        <Sidebar isLoggedIn={isLoggedIn} onLogin={handleLogin} onLogout={handleLogout} />
      </div>

      {/* Main Content */}
      <main className="lg:ml-64 pt-14">
        <HeroSection movies={movies} series={series} />
        <FeaturesSection />
        <SearchSection />
        <MoviesSection movies={movies} />
        <IPTVSection />
        <SeriesSection series={series} />
        <MembershipSection />
        <AppsSection />
        <SupportSection />
      </main>

      <div className="lg:ml-64">
        <Footer />
      </div>
    </div>
  );
}
