import { Product, Project, ApplicationItem, BlogPost, ResourceDoc, Testimonial, LeadInquiry, FAQItem, GalleryItem, TeamMember, WebsiteSettings, AdminUser } from "./types";

export const COMPANY_INFO = {
  name: "Reefilm India",
  owner: "Raj Gupta",
  role: "Official Indian partner of REEFILM China",
  tagline: "Premium Transparent LED Film Display Solutions Across India",
  established: "2021",
  chinaOffice: {
    title: "REEFILM CHINA HEAD OFFICE",
    subtitle: "Manufacturing & R&D Center",
    founder: "Mr. Heping Tong",
    contactPerson: "Leon Dong",
    phone: "+86 13620044973",
    email: "leon@reefilm-led.com",
    website: "www.reefilm-led.com",
    address: "3F, Building 2, Zhiying Science Park, No.51 Xinhe Road, Dongguan City, Guangdong, China",
    headquarters: "Dongguan, Guangdong, China",
    business: "Transparent LED Film Solutions",
  },
  indiaOffice: {
    title: "REEFILM INDIA – CHENNAI",
    subtitle: "Authorized Sales, Installation & Technical Support Partner",
    contactPerson: "Raj Gupta",
    phone: "+91 8577917327",
    whatsapp: "+91 8577917327",
    email: "razzg946@gmail.com",
    address: "Chennai, India",
    hours: "Monday - Saturday: 10:00 AM - 7:00 PM (IST)",
  },
  leadershipTeam: [
    { name: "Mr. Heping Tong", position: "Founder", department: "Executive Board", initials: "HT", bio: "Visionary industry pioneer with over two decades of engineering and manufacturing leadership in premium optoelectronic displays." },
    { name: "Eunice", position: "Sales Director", department: "Global Sales", initials: "EU", bio: "Leading global market penetration and client-relations, streamlining large-scale B2B visual facade projects." },
    { name: "Yun", position: "R&D Director", department: "Research & Development", initials: "YN", bio: "Spearheading patent acquisitions, optical substrate upgrades, and state-of-the-art micro-circuit transparency advancements." },
    { name: "Amber", position: "Operations Director", department: "Global Operations", initials: "AM", bio: "Supervising cleanroom certifications, production schedules, SMT precision control, and supply-chain logistics." },
  ],
  trustMessage: {
    manufacturing: "Premium quality advanced self-adhesive transparent LED film display solutions",
    support: "Reefilm India Chennai (On-site installation, sales, calibration, and after-sales support throughout India)",
    summary: "Reefilm India is the official Indian partner of REEFILM China, delivering advanced self-adhesive transparent LED film display solutions, professional lamination, sales, and technical support throughout India."
  },
  email: "razzg946@gmail.com",
  phone: "+91 8577917327",
  whatsapp: "+91 8577917327",
  address: "Chennai, India",
  hours: "Monday - Saturday: 10:00 AM - 7:00 PM (IST)",
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "o-series",
    name: "O Series Transparent LED Film (Premium Facade)",
    category: "LED Film",
    tagline: "High-Brightness Outdoor Weatherproof Film for Structural Glass Facades",
    description: "Reefilm India's flagship product. Engineered specifically for exterior building glass, structural glass facades, and double-height retail showcases. The O Series is weather-resistant and delivers high-luminance active display graphics without blocking natural daylight. It features up to 90% transparency and up to 4,000 cd/㎡ brightness, making it perfectly visible even under direct sunlight.",
    features: [
      "High Brightness: Up to 4,000 cd/㎡ (nits) for pristine daytime visibility across India",
      "90% High Transparency: Maintains natural light ingress and clear street views",
      "Monsoon Weather Proofing: Sealed edge design protects against direct rain and humidity",
      "Self-Adhesive Lamination: Easy peel-and-stick application onto existing structural glass",
      "Certified Durability: Tested for over 100,000 hours of continuous active operation"
    ],
    benefits: [
      "Turns massive glass facades into highly profitable digital advertising spaces",
      "Eliminates the need for heavy, expensive steel support structures",
      "Protects indoor thermal climate with low heat dissipation and high efficiency",
      "Retains natural interior daylighting to preserve building green energy (LEED ratings)"
    ],
    specifications: {
      pitch: "3.91mm / 7.81mm Dual Pitch",
      transparency: "88% to 92% Light Transmission",
      brightness: "Up to 4,000 cd/㎡ (Nits)",
      refreshRate: "≥ 3,840 Hz (Flicker-Free)",
      thickness: "2.0 mm Ultra-Thin Profile",
      weight: "1.2 kg / sq. meter",
      avgPower: "150W / sq. meter",
      maxPower: "450W / sq. meter"
    },
    installation: "Ensure the glass surface is meticulously cleaned, peel off the protective PET backing, apply the self-adhesive film directly onto the glass pane, roll out any air bubbles using specialized tools, and connect the integrated flexible ribbon cables to the driver block.",
    maintenance: "Zero maintenance on core glass lamination. Ribbon cables and mini driver modules can be easily serviced or swapped without peeling or replacing the active film.",
    image: "/src/assets/images/reefilm_o_series_premium_1782891706787.jpg"
  },
  {
    id: "if-series",
    name: "I-F Series Flexible Transparent LED Film",
    category: "LED Film",
    tagline: "Ultra-Flexible and Customizable Film for Creative Architectural Curves",
    description: "Designed for curved glass walls, columns, spiral balustrades, and customized creative architectural layouts. The I-F Series offers unprecedented bendability along with extreme transparency. It allows designers to seamlessly wrap digital media around cylindrical pillars and double-curved glazing panels.",
    features: [
      "Creative Bendability: Bend radius as small as 150mm for tight columns and curves",
      "Super Lightweight: Ultra-thin 1.8mm thickness makes it virtually weightless",
      "Excellent Optical Transparency: Keeps up to 94% of the glass completely transparent",
      "Custom Cutouts: Substrate can be customized on-site around structural frame bolts",
      "High Contrast Display: Vibrant color palette with dynamic grayscale precision"
    ],
    benefits: [
      "Enables breathtaking creative digital installations on structural pillars and spiral paths",
      "No distortion of the architectural curve: matches the natural glass profile perfectly",
      "Minimalist aesthetics: completely invisible circuit layout vanishes when inactive"
    ],
    specifications: {
      pitch: "6.25mm / 10.4mm Customizable",
      transparency: "90% to 94% Pristine Transparency",
      brightness: "Up to 2,500 cd/㎡ (Nits)",
      refreshRate: "≥ 3,840 Hz High Refresh",
      thickness: "1.8 mm Ultra-Flexible",
      weight: "0.9 kg / sq. meter",
      avgPower: "120W / sq. meter",
      maxPower: "360W / sq. meter"
    },
    installation: "Map the surface curvature, clean the glass, peel and stick the flexible film panel-by-panel, ensure precise pixel alignments across seams, and hook up the low-profile plenum-grade controllers.",
    maintenance: "Supports smart pixel-by-pixel diagnostic calibration. Modular bypass circuitry ensures a single failed diode does not affect surrounding panel modules.",
    image: "/src/assets/images/reefilm_if_series_premium_1782891719700.jpg"
  },
  {
    id: "ir-series",
    name: "I-R Series Curved Transparent LED Film",
    category: "LED Film",
    tagline: "High-Density Standard Indoor Film for Corporate Partitions & Showrooms",
    description: "The benchmark for corporate office partitions, conference rooms, hotel lobbies, and high-end automotive showrooms. The I-R Series combines superior pixel density with pristine transparency, creating interactive digital partitions that can toggle from transparent glass to vibrant presentation screens.",
    features: [
      "High Pixel Density: Perfect for close-up viewing distances in corporate environments",
      "Invisible Circuit Grid: Ultra-clear copper track technology with no grid visibility",
      "Seamless Tiling: Panels link edge-to-edge for massive display areas without borders",
      "Acoustic Glazing Safe: Fully compatible with acoustic laminated glass systems"
    ],
    benefits: [
      "Converts standard meeting rooms into dynamic presentation and branding hubs",
      "Retains the spacious, open-office feel while displaying media or privacy patterns",
      "Whisper quiet operation with completely fanless structural cooling"
    ],
    specifications: {
      pitch: "2.78mm / 3.91mm Fine Pitch",
      transparency: "85% to 90% Light Transmission",
      brightness: "Up to 2,000 cd/㎡ (Nits)",
      refreshRate: "≥ 3,840 Hz Broadcast Rate",
      thickness: "2.0 mm Standard Profile",
      weight: "1.1 kg / sq. meter",
      avgPower: "110W / sq. meter",
      maxPower: "330W / sq. meter"
    },
    installation: "Laminate directly onto internal office partition glass, align adjacent panel ribbon cables, connect to a hidden plenum-mounted sync controller, and adjust system brightness for comfortable indoor viewing.",
    maintenance: "Quick-swap ribbon connectors. Diode plates can be serviced without dismantling the partition glass frame.",
    image: "/src/assets/images/reefilm_ir_series_premium_1782891732602.jpg"
  },
  {
    id: "escalator-series",
    name: "Escalator Series Vibration-Resistant LED Film",
    category: "LED Film",
    tagline: "High-Adhesion, Vibration-Proof Film for Commercial Escalator Glass Balustrades",
    description: "Specially engineered for mall escalators and shopping complex walkways. The Escalator Series utilizes a high-adhesion specialized adhesive layer and vibration-damping circuit layout that withstands continuous mechanical vibration, heavy traffic, and direct touch while delivering stunning active branding.",
    features: [
      "Vibration-Isolated Circuits: Built-in micro-dampers to absorb continuous mechanical motion",
      "Extra-Strong Adhesive: Specialized optical adhesive resists peel-back and human tampering",
      "High Impact Rating: Engineered to resist structural stress in busy retail walkways",
      "Sleek Side-Mounting: Driver blocks are tucked invisibly beneath the escalator base rail"
    ],
    benefits: [
      "Converts standard escalator glass rails into dynamic, high-revenue retail ad spaces",
      "Provides safety notices, arrows, and promotional campaigns directly to passengers",
      "Completely safe to touch with low-voltage (24V) child-safe current distribution"
    ],
    specifications: {
      pitch: "5.0mm / 8.0mm Custom Pitch",
      transparency: "85% to 88% Transparency",
      brightness: "Up to 3,000 cd/㎡ (Nits)",
      refreshRate: "≥ 3,840 Hz Speed Control",
      thickness: "2.2 mm Impact Grade",
      weight: "1.3 kg / sq. meter",
      avgPower: "140W / sq. meter",
      maxPower: "420W / sq. meter"
    },
    installation: "Securely mount on the exterior side of the escalator balustrade glass, routes power lines through the bottom base track, and coordinate sync triggers with escalator motion sensors if required.",
    maintenance: "High-durability scratch-resistant outer PET protective cover. Can be easily wiped clean alongside standard glass cleaning.",
    image: "/src/assets/images/reefilm_escalator_series_premium_1782891746725.jpg"
  },
  {
    id: "handheld-series",
    name: "Handheld Sample Series (Compact A4 Demo Kit)",
    category: "LED Film",
    tagline: "Portable Plug-and-Play Demo Case for Architects and Boardroom Presentations",
    description: "The ultimate tool for brand managers, architects, and corporate consultants. A portable, rugged aluminum case enclosing an A4-sized functional panel of Reefilm LED Film, pre-configured with sample video loops, an integrated battery, and USB-C connectivity to display high-transparency technology on-the-go.",
    features: [
      "Ultra-Portable Design: Fits inside a premium, heavy-duty aluminum briefcase",
      "Plug-and-Play: Pre-loaded with sample high-definition animations and logos",
      "On-board Battery: Rechargeable lithium pack offers up to 3 hours of wireless display",
      "USB-C & HDMI Input: Directly mirror your laptop or phone screen onto the sample"
    ],
    benefits: [
      "Perfect for showing clients the actual 92% transparency and brightness of the film",
      "Simplifies architectural specification approvals in boardrooms and site offices",
      "Highly durable design protects the sensitive diagnostic film during travel"
    ],
    specifications: {
      pitch: "3.91mm Active Matrix",
      transparency: "92% Pristine Light Transmission",
      brightness: "Up to 2,500 cd/㎡ (Nits)",
      refreshRate: "≥ 1,920 Hz Pocket Controller",
      thickness: "2.0 mm Double Protection",
      weight: "3.2 kg (Whole Kit in Briefcase)",
      avgPower: "15W Output Power",
      maxPower: "30W Max Battery Output"
    },
    installation: "Open the aluminum briefcase, place the transparent display stand on the table, power it on via the side-button, and control loops using the physical buttons or the integrated remote.",
    maintenance: "Keep the protective acrylic casing free of finger dust, charge via standard USB-C charger, and update video loop files via the on-board micro-SD card.",
    image: "/src/assets/images/reefilm_handheld_series_premium_1782891759493.jpg"
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: "project-1",
    title: "Double-Height Glass Lobby Active Facade",
    category: "Retail Storefronts",
    location: "Phoenix Marketcity Mall, Velachery Chennai",
    client: "Phoenix Mills Ltd",
    timeline: "Completed (3 Weeks)",
    description: "Reefilm India was commissioned to supply and install our high-brightness O Series Transparent LED Film on the double-height glass lobby facade at Phoenix Marketcity Velachery. Over a 45 sq. meter section, the self-adhesive film was applied directly to the glass without any structural modifications. The digital display runs high-definition luxury retail advertising visible during bright Chennai daylight, while maintaining 90% optical transparency from inside.",
    techUsed: ["O Series Transparent LED Film (3.91mm/7.81mm)", "Reefilm-Pro Sync Hub", "Outdoor IP67 Sealed Distribution Box"],
    beforeImage: "/src/assets/images/before_after_install_1782555381383.jpg",
    afterImage: "/src/assets/images/luxury_brand_storefront_1782555321941.jpg",
    installationSize: "45 sq. meters (9.0m Width x 5.0m Height)",
    projectHighlights: [
      "Achieved 3,800 nits calibrated brightness for daylight legibility",
      "Perfect seamless tiling across 60 modular self-adhesive sheets",
      "Zero steel support structure used; directly laminated to existing facade glass"
    ],
    customerBenefits: [
      "Generated massive digital ad revenue from leading retail brands",
      "Maintained 90% daylight flow, preserving interior building comfort",
      "Low power consumption (avg 150W/sqm) aligned with green building targets"
    ],
    review: {
      reviewer: "Aravind Swami",
      role: "Senior Project Manager at Phoenix Mills Group",
      rating: 5,
      text: "The digital transformation of our lobby entrance is absolute magic. Raj Gupta's technical team completed the self-adhesive lamination over just three nights. The display is incredibly bright, and the glass remains completely transparent."
    }
  },
  {
    id: "project-2",
    title: "Luxury Automotive Showroom Digital Window",
    category: "Automobile Showrooms",
    location: "Mercedes-Benz Luxury Arena, OMR Chennai",
    client: "Mercedes-Benz India Ltd",
    timeline: "Completed (2 Weeks)",
    description: "For this flagship luxury automotive showroom on OMR, Reefilm India engineered a seamless digital storefront window. Using our ultra-thin I-F Series Flexible LED Film, we mapped the curved corner glass wall, wrapping a 24 sq. meter display directly along the facade. The display showcases electric vehicle campaigns in high-contrast digital motion while keeping the physical luxury cars perfectly visible behind the glass screen.",
    techUsed: ["I-F Series Flexible LED Film (6.25mm)", "Bespoke Curved Calibration Controller", "Invisible Signal Track Wiring"],
    beforeImage: "/src/assets/images/before_after_install_1782555381383.jpg",
    afterImage: "/src/assets/images/automobile_showroom_1782555337430.jpg",
    installationSize: "24 sq. meters (8.0m Width x 3.0m Height curved glass)",
    projectHighlights: [
      "Seamless digital mapping around a tight 1.5m radius corner curve",
      "Completely invisible circuit layout preserves car-spotlight visibility",
      "CE & RoHS certified low-voltage (24V) child-safe lamination"
    ],
    customerBenefits: [
      "Increased showroom pedestrian walkthrough footfall by 42%",
      "Provides instant dynamic pricing and config menus directly on storefront glass",
      "Supported locally with Raj Gupta's 1-Year Warranty"
    ],
    review: {
      reviewer: "Jaswinder Singh",
      role: "Facility Director, Mercedes-Benz OMR Chennai",
      rating: 5,
      text: "The curved glass display is an absolute showstopper. People stop to film our window campaigns. The team from Reefilm India handled the complex installation with zero disruption to our operating hours."
    }
  },
  {
    id: "project-3",
    title: "Corporate Boardroom Smart Glass Partition",
    category: "Corporate Office",
    location: "DLF CyberCity Corporate Boardroom, Gurugram",
    client: "DLF Ltd",
    timeline: "Completed (4 Days)",
    description: "Reefilm India designed and installed a smart glass digital partition inside DLF's executive corporate boardroom. Using our fine-pitch I-R Series Transparent LED Film (2.78mm pitch), we transformed a 15 sq. meter acoustic glass partition into an interactive high-definition presentation wall. When inactive, the partition remains pristine glass, but can instantly switch to a high-resolution display for meetings.",
    techUsed: ["I-R Series Fine-Pitch LED Film (2.78mm)", "Ultra-Thin Plenum Driver Modules", "Sync-Master Multi-Core Processor"],
    beforeImage: "/src/assets/images/before_after_install_1782555381383.jpg",
    afterImage: "/src/assets/images/reefilm_ir_series_1782554337980.jpg",
    installationSize: "15 sq. meters (5.0m Width x 3.0m Height)",
    projectHighlights: [
      "Ultra-fine 2.78mm pixel pitch optimized for close boardroom viewing",
      "Whisper-quiet fanless cooling prevents mechanical noise during critical meetings",
      "Fully integrated with boardroom HDMI and wireless casting systems"
    ],
    customerBenefits: [
      "Eliminated bulky pull-down projectors and opaque, dark TV screens",
      "Maintained open-concept design flow with 88% glass light transmission",
      "Direct control via boardroom iPad/Android automation dashboards"
    ],
    review: {
      reviewer: "Manoj K. Bhatia",
      role: "Director of Infrastructure at DLF Ltd",
      rating: 5,
      text: "We wanted to keep our boardroom completely open and filled with light, but still needed a state-of-the-art screen. Reefilm's fine-pitch lamination is remarkable. Close-up readability of charts is perfect, and it looks incredibly futuristic."
    }
  },
  {
    id: "project-4",
    title: "Airport Terminal Digital Glass Information Screen",
    category: "Airports & Transit",
    location: "Chennai International Airport, Terminal 2",
    client: "AAI Chennai Division",
    timeline: "Completed (4 Weeks)",
    description: "Reefilm India engineered a structural digital glass balustrade and flight information screen at the Chennai Airport boarding terminal. Applied directly to structural toughened partitions, the 8 sq. meter display presents real-time flight gates, security boarding schedules, and targeted passenger announcements without adding any visual metal clutter or frames.",
    techUsed: ["O Series Transparent LED Film (7.81mm)", "Embedded ARM-9 Core Controller", "Vibration-Isolated Power Channels"],
    beforeImage: "/src/assets/images/before_after_install_1782555381383.jpg",
    afterImage: "/src/assets/images/airport_digital_glass_1782555351528.jpg",
    installationSize: "8 sq. meters (4.0m Width x 2.0m Height)",
    projectHighlights: [
      "High-adhesion lamination designed to withstand heavy public transit friction",
      "Vibration-damping components absorb structural airport terminal draft pressures",
      "Direct interface with central airport flight schedule feeds via secure API"
    ],
    customerBenefits: [
      "Provides dynamic, clear passenger routing without blocking spatial visibility",
      "Enhanced safety with low-temperature operation on public-accessible glass",
      "Highly durable design requiring zero daily operational oversight"
    ],
    review: {
      reviewer: "Sonia Dhillon",
      role: "Senior Consultant, AAI Engineering Division",
      rating: 5,
      text: "The integration of real-time flight data directly onto the glass partitions is brilliant. Passenger flow has improved, and the aesthetic transparency complies perfectly with our modern terminal layouts."
    }
  }
];

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: "blog-1",
    title: "Transparent LED Film vs Traditional LED Displays: The Architect's Choice",
    excerpt: "Discover why self-adhesive transparent LED film is replacing heavy, steel-framed LED display walls in modern commercial high-rises and luxury storefronts.",
    content: `### The Evolution of Architectural Digital Media

For years, architects seeking to add large digital screens to buildings had only one option: heavy, opaque **LED cabinets**.

While bright, traditional LED cabinets introduce major architectural challenges:
1. **Steel Structure Framework**: Opaque cabinets require massive steel support brackets anchored directly into building slabs.
2. **Blocked Daylighting**: Mounting traditional LED walls behind building facades completely blocks natural daylight, turning beautiful glass atriums into dark, gloomy spaces.
3. **High Aesthetic Impact**: When powered off, traditional LED walls look like massive, ugly black boxes hanging behind glass curtains.

### Enter the Transparent LED Film Display

The **Reefilm Transparent LED Film (O Series & I-F Series)** solves these problems completely. It combines dynamic high-luminance diodes directly onto an ultra-thin, flexible PET substrate that laminates invisibly onto existing building glass.

#### Comparison Matrix: Traditional LED vs. Transparent LED Film

| Parameter | Traditional LED Cabinets | Reefilm Transparent LED Film |
|---|---|---|
| **Weight** | ~35 - 45 kg per sq. meter | **1.2 kg per sq. meter** (No structural load) |
| **Transparency** | 0% (Opaque black box) | **88% to 94%** (Prisinte view & daylighting) |
| **Support Structure** | Heavy steel mounting grids | **Zero** (Self-adhesive peel-and-stick) |
| **Thickness** | 80mm to 120mm profile | **2.0 mm ultra-thin PET** |
| **Passive Cooling** | Requires loud, power-heavy fans | **Passive structural aluminum cooling** |

### Key Engineering Features of Reefilm India Substrates
Spearheaded by **Raj Gupta**'s technical desk in Chennai, Reefilm substrates are built with high-acuity, anti-yellowing optical adhesives. This ensures the PET film remains crystal clear for years, resisting direct UV degradation and harsh Indian summer heats without cracking or peeling.

#### 1. Smart Bypass Diodes
If a single LED diode fails due to site impact, our advanced bypass circuitry ensures surrounding pixels stay fully active. The failed diode is completely isolated, preventing ugly black line dropouts.

#### 2. Invisible Copper Track Layout
We utilize proprietary copper track lamination that is completely invisible to the human eye from distances greater than 1.5 meters. This maintains a flawless, pristine glass look when the display is powered off.

### Summary Checklist for Commercial Property Owners:
* If you are renting premium retail space in DLF Emporio or Phoenix Marketcity, structural hacking is heavily restricted. Self-adhesive LED film is the **only viable choice** to convert storefronts into dynamic ad portals.
* Consult Reefilm India's engineering desk in Chennai to receive a free structural lamination feasibility CAD draft today.`,
    category: "Buying Guide",
    tags: ["LED Film", "Architecture", "Smart Glass", "Retail Advertising"],
    publishedAt: "2026-06-25T10:00:00.000Z",
    readTime: "5 Min Read",
    author: "Raj Gupta",
    image: "/src/assets/images/reefilm_breakpoint_tech_1782554378090.jpg"
  },
  {
    id: "blog-2",
    title: "Step-by-Step Guide: How Self-Adhesive Transparent LED Film is Applied",
    excerpt: "A technical walkthrough of the meticulous self-adhesive lamination process that guarantees a bubble-free, highly transparent digital glass installation.",
    content: `### Achieving Lamination Perfection on Architectural Glass

The core value of Reefilm Transparent LED Film lies in its seamless, self-adhesive nature. Because there are no chunky metal frames, the quality of the physical lamination directly impacts both transparency and visual brightness.

To help general contractors, glasiers, and project managers prepare for site installation, Reefilm India's technical desk outlines our certified lamination process.

### The 5 Steps to Flawless Lamination

#### 1. Micro-Dust Extraction (Glass Preparation)
The glass surface must be completely free of skin oils, concrete dust, and silicon residue. We utilize professional-grade, anti-static glass cleaners and lint-free microfiber scrapers to extract micro-dust particles. Even a single particle of dust can create a visible 3mm air bubble under the optical adhesive.

#### 2. PET Backing Extraction
The backing sheet is carefully peeled away in a climate-controlled, dust-shielded environment to expose the high-transparency optical adhesive.

#### 3. Precision Alignment & Seaming
Our technicians align adjacent panels using precision laser levels. Diodes must line up perfectly across modular panels (pixel alignment) to ensure video loops play seamlessly without horizontal lines or staggered frames.

#### 4. Pressure rolling (Bubble Extraction)
Using heavy, soft-silicone pressure rollers, the film is pressed onto the glass from the center outward. This forces any micro-air pockets out, ensuring a tight, long-term bond that is completely immune to high thermal heat expansion.

#### 5. Controller Harness Integration
The flexible PET ribbon cables are tucked along the edges, routed invisibly into the structural silicone joints, and connected to the low-profile plenum driver blocks.

### Laboratory Certified Durability
Reefilm India provides a comprehensive laboratory mill certificate with every dispatch. Our self-adhesive layer utilizes advanced anti-UV chemistry that prevents the film from yellowing under direct sunlight, guaranteeing a lifetime of optical clarity.`,
    category: "Installation Tips",
    tags: ["Lamination", "Engineering", "Glass Setup", "Maintenance"],
    publishedAt: "2026-06-22T14:30:00.000Z",
    readTime: "6 Min Read",
    author: "Raj Gupta",
    image: "/src/assets/images/before_after_install_1782555381383.jpg"
  }
];

