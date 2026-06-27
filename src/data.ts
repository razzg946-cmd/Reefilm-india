import { Product, Project, ApplicationItem, BlogPost, ResourceDoc, Testimonial, LeadInquiry, FAQItem } from "./types";

export const COMPANY_INFO = {
  name: "Reefilm India",
  owner: "Raj Gupta",
  role: "Authorized Sales, Installation & Technical Support Partner in India",
  tagline: "Transform Glass Into Brilliant Digital Experiences",
  established: "2021",
  address: "DLF CyberCity, Phase III, Sector 24, Gurugram, Haryana - 122002, India",
  email: "sales@reefilm.in",
  phone: "+91 98765 43210",
  whatsapp: "+919876543210",
  hours: "Monday - Saturday: 10:00 AM - 7:00 PM (IST)",
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "transparent-led-film",
    name: "Transparent LED Film (Adhesive)",
    category: "LED Film",
    tagline: "Ultra-Thin Adhesive Film that Turns Glass Into a Vibrant Display",
    description: "Reefilm India's flag-ship product. A paper-thin, self-adhesive transparent LED film that laminates directly onto existing glass panels without altering the structural integrity. With up to 85% transparency, it is virtually invisible when turned off, and bursts into high-brightness, full-color visuals when active.",
    features: [
      "Ultra-lightweight: Only 2.4kg per square meter",
      "Superior flexibility: Bendable up to 1100R for curved installations",
      "Self-Adhesive: Fast laminate installation with optical-grade adhesive layer",
      "High Transparency: Up to 85% light transmission, retaining indoor daylighting",
      "Pixel Pitch Options: Customizable from 3.9mm to 10mm"
    ],
    benefits: [
      "No structural modifications required to existing windows or glass structures",
      "Maintains natural view and indoor illumination from both sides",
      "Saves significant energy compared to traditional heavy LED cabinets",
      "Elevates corporate branding and storefront marketing exponentially"
    ],
    specifications: {
      pitch: "3.91mm / 6.25mm / 10.4mm",
      transparency: "75% - 85%",
      brightness: "4500 - 5500 nits (Sunlight readable)",
      refreshRate: "≥ 3,840 Hz (Moiré-free on camera)",
      thickness: "1.2mm (Thin as paper)",
      weight: "2.4 kg/m²",
      avgPower: "180 W/m²",
      maxPower: "600 W/m²"
    },
    installation: "Clean the glass substrate, peel back the protective layer, apply film carefully with a specialized laminating roller, connect slim side power bars, and route cabling discreetly through the structural frame.",
    maintenance: "Front or rear access maintenance. Individual pixel line replacements can be done in minutes without dismantling the entire glass installation.",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "flexible-led-film",
    name: "Flexible LED Film (Curved Surfaces)",
    category: "LED Film",
    tagline: "Wrap Curved Glass Columns and Organic Architectural Elements",
    description: "Specifically engineered for avant-garde designs, our Flexible LED Film bends effortlessly around tight curves, cylindrical pillars, and organic glass structures. It provides an uninterrupted, continuous canvas that moves seamlessly with your architecture.",
    features: [
      "Curved Adaptability: Seamless bending on concave or convex glass surfaces",
      "Solderless Design: Ultra-durable circuit connections designed for continuous flex",
      "High refresh rate: Flicker-free broadcasting standards",
      "Custom Sizing: Cut-to-fit architecture for unique architectural formats"
    ],
    benefits: [
      "Converts dead space like load-bearing glass columns into highly premium visual focal points",
      "Saves on structural steel and engineering costs",
      "Attracts heavy footfall in shopping malls and flagship showrooms"
    ],
    specifications: {
      pitch: "5.0mm / 8.0mm",
      transparency: "70% - 80%",
      brightness: "4000 nits",
      refreshRate: "3,840 Hz",
      thickness: "2.0mm",
      weight: "2.8 kg/m²",
      avgPower: "150 W/m²",
      maxPower: "500 W/m²"
    },
    installation: "Slick glass column bonding using dedicated structural adhesives, with smart strip control boards nested inside the pillar caps.",
    maintenance: "Modular strip-level swappable mechanism.",
    image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "glass-led-display",
    name: "Structural Glass LED Display",
    category: "Glass Display",
    tagline: "Double-Glazed Structural Safety Glass with Embedded LED Matrix",
    description: "For new construction projects and high-end facade development, we offer pre-manufactured structural glass panels that have the LED film permanently laminated between double-glazed safety glass. It serves as both building facade material and digital display screen.",
    features: [
      "Double-Glazed Insulation: Outstanding soundproofing and thermal insulation",
      "Structural Grade: IP65 weather-proofed outer seal suitable for structural facades",
      "Perfect optical alignment: Sandwiched in cleanroom conditions"
    ],
    benefits: [
      "Dual purpose: Replaces traditional structural glass and serves as a high-tech media facade",
      "Maximum durability: Protected from weather, dust, and direct physical contact",
      "Premium aesthetic: Flat, seamless glass exterior with zero exposed wires"
    ],
    specifications: {
      pitch: "10mm / 16mm",
      transparency: "80%",
      brightness: "6000 nits (Direct sunlight readable)",
      refreshRate: "≥ 1,920 Hz",
      thickness: "12mm + 1.5mm + 12mm double-glazed",
      weight: "24.5 kg/m²",
      avgPower: "220 W/m²",
      maxPower: "750 W/m²"
    },
    installation: "Installed by standard glass facade contractors using heavy duty spider fittings or custom aluminum mullion systems.",
    maintenance: "Rear access maintenance panels built directly into the inner mullion framing.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "window-led-display",
    name: "Street-Facing Window LED Display",
    category: "Window Display",
    tagline: "High-Brightness Solutions to Combat Direct Sunlight in Retail Windows",
    description: "Designed specifically for commercial storefronts facing busy high-streets. This screen features incredible daylight-penetrating brightness (up to 5500 nits) to keep your displays looking crystal clear even in direct noon sunlight, while retaining complete interior transparency.",
    features: [
      "High Sun Tolerance: UV-coated film prevents yellowing and pixel burn-in",
      "Automatic Brightness Control: Ambient light sensors adjust brightness dynamically",
      "Superb Contrast Ratio: 5,000:1 contrast for brilliant visuals"
    ],
    benefits: [
      "Captures the attention of passing vehicular and pedestrian traffic instantly",
      "Retains perfect view of store interior, allowing customers to look inside",
      "Replaces traditional messy static paper banners with dynamic digital campaigns"
    ],
    specifications: {
      pitch: "3.91mm / 7.81mm",
      transparency: "72%",
      brightness: "5500 nits",
      refreshRate: "3,840 Hz",
      thickness: "1.5mm",
      weight: "3.2 kg/m²",
      avgPower: "200 W/m²",
      maxPower: "650 W/m²"
    },
    installation: "Suspended from structural ceiling beams behind the storefront window or mounted on an elegant minimal support frame adjacent to the glass.",
    maintenance: "Easy front-access maintenance that does not interfere with the window glass surface.",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "led-curtain-display",
    name: "Architectural LED Curtain Mesh",
    category: "Mesh Display",
    tagline: "Lightweight, Highly Transparent Mesh for Giant Facades",
    description: "For covering massive skyscrapers or multi-story glass buildings. The LED Curtain Display features a lightweight hollow grid design that ensures outstanding wind permeability and excellent structural safety for high-altitude installations.",
    features: [
      "Wind Permeable: Hollow-strip design reduces wind drag by up to 60%",
      "Ultra-Scale: Seamless daisy-chaining for displays spanning thousands of square meters",
      "IP67 Weatherproof: Full marine-grade outdoor protection"
    ],
    benefits: [
      "Converts entire commercial buildings into dynamic visual media structures",
      "Low wind load reduces required weight of mounting structures",
      "High-altitude visual impact visible from kilometers away"
    ],
    specifications: {
      pitch: "15.6mm / 31.25mm",
      transparency: "65% - 80%",
      brightness: "7500 nits (Extreme outdoor brightness)",
      refreshRate: "3,840 Hz",
      thickness: "35mm (With internal controller casing)",
      weight: "7.5 kg/m²",
      avgPower: "150 W/m²",
      maxPower: "480 W/m²"
    },
    installation: "Installed on custom external structural sub-frames or hung directly from roof anchors for temporary event installations.",
    maintenance: "Modular bar swapping from the rear without any specialized tools.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: "dlf-cybercity-gurugram",
    title: "DLF CyberCity Executive Glass Facade",
    category: "Corporate Office",
    location: "Gurugram, Haryana",
    client: "DLF Offices",
    timeline: "Completed Dec 2025 (4 Weeks)",
    description: "Reefilm India was commissioned to convert a prominent 120 sq. meter glass facade on a leading corporate tower into a dynamic media display. Using our premium Adhesive Transparent LED Film (6.25mm pitch), we delivered a stunning digital facade that proudly displays high-definition corporate content without compromising daylighting for employees inside.",
    techUsed: ["Transparent LED Film (6.25mm)", "Ultra-thin Side Senders", "Real-Time Content Server"],
    beforeImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    afterImage: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80",
    review: {
      reviewer: "Aman Malhotra",
      role: "VP Architectural Design, DLF Group",
      rating: 5,
      text: "The Reefilm team led by Raj Gupta executed this complex high-altitude installation with outstanding precision. Employees love the natural light inside, and the building has become a digital landmark in Gurugram. An absolute masterpiece."
    }
  },
  {
    id: "phoenix-palladium-mumbai",
    title: "Phoenix Palladium Premium Storefront Display",
    category: "Retail Store",
    location: "Lower Parel, Mumbai",
    client: "Elite Luxury Boutique",
    timeline: "Completed Feb 2026 (10 Days)",
    description: "For an ultra-luxury luxury watch brand store in Palladium Mall, Reefilm India designed and installed a seamless 15 sq. meter high-brightness street-facing window display (3.91mm pitch). The screen showcases ultra-high-definition watch mechanics in floating 3D holographic animation, mesmerizing mall crowds.",
    techUsed: ["High-Brightness Window LED Display (3.91mm)", "Automatic Brightness Sensors", "Synchronized Audio Module"],
    beforeImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
    afterImage: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80",
    review: {
      reviewer: "Meera Sen",
      role: "Retail Director, Phoenix Brands",
      rating: 5,
      text: "Footfall inside the flagship store increased by over 42% in the first month following the installation. Reefilm India provided phenomenal white-glove technical support and completed the entire design, lamination, and calibration in under 10 days."
    }
  },
  {
    id: "taj-palace-delhi",
    title: "The Taj Palace Banquet Hall curved Pillars",
    category: "Hotels & Hospitality",
    location: "Chanakyapuri, New Delhi",
    client: "IHCL Group",
    timeline: "Completed April 2026 (2 Weeks)",
    description: "Reefilm India wrapped four load-bearing glass cylindrical structural pillars inside the grand lobby and banquet hall using our Flexible LED Film (5.0mm pitch). These columns now display digital waterfalls, ambient local scenery, and live corporate greetings during events, blending high technology with classic Indian hospitality.",
    techUsed: ["Flexible LED Film (5.0mm)", "Flexible Solderless LED Circuits", "Multi-screen Synchronization Hub"],
    beforeImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    afterImage: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80",
    review: {
      reviewer: "Rajesh Ranjan",
      role: "Director of Hospitality Engineering",
      rating: 5,
      text: "The pillars are an absolute showstopper. Wedding organizers are queuing up to book our banquet hall because of these dynamic LED columns. Raj Gupta's team handled the curved lamination flawlessly with zero seams."
    }
  }
];

