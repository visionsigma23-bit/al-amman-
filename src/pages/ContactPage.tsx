import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { InquiryForm } from '../components/InquiryForm';
import { SEOHead } from '../components/SEOHead';
import { SocialLinksRow } from '../components/SocialLinksRow';

export function ContactPage() {
  const { siteContent, buildWhatsAppUrl } = useApp();

  const whatsappDirectUrl = buildWhatsAppUrl({
    projectName: 'General Real Estate Consultation',
    details: 'Hello AL-Amaan Developers, I would like to speak with an advisor.',
  });

  return (
    <>
      <SEOHead
        title={`Contact Us – ${siteContent.companyName}`}
        description={`Contact ${siteContent.companyName} for project inquiries, site visits, and investment consultations via form or WhatsApp.`}
      />

      {/* Header */}
      <section className="bg-[#101B2D] text-white py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#C5A15B]">
            Get in Touch
          </p>
          <h1 className="font-display text-balance text-4xl sm:text-5xl font-semibold">
            Speak With Our Advisory Team
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
            Submit an inquiry below or connect directly on WhatsApp for plot details, office
            appointments, and site visit scheduling.
          </p>
        </div>
      </section>

      {/* Main Contact Grid */}
      <section className="py-16 lg:py-24 bg-[#F6F7F9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Form */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#101B2D]">
              Send an Inquiry
            </h2>
            <InquiryForm sourcePage="/contact" />
          </div>

          {/* Right: Office Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-slate-200 p-6 sm:p-8 space-y-6">
              <div>
                <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#A98642] mb-2">
                  Corporate Desk
                </p>
                <h2 className="font-display text-2xl font-semibold text-[#101B2D]">
                  Office &amp; Direct Channels
                </h2>
              </div>

              <div className="space-y-4 text-sm text-slate-600">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#A98642] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-[#101B2D]">Office Address</p>
                    <p className="mt-0.5 leading-relaxed">{siteContent.officeAddress}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#A98642] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-[#101B2D]">Telephone</p>
                    <p className="mt-0.5 tabular-nums">{siteContent.contactPhone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#A98642] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-[#101B2D]">Email</p>
                    <a
                      href={`mailto:${siteContent.contactEmail}`}
                      className="mt-0.5 inline-block hover:text-[#101B2D] break-all"
                    >
                      {siteContent.contactEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#A98642] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-[#101B2D]">Visiting Hours</p>
                    <p className="mt-0.5">{siteContent.officeHours}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-3">
                <a
                  href={whatsappDirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-5 bg-[#1B6B46] hover:bg-[#155738] text-white text-sm font-medium inline-flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" aria-hidden="true" />
                  <span>Direct WhatsApp Consultation</span>
                </a>

                <SocialLinksRow
                  socialLinks={siteContent.socialLinks}
                  variant="light"
                  className="pt-2"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Google Maps Location Placeholder */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="bg-white border border-slate-200 p-8 sm:p-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div>
                <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#A98642]">
                  Office Location
                </p>
                <h2 className="font-display text-2xl font-semibold text-[#101B2D] mt-1">
                  Google Maps Location Placeholder
                </h2>
              </div>
              <span className="text-xs text-slate-500">
                Configurable via Office Coordinates / Embed
              </span>
            </div>

            <div className="mt-6 h-72 bg-[#101B2D]/5 border border-dashed border-slate-300 flex flex-col items-center justify-center p-6 text-center space-y-2">
              <MapPin className="w-8 h-8 text-[#101B2D]/60" strokeWidth={1.5} aria-hidden="true" />
              <p className="font-display text-lg font-semibold text-[#101B2D]">
                Interactive Map Embed Area
              </p>
              <p className="text-sm text-slate-600 max-w-lg">
                {siteContent.officeAddress}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