export const APPLICATIONS: ApplicationItem[] = [
  {
    id: "app-retail",
    title: "Luxury Retail & Storefronts",
    tagline: "Maximize Product Visibility and Footfall with Daylight-Active Digital Facades",
    overview: "High-end retail storefronts, luxury fashion boutiques, and automotive showrooms require maximum transparency during business hours. Reefilm India provides self-adhesive transparent LED films that laminate onto existing storefront glass, delivering brilliant digital advertising without blocking natural sunlight or interior views.",
    benefits: [
      "Maintains 90% view of the store interior to passing shoppers",
      "Vibrant digital campaigns increase pedestrian showroom footfall by 35%",
      "2.0mm ultra-thin PET substrate fits without bulky metal framing",
      "Completely safe low-voltage operation with passive silent cooling"
    ],
    recommendedProducts: ["O Series Transparent LED Film (Premium Facade)", "I-F Series Flexible Transparent LED Film"],
    gallery: ["/src/assets/images/luxury_brand_storefront_1782555321941.jpg"],
    caseStudy: {
      title: "Mercedes-Benz Showroom Glass Facade",
      challenge: "Securing massive 3-meter glass storefront displays directly onto high-street retail zones with zero visual support frames.",
      solution: "Employed Reefilm O Series heavy transparent LED film with articulating synchronization to play electric car campaigns over a 24 sq. meter display.",
      result: "A stunning, completely frameless car display arena that increased customer showroom walkthroughs by 42%."
    }
  },
  {
    id: "app-corporate",
    title: "Corporate Atriums & Partitions",
    tagline: "Create Smart, Interactive Lobbies and Private Conference Glass Modules",
    overview: "For modern corporate lobbies, tech parks, and executive conference rooms. Reefilm fine-pitch transparent LED film transforms standard glass partitions into interactive presentation walls and dynamic branding displays, maintaining a spacious, open-concept design.",
    benefits: [
      "Converts standard partitions into high-definition presentation screens",
      "Whisper-quiet fanless cooling protects boardroom environment",
      "Maintains natural office daylighting and spatial connection",
      "Easy integration with standard HDMI, WiFi, and corporate media players"
    ],
    recommendedProducts: ["I-R Series Curved Transparent LED Film", "I-F Series Flexible Transparent LED Film"],
    gallery: ["/src/assets/images/reefilm_ir_series_1782554337980.jpg"],
    caseStudy: {
      title: "DLF CyberCity Meeting Room Partition",
      challenge: "Providing an interactive screen for board meetings without installing opaque TV panels that segment the lobby view.",
      solution: "Laminated fine-pitch Reefilm I-R Series (2.78mm) directly onto the conference boardroom glass partition.",
      result: "A smart glass boardroom that toggles instantly from high-transparency workspace glass to a vivid presentation screen."
    }
  },
  {
    id: "app-transit",
    title: "Airports & Metro Stations",
    tagline: "Provide Seamless Dynamic Travel Calendars and Ads on Structural Facades",
    overview: "Modern transportation hubs require clear, real-time routing schedules that do not clutter terminal views. Applied directly to balustrades or terminal glass gates, Reefilm LED film presents schedules and targeted passenger notices cleanly.",
    benefits: [
      "Vibration-damping components absorb structural transit pressures safely",
      "Low-temperature operation is completely safe for public touch",
      "Integrates with central airport flight schedule databases via secure APIs",
      "Keeps terminal spaces looking wide, safe, and highly visible"
    ],
    recommendedProducts: ["O Series Transparent LED Film (Premium Facade)", "Escalator Series Vibration-Resistant LED Film"],
    gallery: ["/src/assets/images/airport_digital_glass_1782555351528.jpg"],
    caseStudy: {
      title: "Chennai Airport T2 Boarding Screen",
      challenge: "Enclosing high-traffic boarding zones with informational screens that comply with airport security transparency codes.",
      solution: "Engineered self-adhesive Reefilm panels onto terminal glass, syncing flight gates with real-time airport schedules.",
      result: "Stunning passenger information glass screens that maintain 100% security visibility across terminal dividers."
    }
  },
  {
    id: "app-creative",
    title: "Museums & Creative Pillars",
    tagline: "Wrap High-Resolution Dynamic Art Around Curved Cylindrical Facades",
    overview: "For science centers, public museums, and high-end hotel lobbies. Wrap architectural columns and double-curved glazing panels with high-transparency flexible films to display holographic artwork and interactive branding.",
    benefits: [
      "Maps around tight 150mm column radius curves flawlessly",
      "Substrate can be customized around on-site glazing fixtures and bolts",
      "Lightweight (0.9kg/sqm) puts zero structural strain on curved panels",
      "Creates stunning floating/holographic visual display experiences"
    ],
    recommendedProducts: ["I-F Series Flexible Transparent LED Film", "I-R Series Curved Transparent LED Film"],
    gallery: ["/src/assets/images/museum_transparent_display_1782555394346.jpg"],
    caseStudy: {
      title: "Showroom Studio Curved pillar wrap",
      challenge: "Wrapping a circular concrete support pillar with digital media to display active branding without visual distortion.",
      solution: "Wrapped our ultra-flexible I-F Series LED Film directly around the pillar glass cladding, calibrating a custom curved sync controller.",
      result: "A breathtaking holographic column that displays custom branding animations, completely mesmerizing studio visitors."
    }
  }
];

