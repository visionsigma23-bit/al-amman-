import { useMemo, useState } from 'react';
import { Mail, MessageCircle, Search, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { deleteInquiryById, updateInquiryStatus } from '../../lib/firestoreService';
import { Inquiry, InquiryStatus } from '../../types/realestate';

interface InquiriesManagerProps {
  inquiries: Inquiry[];
  onNotify: (msg: string) => void;
}

function formatFirestoreTimestamp(ts: unknown): string {
  if (!ts) return 'Just now';
  if (typeof ts === 'object' && ts !== null && 'toDate' in ts) {
    const d = (ts as { toDate: () => Date }).toDate();
    return d.toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
  return 'Recent';
}

export function InquiriesManager({ inquiries, onNotify }: InquiriesManagerProps) {
  const { buildWhatsAppUrl } = useApp();
  const [statusFilter, setStatusFilter] = useState<'all' | InquiryStatus>('all');
  const [search, setSearch] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [notesDraft, setNotesDraft] = useState('');
  const [statusDraft, setStatusDraft] = useState<InquiryStatus>('new');
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => {
    return inquiries.filter((inq) => {
      const matchesStatus = statusFilter === 'all' || inq.status === statusFilter;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        inq.name.toLowerCase().includes(q) ||
        inq.email.toLowerCase().includes(q) ||
        inq.interestedProject.toLowerCase().includes(q) ||
        inq.phone.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [inquiries, statusFilter, search]);

  const openDetail = (inq: Inquiry) => {
    setSelectedInquiry(inq);
    setNotesDraft(inq.adminNotes || '');
    setStatusDraft(inq.status);
  };

  const handleSaveDetail = async () => {
    if (!selectedInquiry) return;
    setSaving(true);
    try {
      await updateInquiryStatus(selectedInquiry.id, statusDraft, notesDraft);
      onNotify(`Updated inquiry from ${selectedInquiry.name}.`);
      setSelectedInquiry(null);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteInquiryById(id);
    if (selectedInquiry?.id === id) setSelectedInquiry(null);
    onNotify('Inquiry deleted.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-semibold text-[#101B2D]">
            Customer Inquiries
          </h2>
          <p className="text-sm text-slate-600 mt-0.5">
            Review leads submitted through contact and project inquiry forms.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, project..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 bg-white focus:outline-none focus:border-[#101B2D]"
          />
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="inline-flex flex-wrap items-center gap-1 p-1 bg-white border border-slate-200">
        {(['all', 'new', 'contacted', 'completed', 'archived'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setStatusFilter(tab)}
            className={`px-3.5 py-1.5 text-xs font-medium capitalize cursor-pointer ${
              statusFilter === tab
                ? 'bg-[#101B2D] text-white'
                : 'text-slate-600 hover:text-[#101B2D]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Table */}
        <div
          className={`${
            selectedInquiry ? 'lg:col-span-7' : 'lg:col-span-12'
          } bg-white border border-slate-200 overflow-x-auto`}
        >
          {filtered.length === 0 ? (
            <div className="p-10 text-center text-sm text-slate-500">
              No inquiries found for the selected filter.
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-[#F6F7F9] text-xs font-semibold uppercase tracking-wider text-slate-600">
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Project</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filtered.map((inq) => (
                  <tr
                    key={inq.id}
                    onClick={() => openDetail(inq)}
                    className={`cursor-pointer transition-colors ${
                      selectedInquiry?.id === inq.id ? 'bg-[#F6F7F9]' : 'hover:bg-slate-50/70'
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-[#101B2D]">{inq.name}</p>
                      <p className="text-xs text-slate-500 tabular-nums">{inq.phone}</p>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">{inq.interestedProject}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 text-xs font-medium capitalize border ${
                          inq.status === 'new'
                            ? 'bg-amber-50 border-amber-200 text-amber-800'
                            : inq.status === 'contacted'
                            ? 'bg-sky-50 border-sky-200 text-sky-800'
                            : inq.status === 'completed'
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                            : 'bg-slate-100 border-slate-200 text-slate-600'
                        }`}
                      >
                        {inq.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-xs text-slate-500 tabular-nums">
                      {formatFirestoreTimestamp(inq.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Detail Drawer */}
        {selectedInquiry && (
          <div className="lg:col-span-5 bg-white border border-slate-200 p-6 space-y-5">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h3 className="font-display text-xl font-semibold text-[#101B2D]">
                  {selectedInquiry.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Project: {selectedInquiry.interestedProject}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(selectedInquiry.id)}
                className="p-2 text-slate-400 hover:text-red-700 cursor-pointer"
                title="Delete Inquiry"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-sm">
              <p>
                <span className="text-slate-500">Phone:</span>{' '}
                <span className="font-medium tabular-nums text-[#101B2D]">
                  {selectedInquiry.phone}
                </span>
              </p>
              <p>
                <span className="text-slate-500">Email:</span>{' '}
                <a
                  href={`mailto:${selectedInquiry.email}`}
                  className="font-medium text-[#101B2D] underline"
                >
                  {selectedInquiry.email}
                </a>
              </p>
              <div className="pt-2">
                <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Message</p>
                <p className="p-3 bg-[#F6F7F9] border border-slate-200 text-sm text-[#252525] leading-relaxed">
                  {selectedInquiry.message}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <a
                href={buildWhatsAppUrl({
                  customerName: selectedInquiry.name,
                  projectName: selectedInquiry.interestedProject,
                  details: `Following up on your inquiry: ${selectedInquiry.message}`,
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 bg-[#1B6B46] text-white text-xs font-medium inline-flex items-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
              <a
                href={`mailto:${selectedInquiry.email}?subject=${encodeURIComponent(
                  `AL-Amaan Developers – ${selectedInquiry.interestedProject}`
                )}`}
                className="px-3.5 py-2 border border-slate-300 text-[#101B2D] text-xs font-medium inline-flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email Client</span>
              </a>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-200">
              <div>
                <label className="block text-xs font-semibold text-[#101B2D] mb-1.5">
                  Quick Status Actions
                </label>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {(['new', 'contacted', 'completed'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      disabled={saving}
                      onClick={async () => {
                        setSaving(true);
                        try {
                          setStatusDraft(st);
                          await updateInquiryStatus(selectedInquiry.id, st, notesDraft);
                          setSelectedInquiry({ ...selectedInquiry, status: st, adminNotes: notesDraft });
                          onNotify(`Marked ${selectedInquiry.name} as ${st}.`);
                        } finally {
                          setSaving(false);
                        }
                      }}
                      className={`py-1.5 px-2 text-xs font-medium capitalize border transition-colors cursor-pointer ${
                        statusDraft === st
                          ? 'bg-[#101B2D] border-[#101B2D] text-white'
                          : 'bg-white border-slate-300 text-[#101B2D] hover:bg-slate-50'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
                <select
                  value={statusDraft}
                  onChange={(e) => setStatusDraft(e.target.value as InquiryStatus)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 bg-white"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#101B2D] mb-1">
                  Internal Admin Notes
                </label>
                <textarea
                  rows={3}
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  placeholder="Record follow-up notes..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedInquiry(null)}
                  className="px-3.5 py-2 border border-slate-300 text-xs font-medium cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={handleSaveDetail}
                  className="px-4 py-2 bg-[#101B2D] text-white text-xs font-medium cursor-pointer"
                >
                  {saving ? 'Saving...' : 'Update Inquiry'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
