import React, { useEffect, useState } from 'react';
import { Loader2, Save, Upload } from 'lucide-react';
import { saveSiteContent, uploadProjectImage } from '../../lib/firestoreService';
import { SiteContent } from '../../types/realestate';

interface SiteContentEditorProps {
  siteContent: SiteContent;
  onNotify: (msg: string) => void;
}

export function SiteContentEditor({ siteContent, onNotify }: SiteContentEditorProps) {
  const [form, setForm] = useState<SiteContent>({ ...siteContent });
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    setForm({ ...siteContent });
  }, [siteContent]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    setUploadError(null);
    try {
      const url = await uploadProjectImage(file, 'branding');
      setForm((prev) => ({ ...prev, companyLogoUrl: url }));
      onNotify('Company logo uploaded. Click Save Website Content to publish.');
    } catch (err) {
      setUploadError(
        err instanceof Error
          ? `Logo upload failed (${err.message}). You can paste a logo URL instead.`
          : 'Logo upload failed.'
      );
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveSiteContent(form);
      onNotify('Website content and company settings updated in Cloud Firestore.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-semibold text-[#101B2D]">
            Website Content &amp; Company Settings
          </h2>
          <p className="text-sm text-slate-600 mt-0.5">
            Update brand copy, configurable WhatsApp contact number, editable statistics, and sample
            testimonials.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 bg-[#101B2D] hover:bg-[#1A2A44] disabled:opacity-60 text-white text-sm font-medium inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Saving Settings...' : 'Save Website Content'}</span>
        </button>
      </div>

      {/* Section 1: WhatsApp & Contact Settings */}
      <div className="bg-white border border-slate-200 p-6 space-y-5">
        <h3 className="font-display text-xl font-semibold text-[#101B2D]">
          Company Contact &amp; WhatsApp Configuration
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#101B2D] mb-1">
              WhatsApp Business Number (Digits with Country Code) *
            </label>
            <input
              type="text"
              required
              value={form.whatsappNumber}
              onChange={(e) => setForm((prev) => ({ ...prev, whatsappNumber: e.target.value }))}
              placeholder="e.g. 923001234567"
              className="w-full px-3 py-2 text-sm font-mono border border-slate-300 focus:outline-none focus:border-[#101B2D]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#101B2D] mb-1">
              Display Office Phone
            </label>
            <input
              type="text"
              value={form.contactPhone}
              onChange={(e) => setForm((prev) => ({ ...prev, contactPhone: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-slate-300 focus:outline-none focus:border-[#101B2D]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#101B2D] mb-1">
              Corporate Email
            </label>
            <input
              type="email"
              value={form.contactEmail}
              onChange={(e) => setForm((prev) => ({ ...prev, contactEmail: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-slate-300 focus:outline-none focus:border-[#101B2D]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#101B2D] mb-1">
              Office Hours
            </label>
            <input
              type="text"
              value={form.officeHours}
              onChange={(e) => setForm((prev) => ({ ...prev, officeHours: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-slate-300 focus:outline-none focus:border-[#101B2D]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#101B2D] mb-1">
            Corporate Office Address
          </label>
          <input
            type="text"
            value={form.officeAddress}
            onChange={(e) => setForm((prev) => ({ ...prev, officeAddress: e.target.value }))}
            className="w-full px-3 py-2 text-sm border border-slate-300 focus:outline-none focus:border-[#101B2D]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(['facebook', 'instagram', 'linkedin', 'youtube'] as const).map((net) => (
            <div key={net}>
              <label className="block text-xs font-semibold text-[#101B2D] capitalize mb-1">
                {net} URL
              </label>
              <input
                type="url"
                value={form.socialLinks?.[net] || ''}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    socialLinks: { ...prev.socialLinks, [net]: e.target.value },
                  }))
                }
                className="w-full px-3 py-2 text-sm border border-slate-300"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Hero & About Copy */}
      <div className="bg-white border border-slate-200 p-6 space-y-5">
        <h3 className="font-display text-xl font-semibold text-[#101B2D]">
          Brand Messaging &amp; Editorial Copy
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#101B2D] mb-1">
              Company Name
            </label>
            <input
              type="text"
              value={form.companyName}
              onChange={(e) => setForm((prev) => ({ ...prev, companyName: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-slate-300"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#101B2D] mb-1">Tagline</label>
            <input
              type="text"
              value={form.tagline}
              onChange={(e) => setForm((prev) => ({ ...prev, tagline: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-slate-300"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold text-[#101B2D]">
            Company Logo URL (optional — leaves built-in architectural mark if blank)
          </label>
          {uploadError && (
            <p className="text-xs text-red-700">{uploadError}</p>
          )}
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={form.companyLogoUrl || ''}
              onChange={(e) => setForm((prev) => ({ ...prev, companyLogoUrl: e.target.value }))}
              placeholder="https://... or upload logo image"
              className="flex-1 px-3 py-2 text-sm border border-slate-300"
            />
            <label className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-xs font-medium text-[#101B2D] inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap">
              {uploadingLogo ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              <span>Upload Logo</span>
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            </label>
            {form.companyLogoUrl && (
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, companyLogoUrl: '' }))}
                className="px-3 py-2 border border-slate-300 text-xs text-slate-600 hover:text-red-700 cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#101B2D] mb-1">Hero Headline</label>
          <input
            type="text"
            value={form.heroHeadline}
            onChange={(e) => setForm((prev) => ({ ...prev, heroHeadline: e.target.value }))}
            className="w-full px-3 py-2 text-sm border border-slate-300"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#101B2D] mb-1">Hero Subtitle</label>
          <textarea
            rows={2}
            value={form.heroSubtitle}
            onChange={(e) => setForm((prev) => ({ ...prev, heroSubtitle: e.target.value }))}
            className="w-full px-3 py-2 text-sm border border-slate-300"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#101B2D] mb-1">
            About Preview Heading
          </label>
          <input
            type="text"
            value={form.aboutPreviewTitle}
            onChange={(e) => setForm((prev) => ({ ...prev, aboutPreviewTitle: e.target.value }))}
            className="w-full px-3 py-2 text-sm border border-slate-300"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#101B2D] mb-1">
            About Preview Body
          </label>
          <textarea
            rows={3}
            value={form.aboutPreviewBody}
            onChange={(e) => setForm((prev) => ({ ...prev, aboutPreviewBody: e.target.value }))}
            className="w-full px-3 py-2 text-sm border border-slate-300"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#101B2D] mb-1">
            About Page Full Story
          </label>
          <textarea
            rows={5}
            value={form.aboutFullStory}
            onChange={(e) => setForm((prev) => ({ ...prev, aboutFullStory: e.target.value }))}
            className="w-full px-3 py-2 text-sm border border-slate-300"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#101B2D] mb-1">
              Call To Action Headline
            </label>
            <input
              type="text"
              value={form.ctaHeadline}
              onChange={(e) => setForm((prev) => ({ ...prev, ctaHeadline: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-slate-300"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#101B2D] mb-1">
              Call To Action Subtext
            </label>
            <input
              type="text"
              value={form.ctaSubtext}
              onChange={(e) => setForm((prev) => ({ ...prev, ctaSubtext: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-slate-300"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Editable Statistics */}
      <div className="bg-white border border-slate-200 p-6 space-y-4">
        <h3 className="font-display text-xl font-semibold text-[#101B2D]">
          Editable Portfolio Statistics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {form.stats.map((stat, idx) => (
            <div key={idx} className="p-4 bg-[#F6F7F9] border border-slate-200 space-y-2">
              <input
                type="text"
                placeholder="Label"
                value={stat.label}
                onChange={(e) => {
                  const next = [...form.stats];
                  next[idx] = { ...next[idx], label: e.target.value };
                  setForm((prev) => ({ ...prev, stats: next }));
                }}
                className="w-full px-2.5 py-1.5 text-sm border border-slate-300 bg-white"
              />
              <input
                type="text"
                placeholder="Value"
                value={stat.value}
                onChange={(e) => {
                  const next = [...form.stats];
                  next[idx] = { ...next[idx], value: e.target.value };
                  setForm((prev) => ({ ...prev, stats: next }));
                }}
                className="w-full px-2.5 py-1.5 text-sm font-mono border border-slate-300 bg-white"
              />
              <input
                type="text"
                placeholder="Note"
                value={stat.note}
                onChange={(e) => {
                  const next = [...form.stats];
                  next[idx] = { ...next[idx], note: e.target.value };
                  setForm((prev) => ({ ...prev, stats: next }));
                }}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 bg-white"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Section 4: Editable Sample Testimonials */}
      <div className="bg-white border border-slate-200 p-6 space-y-4">
        <h3 className="font-display text-xl font-semibold text-[#101B2D]">
          Editable Sample Testimonials
        </h3>
        <div className="space-y-4">
          {form.testimonials.map((t, idx) => (
            <div key={idx} className="p-4 bg-[#F6F7F9] border border-slate-200 space-y-2.5">
              <textarea
                rows={2}
                placeholder="Quote"
                value={t.quote}
                onChange={(e) => {
                  const next = [...form.testimonials];
                  next[idx] = { ...next[idx], quote: e.target.value };
                  setForm((prev) => ({ ...prev, testimonials: next }));
                }}
                className="w-full px-2.5 py-1.5 text-sm border border-slate-300 bg-white"
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Author"
                  value={t.author}
                  onChange={(e) => {
                    const next = [...form.testimonials];
                    next[idx] = { ...next[idx], author: e.target.value };
                    setForm((prev) => ({ ...prev, testimonials: next }));
                  }}
                  className="px-2.5 py-1.5 text-xs border border-slate-300 bg-white"
                />
                <input
                  type="text"
                  placeholder="Role"
                  value={t.role}
                  onChange={(e) => {
                    const next = [...form.testimonials];
                    next[idx] = { ...next[idx], role: e.target.value };
                    setForm((prev) => ({ ...prev, testimonials: next }));
                  }}
                  className="px-2.5 py-1.5 text-xs border border-slate-300 bg-white"
                />
                <input
                  type="text"
                  placeholder="Project"
                  value={t.project}
                  onChange={(e) => {
                    const next = [...form.testimonials];
                    next[idx] = { ...next[idx], project: e.target.value };
                    setForm((prev) => ({ ...prev, testimonials: next }));
                  }}
                  className="px-2.5 py-1.5 text-xs border border-slate-300 bg-white"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}
