import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ARCHITECTURAL_ASSETS } from '../data/defaultContent';
import { SafeImage } from '../components/SafeImage';
import { SEOHead } from '../components/SEOHead';

const AUDIENCE_SEGMENTS = [
  {
    number: '01',
    title: 'Residential Plot Buyers',
    description:
      'Guidance for individuals and families planning future custom residences with clear plot options and neighborhood context.',
  },
  {
    number: '02',
    title: 'Overseas Pakistanis',
    description:
      'Dedicated digital advisory, transparent documentation walkthroughs, and dependable communication across time zones.',
  },
  {
    number: '03',
    title: 'Families Seeking Community',
    description:
      'Master-planned environments prioritizing landscaped parks, wider roads, and everyday neighborhood conveniences.',
  },
  {
    number: '04',
    title: 'Real Estate Investors',
    description:
      'Structured insights into residential and commercial corridors designed around measured, long-term value.',
  },
];

export function AboutPage() {
  const { siteContent } = useApp();
  const paragraphs = (siteContent.aboutFullStory || siteContent.aboutPreviewBody)
    .split('\n\n')
    .filter((p) => p.trim().length > 0);

  return (
    <>
      <SEOHead
        title={`About Us – ${siteContent.companyName}`}
        description={`Learn about ${siteContent.companyName}, our development philosophy, and our commitment to trust and transparency across Pakistan.`}
      />

      {/* Editorial Header */}
      <section className="bg-[#101B2D] text-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-5">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#C5A15B]">
              About {siteContent.companyName}
            </p>
            <h1 className="font-display text-balance text-4xl sm:text-5xl font-semibold leading-tight">
              {siteContent.tagline}
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              {siteContent.aboutPreviewBody}
            </p>
          </div>
        </div>
      </section>

      {/* Corporate Story Split */}
      <section className="py-20 lg:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          <div className="lg:col-span-6 space-y-6">
            <p className="text-xs font-semibold tracking-[0.16em] uppercase text-[#A98642]">
              Our Mandate
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#101B2D]">
              {siteContent.aboutPreviewTitle}
            </h2>
            <div className="space-y-4 text-base text-slate-600 leading-relaxed">
              {paragraphs.map((para, index) => (
                <p key={index}>{para}</p>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 min-h-[320px] lg:min-h-[440px] bg-[#101B2D] overflow-hidden">
            <SafeImage
              src={ARCHITECTURAL_ASSETS.aboutGallery}
              alt="AL-Amaan Developers architectural showcase pavilion"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="py-20 lg:py-24 bg-[#F6F7F9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-semibold tracking-[0.16em] uppercase text-[#A98642]">
              Client Focus
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#101B2D]">
              Tailored Advisory for Every Property Goal
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {AUDIENCE_SEGMENTS.map((seg) => (
              <div
                key={seg.number}
                className="bg-white border border-slate-200 p-7 sm:p-8 space-y-3"
              >
                <span className="font-mono text-xs font-medium text-[#A98642] tabular-nums">
                  {seg.number}.
                </span>
                <h3 className="font-display text-2xl font-semibold text-[#101B2D]">
                  {seg.title}
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {seg.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="bg-[#101B2D] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {siteContent.stats.map((stat, idx) => (
            <div key={idx} className="space-y-1.5">
              <p className="font-display text-3xl font-semibold text-[#C5A15B] tabular-nums">
                {stat.value}
              </p>
              <p className="text-sm font-semibold">{stat.label}</p>
              <p className="text-xs text-slate-400">{stat.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 bg-white text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-6">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#101B2D]">
            Explore Our Current &amp; Upcoming Developments
          </h2>
          <p className="text-base text-slate-600">
            Review AL-Jalil Garden and connect with our team for verified details.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              to="/projects/al-jalil-garden"
              className="px-6 py-3 bg-[#101B2D] hover:bg-[#1A2A44] text-white text-sm font-medium inline-flex items-center gap-2 transition-colors"
            >
              <span>Explore AL-JALIL GARDEN</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3 border border-slate-300 hover:border-[#101B2D] text-[#101B2D] text-sm font-medium transition-colors"
            >
              Contact Advisory Desk
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
