import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2, Plus, Trash2, Upload } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ARCHITECTURAL_ASSETS } from '../../data/defaultContent';
import {
  slugifyProjectName,
  uploadProjectImage,
  upsertProject,
} from '../../lib/firestoreService';
import { FaqItem, Project, PropertyCategoryItem } from '../../types/realestate';
import { SafeImage } from '../../components/SafeImage';
import { SEOHead } from '../../components/SEOHead';
import { useAdminNotify } from '../../components/admin/AdminLayout';

const EMPTY_PROJECT: Project = {
  id: '',
  name: '',
  slug: '',
  location: '',
  category: 'Residential & Commercial',
  status: 'Upcoming',
  shortDescription: '',
  fullDescription: '',
  coverImage: ARCHITECTURAL_ASSETS.alJalilCover,
  galleryImages: [ARCHITECTURAL_ASSETS.alJalilCover],
  amenities: ['Landscaped Parks', 'Wide Paved Boulevards'],
  plotSizes: ['5 Marla', '10 Marla'],
  propertyCategories: [
    {
      title: 'Residential Plots',
      subtitle: 'Family Neighborhoods',
      description: 'Well-planned residential plots for modern family living.',
    },
  ],
  developmentHighlights: ['Thoughtful master planning and accessible infrastructure.'],
  investmentInfo:
    'Contact our advisory desk for verified project details, availability, and consultation.',
  locationNote: 'Location details and nearby access landmarks.',
  mapEmbedUrl: '',
  faqs: [
    {
      question: 'How can I request verified project information?',
      answer: 'Submit an inquiry via the contact form or connect with us on WhatsApp.',
    },
  ],
  contactPhone: '',
  contactEmail: '',
  featured: false,
  published: true,
  displayOrder: 2,
};

