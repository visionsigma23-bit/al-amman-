import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ARCHITECTURAL_ASSETS } from '../data/defaultContent';
import { ProjectCard } from '../components/ProjectCard';
import { SafeImage } from '../components/SafeImage';
import { SEOHead } from '../components/SEOHead';

const WHY_CHOOSE_PILLARS = [
  {
    number: '01',
    title: 'Trust and Transparency',
    description:
      'Every consultation begins with straightforward facts, clear documentation walkthroughs, and honest communication—never exaggerated claims.',
  },
  {
    number: '02',
    title: 'Customer-Centric Approach',
    description:
      'Dedicated advisory tailored for local families and overseas Pakistanis, ensuring responsive guidance from initial inquiry through handover.',
  },
  {
    number: '03',
    title: 'Quality Development',
    description:
      'Master-planned streetscapes, durable infrastructure planning, and green community zones built for enduring residential livability.',
  },
  {
    number: '04',
    title: 'Investment Opportunities',
    description:
      'Strategically positioned residential plots and commercial corridors evaluated for balanced capital preservation and sustainable growth.',
  },
  {
    number: '05',
    title: 'Professional Guidance',
    description:
      'Structured support with site visits, plot category comparisons, and transparent step-by-step purchase procedures.',
  },
];

export function HomePage() {
  const { projects, siteContent, buildWhatsAppUrl } = useApp();

  const featuredProjects = projects.filter((p) => p.featured);
  const displayProjects = featuredProjects.length > 0 ? featuredProjects : projects.slice(0, 3);
  const marqueeProject = displayProjects[0];

  const whatsappGeneralUrl = buildWhatsAppUrl({
    projectName: marqueeProject?.name || 'AL-JALIL GARDEN',
    details: 'I would like to schedule an investment consultation with AL-Amaan Developers.',
  });

  return (
    <>
      <SEOHead
        title={`${siteContent.companyName} – ${siteContent.tagline}`}
        description="AL-Amaan Developers delivers trustworthy residential and commercial real estate developments in Pakistan, featuring AL-Jalil Garden for families and investors."
      />

      {/* 1. Hero Section */}
      <section className="relative bg-[#101B2D] text-white overflow-hidden">
        <div className="absolute inset-0">
          <SafeImage
            src={ARCHITECTURAL_ASSETS.hero}
            alt="AL-Amaan Developers contemporary master-planned residential and commercial boulevard at twilight"
            eager
            className="w-full h-full object-cover object-center"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-[#101B2D]/88 via-[#101B2D]/78 to-[#101B2D]/90 lg:bg-gradient-to-r lg:from-[#101B2D]/95 lg:via-[#101B2D]/78 lg:to-[#101B2D]/35"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-28 lg:py-36">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl space-y-5 sm:space-y-6"
          >
            <p className="text-xs font-semibold tracking-[0.16em] uppercase text-[#C5A15B]">
              {siteContent.companyName} · Pakistan Real Estate Development
            </p>

            <h1 className="font-display text-balance text-[clamp(2.15rem,4.5vw,4.15rem)] font-semibold leading-[1.08] tracking-tight text-white">
              {siteContent.heroHeadline}
            </h1>

            <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-xl">
              {siteContent.heroSubtitle}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4">
              <Link
                to="/projects"
                className="px-6 py-3.5 bg-[#C5A15B] hover:bg-[#b59049] text-[#101B2D] text-sm font-semibold tracking-wide inline-flex items-center justify-center gap-2 transition-colors duration-150 whitespace-nowrap"
              >
                <span>Explore Our Projects</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>

              <Link
                to="/contact"
                className="px-6 py-3.5 border border-white/40 hover:border-white text-white text-sm font-medium tracking-wide inline-flex items-center justify-center transition-colors duration-150 whitespace-nowrap"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. About Preview */}
      <section className="py-20 lg:py-28 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-stretch">
            <div className="lg:col-span-6 min-h-[300px] lg:min-h-[420px] bg-[#101B2D] overflow-hidden">
              <SafeImage
                src={ARCHITECTURAL_ASSETS.aboutGallery}
                alt="AL-Amaan Developers corporate architectural pavilion"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="lg:col-span-6 flex flex-col justify-center space-y-6 py-2">
              <p className="text-xs font-semibold tracking-[0.16em] uppercase text-[#A98642]">
                About {siteContent.companyName}
              </p>

              <h2 className="font-display text-balance text-3xl sm:text-4xl font-semibold text-[#101B2D] leading-tight">
                {siteContent.aboutPreviewTitle}
              </h2>

              <p className="text-base text-slate-600 leading-relaxed">
                {siteContent.aboutPreviewBody}
              </p>

              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-200">
                <div>
                  <p className="text-sm font-semibold text-[#101B2D]">For Families & Residents</p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Thoughtful neighborhood layouts with parks, security planning, and essential access.
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#101B2D]">For Overseas Investors</p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Clear remote consultations, verifiable documentation, and direct WhatsApp guidance.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#101B2D] hover:text-[#A98642] transition-colors"
                >
                  <span>Read Our Corporate Story</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Projects */}
      <section className="py-20 lg:py-28 bg-[#F6F7F9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <p className="text-xs font-semibold tracking-[0.16em] uppercase text-[#A98642]">
                Featured Developments
              </p>
              <h2 className="font-display text-balance text-3xl sm:text-4xl font-semibold text-[#101B2D]">
                Flagship Real Estate Opportunities
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                Explore our featured master-planned community alongside a scalable portfolio built
                for future residential and commercial landmarks.
              </p>
            </div>

            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#101B2D] hover:text-[#A98642] transition-colors whitespace-nowrap shrink-0"
            >
              <span>View All Projects</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          {displayProjects.length === 1 && marqueeProject ? (
            /* Editorial Split Feature for Flagship Project */
            <div className="bg-white border border-slate-200 grid grid-cols-1 lg:grid-cols-12 items-stretch overflow-hidden">
              <Link
                to={`/projects/${marqueeProject.slug}`}
                className="lg:col-span-7 min-w-0 min-h-[260px] sm:min-h-[300px] lg:min-h-[460px] bg-[#101B2D] overflow-hidden group"
              >
                <SafeImage
                  src={marqueeProject.coverImage}
                  alt={marqueeProject.name}
                  fallbackTitle={marqueeProject.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </Link>

              <div className="lg:col-span-5 min-w-0 p-6 sm:p-10 lg:p-12 flex flex-col justify-between gap-8">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
                    <span className="text-[#A98642] font-semibold">{marqueeProject.status}</span>
                    <span aria-hidden="true">·</span>
                    <span>{marqueeProject.category}</span>
                  </div>

                  <h3 className="font-display text-3xl font-semibold text-[#101B2D]">
                    {marqueeProject.name}
                  </h3>

                  <p className="text-sm text-slate-500">{marqueeProject.location}</p>

                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    {marqueeProject.shortDescription}
                  </p>

                  {marqueeProject.plotSizes && marqueeProject.plotSizes.length > 0 && (
                    <div className="pt-4 border-t border-slate-100 space-y-2">
                      <p className="text-xs font-semibold tracking-wider uppercase text-slate-500">
                        Plot Options (Editable)
                      </p>
                      <p className="text-sm text-[#101B2D] font-medium leading-relaxed">
                        {marqueeProject.plotSizes.join(' · ')}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link
                    to={`/projects/${marqueeProject.slug}`}
                    className="px-6 py-3 bg-[#101B2D] hover:bg-[#1A2A44] text-white text-sm font-medium inline-flex items-center gap-2 transition-colors whitespace-nowrap"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                  <Link
                    to="/contact"
                    className="px-5 py-3 border border-slate-300 hover:border-[#101B2D] text-[#101B2D] text-sm font-medium transition-colors whitespace-nowrap"
                  >
                    Request Info
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {displayProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. Statistics Section (Editable Placeholders) */}
      <section className="bg-[#101B2D] text-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-10 border-b border-white/10">
            <div>
              <p className="text-xs font-semibold tracking-[0.16em] uppercase text-[#C5A15B]">
                Portfolio Snapshot
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold mt-2">
                Measured Growth & Advisory Benchmarks
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Editable placeholder indicators configurable via Admin Settings
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-10">
            {siteContent.stats.map((stat, idx) => (
              <div key={idx} className="space-y-2">
                <p className="font-display text-3xl sm:text-4xl font-semibold text-[#C5A15B] tabular-nums">
                  {stat.value}
                </p>
                <p className="text-sm font-semibold text-white">{stat.label}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{stat.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Why Choose Us */}
      <section className="py-20 lg:py-28 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4 space-y-4">
              <p className="text-xs font-semibold tracking-[0.16em] uppercase text-[#A98642]">
                Why Choose Us
              </p>
              <h2 className="font-display text-balance text-3xl sm:text-4xl font-semibold text-[#101B2D] leading-tight">
                A Disciplined Standard for Property Buyers
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Real estate decisions require clarity over hype. Our five core principles guide
                every client conversation and development milestone.
              </p>
            </div>

            <div className="lg:col-span-8 divide-y divide-slate-200 border-t border-b border-slate-200">
              {WHY_CHOOSE_PILLARS.map((pillar) => (
                <div
                  key={pillar.number}
                  className="py-6 sm:py-7 grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-6 items-start"
                >
                  <span className="sm:col-span-2 font-mono text-sm font-medium text-[#A98642] tabular-nums">
                    {pillar.number}.
                  </span>
                  <div className="sm:col-span-10 space-y-1.5">
                    <h3 className="font-display text-xl font-semibold text-[#101B2D]">
                      {pillar.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{pillar.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Testimonials Section (Editable Sample Content) */}
      <section className="py-20 lg:py-24 bg-[#F6F7F9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <p className="text-xs font-semibold tracking-[0.16em] uppercase text-[#A98642]">
                Client Perspectives
              </p>
              <h2 className="font-display text-balance text-3xl sm:text-4xl font-semibold text-[#101B2D]">
                Investor & Homebuyer Feedback
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Sample placeholder testimonials · Editable in Admin Dashboard
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {siteContent.testimonials.map((item, idx) => (
              <blockquote
                key={idx}
                className="bg-white border border-slate-200 p-7 flex flex-col justify-between gap-6"
              >
                <p className="text-sm sm:text-base text-[#252525] leading-relaxed">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <footer className="pt-4 border-t border-slate-100 space-y-1">
                  <p className="text-sm font-semibold text-[#101B2D]">{item.author}</p>
                  <p className="text-xs text-slate-500">
                    {item.role} · {item.project}
                  </p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Call To Action */}
      <section className="bg-white border-t border-slate-200 py-20 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <p className="text-xs font-semibold tracking-[0.16em] uppercase text-[#A98642]">
            Private Consultation
          </p>
          <h2 className="font-display text-balance text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#101B2D] leading-tight">
            {siteContent.ctaHeadline || "Let's Find Your Next Investment Opportunity."}
          </h2>
          <p className="text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {siteContent.ctaSubtext}
          </p>

          <div className="pt-3 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contact"
              className="px-7 py-3.5 bg-[#101B2D] hover:bg-[#1A2A44] text-white text-sm font-medium inline-flex items-center gap-2 transition-colors whitespace-nowrap"
            >
              <span>Schedule a Consultation</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>

            <a
              href={whatsappGeneralUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 border border-slate-300 hover:border-[#101B2D] text-[#101B2D] text-sm font-medium inline-flex items-center gap-2 transition-colors whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4 text-[#1B6B46]" aria-hidden="true" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
