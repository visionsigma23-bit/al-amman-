import { useState } from 'react';
import { Link, Navigate, NavLink, Outlet, useOutletContext } from 'react-router-dom';
import {
  Building2,
  CheckCircle2,
  Database,
  ExternalLink,
  Inbox,
  LayoutDashboard,
  Loader2,
  LogOut,
  PlusSquare,
  Settings,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export interface AdminOutletContext {
  notify: (msg: string) => void;
}

export function useAdminNotify() {
  return useOutletContext<AdminOutletContext>();
}

const ADMIN_NAV = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/projects', label: 'Projects', icon: Building2, end: true },
  { to: '/admin/projects/add', label: 'Add Project', icon: PlusSquare, end: true },
  { to: '/admin/inquiries', label: 'Inquiries', icon: Inbox, end: false },
  { to: '/admin/settings', label: 'Company Settings', icon: Settings, end: false },
];

export function AdminLayout() {
  const {
    user,
    isAdmin,
    authLoading,
    signOutUser,
    inquiries,
    siteContent,
    hasLiveProjectsInDb,
    hasLiveSiteContentInDb,
    initializeDatabaseDefaults,
  } = useApp();

  const [notice, setNotice] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);

  const notify = (msg: string) => {
    setNotice(msg);
    setTimeout(() => {
      setNotice((prev) => (prev === msg ? null : prev));
    }, 4500);
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await initializeDatabaseDefaults();
      notify('AL-JALIL GARDEN and default company settings synced to Cloud Firestore.');
    } finally {
      setSeeding(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F6F7F9]">
        <div className="flex items-center gap-3 text-sm text-slate-600">
          <Loader2 className="w-5 h-5 animate-spin text-[#101B2D]" />
          <span>Verifying administrator session...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#F6F7F9] flex items-center justify-center p-6">
        <div className="max-w-lg w-full bg-white border border-slate-200 p-8 space-y-5 shadow-sm">
          <div className="flex items-center gap-3 text-red-800">
            <ShieldAlert className="w-6 h-6 shrink-0" />
            <h1 className="font-display text-2xl font-semibold">Access Restricted</h1>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Signed in as <span className="font-semibold text-[#101B2D]">{user.email}</span>, which
            is not authorized as an administrator. Only verified administrators can access the
            AL-Amaan Developers dashboard.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => void signOutUser()}
              className="px-5 py-2.5 bg-[#101B2D] text-white text-sm font-medium cursor-pointer"
            >
              Sign Out
            </button>
            <Link
              to="/"
              className="px-5 py-2.5 border border-slate-300 text-sm font-medium text-[#101B2D]"
            >
              Return to Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const newInquiriesCount = inquiries.filter((i) => i.status === 'new').length;

  return (
    <div className="min-h-screen w-full max-w-full bg-[#F6F7F9] flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 bg-[#101B2D] text-white shrink-0 flex flex-col justify-between">
        <div className="p-5 sm:p-6 space-y-6">
          <div className="flex items-center justify-between lg:block">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#C5A15B]">
                Admin Control Center
              </p>
              <p className="font-display text-lg font-semibold mt-1 text-white">
                {siteContent.companyName}
              </p>
            </div>
            <button
              type="button"
              onClick={() => void signOutUser()}
              className="lg:hidden px-3 py-1.5 border border-white/20 text-xs text-slate-200 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>

          <nav
            aria-label="Admin navigation"
            className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0"
          >
            {ADMIN_NAV.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `px-3.5 py-2.5 text-sm font-medium flex items-center justify-between gap-3 whitespace-nowrap shrink-0 transition-colors ${
                      isActive
                        ? 'bg-white/10 text-white border-b-2 lg:border-b-0 lg:border-l-2 border-[#C5A15B]'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  <span className="inline-flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-[#C5A15B] shrink-0" aria-hidden="true" />
                    <span>{item.label}</span>
                  </span>
                  {item.to === '/admin/inquiries' && newInquiriesCount > 0 && (
                    <span className="font-mono text-xs tabular-nums text-[#C5A15B]">
                      {newInquiriesCount}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="hidden lg:block p-6 border-t border-white/10 space-y-3">
          <Link
            to="/"
            className="w-full py-2 px-3 bg-white/5 hover:bg-white/10 text-xs font-medium inline-flex items-center justify-center gap-2 text-slate-200 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#C5A15B]" aria-hidden="true" />
            <span>View Public Website</span>
          </Link>

          <div className="text-xs pt-1">
            <p className="text-slate-400">Authorized Admin</p>
            <p className="text-white font-medium truncate">{user.email}</p>
          </div>

          <button
            type="button"
            onClick={() => void signOutUser()}
            className="w-full py-2 px-3 border border-white/20 hover:border-white/40 text-xs font-medium inline-flex items-center justify-center gap-2 text-slate-200 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="bg-white border-b border-slate-200 px-6 sm:px-8 py-4 flex items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            <span>{siteContent.companyName}</span>
            <span className="mx-2">/</span>
            <span className="font-semibold text-[#101B2D]">Administration</span>
          </div>
          <Link
            to="/"
            className="lg:hidden text-xs font-medium text-[#101B2D] inline-flex items-center gap-1"
          >
            <span>Public Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </header>

        <main className="flex-1 p-5 sm:p-8 lg:p-10 space-y-6">
          {notice && (
            <div
              role="status"
              className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 text-sm flex items-center gap-2.5"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{notice}</span>
            </div>
          )}

          {(!hasLiveProjectsInDb || !hasLiveSiteContentInDb) && (
            <div className="bg-white border border-[#C5A15B] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-[#101B2D] inline-flex items-center gap-2">
                  <Database className="w-4 h-4 text-[#A98642]" />
                  <span>Initialize Cloud Firestore Records</span>
                </p>
                <p className="text-xs text-slate-600">
                  Seed AL-JALIL GARDEN and default company settings into Firestore so updates sync
                  live across the website.
                </p>
              </div>
              <button
                type="button"
                disabled={seeding}
                onClick={handleSeed}
                className="px-4 py-2.5 bg-[#101B2D] text-white text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer"
              >
                {seeding ? 'Syncing...' : 'Sync Default Data'}
              </button>
            </div>
          )}

          <Outlet context={{ notify }} />
        </main>
      </div>
    </div>
  );
}
