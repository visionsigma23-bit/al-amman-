import { useState } from 'react';
import { Send, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

function WhatsAppBrandIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12.04 2C6.51 2 2.02 6.49 2.02 12.02c0 1.77.46 3.5 1.34 5.02L2 22l5.09-1.33a10 10 0 0 0 4.95 1.31h.01c5.53 0 10.02-4.49 10.02-10.02A9.97 9.97 0 0 0 12.04 2Zm5.83 14.23c-.25.7-1.44 1.33-2 1.42-.51.08-1.17.11-1.88-.12-.44-.14-.99-.32-1.7-.63-2.99-1.29-4.94-4.31-5.09-4.51-.15-.2-1.22-1.62-1.22-3.09s.77-2.2 1.04-2.5c.27-.3.6-.37.8-.37.2 0 .4 0 .57.01.18.01.43-.07.67.51.25.6.85 2.07.92 2.22.07.15.12.32.02.52-.1.2-.15.32-.3.5-.15.17-.31.39-.44.52-.15.15-.3.31-.13.61.17.3.76 1.25 1.63 2.03 1.12 1 2.07 1.31 2.37 1.46.3.15.47.12.64-.08.17-.2.74-.86.94-1.15.2-.3.4-.25.67-.15.27.1 1.74.82 2.04.97.3.15.5.22.57.34.08.12.08.7-.17 1.4Z" />
    </svg>
  );
}

export function FloatingWhatsApp() {
  const { projects, buildWhatsAppUrl } = useApp();
  const [open, setOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [selectedProject, setSelectedProject] = useState(
    projects[0]?.name || 'AL-JALIL GARDEN'
  );
  const [details, setDetails] = useState('');

  const whatsappHref = buildWhatsAppUrl({
    customerName,
    projectName: selectedProject,
    details,
  });

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:right-auto sm:bottom-6 sm:left-6 z-50 flex flex-col items-start pointer-events-none">
      {open && (
        <div
          role="dialog"
          aria-label="WhatsApp Project Inquiry"
          className="pointer-events-auto mb-3 w-full max-w-[340px] bg-white border border-slate-200 shadow-xl overflow-hidden"
        >
          <div className="bg-[#101B2D] text-white px-5 py-4 flex items-center justify-between">
            <div>
              <p className="font-display text-base font-semibold">WhatsApp Advisory</p>
              <p className="text-xs text-slate-300 mt-0.5">
                Direct line to AL-Amaan Developers
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close WhatsApp inquiry panel"
              className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 space-y-3">
            <div>
              <label
                htmlFor="wa-name"
                className="block text-xs font-medium text-slate-600 mb-1"
              >
                Your Name
              </label>
              <input
                id="wa-name"
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-3 py-2 text-sm border border-slate-300 bg-white text-[#252525] focus:outline-none focus:border-[#101B2D]"
              />
            </div>

            <div>
              <label
                htmlFor="wa-project"
                className="block text-xs font-medium text-slate-600 mb-1"
              >
                Interested Project
              </label>
              <select
                id="wa-project"
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 bg-white text-[#252525] focus:outline-none focus:border-[#101B2D]"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name}
                  </option>
                ))}
                <option value="General Investment Inquiry">General Investment Inquiry</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="wa-details"
                className="block text-xs font-medium text-slate-600 mb-1"
              >
                Inquiry Details
              </label>
              <textarea
                id="wa-details"
                rows={2}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Plot category, site visit, or information request"
                className="w-full px-3 py-2 text-sm border border-slate-300 bg-white text-[#252525] focus:outline-none focus:border-[#101B2D] resize-none"
              />
            </div>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 bg-[#1B6B46] hover:bg-[#155738] text-white text-sm font-medium inline-flex items-center justify-center gap-2 transition-colors"
            >
              <Send className="w-4 h-4" aria-hidden="true" />
              <span>Start WhatsApp Chat</span>
            </a>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? 'Close WhatsApp inquiry panel' : 'Inquire on WhatsApp'}
        aria-expanded={open}
        title="WhatsApp Inquiry"
        className="pointer-events-auto w-14 h-14 rounded-full bg-[#1B6B46] hover:bg-[#155738] text-white border-2 border-[#C5A15B]/80 shadow-[0_10px_28px_rgba(16,27,45,0.28)] inline-flex items-center justify-center transition-transform duration-150 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A15B] focus-visible:ring-offset-2 cursor-pointer"
      >
        {open ? (
          <X className="w-6 h-6 text-white" aria-hidden="true" />
        ) : (
          <WhatsAppBrandIcon className="w-7 h-7 text-white" />
        )}
      </button>
    </div>
  );
}
