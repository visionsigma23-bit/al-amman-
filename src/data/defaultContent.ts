import { Project, SiteContent } from '../types/realestate';

export const ARCHITECTURAL_ASSETS = {
  hero: '/src/assets/images/hero_architecture_1795273289253.jpg',
  alJalilCover: '/src/assets/images/al_jalil_garden_cover_1795273289762.jpg',
  alJalilCommercial: '/src/assets/images/al_jalil_commercial_1795273289962.jpg',
  alJalilMasterplan: '/src/assets/images/al_jalil_aerial_masterplan_1795273289702.jpg',
  aboutGallery: '/src/assets/images/about_architecture_craft_1795273289572.jpg',
} as const;

export const DEFAULT_SITE_CONTENT: SiteContent = {
  companyName: 'AL-Amaan Developers',
  tagline: 'Building Trust. Creating Futures.',
  heroHeadline: 'Building Trust. Creating Futures.',
  heroSubtitle:
    'Thoughtfully planned residential communities and commercial corridors across Pakistan, guided by transparent documentation and enduring architectural standards.',
  aboutPreviewTitle: 'Real Estate Development Grounded in Accountability',
  aboutPreviewBody:
    'AL-Amaan Developers serves families, overseas Pakistanis, and long-term property investors seeking clear communication, disciplined planning, and dependable delivery. Every project is structured around verifiable milestones and attentive client advisory.',
  aboutFullStory:
    'AL-Amaan Developers was established with a clear mandate: to raise the standard of trust, transparency, and architectural planning in Pakistan’s real estate sector.\n\nWhether advising an overseas Pakistani family on a residential plot or guiding an institutional investor toward a commercial boulevard opportunity, our approach prioritizes clarity at every step. We believe sustainable property value comes from thoughtful master planning, accessible locations, and straightforward client support—not exaggerated promises.\n\nAs our portfolio expands from our featured development, AL-Jalil Garden, into future residential and mixed-use communities, our scalable development framework ensures every client receives consistent professionalism from initial inquiry to handover.',
  whatsappNumber: '923000000000',
  contactPhone: '+92 300 0000000 (Placeholder)',
  contactEmail: 'info@alamaandevelopers.example',
  officeAddress:
    'Corporate Office Address Placeholder — Suite / Floor, Main Boulevard, Lahore, Pakistan (Editable in Admin)',
  officeHours: 'Monday – Saturday · 10:00 AM – 6:30 PM PKT',
  socialLinks: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    linkedin: 'https://linkedin.com',
    youtube: 'https://youtube.com',
  },
  stats: [
    {
      label: 'Total Projects',
      value: '01+',
      note: 'Editable portfolio count placeholder',
    },
    {
      label: 'Happy Clients',
      value: '[Editable]',
      note: 'Update with verified client figures',
    },
    {
      label: 'Years of Experience',
      value: '[Editable]',
      note: 'Update with company tenure',
    },
    {
      label: 'Investment Opportunities',
      value: 'Residential & Commercial',
      note: 'Configurable opportunity summary',
    },
  ],
  testimonials: [
    {
      quote:
        'Sample client feedback placeholder: Clear documentation walkthroughs and responsive advisory made evaluating residential options from abroad straightforward and reassuring.',
      author: 'Sample Investor Profile A',
      role: 'Overseas Pakistani Buyer (Editable Sample)',
      project: 'AL-Jalil Garden',
    },
    {
      quote:
        'Sample client feedback placeholder: The team took time to explain plot categories, site access, and next steps without pressure, helping our family make a well-informed decision.',
      author: 'Sample Family Homebuyer B',
      role: 'Residential Plot Client (Editable Sample)',
      project: 'AL-Jalil Garden',
    },
    {
      quote:
        'Sample client feedback placeholder: Consistent updates and direct communication channels gave us confidence when reviewing commercial frontage prospects.',
      author: 'Sample Commercial Client C',
      role: 'Commercial Investor (Editable Sample)',
      project: 'AL-Jalil Garden',
    },
  ],
  ctaHeadline: "Let's Find Your Next Investment Opportunity.",
  ctaSubtext:
    'Speak directly with an AL-Amaan Developers advisor for current project availability, site visit scheduling, and documentation guidance.',
};

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'al-jalil-garden',
    name: 'AL-JALIL GARDEN',
    slug: 'al-jalil-garden',
    location: 'Location Details Editable in Admin (Pakistan)',
    category: 'Residential & Commercial',
    status: 'Featured Development',
    shortDescription:
      'Our featured master-planned residential and commercial development designed for modern family living and long-term property investment.',
    fullDescription:
      'AL-Jalil Garden is the flagship featured real estate project presented by AL-Amaan Developers. Planned to bring together serene residential neighborhoods, landscaped parks, and accessible commercial avenues, the development addresses the priorities of families, overseas Pakistanis, and disciplined real estate investors.\n\nNote: Specific official approvals, pricing schedules, possession timelines, and technical specifications should be updated directly through the Admin Dashboard once final documentation is confirmed.',
    coverImage: ARCHITECTURAL_ASSETS.alJalilCover,
    galleryImages: [
      ARCHITECTURAL_ASSETS.alJalilCover,
      ARCHITECTURAL_ASSETS.alJalilMasterplan,
      ARCHITECTURAL_ASSETS.alJalilCommercial,
      ARCHITECTURAL_ASSETS.hero,
    ],
    amenities: [
      'Gated Community Concept (Editable)',
      'Wide Landscaped Boulevards',
      'Dedicated Family Parks & Green Belts',
      'Grand Jamia Mosque Provision',
      'Commercial & Retail Corridors',
      'Planned Underground Utilities (Editable)',
      'Educational & Healthcare Zones (Editable)',
      '24/7 Security Planning Framework',
    ],
    plotSizes: [
      '3 Marla (Editable Placeholder)',
      '5 Marla (Editable Placeholder)',
      '8 Marla (Editable Placeholder)',
      '10 Marla (Editable Placeholder)',
      '1 Kanal (Editable Placeholder)',
      'Commercial Plots (Sizes Editable)',
    ],
    propertyCategories: [
      {
        title: 'Residential Plots',
        subtitle: 'Family Neighborhoods',
        description:
          'Thoughtfully positioned residential blocks offering peaceful streetscapes, park proximity, and flexible plot size options for custom home construction.',
      },
      {
        title: 'Commercial Boulevards',
        subtitle: 'Retail & Corporate Frontage',
        description:
          'High-visibility commercial plots planned along primary access roads to support neighborhood retail, offices, and long-term rental yield potential.',
      },
    ],
    developmentHighlights: [
      'Master-planned street hierarchy designed for smooth internal traffic flow and pedestrian safety.',
      'Dedicated green corridors and community gathering spaces supporting family-oriented living.',
      'Transparent client advisory process tailored for both local buyers and overseas Pakistanis.',
      'Scalable phase documentation and project updates managed centrally through AL-Amaan Developers.',
    ],
    investmentInfo:
      'Investment details, payment plans, official regulatory statuses, and current unit availability are provided directly upon consultation and can be updated anytime in the Admin Dashboard. Contact our advisory team to receive verified project literature before making any financial commitment.',
    locationNote:
      'Strategic corridor access details, nearby landmarks, and verified Google Maps coordinates can be configured from the Admin Dashboard.',
    mapEmbedUrl: '',
    faqs: [
      {
        question: 'How can I verify official project details and plot availability?',
        answer:
          'Please submit an inquiry through our contact form or connect via WhatsApp so our advisory desk can share current verified documentation and available plot categories.',
      },
      {
        question: 'Can overseas Pakistanis inquire and initiate booking consultations remotely?',
        answer:
          'Yes. AL-Amaan Developers provides dedicated remote advisory, digital document walkthroughs, and WhatsApp consultations tailored for overseas Pakistani investors.',
      },
      {
        question: 'Are both residential and commercial options available?',
        answer:
          'Yes, AL-Jalil Garden features both residential neighborhood blocks and commercial boulevard categories. Exact plot sizes and availability can be confirmed with our sales desk.',
      },
      {
        question: 'How can I schedule a physical site visit?',
        answer:
          'Use the inquiry form below or click the WhatsApp button with your preferred date, and a representative will coordinate a guided site visit.',
      },
    ],
    contactPhone: '+92 300 0000000 (Placeholder)',
    contactEmail: 'info@alamaandevelopers.example',
    featured: true,
    published: true,
    displayOrder: 1,
  },
];
