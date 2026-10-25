import { useState } from 'react';
import {
  User, Search, Film, Tv, Radio, Video, FileText, Newspaper, HelpCircle,
  ShoppingBag, Gift, CheckSquare, Info, Shield, FileCheck, Mail, Headphones,
  ChevronDown, ChevronRight, LogIn, UserPlus, LayoutDashboard, LogOut
} from 'lucide-react';

interface SidebarProps {
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

export default function Sidebar({ isLoggedIn, onLogin, onLogout }: SidebarProps) {
  const [watchOpen, setWatchOpen] = useState(true);
  const [browseOpen, setBrowseOpen] = useState(true);
  const [earnOpen, setEarnOpen] = useState(true);
  const [pagesOpen, setPagesOpen] = useState(true);

  const visitorId = `VR-${Math.floor(100000 + Math.random() * 900000)}`;
  const userId = `ID-${Math.floor(100000 + Math.random() * 900000)}`;

  return (
    <aside className="w-64 h-full bg-white border-r border-gray-200 overflow-y-auto scrollbar-thin">
      {/* User Section */}
      <div className="p-4 border-b border-gray-100">
        {!isLoggedIn ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <User size={20} className="text-gray-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Visitor</p>
              <p className="text-xs text-gray-400">{visitorId}</p>
            </div>
          </div>
        ) : (
          <a href="profile.html" className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition">
            <div className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">John Doe</p>
              <p className="text-xs text-gray-400">{userId}</p>
            </div>
          </a>
        )}

        {!isLoggedIn ? (
          <div className="flex gap-2 mt-3">
            <button
              onClick={onLogin}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-[#1877F2] text-white text-xs rounded-lg hover:bg-[#166FE5] transition"
            >
              <LogIn size={12} /> Login
            </button>
            <button className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 border border-[#1877F2] text-[#1877F2] text-xs rounded-lg hover:bg-blue-50 transition">
              <UserPlus size={12} /> Sign Up
            </button>
          </div>
        ) : (
          <div className="flex gap-2 mt-3">
            <a href="dashboard.html" className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-[#1877F2] text-white text-xs rounded-lg hover:bg-[#166FE5] transition">
              <LayoutDashboard size={12} /> Dashboard
            </a>
            <button
              onClick={onLogout}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 border border-red-400 text-red-500 text-xs rounded-lg hover:bg-red-50 transition"
            >
              <LogOut size={12} /> Logout
            </button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="p-3">
        {/* Search */}
        <a href="search.html" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-[#1877F2] rounded-lg transition text-sm font-medium">
          <Search size={18} />
          <span>Search</span>
        </a>

        {/* Watch Section */}
        <div className="mt-2">
          <button
            onClick={() => setWatchOpen(!watchOpen)}
            className="flex items-center justify-between w-full px-3 py-2 text-gray-500 text-xs font-bold uppercase tracking-wider"
          >
            <span>Watch</span>
            {watchOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
          {watchOpen && (
            <div className="ml-2 space-y-0.5">
              <a href="movies.html" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-[#1877F2] rounded-lg transition text-sm">
                <Film size={16} /> Movies
              </a>
              <a href="series.html" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-[#1877F2] rounded-lg transition text-sm">
                <Tv size={16} /> Series
              </a>
              <a href="iptv.html" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-[#1877F2] rounded-lg transition text-sm">
                <Radio size={16} /> IPTV
              </a>
            </div>
          )}
        </div>

        {/* Browse Section */}
        <div className="mt-2">
          <button
            onClick={() => setBrowseOpen(!browseOpen)}
            className="flex items-center justify-between w-full px-3 py-2 text-gray-500 text-xs font-bold uppercase tracking-wider"
          >
            <span>Browse</span>
            {browseOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
          {browseOpen && (
            <div className="ml-2 space-y-0.5">
              <a href="videos.html" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-[#1877F2] rounded-lg transition text-sm">
                <Video size={16} /> Videos
              </a>
              <a href="documents.html" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-[#1877F2] rounded-lg transition text-sm">
                <FileText size={16} /> Documents
              </a>
              <a href="articles.html" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-[#1877F2] rounded-lg transition text-sm">
                <Newspaper size={16} /> Articles
              </a>
              <a href="answers.html" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-[#1877F2] rounded-lg transition text-sm">
                <HelpCircle size={16} /> Q&A
              </a>
            </div>
          )}
        </div>

        {/* Earn Section */}
        <div className="mt-2">
          <button
            onClick={() => setEarnOpen(!earnOpen)}
            className="flex items-center justify-between w-full px-3 py-2 text-gray-500 text-xs font-bold uppercase tracking-wider"
          >
            <span>Earn</span>
            {earnOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
          {earnOpen && (
            <div className="ml-2 space-y-0.5">
              <a href="market.html" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-[#1877F2] rounded-lg transition text-sm">
                <ShoppingBag size={16} /> Market
              </a>
              <a href="prize.html" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-[#1877F2] rounded-lg transition text-sm">
                <Gift size={16} /> Prizes
              </a>
              <a href="tasks.html" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-[#1877F2] rounded-lg transition text-sm">
                <CheckSquare size={16} /> Tasks
              </a>
            </div>
          )}
        </div>

        {/* Pages Section */}
        <div className="mt-2">
          <button
            onClick={() => setPagesOpen(!pagesOpen)}
            className="flex items-center justify-between w-full px-3 py-2 text-gray-500 text-xs font-bold uppercase tracking-wider"
          >
            <span>Pages</span>
            {pagesOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
          {pagesOpen && (
            <div className="ml-2 space-y-0.5">
              <a href="about.html" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-[#1877F2] rounded-lg transition text-sm">
                <Info size={16} /> About
              </a>
              <a href="privacy.html" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-[#1877F2] rounded-lg transition text-sm">
                <Shield size={16} /> Privacy
              </a>
              <a href="terms.html" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-[#1877F2] rounded-lg transition text-sm">
                <FileCheck size={16} /> Terms
              </a>
              <a href="contact.html" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-[#1877F2] rounded-lg transition text-sm">
                <Mail size={16} /> Contact Us
              </a>
              <a href="help.html" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-[#1877F2] rounded-lg transition text-sm">
                <Headphones size={16} /> Help
              </a>
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
}