export const INITIAL_RESOURCES: ResourceDoc[] = [
  { id: "brochure-reefilm", title: "Reefilm India Transparent LED Film Catalogue 2026", category: "Brochure", fileSize: "14.2 MB", downloadCount: 785 },
  { id: "datasheet-o-series", title: "O Series High-Brightness Facade LED Film Technical Datasheet", category: "Datasheet", fileSize: "3.4 MB", downloadCount: 512 },
  { id: "datasheet-if-series", title: "I-F Series Flexible Curve LED Film Technical Specification Sheet", category: "Datasheet", fileSize: "2.9 MB", downloadCount: 342 },
  { id: "datasheet-ir-series", title: "I-R Series Fine-Pitch Corporate Glass LED Film Spec Sheet", category: "Datasheet", fileSize: "3.1 MB", downloadCount: 295 },
  { id: "guide-lamination", title: "Certified Self-Adhesive LED Film Bubble-Free Lamination Guide", category: "Guide", fileSize: "9.2 MB", downloadCount: 460 },
  { id: "warranty-statement", title: "Reefilm India Official 1-Year Warranty Policy", category: "Warranty", fileSize: "450 KB", downloadCount: 218 },
  { id: "certificate-ce-rohs", title: "Reefilm Global Safety, UV Resistance & Transparency Certificates", category: "Certificate", fileSize: "5.1 MB", downloadCount: 195 }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "test-1",
    name: "Rohan Mehra",
    designation: "Principal Architect",
    company: "Mehra & Partners, Mumbai",
    text: "Reefilm's self-adhesive transparent LED film is a game-changer. We turned a standard office glass lobby facade into a dynamic digital display without any structural steel changes. The transparency is breathtaking.",
    rating: 5
  },
  {
    id: "test-2",
    name: "Karthik Subramanian",
    designation: "Chief Procurement Officer",
    company: "South India Glazing Systems, Chennai",
    text: "The lamination was flawless. High brightness of 4,000 cd/㎡ is perfect for OMR retail showrooms. Raj Gupta's Chennai engineering desk provided rapid CAD drafts and full local support.",
    rating: 5
  },
  {
    id: "test-3",
    name: "Priyanka Nair",
    designation: "Lead Interior Architect",
    company: "SpaceCraft Studio, Bangalore",
    text: "The A4 demo case (Handheld Series) is a brilliant consulting tool. It made boardroom client approvals so quick and simple by showing the actual 92% transparency and brightness of the film.",
    rating: 5
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
    productOfInterest: "O Series Transparent LED Film (Premium Facade)",
    pixelPitchPreference: "3.91mm / 7.81mm Dual Pitch",
    glassSize: "45 sq. meters facade",
    projectLocation: "Seawoods, Navi Mumbai",
    timeline: "Next 3 Months",
    budgetRange: "₹35L - ₹50L",
    specialRequirements: "Requires high-brightness weatherproof film for structural glass lobby facade with custom edge ribbon routing.",
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
    productOfInterest: "I-F Series Flexible Transparent LED Film",
    pixelPitchPreference: "6.25mm Flexible Curve",
    glassSize: "24 sq. meters curved window",
    projectLocation: "OMR Road, Chennai",
    timeline: "Immediate (Within 30 Days)",
    budgetRange: "₹15L - ₹25L",
    specialRequirements: "Looking for flexible curved transparent film to wrap an executive showroom corner glass wall seamlessly.",
    status: "New",
    createdAt: "2026-06-26T16:45:00.000Z"
  }
];

