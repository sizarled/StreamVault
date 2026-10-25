import { useState } from 'react';
import { Film, Search, Tv, Radio, CreditCard, Smartphone, HeadphonesIcon, Menu, X } from 'lucide-react';

interface HeaderProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}

export default function Header({ isLoggedIn, onLogout }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Features', href: '#features', icon: <Film size={16} /> },
    { label: 'Search', href: '#search', icon: <Search size={16} /> },
    { label: 'Movies', href: '#movies', icon: <Film size={16} /> },
    { label: 'Series', href: '#series', icon: <Tv size={16} /> },
    { label: 'IPTV', href: '#iptv', icon: <Radio size={16} /> },
    { label: 'Membership', href: '#membership', icon: <CreditCard size={16} /> },
    { label: 'Apps', href: '#apps', icon: <Smartphone size={16} /> },
    { label: 'Support', href: '#support', icon: <HeadphonesIcon size={16} /> },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#1877F2] shadow-lg">
      <div className="flex items-center justify-between px-4 h-14">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <Film className="text-[#1877F2]" size={24} />
          </div>
          <span className="text-white font-bold text-xl hidden sm:block">StreamVault</span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="flex items-center gap-1.5 px-3 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all text-sm font-medium"
            >
              {item.icon}
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center gap-2">
          {!isLoggedIn ? (
            <>
              <button className="hidden sm:block px-4 py-1.5 text-white border border-white/50 rounded-lg hover:bg-white/10 transition text-sm font-medium">
                Login
              </button>
              <button className="px-4 py-1.5 bg-white text-[#1877F2] rounded-lg hover:bg-gray-100 transition text-sm font-bold">
                Sign Up
              </button>
            </>
          ) : (
            <button
              onClick={onLogout}
              className="px-4 py-1.5 bg-white text-[#1877F2] rounded-lg hover:bg-gray-100 transition text-sm font-bold"
            >
              Logout
            </button>
          )}
          <button
            className="lg:hidden text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#1877F2] border-t border-white/20 px-4 py-3">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="flex items-center gap-2 px-3 py-2.5 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition text-sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.icon}
              <span>{item.label}</span>
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
