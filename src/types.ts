export interface Product {
  id: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  features: string[];
  benefits: string[];
  specifications: {
    pitch: string;
    transparency: string;
    brightness: string;
    refreshRate: string;
    thickness: string;
    weight: string;
    avgPower: string;
    maxPower: string;
  };
  installation: string;
  maintenance: string;
  image: string;
  brochureUrl?: string;
  series?: string;
  videoUrl?: string;
  displayOrder?: number;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  location: string;
  client: string;
  timeline: string;
  description: string;
  techUsed: string[];
  beforeImage: string;
  afterImage: string;
  installationSize?: string;
  projectHighlights?: string[];
  customerBenefits?: string[];
  review?: {
    reviewer: string;
    role: string;
    rating: number;
    text: string;
  };
}

export interface ApplicationItem {
  id: string;
  title: string;
  tagline: string;
  overview: string;
  benefits: string[];
  recommendedProducts: string[];
  gallery: string[];
  caseStudy: {
    title: string;
    challenge: string;
    solution: string;
    result: string;
  };
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  publishedAt: string;
  readTime: string;
  author: string;
  image: string;
}

export interface ResourceDoc {
  id: string;
  title: string;
  category: string;
  fileSize: string;
  downloadCount: number;
  fileUrl?: string;
  docCode?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  designation: string;
  company: string;
  text: string;
  rating: number;
}

export interface LeadInquiry {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  whatsapp?: string;
  company?: string;
  role?: string;
  productOfInterest?: string;
  pixelPitchPreference?: string;
  glassSize?: string;
  screenSize?: string;
  quantity?: string | number;
  city?: string;
  state?: string;
  country?: string;
  projectLocation?: string;
  timeline?: string;
  budgetRange?: string;
  specialRequirements?: string;
  status: "New" | "Contacted" | "Quotation Sent" | "Closed" | "Proposal Sent" | "Closed - Won" | "Closed - Lost";
  createdAt: string;
  drawingName?: string;
  drawingData?: string;
  imageName?: string;
  imageData?: string;
  attachmentName?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: "Storefronts & Entrances" | "Interior Glass Partitioning" | "Digital Displays" | "Hardware & Installation";
  imageUrl: string;
  videoUrl?: string;
  location: string;
  description: string;
  specs: {
    dimensions: string;
    controller: string;
    transmission: string;
    layers: string;
  };
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  department: string;
  initials: string;
  bio: string;
  email?: string;
}

export interface WebsiteSettings {
  companyName: string;
  tagline: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  hours: string;
  logoUrl?: string;
  footerText?: string;
  // Home Page CMS
  homeHeroBanner?: string;
  homeHeroHeadline?: string;
  homeHeroSubtitle?: string;
  homeHeroCta1Text?: string;
  homeHeroCta1Tab?: string;
  homeHeroCta2Text?: string;
  homeHeroCta2Tab?: string;
  homeHeroImage?: string;
  homeHeroVideo?: string;
  // About Page CMS
  aboutHeaderTitle?: string;
  aboutHeaderSubtitle?: string;
  aboutHeaderIntro?: string;
  aboutChinaTitle?: string;
  aboutChinaSub?: string;
  aboutChinaText: string;
  aboutChinaFounder: string;
  aboutChinaWebsite: string;
  aboutChinaHeadquarters: string;
  aboutChinaBusiness: string;
  aboutTeamTitle?: string;
  aboutTeamSub?: string;
  aboutTeamDesc?: string;
  aboutFactoryTitle?: string;
  aboutFactorySub?: string;
  aboutFactoryDesc1?: string;
  aboutFactoryDesc2?: string;
  aboutServicesTitle?: string;
  aboutServicesSub?: string;
  aboutServicesDesc?: string;
  aboutIndiaTitle?: string;
  aboutIndiaSub?: string;
  aboutIndiaDesc1?: string;
  aboutIndiaDesc2?: string;
  aboutIndiaSLA1?: string;
  aboutIndiaSLA2?: string;
  aboutIndiaSLA3?: string;
  aboutCtaTitle?: string;
  aboutCtaDesc?: string;
  factoryAddress: string;
  googleMapEmbed?: string;
  facebookUrl?: string;
  linkedinUrl?: string;
  youtubeUrl?: string;
  instagramUrl?: string;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  role: "Administrator" | "Editor" | "Viewer";
  createdAt: string;
}