export const APPLICATIONS: ApplicationItem[] = [
  {
    id: "retail-luxury",
    title: "Luxury Storefronts & Flagships",
    tagline: "Drive high-end customer engagement through holographic product showcases",
    overview: "In physical retail, first impressions are everything. Transparent LED Display solutions turn ordinary store window glass into highly valuable marketing real estate, projecting brilliant floating campaigns while maintaining window visibility.",
    benefits: [
      "Boosts retail store foot traffic by up to 45%",
      "Replaces static vinyl stickers with zero-waste digital video loops",
      "Creates an ultra-modern 'holographic' display feel that elevates brand value"
    ],
    recommendedProducts: ["Transparent LED Film (Adhesive)", "Street-Facing Window LED Display"],
    gallery: ["https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80"],
    caseStudy: {
      title: "Luxury Watch Flagship Launch",
      challenge: "Capturing fast-moving pedestrian traffic in a super premium mall, while keeping the store interior uncluttered.",
      solution: "Installed 12 sq. meters of Reefilm 3.9mm adhesive display directly onto the front glass facade.",
      result: "Achieved a 4.5x increase in passerby retention times and substantial social media organic amplification."
    }
  },
  {
    id: "corporate-offices",
    title: "Corporate Offices & Headquarters",
    tagline: "Elevate corporate workspace design with digital information glass panels",
    overview: "Upgrade entrance lobbies, boardrooms, and office partitions with transparent LED displays. Show real-time corporate metrics, achievements, branding, and customized art installations, without restricting natural light.",
    benefits: [
      "Maintains standard indoor comfort and healthy lighting for working teams",
      "Displays dynamic office announcements and customized corporate videos",
      "Increases modern high-tech appeal for key corporate visitors and stakeholders"
    ],
    recommendedProducts: ["Transparent LED Film (Adhesive)", "Flexible LED Film (Curved Surfaces)"],
    gallery: ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80"],
    caseStudy: {
      title: "Gurugram Tech Park Innovation Lobby",
      challenge: "Transforming a massive 4-story high-ceiling lobby atrium glass facade into a corporate display screen without dimming the space.",
      solution: "Applied lightweight, highly transparent 8mm adhesive LED film across 80 glass panes.",
      result: "Turned the entire office building facade into an iconic landmark visible from the National Highway."
    }
  },
  {
    id: "hospitality-dining",
    title: "Luxury Hotels & Premium Restaurants",
    tagline: "Create memorable dining and welcoming environments with digital glass art",
    overview: "Set a luxurious mood using ambient digital content. From massive lobby displays showing slow-moving artistic waves to transparent divider walls in fine dining spaces showcasing active menus or art.",
    benefits: [
      "Delivers the high-end premium aesthetic demanded by five-star properties",
      "Serves as a dynamic backdrop during weddings, press events, and private galas",
      "Provides elegant privacy filtering on divider walls with dynamic content controllers"
    ],
    recommendedProducts: ["Flexible LED Film (Curved Surfaces)", "Structural Glass LED Display"],
    gallery: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80"],
    caseStudy: {
      title: "New Delhi Chanakyapuri Pillar Wrap",
      challenge: "Adding digital elements into a classic luxury hotel lobby without clashing with premium marble columns.",
      solution: "Laminated 5mm flexible transparent film around curved architectural pillars.",
      result: "Created a gorgeous digital oasis featuring slow cascading waterfalls that completely wowed hotel guests."
    }
  }
];

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: "buying-guide-2026",
    title: "Ultimate Guide: How to Select the Right Pixel Pitch for Transparent LED Films",
    excerpt: "Understand pixel pitch (P3.9, P6.2, P10) and its direct impact on transparency, viewing distance, and picture resolution for Indian corporate and retail facades.",
    content: `When designing a transparent LED film display for a building facade or retail storefront in India, the single most critical technical decision you will make is selecting the correct **Pixel Pitch**.

### What is Pixel Pitch?
Pixel pitch refers to the vertical and horizontal distance between the centers of two adjacent LED pixels. It is typically measured in millimeters (e.g., P3.91, P7.81, P10.4).

### The Critical Tradeoff: Resolution vs. Transparency
There is a direct technical relationship between pixel density and light transmission:
1. **Tight Pixel Pitch (e.g., 3.91mm)**:
   * **Pros**: Incredible high-definition resolution, sharp text, crisp details, viewable from as close as 3 meters.
   * **Cons**: Slightly lower transparency (around 70-75%), higher power draw, higher upfront project cost.
   * **Best For**: Eye-level storefront window displays, premium indoor mall facades, luxury boutiques.

2. **Medium Pixel Pitch (e.g., 6.25mm - 8.0mm)**:
   * **Pros**: Fantastic compromise. Great resolution from 6+ meters out, high transparency (78-82%), balanced pricing.
   * **Cons**: Text smaller than 4 inches may become slightly difficult to read at close distances.
   * **Best For**: Corporate office lobby partitions, double-height showroom windows, medium-sized street-facing facades.

3. **Wide Pixel Pitch (e.g., P10mm - P16mm)**:
   * **Pros**: Maximum transparency (up to 88%), highly cost-effective, very low power consumption per square meter.
   * **Cons**: Lower resolution. Requires a minimum viewing distance of 10+ meters to resolve cohesive images.
   * **Best For**: Multi-story high-altitude exterior glass building facades, outdoor mesh overlays.

### Summary Checklist for Business Owners:
* Determine your closest target viewer's distance. (Formula: Pitch in mm x 1 Meter = Optimal Viewing Distance).
* Assess direct sunlight exposure. Direct high-street glass requires ≥5,000 nits brightness, whereas indoor shopping malls are comfortable with 1,500 - 3,000 nits.
* Consult Reefilm India's technical engineering desk spearheaded by Raj Gupta to get a free structural daylighting simulation before locking your specifications.`,
    category: "Buying Guide",
    tags: ["Technology", "Retail", "Architecture"],
    publishedAt: "May 14, 2026",
    readTime: "5 Min Read",
    author: "Raj Gupta",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "retail-display-trends-india",
    title: "How India's Top Retailers are Using Transparent LED Displays to Boost Footfall",
    excerpt: "Discover the latest digital signage design trends sweeping luxury shopping malls across Delhi NCR, Mumbai, and Bengaluru.",
    content: `The Indian luxury retail environment is undergoing an unprecedented digital renaissance. Flagship malls such as Phoenix Palladium in Mumbai, DLF Emporio in Delhi, and UB City in Bengaluru are witnessing a massive structural design shift away from standard LCD flat screens toward high-end, futuristic **Transparent LED Displays**.

Here is why top retail designers and visual merchandisers are rapidly making the switch:

### 1. Removing the 'Black Wall' Effect
Traditional heavy LED wall cabinets block windows completely, turning a shopfront into a solid, black screen when powered off. This ruins the architect's intended open layout and blocks daylight. Transparent LED film preserves up to 85% light transmission, allowing high-street light to spill beautifully into the store, while keeping products inside clearly visible from the street.

### 2. The Holographic 3D Illusion
By displaying high-contrast animations with deep black backdrops on a transparent film, the black pixels become completely see-through, leaving only the glowing colored elements active. This creates a highly realistic, floating holographic 3D illusion of floating shoes, spinning watch cogs, or drifting jewelry that stops shoppers dead in their tracks.

### 3. Rapid Indian Retail Installation
Indian retail projects run on extremely tight opening schedules. Reefilm India's specialized adhesive LED film can be laminated onto existing shop glass windows overnight with zero heavy steel mounting structures or civil work, bypassing complex mall renovation permission guidelines.

Contact our project execution desk today to see live samples in Gurugram!`,
    category: "Retail Display",
    tags: ["Retail Trends", "Digital Signage", "Visual Merchandising"],
    publishedAt: "June 02, 2026",
    readTime: "4 Min Read",
    author: "Marketing Desk",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "installation-tips-facade",
    title: "Crucial Installation & Structural Rules for Exterior Glass LED Facades",
    excerpt: "Avoid expensive failures. Read our certified engineering guidelines for wind load calculation, thermal control, and cabling routes for glass buildings.",
    content: `Laminating transparent LED film onto monumental exterior architectural glass is an engineering craft. Because Indian weather presents unique challenges—from soaring summer temperatures of 45°C+ in Delhi NCR to heavy coastal monsoon winds in Mumbai—there are five crucial engineering rules that must be respected:

### 1. Thermal Dissipation and Glass Heat Expansion
Transparent LED film emits minor heat during full-brightness operation. When applied directly onto architectural glass, this heat must dissipate efficiently to avoid glass thermal fracture.
* **Solution**: Reefilm India utilizes premium high-thermal-conductivity silicone backing and specialized airflow gaps in surrounding aluminum profiles to keep glass temperatures comfortable.

### 2. UV Degradation Control
Direct Indian sunlight contains severe UV radiation. Standard non-certified low-grade adhesive films will turn yellow and brittle within 12 months.
* **Solution**: Our transparent display films are manufactured using premium optical-grade UV-blocking protective layers, ensuring the polymer adhesive remains crystal clear for up to 10 years of sunlight exposure.

### 3. Integrated Wind Permeability
For large external building facades, wind load is a massive safety hazard. A solid screen acts like a sail, putting immense strain on structural columns.
* **Solution**: Using hollow-strip **LED Curtain Mesh** displays allows wind to pass cleanly through the structure, keeping building wind-shear calculations safe and solid.

### 4. Cabling Routing and Frame Concealment
No customer wants premium glass displays ruined by visible hanging power cables and copper wires.
* **Solution**: Reefilm India custom designs anodized aluminum side channels that act as structural glass support rails and seamlessly hide all power busbars, sub-controllers, and signal wires.

Consult Reefilm India's technical installation office for a site survey and mechanical load assessment.`,
    category: "Installation Tips",
    tags: ["Engineering", "Installation", "Facade Development"],
    publishedAt: "June 20, 2026",
    readTime: "7 Min Read",
    author: "Raj Gupta",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80"
  }
];