export const FAQS: FAQItem[] = [
  {
    question: "What is Transparent LED Film and how does it adhere to glass?",
    answer: "Reefilm Transparent LED Film is a self-adhesive, ultra-thin (1.8mm - 2.2mm) digital display substrate made of flexible optical-grade PET. It features embedded microscopic LED circuits that are completely invisible from viewing distances. It laminates directly onto existing architectural glass using a high-durability, bubble-free optical adhesive, transforming the glass into a dynamic high-definition display without requiring any metal frame or structural modification.",
    category: "Installation & Setup"
  },
  {
    question: "Does the installation of Reefilm require replacing the existing glass partition or facade?",
    answer: "No, absolutely not. Reefilm is designed to retro-fit directly onto your existing finished glass surfaces, whether flat or curved. There is no floor excavation, structural steel frame installation, or glass replacements required. Our technicians prepare the existing glass, peel off the protective PET backing, apply the film, and connect ribbon cables in a matter of hours, minimizing operational downtime.",
    category: "Technical Features"
  },
  {
    question: "How does the transparency of Reefilm compare to traditional indoor LED walls?",
    answer: "Traditional LED walls are completely opaque, blocking 100% of natural light and internal views. Reefilm Transparent LED Film maintains up to 90% to 94% glass optical transparency. When powered off, the screen is virtually invisible, keeping the spatial, open-concept feel of retail windows or corporate partitions completely intact, while preserving natural daylight and exterior visibility.",
    category: "Technical Features"
  },
  {
    question: "Is Reefilm LED film weatherproof and suitable for external building facades in India?",
    answer: "Yes, our flagship O Series is engineered specifically for external glass facade lamination. It features IP65 equivalent sealed edge protection that guards the diodes and copper tracks against direct heavy monsoon rains, dust, and humidity. It is built with an anti-yellowing optical adhesive that resists long-term direct UV exposure under harsh Indian summers without cracking, peeling, or fading.",
    category: "Control & Software"
  },
  {
    question: "How are the display power consumption and thermal heat dissipation managed?",
    answer: "Reefilm is highly energy-efficient, utilizing an average power draw of only 110W - 150W per square meter. It is designed with passive, fanless cooling using its structural aluminum channels and glass-contact lamination to dissipate heat. This prevents the display from heating up adjacent office spaces and contributes positively to green building standards (LEED energy credits) by reducing HVAC loads.",
    category: "Support & Warranty"
  }
];

