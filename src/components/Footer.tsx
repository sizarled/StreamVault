import { Film, Facebook, Twitter, Instagram, Youtube, Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1a1a2e] text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-[#1877F2] rounded-full flex items-center justify-center">
                <Film className="text-white" size={20} />
              </div>
              <span className="font-bold text-xl">StreamVault</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Your ultimate destination for movies, series, and live IPTV channels. Stream anytime, anywhere.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#1877F2] transition">
                <Facebook size={16} />
              </a>
              <a href="#" className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#1877F2] transition">
                <Twitter size={16} />
              </a>
              <a href="#" className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#1877F2] transition">
                <Instagram size={16} />
              </a>
              <a href="#" className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#1877F2] transition">
                <Youtube size={16} />
              </a>
              <a href="#" className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#1877F2] transition">
                <Send size={16} />
              </a>
            </div>
          </div>

          {/* Watch */}
          <div>
            <h3 className="font-bold text-lg mb-4">Watch</h3>
            <ul className="space-y-2">
              <li><a href="movies.html" className="text-gray-400 hover:text-white transition text-sm">Movies</a></li>
              <li><a href="series.html" className="text-gray-400 hover:text-white transition text-sm">TV Series</a></li>
              <li><a href="iptv.html" className="text-gray-400 hover:text-white transition text-sm">IPTV Channels</a></li>
              <li><a href="videos.html" className="text-gray-400 hover:text-white transition text-sm">Videos</a></li>
              <li><a href="articles.html" className="text-gray-400 hover:text-white transition text-sm">Articles</a></li>
            </ul>
          </div>

          {/* Browse */}
          <div>
            <h3 className="font-bold text-lg mb-4">Browse</h3>
            <ul className="space-y-2">
              <li><a href="documents.html" className="text-gray-400 hover:text-white transition text-sm">Documents</a></li>
              <li><a href="answers.html" className="text-gray-400 hover:text-white transition text-sm">Q&A</a></li>
              <li><a href="market.html" className="text-gray-400 hover:text-white transition text-sm">Market</a></li>
              <li><a href="prize.html" className="text-gray-400 hover:text-white transition text-sm">Prizes</a></li>
              <li><a href="tasks.html" className="text-gray-400 hover:text-white transition text-sm">Tasks</a></li>
            </ul>
          </div>

          {/* Pages */}
          <div>
            <h3 className="font-bold text-lg mb-4">Pages</h3>
            <ul className="space-y-2">
              <li><a href="about.html" className="text-gray-400 hover:text-white transition text-sm">About Us</a></li>
              <li><a href="privacy.html" className="text-gray-400 hover:text-white transition text-sm">Privacy Policy</a></li>
              <li><a href="terms.html" className="text-gray-400 hover:text-white transition text-sm">Terms of Service</a></li>
              <li><a href="contact.html" className="text-gray-400 hover:text-white transition text-sm">Contact Us</a></li>
              <li><a href="help.html" className="text-gray-400 hover:text-white transition text-sm">Help Center</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm">
            © 2026 StreamVault. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="privacy.html" className="text-gray-400 hover:text-white text-sm transition">Privacy</a>
            <a href="terms.html" className="text-gray-400 hover:text-white text-sm transition">Terms</a>
            <a href="contact.html" className="text-gray-400 hover:text-white text-sm transition">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
