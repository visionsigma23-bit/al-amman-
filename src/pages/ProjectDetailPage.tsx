import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronDown,
  MapPin,
  MessageCircle,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { InquiryForm } from '../components/InquiryForm';
import { SafeImage } from '../components/SafeImage';
import { SEOHead } from '../components/SEOHead';

interface ProjectDetailPageProps {
  forcedSlug?: string;
}

export function ProjectDetailPage({ forcedSlug }: ProjectDetailPageProps) {
  const { slug: routeSlug } = useParams<{ slug: string }>();
  const targetSlug = forcedSlug || routeSlug || 'al-jalil-garden';

  const { projects, siteContent, buildWhatsAppUrl } = useApp();
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const project = useMemo(
    () => projects.find((p) => p.slug === targetSlug),
    [projects, targetSlug]
  );

  if (!project) {
    return (
      <>
        <SEOHead
          title={`Project Not Found – ${siteContent.companyName}`}
          description="The requested real estate project could not be located."
        />
        <section className="py-28 bg-[#F6F7F9]">
          <div className="max-w-xl mx-auto px-4 text-center space-y-5 bg-white border border-slate-200 p-10">
            <h1 className="font-display text-3xl font-semibold text-[#101B2D]">
              Project Not Found
            </h1>
            <p className="text-sm text-slate-600">
              This project may have been moved or is currently unpublished. Browse our published
              developments below.
            </p>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#101B2D] text-white text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>View All Projects</span>
            </Link>
          </div>
        </section>
      </>
    );
  }

  const narrativeParagraphs = project.fullDescription
    .split('\n\n')
    .filter((p) => p.trim().length > 0);

  const whatsappUrl = buildWhatsAppUrl({
    projectName: project.name,
    details: `I am interested in ${project.name} (${project.category}). Please share verified details and plot availability.`,
  });

  const gallery =
    project.galleryImages && project.galleryImages.length > 0
      ? project.galleryImages
      : [project.coverImage];

  return (
    <>
      <SEOHead
        title={`${project.name} – ${siteContent.companyName}`}
        description={project.shortDescription}
      />

      {/* 1. Large Project Hero Banner */}
      <section className="relative bg-[#101B2D] text-white overflow-hidden">
        <div className="absolute inset-0">
          <SafeImage
            src={project.coverImage}
            alt={project.name}
            eager
            fallbackTitle={project.name}
            className="w-full h-full object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#101B2D] via-[#101B2D]/75 to-[#101B2D]/40"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Back to All Projects</span>
          </Link>

          <div className="max-w-3xl space-y-5">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-300">
              <span className="text-[#C5A15B] font-semibold">{project.status}</span>
              <span aria-hidden="true">·</span>
              <span>{project.category}</span>
              <span aria-hidden="true">·</span>
              <span>{project.location}</span>
            </div>

            <h1 className="font-display text-balance text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight">
              {project.name}
            </h1>

            <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl">
              {project.shortDescription}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="#project-inquiry"
                className="px-6 py-3.5 bg-[#C5A15B] hover:bg-[#b59049] text-[#101B2D] text-sm font-semibold transition-colors whitespace-nowrap"
              >
                Request Project Information
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 border border-white/40 hover:border-white text-white text-sm font-medium inline-flex items-center gap-2 transition-colors whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4 text-[#C5A15B]" aria-hidden="true" />
                <span>WhatsApp Project Desk</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Project Introduction & Key Specs */}
      <section className="py-16 lg:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 space-y-5">
            <p className="text-xs font-semibold tracking-[0.16em] uppercase text-[#A98642]">
              Project Overview
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#101B2D]">
              Introducing {project.name}
            </h2>
            <div className="space-y-4 text-base text-slate-600 leading-relaxed">
              {narrativeParagraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-[#F6F7F9] border border-slate-200 p-7 sm:p-8 space-y-6">
              <h3 className="font-display text-2xl font-semibold text-[#101B2D]">
                Project Summary
              </h3>
              <dl className="divide-y divide-slate-200 text-sm">
                <div className="py-3 flex justify-between gap-4">
                  <dt className="text-slate-500">Developer</dt>
                  <dd className="font-semibold text-[#101B2D] text-right">
                    {siteContent.companyName}
                  </dd>
                </div>
                <div className="py-3 flex justify-between gap-4">
                  <dt className="text-slate-500">Category</dt>
                  <dd className="font-semibold text-[#101B2D] text-right">{project.category}</dd>
                </div>
                <div className="py-3 flex justify-between gap-4">
                  <dt className="text-slate-500">Status</dt>
                  <dd className="font-semibold text-[#A98642] text-right">{project.status}</dd>
                </div>
                <div className="py-3 flex justify-between gap-4">
                  <dt className="text-slate-500">Location</dt>
                  <dd className="font-medium text-[#101B2D] text-right">{project.location}</dd>
                </div>
                {project.contactPhone && (
                  <div className="py-3 flex justify-between gap-4">
                    <dt className="text-slate-500">Advisory Line</dt>
                    <dd className="font-medium text-[#101B2D] tabular-nums text-right">
                      {project.contactPhone}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Residential & Commercial Property Categories + Plot Sizes */}
      <section className="py-16 lg:py-24 bg-[#F6F7F9] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          {project.propertyCategories && project.propertyCategories.length > 0 && (
            <div className="space-y-8">
              <div className="max-w-2xl space-y-2">
                <p className="text-xs font-semibold tracking-[0.16em] uppercase text-[#A98642]">
                  Property Categories
                </p>
                <h2 className="font-display text-3xl font-semibold text-[#101B2D]">
                  Residential &amp; Commercial Offerings
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {project.propertyCategories.map((cat, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-slate-200 p-7 sm:p-8 space-y-3"
                  >
                    <p className="text-xs font-semibold tracking-wider uppercase text-[#A98642]">
                      {cat.subtitle}
                    </p>
                    <h3 className="font-display text-2xl font-semibold text-[#101B2D]">
                      {cat.title}
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Available Plot Sizes */}
          {project.plotSizes && project.plotSizes.length > 0 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-xs font-semibold tracking-[0.16em] uppercase text-[#A98642]">
                  Plot Inventory Framework
                </p>
                <h2 className="font-display text-3xl font-semibold text-[#101B2D]">
                  Available Plot Sizes
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {project.plotSizes.map((size, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-slate-200 px-5 py-4 flex items-center justify-between"
                  >
                    <span className="font-medium text-[#101B2D] text-sm sm:text-base">
                      {size}
                    </span>
                    <span className="font-mono text-xs text-slate-400 tabular-nums">
                      0{idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 4. Project Features, Amenities & Development Highlights */}
      <section className="py-16 lg:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Amenities */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold tracking-[0.16em] uppercase text-[#A98642]">
                Master Plan Features
              </p>
              <h2 className="font-display text-3xl font-semibold text-[#101B2D]">
                Features &amp; Amenities
              </h2>
            </div>

            <ul className="divide-y divide-slate-200 border-t border-b border-slate-200">
              {project.amenities.map((amenity, idx) => (
                <li
                  key={idx}
                  className="py-3.5 flex items-center justify-between gap-4 text-sm sm:text-base text-[#252525]"
                >
                  <span>{amenity}</span>
                  <span className="font-mono text-xs text-[#A98642] tabular-nums">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Development Highlights & Investment Info */}
          <div className="lg:col-span-6 space-y-10">
            {project.developmentHighlights && project.developmentHighlights.length > 0 && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <p className="text-xs font-semibold tracking-[0.16em] uppercase text-[#A98642]">
                    Planning Standards
                  </p>
                  <h2 className="font-display text-3xl font-semibold text-[#101B2D]">
                    Development Highlights
                  </h2>
                </div>
                <ul className="space-y-3 text-sm sm:text-base text-slate-600 leading-relaxed">
                  {project.developmentHighlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="font-mono text-xs text-[#A98642] mt-1 tabular-nums">
                        {String(idx + 1).padStart(2, '0')}.
                      </span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {project.investmentInfo && (
              <div className="bg-[#101B2D] text-white p-7 sm:p-8 space-y-3">
                <p className="text-xs font-semibold tracking-[0.16em] uppercase text-[#C5A15B]">
                  Investment Information
                </p>
                <h3 className="font-display text-2xl font-semibold">
                  Advisory &amp; Verification Notice
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {project.investmentInfo}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. Project Gallery */}
      <section className="py-16 lg:py-24 bg-[#F6F7F9] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold tracking-[0.16em] uppercase text-[#A98642]">
                Architectural Showcase
              </p>
              <h2 className="font-display text-3xl font-semibold text-[#101B2D]">
                Project Gallery
              </h2>
            </div>
            <p className="text-xs text-slate-500">Click any image to inspect full view</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {gallery.map((imgUrl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setLightboxImage(imgUrl)}
                className="group aspect-[4/3] bg-[#101B2D] overflow-hidden border border-slate-200 text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-[#C5A15B]"
              >
                <SafeImage
                  src={imgUrl}
                  alt={`${project.name} visual ${idx + 1}`}
                  fallbackTitle={`${project.name} (${idx + 1})`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Location Section with Map Placeholder */}
      <section className="py-16 lg:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <p className="text-xs font-semibold tracking-[0.16em] uppercase text-[#A98642]">
                Connectivity &amp; Site Access
              </p>
              <h2 className="font-display text-3xl font-semibold text-[#101B2D]">
                Project Location
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {project.locationNote || project.location}
              </p>
            </div>
          </div>

          {project.mapEmbedUrl && project.mapEmbedUrl.startsWith('http') ? (
            <div className="aspect-[16/7] w-full border border-slate-200 overflow-hidden bg-slate-100">
              <iframe
                title={`${project.name} Location Map`}
                src={project.mapEmbedUrl}
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          ) : (
            <div className="h-72 bg-[#F6F7F9] border border-dashed border-slate-300 flex flex-col items-center justify-center p-6 text-center space-y-2">
              <MapPin className="w-8 h-8 text-[#101B2D]/60" strokeWidth={1.5} aria-hidden="true" />
              <p className="font-display text-xl font-semibold text-[#101B2D]">
                Site Map Placeholder — {project.name}
              </p>
              <p className="text-sm text-slate-600 max-w-lg">
                {project.location}. Verified Google Maps embed link or coordinates can be added
                anytime in the Admin Dashboard.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 7. Frequently Asked Questions */}
      {project.faqs && project.faqs.length > 0 && (
        <section className="py-16 lg:py-24 bg-[#F6F7F9] border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="space-y-2">
              <p className="text-xs font-semibold tracking-[0.16em] uppercase text-[#A98642]">
                Frequently Asked Questions
              </p>
              <h2 className="font-display text-3xl font-semibold text-[#101B2D]">
                Common Buyer &amp; Investor Questions
              </h2>
            </div>

            <div className="bg-white border border-slate-200 divide-y divide-slate-200">
              {project.faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div key={idx}>
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      aria-expanded={isOpen}
                      className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors cursor-pointer"
                    >
                      <span className="font-medium text-base text-[#101B2D]">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-150 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-5 text-sm text-slate-600 leading-relaxed">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 8. Project Inquiry Form */}
      <section id="project-inquiry" className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 space-y-5">
            <p className="text-xs font-semibold tracking-[0.16em] uppercase text-[#A98642]">
              Project Inquiry Desk
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#101B2D]">
              Inquire About {project.name}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Submit your contact details to request verified project documentation, current unit
              availability, or a scheduled site visit with {siteContent.companyName}.
            </p>

            <div className="pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#1B6B46] hover:bg-[#155738] text-white text-sm font-medium transition-colors"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                <span>Inquire on WhatsApp</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-7">
            <InquiryForm
              defaultProject={project.name}
              sourcePage={`/projects/${project.slug}`}
            />
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Gallery image preview"
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4"
        >
          <button
            type="button"
            onClick={() => setLightboxImage(null)}
            aria-label="Close image preview"
            className="absolute top-5 right-5 w-10 h-10 bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-5xl w-full max-h-[85vh] overflow-hidden bg-[#101B2D]"
          >
            <SafeImage
              src={lightboxImage}
              alt={`${project.name} preview`}
              className="w-full h-full max-h-[85vh] object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