export const INITIAL_RESOURCES: ResourceDoc[] = [
  { id: "brochure-transparent-film", title: "Reefilm India Adhesive Transparent LED Film Catalog 2026", category: "Brochure", fileSize: "8.4 MB", downloadCount: 342 },
  { id: "datasheet-p3-91", title: "High-Definition P3.91 Transparent LED Film Technical Datasheet", category: "Datasheet", fileSize: "2.1 MB", downloadCount: 198 },
  { id: "datasheet-p6-25", title: "All-Weather P6.25 Transparent Display Product Specification Sheet", category: "Datasheet", fileSize: "1.9 MB", downloadCount: 154 },
  { id: "guide-installation-reefilm", title: "Certified Step-by-Step Adhesive LED Film Lamination Guide", category: "Guide", fileSize: "12.6 MB", downloadCount: 240 },
  { id: "warranty-statement", title: "Reefilm India Official 3-Year Platinum On-Site Warranty Policy", category: "Warranty", fileSize: "980 KB", downloadCount: 89 },
  { id: "certificate-ce-rohs", title: "Reefilm International CE, FCC & RoHS Safety Compliance Certificates", category: "Certificate", fileSize: "3.4 MB", downloadCount: 75 }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Vikram Sethi",
    designation: "Chief Infrastructure Projects Officer",
    company: "Inorbit Malls India",
    text: "We installed a massive 70 square meter transparent media screen in our atrium glass elevators. The effect is jaw-dropping. Reefilm India offered incredible design consulting and Raj Gupta oversaw the engineering calibration personally.",
    rating: 5
  },
  {
    id: "t2",
    name: "Prerna Mathur",
    designation: "Lead Retail Merchandiser",
    company: "Zoya Luxury Jewelry (Tata Group)",
    text: "Our boutique window displays must exude luxury. Reefilm's adhesive films gave us the perfect high-definition holographic visuals for our gold collection launch. Highly professional sales and installation partner.",
    rating: 5
  },
  {
    id: "t3",
    name: "Sanjay Goel",
    designation: "Senior Architect & Facade Advisor",
    company: "Goel & Associates Architects",
    text: "For corporate offices, light is life. Reefilm's products let us fulfill building energy codes by preserving natural daylight while meeting the developer's request for a giant branding screen. Best-in-class after-sales maintenance support.",
    rating: 5
  }
];

