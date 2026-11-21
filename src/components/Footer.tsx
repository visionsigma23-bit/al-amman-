import { Link } from 'react-router-dom';
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SocialLinksRow } from './SocialLinksRow';

export function Footer() {
  const { siteContent, projects } = useApp();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#101B2D] text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Column 1: Company Brand & Intro */}
          <div className="lg:col-span-4 min-w-0 space-y-5">
            <Link to="/" className="inline-flex items-center gap-3">
              {siteContent.companyLogoUrl ? (
                <img
                  src={siteContent.companyLogoUrl}
                  alt={siteContent.companyName}
                  referrerPolicy="no-referrer"
                  className="h-7 w-7 object-contain shrink-0"
                />
              ) : (
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 32 32"
                  fill="none"
                  aria-hidden="true"
                  className="shrink-0 text-white"
                >
                  <rect x="2" y="2" width="28" height="28" stroke="#C5A15B" strokeWidth="1.5" />
                  <path d="M9 23V12L16 7L23 12V23" stroke="currentColor" strokeWidth="1.75" />
                  <path d="M13 23V16H19V23" stroke="#C5A15B" strokeWidth="1.5" />
                </svg>
              )}
              <span className="font-display text-xl font-semibold tracking-tight text-white">
                {siteContent.companyName}
              </span>
            </Link>
            <p className="text-xs font-medium tracking-[0.14em] uppercase text-[#C5A15B]">
              {siteContent.tagline}
            </p>
            <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
              {siteContent.aboutPreviewBody}
            </p>
          </div>

          {/* Column 2: Quick Navigation */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-sans text-xs font-semibold tracking-[0.12em] uppercase text-[#C5A15B]">
              Navigation
            </h2>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-white transition-colors">
                  Our Projects
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white transition-colors text-slate-400">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Dynamic Project Links */}
          <div className="lg:col-span-3 space-y-4">
            <h2 className="font-sans text-xs font-semibold tracking-[0.12em] uppercase text-[#C5A15B]">
              Developments
            </h2>
            <ul className="space-y-2.5 text-sm text-slate-300">
              {projects.slice(0, 6).map((project) => (
                <li key={project.id}>
                  <Link
                    to={`/projects/${project.slug}`}
                    className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
                  >
                    <span>{project.name}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#C5A15B]" aria-hidden="true" />
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/projects" className="text-slate-400 hover:text-white transition-colors">
                  View All Developments
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Social */}
          <div className="lg:col-span-3 space-y-4">
            <h2 className="font-sans text-xs font-semibold tracking-[0.12em] uppercase text-[#C5A15B]">
              Contact Office
            </h2>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C5A15B] shrink-0 mt-0.5" aria-hidden="true" />
                <span className="leading-relaxed">{siteContent.officeAddress}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C5A15B] shrink-0" aria-hidden="true" />
                <span className="tabular-nums">{siteContent.contactPhone}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C5A15B] shrink-0" aria-hidden="true" />
                <a
                  href={`mailto:${siteContent.contactEmail}`}
                  className="hover:text-white transition-colors break-all"
                >
                  {siteContent.contactEmail}
                </a>
              </li>
            </ul>

            <SocialLinksRow
              socialLinks={siteContent.socialLinks}
              variant="dark"
              className="pt-2"
            />
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400">
          <p className="tabular-nums">
            &copy; {currentYear} {siteContent.companyName}. All rights reserved.
          </p>
          <p>
            Information displayed is subject to official verification and updates via our corporate desk.
          </p>
        </div>
      </div>
    </footer>
  );
}
