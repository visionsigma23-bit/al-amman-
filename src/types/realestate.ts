export type ProjectCategory =
  | 'Residential & Commercial'
  | 'Residential'
  | 'Commercial'
  | 'Mixed-Use';

export type ProjectStatus =
  | 'Featured Development'
  | 'Upcoming'
  | 'Ongoing'
  | 'Planning Phase'
  | 'Sold Out';

export interface PropertyCategoryItem {
  title: string;
  subtitle: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  location: string;
  category: ProjectCategory | string;
  status: ProjectStatus | string;
  shortDescription: string;
  fullDescription: string;
  coverImage: string;
  galleryImages: string[];
  amenities: string[];
  plotSizes: string[];
  propertyCategories: PropertyCategoryItem[];
  developmentHighlights: string[];
  investmentInfo: string;
  locationNote: string;
  mapEmbedUrl: string;
  faqs: FaqItem[];
  contactPhone: string;
  contactEmail: string;
  featured: boolean;
  published: boolean;
  displayOrder: number;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export type InquiryStatus = 'new' | 'contacted' | 'completed' | 'archived';

export interface Inquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  interestedProject: string;
  message: string;
  sourcePage?: string;
  status: InquiryStatus;
  adminNotes?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface StatItem {
  label: string;
  value: string;
  note: string;
}

export interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
  project: string;
}

export interface SocialLinks {
  facebook: string;
  instagram: string;
  linkedin: string;
  youtube: string;
}

export interface SiteContent {
  companyName: string;
  companyLogoUrl?: string;
  tagline: string;
  heroHeadline: string;
  heroSubtitle: string;
  aboutPreviewTitle: string;
  aboutPreviewBody: string;
  aboutFullStory: string;
  whatsappNumber: string;
  contactPhone: string;
  contactEmail: string;
  officeAddress: string;
  officeHours: string;
  socialLinks: SocialLinks;
  stats: StatItem[];
  testimonials: TestimonialItem[];
  ctaHeadline: string;
  ctaSubtext: string;
  updatedAt?: unknown;
}

export interface AdminUser {
  uid: string;
  email: string;
  displayName?: string;
  role: 'admin';
  createdAt?: unknown;
}