export const FAQS: FAQItem[] = [
  {
    question: "Is Reefilm India the original manufacturer of these transparent displays?",
    answer: "No, Reefilm India is the proud Authorized Sales, Installation & Technical Support Partner in India. We work directly with world-class international LED film developers to supply certified, highly customized materials, and handle complete structural engineering, local installation, custom frames, controller programming, and full on-site warranty servicing.",
    category: "About Reefilm"
  },
  {
    question: "What is the transparency level? Does it block office daylight?",
    answer: "Our adhesive LED films maintain outstanding transparency levels between 75% and 85%, depending on the pixel pitch. Standing inside the room, it appears like a subtle tinted window and allows natural sunlight to filter into the workspace, fully adhering to green building daylighting standards.",
    category: "Technical Features"
  },
  {
    question: "Can it be installed on existing glass windows or do we need new frames?",
    answer: "Our Adhesive Transparent LED Film is specifically designed for retrofitting! It features a specialized optical-grade self-adhesive back that can be directly wet-laminated onto your existing high-quality glass windows by our trained technicians. There is no need for structural glass replacements.",
    category: "Installation & Setup"
  },
  {
    question: "How do you control the content shown on the transparent screen?",
    answer: "The displays are driven by standard high-performance media controllers (Novastar / Colorlight compatible) which accept standard HDMI, DisplayPort, or Wi-Fi input. You can control the system directly from a PC, media player, cloud-based digital signage software, or even a smartphone app.",
    category: "Control & Software"
  },
  {
    question: "What is the warranty and technical support structure in India?",
    answer: "We provide an industry-leading 3-Year Platinum On-Site Warranty. Reefilm India has dedicated engineers stationed in Gurugram, Mumbai, and Bengaluru. If any technical anomaly or pixel strip failure occurs, our local support team visits your premises to replace the modular components with minimal downtime.",
    category: "Support & Warranty"
  }
];