export function AdminProjectFormPage({ mode }: { mode: 'add' | 'edit' }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { allAdminProjects, siteContent } = useApp();
  const { notify } = useAdminNotify();

  const existingProject =
    mode === 'edit' && id ? allAdminProjects.find((p) => p.id === id) : undefined;

  const [form, setForm] = useState<Project>(
    existingProject ? { ...existingProject } : { ...EMPTY_PROJECT }
  );
  const [slugTouched, setSlugTouched] = useState(mode === 'edit');
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  useEffect(() => {
    if (mode === 'edit' && existingProject) {
      setForm({ ...existingProject });
      setSlugTouched(true);
    }
  }, [mode, existingProject]);

  if (mode === 'edit' && allAdminProjects.length > 0 && !existingProject) {
    return (
      <div className="bg-white border border-slate-200 p-8 space-y-4">
        <h1 className="font-display text-2xl font-semibold text-[#101B2D]">
          Project Not Found
        </h1>
        <p className="text-sm text-slate-600">
          The requested project ID ({id}) was not found in Cloud Firestore.
        </p>
        <Link
          to="/admin/projects"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#101B2D] text-white text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects</span>
        </Link>
      </div>
    );
  }

  const handleNameChange = (name: string) => {
    setForm((prev) => ({
      ...prev,
      name,
      slug: slugTouched ? prev.slug : slugifyProjectName(name),
    }));
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    setError(null);
    try {
      const url = await uploadProjectImage(file, 'projects/covers');
      setForm((prev) => ({ ...prev, coverImage: url }));
    } catch (err) {
      setError(
        err instanceof Error
          ? `Cover upload failed (${err.message}). Verify Firebase Storage is enabled or paste an image URL.`
          : 'Cover upload failed.'
      );
    } finally {
      setUploadingCover(false);
    }
  };

  const handleMultipleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploadingGallery(true);
    setError(null);
    try {
      const uploadedUrls = await Promise.all(
        files.slice(0, 12).map((file) => uploadProjectImage(file, 'projects/gallery'))
      );
      setForm((prev) => ({
        ...prev,
        galleryImages: [...prev.galleryImages, ...uploadedUrls].slice(0, 12),
      }));
    } catch (err) {
      setError(
        err instanceof Error
          ? `Gallery upload failed (${err.message}). Verify Firebase Storage is enabled or add URLs manually.`
          : 'Gallery upload failed.'
      );
    } finally {
      setUploadingGallery(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.name.trim().length < 2) {
      setError('Project name must be at least 2 characters.');
      return;
    }
    const cleanSlug = slugifyProjectName(form.slug || form.name);
    if (cleanSlug.length < 2) {
      setError('Project slug must be at least 2 characters.');
      return;
    }
    if (form.shortDescription.trim().length < 10) {
      setError('Short description must be at least 10 characters.');
      return;
    }
    if (form.fullDescription.trim().length < 20) {
      setError('Full description must be at least 20 characters.');
      return;
    }
    if (!form.coverImage.trim()) {
      setError('Cover image URL or asset path is required.');
      return;
    }

    setSaving(true);
    try {
      const isNew = mode === 'add';
      const finalProject: Project = {
        ...form,
        id: isNew ? cleanSlug : form.id,
        slug: cleanSlug,
      };
      await upsertProject(finalProject, isNew);
      notify(
        isNew
          ? `Created project "${finalProject.name}" in Cloud Firestore.`
          : `Updated project "${finalProject.name}".`
      );
      navigate('/admin/projects');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save project.');
    } finally {
      setSaving(false);
    }
  };

  const updateCategoryItem = (
    idx: number,
    field: keyof PropertyCategoryItem,
    value: string
  ) => {
    setForm((prev) => {
      const next = [...prev.propertyCategories];
      next[idx] = { ...next[idx], [field]: value };
      return { ...prev, propertyCategories: next };
    });
  };

  const updateFaqItem = (idx: number, field: keyof FaqItem, value: string) => {
    setForm((prev) => {
      const next = [...prev.faqs];
      next[idx] = { ...next[idx], [field]: value };
      return { ...prev, faqs: next };
    });
  };

  return (
    <>
      <SEOHead
        title={`${mode === 'add' ? 'Add Project' : `Edit ${form.name}`} – ${siteContent.companyName} Admin`}
        description="Add or edit real estate projects in Cloud Firestore."
      />

      <div className="max-w-5xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Link
              to="/admin/projects"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-[#101B2D]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Projects</span>
            </Link>
            <h1 className="font-display text-3xl font-semibold text-[#101B2D]">
              {mode === 'add' ? 'Add New Project' : `Edit Project: ${form.name}`}
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 p-6 sm:p-8 space-y-7">
          {error && (
            <div role="alert" className="p-3.5 bg-red-50 border border-red-200 text-sm text-red-800">
              {error}
            </div>
          )}

          {/* Core Identity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#101B2D] mb-1">
                Project Name *
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. AL-AMAAN RESIDENCIA"
                className="w-full px-3 py-2 text-sm border border-slate-300 focus:outline-none focus:border-[#101B2D]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#101B2D] mb-1">
                URL Slug * (lowercase letters, numbers, hyphens)
              </label>
              <input
                type="text"
                required
                disabled={mode === 'edit'}
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setForm((prev) => ({ ...prev, slug: slugifyProjectName(e.target.value) }));
                }}
                placeholder="e.g. al-amaan-residencia"
                className="w-full px-3 py-2 text-sm font-mono border border-slate-300 disabled:bg-slate-100 focus:outline-none focus:border-[#101B2D]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#101B2D] mb-1">
                Project Location *
              </label>
              <input
                type="text"
                required
                value={form.location}
                onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
                placeholder="City / Corridor"
                className="w-full px-3 py-2 text-sm border border-slate-300 focus:outline-none focus:border-[#101B2D]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#101B2D] mb-1">Category *</label>
              <select
                value={form.category}
                onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-slate-300 focus:outline-none focus:border-[#101B2D]"
              >
                <option value="Residential & Commercial">Residential &amp; Commercial</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Mixed-Use">Mixed-Use</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#101B2D] mb-1">
                Project Status *
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-slate-300 focus:outline-none focus:border-[#101B2D]"
              >
                <option value="Featured Development">Featured Development</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Planning Phase">Planning Phase</option>
                <option value="Sold Out">Sold Out</option>
              </select>
            </div>
          </div>

          {/* Toggles & Display Order */}
          <div className="flex flex-wrap items-center gap-6 py-3 px-4 bg-[#F6F7F9] border border-slate-200">
            <label className="inline-flex items-center gap-2 text-sm font-medium text-[#101B2D] cursor-pointer">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm((prev) => ({ ...prev, published: e.target.checked }))}
                className="w-4 h-4 accent-[#101B2D]"
              />
              <span>Published (Visible on Public Website)</span>
            </label>

            <label className="inline-flex items-center gap-2 text-sm font-medium text-[#101B2D] cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm((prev) => ({ ...prev, featured: e.target.checked }))}
                className="w-4 h-4 accent-[#101B2D]"
              />
              <span>Mark as Featured</span>
            </label>

            <div className="flex items-center gap-2 sm:ml-auto">
              <label className="text-xs font-semibold text-slate-600">Display Order:</label>
              <input
                type="number"
                min={1}
                max={999}
                value={form.displayOrder}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, displayOrder: Number(e.target.value) || 1 }))
                }
                className="w-20 px-2.5 py-1 text-sm tabular-nums border border-slate-300 bg-white"
              />
            </div>
          </div>

          {/* Descriptions */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#101B2D] mb-1">
                Short Description * (max 360 chars)
              </label>
              <textarea
                rows={2}
                required
                maxLength={360}
                value={form.shortDescription}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, shortDescription: e.target.value }))
                }
                className="w-full px-3 py-2 text-sm border border-slate-300 focus:outline-none focus:border-[#101B2D]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#101B2D] mb-1">
                Full Project Description *
              </label>
              <textarea
                rows={5}
                required
                maxLength={6000}
                value={form.fullDescription}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, fullDescription: e.target.value }))
                }
                className="w-full px-3 py-2 text-sm border border-slate-300 focus:outline-none focus:border-[#101B2D]"
              />
            </div>
          </div>

          {/* Cover Image */}
          <div className="space-y-3 border-t border-slate-200 pt-5">
            <label className="block text-xs font-semibold text-[#101B2D]">
              Project Cover Image *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-3 aspect-[4/3] bg-[#101B2D] overflow-hidden border border-slate-200">
                <SafeImage src={form.coverImage} alt="Cover preview" />
              </div>
              <div className="md:col-span-9 space-y-2">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    required
                    value={form.coverImage}
                    onChange={(e) => setForm((prev) => ({ ...prev, coverImage: e.target.value }))}
                    className="flex-1 px-3 py-2 text-sm border border-slate-300"
                  />
                  <label className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-xs font-medium text-[#101B2D] inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap">
                    {uploadingCover ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    <span>Upload Cover Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  <span className="text-[11px] text-slate-500">Architectural Presets:</span>
                  {Object.entries(ARCHITECTURAL_ASSETS).map(([key, path]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, coverImage: path }))}
                      className="text-[11px] underline text-[#101B2D] hover:text-[#A98642] cursor-pointer"
                    >
                      {key}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Multiple Gallery Images */}
          <div className="space-y-3 border-t border-slate-200 pt-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-xs font-semibold text-[#101B2D]">
                Gallery Images ({form.galleryImages.length}/12)
              </label>
              <label className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-xs font-medium text-[#101B2D] inline-flex items-center gap-1.5 cursor-pointer">
                {uploadingGallery ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Upload className="w-3.5 h-3.5" />
                )}
                <span>Upload Multiple Gallery Images</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleMultipleGalleryUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newGalleryUrl}
                onChange={(e) => setNewGalleryUrl(e.target.value)}
                placeholder="Paste image URL and click Add..."
                className="flex-1 px-3 py-2 text-sm border border-slate-300"
              />
              <button
                type="button"
                onClick={() => {
                  if (newGalleryUrl.trim()) {
                    setForm((prev) => ({
                      ...prev,
                      galleryImages: [...prev.galleryImages, newGalleryUrl.trim()].slice(0, 12),
                    }));
                    setNewGalleryUrl('');
                  }
                }}
                className="px-4 py-2 bg-[#101B2D] text-white text-xs font-medium cursor-pointer"
              >
                Add URL
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {form.galleryImages.map((url, idx) => (
                <div key={idx} className="border border-slate-200 bg-[#F6F7F9] overflow-hidden">
                  <div className="aspect-[4/3] bg-[#101B2D]">
                    <SafeImage src={url} alt={`Gallery ${idx + 1}`} />
                  </div>
                  <div className="px-2 py-1.5 flex items-center justify-between gap-2 text-[11px]">
                    <span className="truncate font-mono text-slate-500">#{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          galleryImages: prev.galleryImages.filter((_, i) => i !== idx),
                        }))
                      }
                      className="text-red-700 hover:text-red-900 cursor-pointer"
                      aria-label="Remove gallery image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Plot Sizes, Amenities & Project Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-200 pt-5">
            <div>
              <label className="block text-xs font-semibold text-[#101B2D] mb-1">
                Plot Sizes (one per line)
              </label>
              <textarea
                rows={4}
                value={form.plotSizes.join('\n')}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    plotSizes: e.target.value.split('\n').map((s) => s.trim()),
                  }))
                }
                className="w-full px-3 py-2 text-sm border border-slate-300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#101B2D] mb-1">
                Amenities (one per line)
              </label>
              <textarea
                rows={4}
                value={form.amenities.join('\n')}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    amenities: e.target.value.split('\n').map((s) => s.trim()),
                  }))
                }
                className="w-full px-3 py-2 text-sm border border-slate-300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#101B2D] mb-1">
                Project Features / Highlights (one per line)
              </label>
              <textarea
                rows={4}
                value={form.developmentHighlights.join('\n')}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    developmentHighlights: e.target.value.split('\n').map((s) => s.trim()),
                  }))
                }
                className="w-full px-3 py-2 text-sm border border-slate-300"
              />
            </div>
          </div>

          {/* Property Categories */}
          <div className="space-y-3 border-t border-slate-200 pt-5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#101B2D]">
                Property Categories (Residential / Commercial)
              </label>
              <button
                type="button"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    propertyCategories: [
                      ...prev.propertyCategories,
                      { title: '', subtitle: '', description: '' },
                    ].slice(0, 8),
                  }))
                }
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#101B2D] hover:text-[#A98642] cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Category</span>
              </button>
            </div>

            {form.propertyCategories.map((cat, idx) => (
              <div
                key={idx}
                className="p-3 bg-[#F6F7F9] border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 items-start"
              >
                <input
                  type="text"
                  placeholder="Title"
                  value={cat.title}
                  onChange={(e) => updateCategoryItem(idx, 'title', e.target.value)}
                  className="px-2.5 py-1.5 text-xs border border-slate-300 bg-white"
                />
                <input
                  type="text"
                  placeholder="Subtitle"
                  value={cat.subtitle}
                  onChange={(e) => updateCategoryItem(idx, 'subtitle', e.target.value)}
                  className="px-2.5 py-1.5 text-xs border border-slate-300 bg-white"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Description"
                    value={cat.description}
                    onChange={(e) => updateCategoryItem(idx, 'description', e.target.value)}
                    className="flex-1 px-2.5 py-1.5 text-xs border border-slate-300 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        propertyCategories: prev.propertyCategories.filter((_, i) => i !== idx),
                      }))
                    }
                    className="text-red-700 p-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Investment Info & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-200 pt-5">
            <div>
              <label className="block text-xs font-semibold text-[#101B2D] mb-1">
                Investment Information
              </label>
              <textarea
                rows={3}
                value={form.investmentInfo}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, investmentInfo: e.target.value }))
                }
                className="w-full px-3 py-2 text-sm border border-slate-300"
              />
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#101B2D] mb-1">
                  Location Accessibility Note
                </label>
                <input
                  type="text"
                  value={form.locationNote}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, locationNote: e.target.value }))
                  }
                  className="w-full px-3 py-2 text-sm border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#101B2D] mb-1">
                  Google Maps Embed URL (optional)
                </label>
                <input
                  type="url"
                  value={form.mapEmbedUrl}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, mapEmbedUrl: e.target.value }))
                  }
                  placeholder="https://www.google.com/maps/embed?..."
                  className="w-full px-3 py-2 text-sm border border-slate-300"
                />
              </div>
            </div>
          </div>

          {/* FAQs */}
          <div className="space-y-3 border-t border-slate-200 pt-5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#101B2D]">
                Frequently Asked Questions
              </label>
              <button
                type="button"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    faqs: [...prev.faqs, { question: '', answer: '' }].slice(0, 12),
                  }))
                }
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#101B2D] hover:text-[#A98642] cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add FAQ</span>
              </button>
            </div>

            {form.faqs.map((faq, idx) => (
              <div key={idx} className="p-3 bg-[#F6F7F9] border border-slate-200 space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Question"
                    value={faq.question}
                    onChange={(e) => updateFaqItem(idx, 'question', e.target.value)}
                    className="flex-1 px-2.5 py-1.5 text-xs border border-slate-300 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        faqs: prev.faqs.filter((_, i) => i !== idx),
                      }))
                    }
                    className="text-red-700 p-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <textarea
                  rows={2}
                  placeholder="Answer"
                  value={faq.answer}
                  onChange={(e) => updateFaqItem(idx, 'answer', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 bg-white"
                />
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <Link
              to="/admin/projects"
              className="px-4 py-2.5 border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-[#101B2D] hover:bg-[#1A2A44] disabled:opacity-60 text-white text-sm font-medium inline-flex items-center gap-2 cursor-pointer"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>
                {saving
                  ? 'Saving Project...'
                  : mode === 'add'
                  ? 'Publish / Save Project'
                  : 'Save Project Changes'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
