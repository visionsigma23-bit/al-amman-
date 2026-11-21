import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Inbox, PlusSquare, Settings } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SEOHead } from '../../components/SEOHead';

function formatDate(ts: unknown): string {
  if (!ts) return 'Just now';
  if (typeof ts === 'object' && ts !== null && 'toDate' in ts) {
    return (ts as { toDate: () => Date }).toDate().toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
  return 'Recent';
}

export function AdminDashboardPage() {
  const { allAdminProjects, inquiries, siteContent } = useApp();

  const totalProjects = allAdminProjects.length;
  const publishedProjects = allAdminProjects.filter((p) => p.published).length;
  const draftProjects = allAdminProjects.filter((p) => !p.published).length;
  const totalInquiries = inquiries.length;
  const newInquiries = inquiries.filter((i) => i.status === 'new').length;
  const recentInquiries = inquiries.slice(0, 5);

  return (
    <>
      <SEOHead
        title={`Dashboard – ${siteContent.companyName} Admin`}
        description="Admin dashboard overview for AL-Amaan Developers."
      />

      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-semibold text-[#101B2D]">
              Dashboard Overview
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Real-time portfolio metrics and incoming client inquiries from Cloud Firestore.
            </p>
          </div>

          <Link
            to="/admin/projects/add"
            className="px-5 py-2.5 bg-[#101B2D] hover:bg-[#1A2A44] text-white text-sm font-medium inline-flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            <PlusSquare className="w-4 h-4 text-[#C5A15B]" />
            <span>Add New Project</span>
          </Link>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white border border-slate-200 p-6 space-y-1">
            <p className="text-xs font-medium text-slate-500">Total Projects</p>
            <p className="font-display text-3xl font-semibold text-[#101B2D] tabular-nums">
              {totalProjects}
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-6 space-y-1">
            <p className="text-xs font-medium text-slate-500">Published Projects</p>
            <p className="font-display text-3xl font-semibold text-emerald-800 tabular-nums">
              {publishedProjects}
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-6 space-y-1">
            <p className="text-xs font-medium text-slate-500">Draft Projects</p>
            <p className="font-display text-3xl font-semibold text-slate-700 tabular-nums">
              {draftProjects}
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-6 space-y-1">
            <p className="text-xs font-medium text-slate-500">Total Customer Inquiries</p>
            <div className="flex items-baseline justify-between gap-2">
              <p className="font-display text-3xl font-semibold text-[#A98642] tabular-nums">
                {totalInquiries}
              </p>
              <span className="text-xs text-slate-500 tabular-nums">{newInquiries} new</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-[#101B2D]">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/admin/projects/add"
              className="bg-white border border-slate-200 hover:border-[#101B2D] p-5 space-y-2 transition-colors"
            >
              <PlusSquare className="w-5 h-5 text-[#A98642]" />
              <p className="font-semibold text-sm text-[#101B2D]">Add New Project</p>
              <p className="text-xs text-slate-500">Create and publish a new development.</p>
            </Link>

            <Link
              to="/admin/projects"
              className="bg-white border border-slate-200 hover:border-[#101B2D] p-5 space-y-2 transition-colors"
            >
              <Building2 className="w-5 h-5 text-[#A98642]" />
              <p className="font-semibold text-sm text-[#101B2D]">Manage Projects</p>
              <p className="text-xs text-slate-500">Edit details, galleries, or publish status.</p>
            </Link>

            <Link
              to="/admin/inquiries"
              className="bg-white border border-slate-200 hover:border-[#101B2D] p-5 space-y-2 transition-colors"
            >
              <Inbox className="w-5 h-5 text-[#A98642]" />
              <p className="font-semibold text-sm text-[#101B2D]">Manage Inquiries</p>
              <p className="text-xs text-slate-500">Update lead status and reply on WhatsApp.</p>
            </Link>

            <Link
              to="/admin/settings"
              className="bg-white border border-slate-200 hover:border-[#101B2D] p-5 space-y-2 transition-colors"
            >
              <Settings className="w-5 h-5 text-[#A98642]" />
              <p className="font-semibold text-sm text-[#101B2D]">Company Settings</p>
              <p className="text-xs text-slate-500">Logo, WhatsApp number, address &amp; links.</p>
            </Link>
          </div>
        </div>

        {/* Recent Inquiries */}
        <div className="bg-white border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4">
            <h2 className="font-display text-xl font-semibold text-[#101B2D]">Recent Inquiries</h2>
            <Link
              to="/admin/inquiries"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#101B2D] hover:text-[#A98642]"
            >
              <span>View All Inquiries</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentInquiries.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">
              No customer inquiries received yet. Submissions from Contact Us or project pages will
              appear here automatically.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-[#F6F7F9] border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-600">
                    <th className="py-3 px-6">Customer</th>
                    <th className="py-3 px-6">Project</th>
                    <th className="py-3 px-6">Status</th>
                    <th className="py-3 px-6 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {recentInquiries.map((inq) => (
                    <tr key={inq.id} className="hover:bg-slate-50/70">
                      <td className="py-3.5 px-6">
                        <p className="font-semibold text-[#101B2D]">{inq.name}</p>
                        <p className="text-xs text-slate-500 tabular-nums">{inq.phone}</p>
                      </td>
                      <td className="py-3.5 px-6 text-slate-700">{inq.interestedProject}</td>
                      <td className="py-3.5 px-6">
                        <span className="text-xs font-medium capitalize text-[#101B2D]">
                          {inq.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-right font-mono text-xs text-slate-500 tabular-nums">
                        {formatDate(inq.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