export const INITIAL_LEADS: LeadInquiry[] = [
  {
    id: "lead-1",
    fullName: "Aravind Swami",
    email: "aravind@lntrealty.com",
    phone: "+91 99887 76655",
    company: "L&T Realty",
    role: "Senior Project Manager",
    productOfInterest: "Transparent LED Film (Adhesive)",
    pixelPitchPreference: "6.25mm",
    glassSize: "12m x 4m (48 sq. meters)",
    projectLocation: "Seawoods, Navi Mumbai",
    timeline: "Next 3 Months",
    budgetRange: "₹35L - ₹50L",
    specialRequirements: "Requires integration into double-height glass lobby, structural stability certificate for coastal winds.",
    status: "Proposal Sent",
    createdAt: "2026-06-25T11:20:00.000Z"
  },
  {
    id: "lead-2",
    fullName: "Sonia Dhillon",
    email: "sonia@bbdesign.co.in",
    phone: "+91 91234 56789",
    company: "B&B Architecture & Design",
    role: "Chief Interior Designer",
    productOfInterest: "Flexible LED Film (Curved Surfaces)",
    pixelPitchPreference: "5.0mm",
    glassSize: "3m Circumference Columns",
    projectLocation: "Aerocity, New Delhi",
    timeline: "Immediate (Within 30 Days)",
    budgetRange: "₹15L - ₹25L",
    specialRequirements: "Wrapping four load-bearing columns inside a premium hotel reception area.",
    status: "New",
    createdAt: "2026-06-26T16:45:00.000Z"
  }
];
