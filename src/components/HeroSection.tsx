import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Play } from 'lucide-react';
import { getBackdropUrl } from '../lib/tmdb';

interface MediaItem {
  id: number;
  title?: string;
  name?: string;
  backdrop_path: string;
  overview: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  media_type?: string;
}

interface HeroSectionProps {
  movies: MediaItem[];
  series: MediaItem[];
}

export default function HeroSection({ movies, series }: HeroSectionProps) {
  const allItems = [
    ...movies.slice(0, 5).map(m => ({ ...m, media_type: 'movie' })),
    ...series.slice(0, 5).map(s => ({ ...s, media_type: 'tv' }))
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % allItems.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [allItems.length]);

  if (allItems.length === 0) {
    return (
      <div className="relative h-[500px] bg-gradient-to-r from-[#1877F2] to-[#0a5dc2] flex items-center justify-center">
        <div className="animate-pulse text-white text-2xl">Loading...</div>
      </div>
    );
  }

  const item = allItems[current];
  const title = item.title || item.name || 'Unknown';

  const handleItemClick = () => {
    if (item.media_type === 'movie') {
      window.location.href = `watch.html?movie=${item.id}`;
    } else {
      window.location.href = `watch.html?tv=${item.id}`;
    }
  };

  return (
    <section className="relative h-[500px] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={getBackdropUrl(item.backdrop_path)}
          alt={title}
          className="w-full h-full object-cover transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center px-8 lg:px-16">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-0.5 bg-[#1877F2] text-white text-xs font-bold rounded">
              {item.media_type === 'movie' ? 'MOVIE' : 'SERIES'}
            </span>
            <span className="px-2 py-0.5 bg-yellow-500 text-black text-xs font-bold rounded flex items-center gap-1">
              <Star size={10} fill="black" /> {item.vote_average?.toFixed(1)}
            </span>
            <span className="text-white/70 text-sm">
              {item.release_date?.split('-')[0] || item.first_air_date?.split('-')[0]}
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">{title}</h1>
          <p className="text-white/80 text-sm lg:text-base mb-6 line-clamp-3">{item.overview}</p>
          <div className="flex gap-3">
            <button
              onClick={handleItemClick}
              className="flex items-center gap-2 px-6 py-3 bg-[#1877F2] text-white rounded-lg hover:bg-[#166FE5] transition font-bold"
            >
              <Play size={18} fill="white" /> Watch Now
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition font-medium backdrop-blur-sm">
              More Info
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <button
        onClick={() => setCurrent((prev) => (prev - 1 + allItems.length) % allItems.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 transition"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={() => setCurrent((prev) => (prev + 1) % allItems.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 transition"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {allItems.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              idx === current ? 'bg-[#1877F2] w-8' : 'bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
