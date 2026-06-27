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
  category: "Brochure" | "Datasheet" | "Certificate" | "Guide" | "Warranty";
  fileSize: string;
  downloadCount: number;
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
  company: string;
  role: string;
  productOfInterest: string;
  pixelPitchPreference: string;
  glassSize: string;
  projectLocation: string;
  timeline: string;
  budgetRange: string;
  specialRequirements: string;
  status: "New" | "Contacted" | "Proposal Sent" | "Closed - Won" | "Closed - Lost";
  createdAt: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}
