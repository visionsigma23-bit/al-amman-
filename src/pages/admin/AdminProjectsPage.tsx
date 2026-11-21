import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit3, ExternalLink, Plus, Search, Star, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { deleteProjectById, upsertProject } from '../../lib/firestoreService';
import { Project } from '../../types/realestate';
import { SafeImage } from '../../components/SafeImage';
import { SEOHead } from '../../components/SEOHead';
import { useAdminNotify } from '../../components/admin/AdminLayout';

export function AdminProjectsPage() {
  const { allAdminProjects, siteContent } = useApp();
  const { notify } = useAdminNotify();

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return allAdminProjects.filter((p) => {
      const matchesFilter =
        filter === 'all' ||
        (filter === 'published' && p.published) ||
        (filter === 'draft' && !p.published);
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [allAdminProjects, filter, search]);

  const togglePublish = async (project: Project) => {
    setBusyId(project.id);
    try {
      await upsertProject({ ...project, published: !project.published }, false);
      notify(
        `${project.name} is now ${!project.published ? 'published on the website' : 'set to draft'}.`
      );
    } finally {
      setBusyId(null);
    }
  };

  const toggleFeatured = async (project: Project) => {
    setBusyId(project.id);
    try {
      await upsertProject({ ...project, featured: !project.featured }, false);
      notify(
        `${project.name} ${!project.featured ? 'marked as featured' : 'removed from featured'}.`
      );
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (project: Project) => {
    setBusyId(project.id);
    try {
      await deleteProjectById(project.id);
      setConfirmDeleteId(null);
      notify(`Deleted project ${project.name}.`);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <>
      <SEOHead
        title={`Projects – ${siteContent.companyName} Admin`}
        description="Manage real estate projects in Cloud Firestore."
      />

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-semibold text-[#101B2D]">
              Manage Projects
            </h1>
            <p className="text-sm text-slate-600 mt-0.5">
              Add unlimited developments, edit existing projects, toggle published status, or mark
              featured projects.
            </p>
          </div>

          <Link
            to="/admin/projects/add"
            className="px-5 py-2.5 bg-[#101B2D] hover:bg-[#1A2A44] text-white text-sm font-medium inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4 text-[#C5A15B]" />
            <span>Add New Project</span>
          </Link>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="inline-flex items-center gap-1 p-1 bg-white border border-slate-200 self-start">
            {(['all', 'published', 'draft'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={`px-3.5 py-1.5 text-xs font-medium capitalize cursor-pointer ${
                  filter === tab
                    ? 'bg-[#101B2D] text-white'
                    : 'text-slate-600 hover:text-[#101B2D]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 bg-white focus:outline-none focus:border-[#101B2D]"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white border border-slate-200 p-10 text-center space-y-4">
            <p className="font-display text-xl font-semibold text-[#101B2D]">
              No Projects Found
            </p>
            <Link
              to="/admin/projects/add"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#101B2D] text-white text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Project</span>
            </Link>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-[#F6F7F9] text-xs font-semibold uppercase tracking-wider text-slate-600">
                  <th className="py-3.5 px-4">Project</th>
                  <th className="py-3.5 px-4">Category &amp; Status</th>
                  <th className="py-3.5 px-4">Publish / Featured</th>
                  <th className="py-3.5 px-4 text-right">Order</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {filtered.map((project) => (
                  <tr key={project.id} className="hover:bg-slate-50/70">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-16 h-12 bg-[#101B2D] shrink-0 overflow-hidden">
                          <SafeImage
                            src={project.coverImage}
                            alt={project.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-[#101B2D] truncate">{project.name}</p>
                          <p className="text-xs text-slate-500 truncate">{project.location}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <p className="text-[#101B2D] font-medium">{project.category}</p>
                      <p className="text-xs text-slate-500">{project.status}</p>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          disabled={busyId === project.id}
                          onClick={() => togglePublish(project)}
                          className={`px-2.5 py-1 text-xs font-medium border transition-colors cursor-pointer ${
                            project.published
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                              : 'bg-slate-100 border-slate-300 text-slate-600'
                          }`}
                        >
                          {project.published ? 'Published' : 'Draft'}
                        </button>

                        <button
                          type="button"
                          disabled={busyId === project.id}
                          onClick={() => toggleFeatured(project)}
                          title="Toggle Featured"
                          className={`p-1.5 border transition-colors cursor-pointer ${
                            project.featured
                              ? 'border-[#C5A15B] text-[#A98642] bg-[#C5A15B]/10'
                              : 'border-slate-200 text-slate-400 hover:text-slate-600'
                          }`}
                        >
                          <Star
                            className="w-3.5 h-3.5"
                            fill={project.featured ? 'currentColor' : 'none'}
                          />
                        </button>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-right font-mono text-xs tabular-nums text-slate-600">
                      {project.displayOrder ?? 1}
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/projects/${project.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-slate-500 hover:text-[#101B2D]"
                          title="View Public Page"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>

                        <Link
                          to={`/admin/projects/edit/${project.id}`}
                          className="p-2 text-slate-600 hover:text-[#101B2D]"
                          title="Edit Project"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>

                        {confirmDeleteId === project.id ? (
                          <div className="inline-flex items-center gap-1.5 ml-1">
                            <button
                              type="button"
                              onClick={() => handleDelete(project)}
                              className="px-2.5 py-1 bg-red-600 text-white text-xs font-medium cursor-pointer"
                            >
                              Confirm
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-2 py-1 border border-slate-300 text-xs cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(project.id)}
                            className="p-2 text-slate-400 hover:text-red-700 cursor-pointer"
                            title="Delete Project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
