import React, { useState } from 'react';
import { CheckCircle2, Loader2, MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { submitInquiry } from '../lib/firestoreService';

interface InquiryFormProps {
  defaultProject?: string;
  sourcePage?: string;
  compact?: boolean;
}

export function InquiryForm({
  defaultProject,
  sourcePage = '/contact',
  compact = false,
}: InquiryFormProps) {
  const { projects, buildWhatsAppUrl } = useApp();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [interestedProject, setInterestedProject] = useState(
    defaultProject || projects[0]?.name || 'AL-JALIL GARDEN'
  );
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const validate = (): string | null => {
    if (name.trim().length < 2) return 'Please enter your full name.';
    if (phone.trim().length < 6) return 'Please enter a valid contact or WhatsApp number.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) return 'Please enter a valid email address.';
    if (message.trim().length < 5) return 'Please share a brief message about your inquiry.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    try {
      const id = await submitInquiry({
        name,
        phone,
        email,
        interestedProject,
        message,
        sourcePage,
      });
      setSubmittedId(id);
    } catch {
      setError('Unable to submit your inquiry right now. Please try again or contact us via WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappUrl = buildWhatsAppUrl({
    customerName: name || undefined,
    projectName: interestedProject,
    details: message || undefined,
  });

  if (submittedId) {
    return (
      <div className="bg-white border border-slate-200 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3 text-[#101B2D]">
          <CheckCircle2 className="w-6 h-6 text-emerald-700 shrink-0" aria-hidden="true" />
          <h3 className="font-display text-2xl font-semibold">Inquiry Received</h3>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">
          Thank you, <span className="font-semibold text-[#101B2D]">{name}</span>. Your inquiry
          regarding <span className="font-semibold text-[#101B2D]">{interestedProject}</span> has
          been recorded for our advisory team.
        </p>
        <p className="text-xs font-mono text-slate-500 tabular-nums">
          Reference ID: {submittedId}
        </p>
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1B6B46] text-white text-sm font-medium hover:bg-[#155738] transition-colors"
          >
            <MessageCircle className="w-4 h-4" aria-hidden="true" />
            <span>Continue on WhatsApp</span>
          </a>
          <button
            type="button"
            onClick={() => {
              setSubmittedId(null);
              setName('');
              setPhone('');
              setEmail('');
              setMessage('');
            }}
            className="px-4 py-2.5 border border-slate-300 text-sm font-medium text-[#101B2D] hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Send Another Inquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={`bg-white border border-slate-200 ${compact ? 'p-6' : 'p-6 sm:p-8'} space-y-5`}
    >
      {error && (
        <div
          role="alert"
          className="px-4 py-3 bg-red-50 border border-red-200 text-sm text-red-800"
        >
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="inq-name" className="block text-xs font-semibold text-[#101B2D] mb-1.5">
            Full Name *
          </label>
          <input
            id="inq-name"
            type="text"
            required
            maxLength={120}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Muhammad Usman"
            className="w-full px-3.5 py-2.5 text-sm border border-slate-300 bg-white text-[#252525] focus:outline-none focus:border-[#101B2D]"
          />
        </div>

        <div>
          <label htmlFor="inq-phone" className="block text-xs font-semibold text-[#101B2D] mb-1.5">
            Phone / WhatsApp Number *
          </label>
          <input
            id="inq-phone"
            type="tel"
            required
            maxLength={40}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+92 300 0000000"
            className="w-full px-3.5 py-2.5 text-sm border border-slate-300 bg-white text-[#252525] focus:outline-none focus:border-[#101B2D]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="inq-email" className="block text-xs font-semibold text-[#101B2D] mb-1.5">
            Email Address *
          </label>
          <input
            id="inq-email"
            type="email"
            required
            maxLength={160}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-3.5 py-2.5 text-sm border border-slate-300 bg-white text-[#252525] focus:outline-none focus:border-[#101B2D]"
          />
        </div>

        <div>
          <label htmlFor="inq-project" className="block text-xs font-semibold text-[#101B2D] mb-1.5">
            Interested Project *
          </label>
          <select
            id="inq-project"
            value={interestedProject}
            onChange={(e) => setInterestedProject(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm border border-slate-300 bg-white text-[#252525] focus:outline-none focus:border-[#101B2D]"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.name}>
                {p.name}
              </option>
            ))}
            <option value="General Investment Consultation">General Investment Consultation</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="inq-message" className="block text-xs font-semibold text-[#101B2D] mb-1.5">
          Message / Requirements *
        </label>
        <textarea
          id="inq-message"
          rows={compact ? 3 : 4}
          required
          maxLength={3000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us about your preferred plot category, investment goals, or site visit request..."
          className="w-full px-3.5 py-2.5 text-sm border border-slate-300 bg-white text-[#252525] focus:outline-none focus:border-[#101B2D] resize-y"
        />
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-3 bg-[#101B2D] hover:bg-[#1A2A44] disabled:opacity-60 text-white text-sm font-medium inline-flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
        >
          {submitting && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
          <span>{submitting ? 'Submitting Inquiry...' : 'Submit Inquiry'}</span>
        </button>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-3 border border-slate-300 hover:border-[#101B2D] text-[#101B2D] text-sm font-medium inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
        >
          <MessageCircle className="w-4 h-4 text-[#1B6B46]" aria-hidden="true" />
          <span>Inquire via WhatsApp</span>
        </a>
      </div>
    </form>
  );
}
