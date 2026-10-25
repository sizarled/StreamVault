import { useState } from 'react';
import {
  Film, Tv, Radio, Shield, Zap, Globe, Star, Users, Download,
  Search as SearchIcon, ChevronLeft, ChevronRight, Play, Crown, Diamond, Award
} from 'lucide-react';
import { getImageUrl } from '../lib/tmdb';

interface MediaItem {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  vote_average: number;
  overview: string;
}

interface IPTVChannel {
  id: string;
  name: string;
  logo: string;
  category: string;
  isPremium: boolean;
}

// Features Section
export function FeaturesSection() {
  const features = [
    { icon: <Film size={32} />, title: 'Movies', desc: 'Watch the latest movies in HD quality' },
    { icon: <Tv size={32} />, title: 'Series', desc: 'Binge-watch trending TV series' },
    { icon: <Radio size={32} />, title: 'IPTV', desc: 'Live TV channels from around the world' },
    { icon: <Shield size={32} />, title: 'Secure', desc: 'Your data is protected and private' },
    { icon: <Zap size={32} />, title: 'Fast', desc: 'Lightning fast streaming experience' },
    { icon: <Globe size={32} />, title: 'Global', desc: 'Content from every corner of the world' },
    { icon: <Users size={32} />, title: 'Community', desc: 'Share and discover with others' },
    { icon: <Download size={32} />, title: 'Offline', desc: 'Download and watch offline anytime' },
  ];

  return (
    <section id="features" className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Platform Features</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">Everything you need for the ultimate entertainment experience</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1 border border-gray-100">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-[#1877F2] mb-4">
                {f.icon}
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Search Section
export function SearchSection() {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      window.location.href = `search.html?q=${encodeURIComponent(query)}`;
    }
  };

  return (
    <section id="search" className="py-16 px-4 bg-white">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Search Everything</h2>
        <p className="text-gray-500 mb-8">Find movies, series, articles, and more</p>
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for movies, series, articles..."
            className="w-full px-6 py-4 pl-14 bg-gray-100 border border-gray-200 rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-[#1877F2] focus:border-transparent transition"
          />
          <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-[#1877F2] text-white rounded-xl hover:bg-[#166FE5] transition font-medium"
          >
            Search
          </button>
        </form>
      </div>
    </section>
  );
}

// Movies Section
export function MoviesSection({ movies }: { movies: MediaItem[] }) {
  const scroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('movies-scroll');
    if (container) {
      container.scrollBy({ left: direction === 'left' ? -400 : 400, behavior: 'smooth' });
    }
  };

  return (
    <section id="movies" className="py-12 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Film className="text-[#1877F2]" size={28} /> Trending Movies
            </h2>
            <p className="text-gray-500 text-sm mt-1">Top 50 trending movies this week</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => scroll('left')} className="w-9 h-9 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition">
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => scroll('right')} className="w-9 h-9 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
        <div id="movies-scroll" className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
          {movies.slice(0, 50).map((movie) => (
            <a
              key={movie.id}
              href={`watch.html?movie=${movie.id}`}
              className="flex-shrink-0 w-40 snap-start group"
            >
              <div className="relative rounded-xl overflow-hidden shadow-md group-hover:shadow-xl transition-all group-hover:-translate-y-1">
                <img
                  src={getImageUrl(movie.poster_path)}
                  alt={movie.title}
                  className="w-full h-60 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition">
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center gap-1 text-yellow-400 text-xs">
                      <Star size={12} fill="currentColor" /> {movie.vote_average?.toFixed(1)}
                    </div>
                  </div>
                </div>
                <div className="absolute top-2 right-2 w-8 h-8 bg-[#1877F2] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <Play size={14} fill="white" className="text-white ml-0.5" />
                </div>
              </div>
              <p className="mt-2 text-sm font-medium text-gray-800 truncate">{movie.title}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// IPTV Section
export function IPTVSection() {
  const freeChannels: IPTVChannel[] = [
    { id: 'ch1', name: 'News 24/7', logo: '', category: 'News', isPremium: false },
    { id: 'ch2', name: 'Sports Live', logo: '', category: 'Sports', isPremium: false },
    { id: 'ch3', name: 'Music Hits', logo: '', category: 'Music', isPremium: false },
    { id: 'ch4', name: 'Kids Zone', logo: '', category: 'Kids', isPremium: false },
    { id: 'ch5', name: 'Documentary', logo: '', category: 'Docs', isPremium: false },
    { id: 'ch6', name: 'Comedy Central', logo: '', category: 'Entertainment', isPremium: false },
  ];

  const premiumChannels: IPTVChannel[] = [
    { id: 'pch1', name: 'Premium Movies', logo: '', category: 'Movies', isPremium: true },
    { id: 'pch2', name: 'HBO Max', logo: '', category: 'Premium', isPremium: true },
    { id: 'pch3', name: 'Sports Premium', logo: '', category: 'Sports', isPremium: true },
    { id: 'pch4', name: 'Discovery+', logo: '', category: 'Docs', isPremium: true },
    { id: 'pch5', name: 'Cinema World', logo: '', category: 'Movies', isPremium: true },
  ];

  const renderChannel = (channel: IPTVChannel) => (
    <a
      key={channel.id}
      href={`iptv.html?M3U=${channel.id}`}
      className="flex-shrink-0 w-36 snap-start group"
    >
      <div className="relative bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#1877F2] to-[#0a5dc2] rounded-full flex items-center justify-center mb-3">
          <Radio size={24} className="text-white" />
        </div>
        <p className="text-sm font-medium text-gray-800 text-center truncate">{channel.name}</p>
        <p className="text-xs text-gray-400 text-center mt-1">{channel.category}</p>
        {channel.isPremium && (
          <div className="absolute top-2 right-2">
            <Crown size={14} className="text-yellow-500" />
          </div>
        )}
      </div>
    </a>
  );

  return (
    <section id="iptv" className="py-12 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Radio className="text-[#1877F2]" size={28} /> IPTV Channels
            </h2>
            <p className="text-gray-500 text-sm mt-1">Live TV channels - Free & Premium</p>
          </div>
        </div>

        {/* Free Channels */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Free Channels <span className="text-xs text-gray-400 font-normal">(Members Only)</span>
          </h3>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
            {freeChannels.map(renderChannel)}
          </div>
        </div>

        {/* Premium Channels */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Crown size={16} className="text-yellow-500" />
            Premium Channels <span className="text-xs text-gray-400 font-normal">(Premium Members)</span>
          </h3>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
            {premiumChannels.map(renderChannel)}
          </div>
        </div>
      </div>
    </section>
  );
}

// Series Section
export function SeriesSection({ series }: { series: MediaItem[] }) {
  const scroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('series-scroll');
    if (container) {
      container.scrollBy({ left: direction === 'left' ? -400 : 400, behavior: 'smooth' });
    }
  };

  return (
    <section id="series" className="py-12 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Tv className="text-[#1877F2]" size={28} /> Trending Series
            </h2>
            <p className="text-gray-500 text-sm mt-1">Top 50 trending series this week</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => scroll('left')} className="w-9 h-9 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition">
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => scroll('right')} className="w-9 h-9 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
        <div id="series-scroll" className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
          {series.slice(0, 50).map((show) => (
            <a
              key={show.id}
              href={`watch.html?tv=${show.id}`}
              className="flex-shrink-0 w-40 snap-start group"
            >
              <div className="relative rounded-xl overflow-hidden shadow-md group-hover:shadow-xl transition-all group-hover:-translate-y-1">
                <img
                  src={getImageUrl(show.poster_path)}
                  alt={show.name}
                  className="w-full h-60 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition">
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center gap-1 text-yellow-400 text-xs">
                      <Star size={12} fill="currentColor" /> {show.vote_average?.toFixed(1)}
                    </div>
                  </div>
                </div>
                <div className="absolute top-2 right-2 w-8 h-8 bg-[#1877F2] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <Play size={14} fill="white" className="text-white ml-0.5" />
                </div>
              </div>
              <p className="mt-2 text-sm font-medium text-gray-800 truncate">{show.name}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// Membership Section
export function MembershipSection() {
  const plans = [
    {
      name: 'Free',
      icon: <Users size={28} />,
      price: '$0',
      period: '/month',
      color: 'from-gray-400 to-gray-500',
      borderColor: 'border-gray-200',
      features: [
        'Watch movies & series',
        'Free IPTV channels',
        'Watch with ads',
        '5 watch codes max',
        'Max level upgrade: LV3',
        'Monthly renewal required',
      ],
      codeLength: 6,
      maxLevel: 'LV3',
    },
    {
      name: 'Silver',
      icon: <Award size={28} />,
      price: '$5',
      period: '/3 months',
      color: 'from-gray-300 to-gray-400',
      borderColor: 'border-gray-300',
      features: [
        'Watch movies & series',
        'Free + Premium IPTV',
        'No ads',
        '10 watch codes max',
        'Max level upgrade: LV5',
        '3/6/12/24 month options',
      ],
      codeLength: 10,
      maxLevel: 'LV5',
    },
    {
      name: 'Gold',
      icon: <Star size={28} />,
      price: '$10',
      period: '/3 months',
      color: 'from-yellow-400 to-yellow-600',
      borderColor: 'border-yellow-300',
      popular: true,
      features: [
        'Watch movies & series',
        'Free + Premium IPTV',
        'No ads',
        '10 watch codes max',
        'Max level upgrade: LV7',
        '3/6/12/24 month options',
      ],
      codeLength: 10,
      maxLevel: 'LV7',
    },
    {
      name: 'Diamond',
      icon: <Diamond size={28} />,
      price: '$15',
      period: '/3 months',
      color: 'from-blue-400 to-purple-500',
      borderColor: 'border-purple-300',
      features: [
        'Watch movies & series',
        'Free + Premium IPTV',
        'No ads',
        '10 watch codes max',
        'Max level upgrade: LV10',
        '3/6/12/24 month options',
      ],
      codeLength: 10,
      maxLevel: 'LV10',
    },
  ];

  return (
    <section id="membership" className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Membership Plans</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">Choose the plan that fits your needs</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl border-2 ${plan.borderColor} p-6 hover:shadow-xl transition-all hover:-translate-y-1 ${
                plan.popular ? 'ring-2 ring-[#1877F2]' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#1877F2] text-white text-xs font-bold rounded-full">
                  Most Popular
                </div>
              )}
              <div className={`w-14 h-14 bg-gradient-to-br ${plan.color} rounded-xl flex items-center justify-center text-white mb-4`}>
                {plan.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
              <div className="mt-2 mb-4">
                <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-gray-500 text-sm">{plan.period}</span>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-2.5 rounded-xl font-bold transition ${
                plan.popular
                  ? 'bg-[#1877F2] text-white hover:bg-[#166FE5]'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}>
                Subscribe Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Apps Section
export function AppsSection() {
  const apps = [
    { name: 'Windows', icon: 'fab fa-windows', available: false },
    { name: 'macOS', icon: 'fab fa-apple', available: false },
    { name: 'Linux', icon: 'fab fa-linux', available: false },
    { name: 'Android', icon: 'fab fa-android', available: false },
    { name: 'iOS', icon: 'fab fa-apple', available: false },
    { name: 'Android TV', icon: 'fas fa-tv', available: false },
    { name: 'Apple TV', icon: 'fab fa-apple', available: false },
  ];

  return (
    <section id="apps" className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Download Our Apps</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">Available on all your favorite platforms</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {apps.map((app) => (
            <div
              key={app.name}
              className="relative bg-white rounded-xl p-6 border border-gray-100 text-center hover:shadow-md transition-all hover:-translate-y-1"
            >
              <i className={`${app.icon} text-4xl text-[#1877F2] mb-3`}></i>
              <p className="font-medium text-gray-800">{app.name}</p>
              {!app.available && (
                <span className="absolute top-2 right-2 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">
                  Coming Soon
                </span>
              )}
              {app.available && (
                <button className="mt-3 px-4 py-1.5 bg-[#1877F2] text-white text-sm rounded-lg hover:bg-[#166FE5] transition">
                  Download
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Support Section
export function SupportSection() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section id="support" className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Get In Touch</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">Have questions? We'd love to hear from you</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1877F2] transition"
                placeholder="Your full name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1877F2] transition"
                placeholder="your@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1877F2] transition h-32 resize-none"
                placeholder="How can we help you?"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-[#1877F2] text-white rounded-xl font-bold hover:bg-[#166FE5] transition"
            >
              Send Message
            </button>
          </form>

          {/* Pages Links */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="font-bold text-gray-900 mb-4">Quick Links</h3>
            <div className="grid grid-cols-2 gap-3">
              <a href="about.html" className="flex items-center gap-2 p-3 bg-white rounded-lg hover:shadow-sm transition text-sm text-gray-700">
                <span className="text-[#1877F2]">•</span> About Us
              </a>
              <a href="privacy.html" className="flex items-center gap-2 p-3 bg-white rounded-lg hover:shadow-sm transition text-sm text-gray-700">
                <span className="text-[#1877F2]">•</span> Privacy Policy
              </a>
              <a href="terms.html" className="flex items-center gap-2 p-3 bg-white rounded-lg hover:shadow-sm transition text-sm text-gray-700">
                <span className="text-[#1877F2]">•</span> Terms of Service
              </a>
              <a href="help.html" className="flex items-center gap-2 p-3 bg-white rounded-lg hover:shadow-sm transition text-sm text-gray-700">
                <span className="text-[#1877F2]">•</span> Help Center
              </a>
              <a href="contact.html" className="flex items-center gap-2 p-3 bg-white rounded-lg hover:shadow-sm transition text-sm text-gray-700">
                <span className="text-[#1877F2]">•</span> Contact Us
              </a>
              <a href="faq.html" className="flex items-center gap-2 p-3 bg-white rounded-lg hover:shadow-sm transition text-sm text-gray-700">
                <span className="text-[#1877F2]">•</span> FAQ
              </a>
            </div>
            <div className="mt-6 p-4 bg-blue-50 rounded-xl">
              <p className="text-sm text-gray-600">
                <strong>Support Hours:</strong><br />
                Monday - Friday: 9:00 AM - 6:00 PM<br />
                Saturday: 10:00 AM - 4:00 PM<br />
                Sunday: Closed
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