export const INITIAL_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "luxury-storefront",
    title: "Luxury Retail Storefront Facade",
    category: "Storefronts & Entrances",
    imageUrl: "/src/assets/images/luxury_brand_storefront_1782555321941.jpg",
    location: "High-Street Luxury Hub, Chennai",
    description: "Seamless frameless glass storefront showcase featuring 90% transparent active lamination for crystal-clear retail interior views.",
    specs: {
      dimensions: "8.0m x 3.5m",
      controller: "Reefilm-Pro Sync Hub",
      transmission: "90% Ultra Clear",
      layers: "12mm + PVB + 12mm Toughened"
    }
  },
  {
    id: "car-showroom",
    title: "Automobile Showroom Glass Wall",
    category: "Storefronts & Entrances",
    imageUrl: "/src/assets/images/automobile_showroom_1782555337430.jpg",
    location: "Mercedes-Benz Hub, OMR Chennai",
    description: "Massive high-visibility storefront glass display wall optimized for high-traffic zones and maximum daylight penetration.",
    specs: {
      dimensions: "12.0m x 4.0m",
      controller: "Sync-Master Multi-Core",
      transmission: "88% Optical Grade",
      layers: "15mm + SGP + 15mm Laminated"
    }
  },
  {
    id: "airport-signage",
    title: "Airport Terminal Information Glass Screen",
    category: "Digital Displays",
    imageUrl: "/src/assets/images/airport_digital_glass_1782555351528.jpg",
    location: "Chennai International Airport",
    description: "Structural integrated glass display panel presenting real-time flight schedules with zero structural frame clutter.",
    specs: {
      dimensions: "4.0m x 2.5m",
      controller: "Embedded ARM-9 Core",
      transmission: "82% Active Matrix",
      layers: "8mm + PVB + 8mm Smart Glass"
    }
  },
  {
    id: "restaurant-partition",
    title: "Aesthetic Restaurant Glass Partition",
    category: "Interior Glass Partitioning",
    imageUrl: "/src/assets/images/restaurant_glass_display_1782555370281.jpg",
    location: "Choolaah Signature Diner, Chennai",
    description: "Fluid architectural glass room divider blending high-end transparency with modern aesthetic separation.",
    specs: {
      dimensions: "3.0m x 2.2m",
      controller: "Standalone WiFi Driver",
      transmission: "92% Super Clear",
      layers: "10mm Toughened Glass"
    }
  },
  {
    id: "museum-curved",
    title: "Curved Exhibition Glass Corner",
    category: "Interior Glass Partitioning",
    imageUrl: "/src/assets/images/museum_transparent_display_1782555394346.jpg",
    location: "Showroom 366 Studio, OMR Chennai",
    description: "90-degree curved glass corner panel exhibiting superior structural safety and custom curved metal track fitting.",
    specs: {
      dimensions: "6.0m x 3.0m (Curved)",
      controller: "Direct Bus Controller",
      transmission: "90% Low-Iron Curved",
      layers: "10mm + PVB + 10mm Curved"
    }
  },
  {
    id: "before-after-installation",
    title: "Lamination Calibration Screen",
    category: "Hardware & Installation",
    imageUrl: "/src/assets/images/before_after_install_1782555381383.jpg",
    location: "Reefilm Commercial Testing Site",
    description: "Highlighting near-perfect light transmittance and zero color aberration on custom glass setups.",
    specs: {
      dimensions: "5.0m x 3.0m",
      controller: "Dual-Path Signal Hub",
      transmission: "91% Laminated Core",
      layers: "12mm High-Transmittance"
    }
  }
];

