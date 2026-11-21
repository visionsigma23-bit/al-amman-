import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const NAV_ITEMS = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'Our Projects', to: '/projects' },
  { label: 'AL-JALIL GARDEN', to: '/projects/al-jalil-garden' },
  { label: 'Contact Us', to: '/contact' },
];

export function Navbar() {
  const { siteContent } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 lg:h-20 flex items-center justify-between gap-3 lg:gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <Link
          to="/"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-2.5 sm:gap-3 min-w-0 whitespace-nowrap shrink-0 group focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C5A15B]"
        >
          {siteContent.companyLogoUrl ? (
            <img
              src={siteContent.companyLogoUrl}
              alt={siteContent.companyName}
              referrerPolicy="no-referrer"
              className="h-7 w-7 sm:h-8 sm:w-8 object-contain shrink-0"
            />
          ) : (
            <svg
              width="26"
              height="26"
              viewBox="0 0 32 32"
              fill="none"
              aria-hidden="true"
              className="shrink-0 text-[#101B2D] sm:w-7 sm:h-7"
            >
              <rect x="2" y="2" width="28" height="28" stroke="#C5A15B" strokeWidth="1.5" />
              <path d="M9 23V12L16 7L23 12V23" stroke="currentColor" strokeWidth="1.75" />
              <path d="M13 23V16H19V23" stroke="#C5A15B" strokeWidth="1.5" />
            </svg>
          )}
          <span className="font-display text-base sm:text-xl font-semibold tracking-tight text-[#101B2D] whitespace-nowrap truncate">
            {siteContent.companyName}
          </span>
        </Link>

        {/* Zone 2: Concise single-line text navigation links */}
        <nav
          aria-label="Primary navigation"
          className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#252525]/80"
        >
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `relative py-1 whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C5A15B] ${
                  isActive
                    ? 'text-[#101B2D] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#C5A15B]'
                    : 'hover:text-[#101B2D]'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Zone 3: Single Primary Action */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link
            to="/contact"
            className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 bg-[#101B2D] text-white text-sm font-medium tracking-wide hover:bg-[#1A2A44] transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C5A15B]"
          >
            Get in Touch
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="lg:hidden inline-flex items-center justify-center w-11 h-11 text-[#101B2D] hover:bg-slate-100 transition-colors cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-3 text-base font-medium transition-colors ${
                  isActive
                    ? 'text-[#101B2D] bg-[#F6F7F9] font-semibold'
                    : 'text-[#252525]/80 hover:text-[#101B2D] hover:bg-slate-50'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <div className="pt-3 border-t border-slate-100">
            <Link
              to="/contact"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center w-full py-3 bg-[#101B2D] text-white text-sm font-medium"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
