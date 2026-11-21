import type { SocialLinks } from '../types/realestate';

interface SocialLinksRowProps {
  socialLinks?: Partial<SocialLinks>;
  variant?: 'dark' | 'light';
  className?: string;
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.84c0-2.52 1.49-3.91 3.78-3.91 1.1 0 2.24.2 2.24.2v2.47H15.2c-1.24 0-1.63.77-1.63 1.57v1.89h2.78l-.44 2.91h-2.34V22c4.78-.76 8.43-4.92 8.43-9.94Z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <rect x="2.75" y="2.75" width="18.5" height="18.5" rx="5" />
      <circle cx="12" cy="12" r="4.25" />
      <circle cx="17.25" cy="6.75" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77Z" />
    </svg>
  );
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M21.58 7.19a2.75 2.75 0 0 0-1.94-1.95C17.93 4.78 12 4.78 12 4.78s-5.93 0-7.64.46a2.75 2.75 0 0 0-1.94 1.95A28.7 28.7 0 0 0 2 12a28.7 28.7 0 0 0 .42 4.81 2.75 2.75 0 0 0 1.94 1.95c1.71.46 7.64.46 7.64.46s5.93 0 7.64-.46a2.75 2.75 0 0 0 1.94-1.95A28.7 28.7 0 0 0 22 12a28.7 28.7 0 0 0-.42-4.81ZM10 15.1V8.9l5.2 3.1L10 15.1Z" />
    </svg>
  );
}

export function SocialLinksRow({
  socialLinks,
  variant = 'dark',
  className = '',
}: SocialLinksRowProps) {
  const items = [
    {
      key: 'facebook' as const,
      label: 'Facebook',
      href: socialLinks?.facebook,
      Icon: FacebookIcon,
    },
    {
      key: 'instagram' as const,
      label: 'Instagram',
      href: socialLinks?.instagram,
      Icon: InstagramIcon,
    },
    {
      key: 'linkedin' as const,
      label: 'LinkedIn',
      href: socialLinks?.linkedin,
      Icon: LinkedInIcon,
    },
    {
      key: 'youtube' as const,
      label: 'YouTube',
      href: socialLinks?.youtube,
      Icon: YouTubeIcon,
    },
  ].filter((item) => Boolean(item.href && item.href.trim()));

  if (items.length === 0) return null;

  const linkClass =
    variant === 'dark'
      ? 'group inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-[#C5A15B] transition-colors py-1'
      : 'group inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 hover:text-[#101B2D] transition-colors py-1';

  const iconClass =
    variant === 'dark'
      ? 'w-4 h-4 text-[#C5A15B] group-hover:text-[#C5A15B] transition-colors shrink-0'
      : 'w-4 h-4 text-[#A98642] group-hover:text-[#101B2D] transition-colors shrink-0';

  const labelClass =
    variant === 'light' ? 'group-hover:underline underline-offset-4' : '';

  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-2 ${className}`.trim()}>
      {items.map(({ key, label, href, Icon }) => (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className={linkClass}
        >
          <Icon className={iconClass} />
          <span className={labelClass}>{label}</span>
        </a>
      ))}
    </div>
  );
}