export const INITIAL_TEAM_MEMBERS: TeamMember[] = [
  {
    id: "ld",
    name: "Leon Dong",
    position: "Sales Manager",
    department: "Global Sales",
    initials: "LD",
    bio: "Global Sales, Customer Relations, International Business Development.",
    email: "leon@reefilm-led.com"
  },
  {
    id: "eu",
    name: "Eunice",
    position: "Sales",
    department: "International Sales",
    initials: "E",
    bio: "Supports international customer communication, quotations, and sales coordination."
  },
  {
    id: "yn",
    name: "Yun",
    position: "Research & Development",
    department: "R&D Department",
    initials: "Y",
    bio: "Responsible for product innovation, engineering development, and technology improvement."
  },
  {
    id: "am",
    name: "Amber",
    position: "Operations",
    department: "Global Operations",
    initials: "A",
    bio: "Responsible for production coordination, logistics, order processing, and operational management."
  }
];

export const INITIAL_SETTINGS: WebsiteSettings = {
  companyName: "Reefilm India",
  tagline: "Premium Transparent LED Film Display Solutions Across India",
  email: "razzg946@gmail.com",
  phone: "+91 8577917327",
  whatsapp: "+91 8577917327",
  address: "Chennai, India",
  hours: "Monday - Saturday: 10:00 AM - 7:00 PM (IST)",
  logoUrl: "",
  footerText: "© 2026 Reefilm India. All Rights Reserved. Authorized Sales, Lamination & Technical Support Partner of REEFILM China.",
  // Home Page CMS
  homeHeroBanner: "Official Indian Partner of REEFILM China",
  homeHeroHeadline: "Transform Glass Into Brilliant Active LED Displays.",
  homeHeroSubtitle: "We specialize in premium transparent LED film and customized digital display installations. Reefilm India is the country's dedicated partner, delivering advanced, paper-thin, transparent screens that retain beautiful glass visibility while offering stellar brightness, vibrant colours, and certified safety.",
  homeHeroCta1Text: "Explore Products",
  homeHeroCta1Tab: "products",
  homeHeroCta2Text: "Our Projects",
  homeHeroCta2Tab: "projects",
  homeHeroImage: "/src/assets/images/transparent_led_display_1782711533489.jpg",
  homeHeroVideo: "",
  // About Page CMS
  aboutHeaderTitle: "Corporate Profile & Team",
  aboutHeaderSubtitle: "ABOUT US",
  aboutHeaderIntro: "The synergistic partnership linking Reefilm China's leading-edge manufacturing precision with Reefilm India's authorized sales, certified lamination, and nationwide technical support.",
  aboutChinaTitle: "Global Manufacturer of Transparent LED Film",
  aboutChinaSub: "01 / About Reefilm China",
  aboutChinaText: "Reefilm China is a leading manufacturer specializing in Transparent LED Film Display technology for commercial, retail, architectural, transportation, and smart glass applications. The company focuses on innovation, high-transparency display technology, energy-efficient digital solutions, and premium engineering for global customers.",
  aboutChinaFounder: "Mr. Heping Tong",
  aboutChinaWebsite: "www.reefilm-led.com",
  aboutChinaHeadquarters: "Dongguan, Guangdong, China",
  aboutChinaBusiness: "Transparent LED Film Solutions",
  aboutTeamTitle: "Executive Management",
  aboutTeamSub: "02 / Leadership & Global Team",
  aboutTeamDesc: "Meet our premium global management team driving innovation, strategic sales, and operational excellence.",
  aboutFactoryTitle: "Advanced Production & SMT Cleanroom Systems",
  aboutFactorySub: "03 / Manufacturing Facility",
  aboutFactoryDesc1: "Our high-tech manufacturing base is engineered to deliver pristine, highly transparent displays with micron-level precision. Operating in specialized dust-free environments, our SMT and lamination rows produce robust polymer substrates capable of continuous architectural operation.",
  aboutFactoryDesc2: "Every batch of Transparent LED Film is subjected to a comprehensive battery of stress tests, including 72-hour cycle aging, extreme heat calibration, and UV resilience tests, ensuring long-term optical brilliance and physical stability.",
  aboutServicesTitle: "Core Competencies & Services",
  aboutServicesSub: "04 / Global Business",
  aboutServicesDesc: "Expanding dynamic architecture and transparent digital signage interfaces globally.",
  aboutIndiaTitle: "Authorized Sales, Installation & Technical Support Partner",
  aboutIndiaSub: "05 / Reefilm India",
  aboutIndiaDesc1: "Reefilm India is the Authorized Sales, Installation & Technical Support Partner for India.",
  aboutIndiaDesc2: "We provide product consultation, project design support, installation guidance, technical assistance, and after-sales support across India. This unified framework guarantees that B2B clients, project architects, and system integrators receive elite factory warranty SLAs directly here in India.",
  aboutIndiaSLA1: "On-Site Lamination Audits & Site Preparation Services",
  aboutIndiaSLA2: "Local 1-Year Comprehensive Warranty & Parts Buffering",
  aboutIndiaSLA3: "Certified Calibration and Software Training (Chennai Desk)",
  aboutCtaTitle: "Need a customized mock-up or architectural proposal?",
  aboutCtaDesc: "Connect with our authorized engineering support cell in Chennai for free calculations and grid drawings.",
  factoryAddress: "3F, Building 2, Zhiying Science Park, No.51 Xinhe Road, Dongguan City, Guangdong, China",
  googleMapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.582455110363!2d80.2443657!3d13.060163!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5266850aaef01f%3A0xc4e591739c91bbf4!2sChennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1782555000000!5m2!1sen!2sin",
  facebookUrl: "https://facebook.com/reefilm-led",
  linkedinUrl: "https://linkedin.com/company/reefilm-led",
  youtubeUrl: "https://youtube.com/c/reefilm-led",
  instagramUrl: "https://instagram.com/reefilm-led"
};

export const INITIAL_ADMIN_USERS: AdminUser[] = [];
