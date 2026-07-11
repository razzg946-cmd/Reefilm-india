import imgOSeries from "./assets/images/reefilm_o_series_premium_1782891706787.jpg";
import imgIfSeries from "./assets/images/reefilm_if_series_premium_1782891719700.jpg";
import imgIrSeries from "./assets/images/reefilm_ir_series_premium_1782891732602.jpg";
import imgEscalator from "./assets/images/reefilm_escalator_series_premium_1782891746725.jpg";
import imgHandheld from "./assets/images/reefilm_handheld_series_premium_1782891759493.jpg";

import imgAirport from "./assets/images/airport_digital_glass_1782555351528.jpg";
import imgShowroom from "./assets/images/automobile_showroom_1782555337430.jpg";
import imgBeforeAfter from "./assets/images/before_after_install_1782555381383.jpg";
import imgLuxury from "./assets/images/luxury_brand_storefront_1782555321941.jpg";
import imgMuseum from "./assets/images/museum_transparent_display_1782555394346.jpg";
import imgBreakpointTech from "./assets/images/reefilm_breakpoint_tech_1782554378090.jpg";
import imgTransparencyDemo from "./assets/images/reefilm_transparency_demo_1782554388889.jpg";
import imgRestaurant from "./assets/images/restaurant_glass_display_1782555370281.jpg";
import imgTransparentLed from "./assets/images/transparent_led_display_1782711533489.jpg";

import { 
  Layers, 
  Eye, 
  Sun, 
  ShieldCheck, 
  Cpu, 
  Smartphone, 
  Zap, 
  Sliders, 
  Activity 
} from "lucide-react";

export interface ProductSeries {
  id: string;
  name: string;
  category: string;
  title: string;
  subtitle: string;
  description: string;
  mainImage: string;
  highlights: string[];
  benefits: string[];
  applications: string[];
  features: { title: string; description: string; icon: any }[];
  specs: {
    pixelPitch: string;
    brightness: string;
    transparency: string;
    thickness: string;
    weight: string;
    inputVoltage: string;
    power: string;
    angle: string;
    refreshRate: string;
    grayscale: string;
    temp: string;
    humidity: string;
    controller: string;
    driveMode: string;
    lifespan: string;
  };
  models: { name: string; pitch: string; viewingDistance: string; brightness: string; bestFor: string }[];
  gallery: {
    installation: { title: string; img: string }[];
    closeup: { title: string; img: string }[];
    application: { title: string; img: string }[];
  };
  installationGuide: { step: string; title: string; desc: string }[];
  faqs: { q: string; a: string }[];
  videoUrl?: string;
  brochureUrl?: string;
  displayOrder?: number;
}

export const ALL_TARGET_APPLICATIONS = [
  "Retail Stores",
  "Shopping Malls",
  "Luxury Stores",
  "Corporate Offices",
  "Hotels",
  "Restaurants",
  "Museums",
  "Airports",
  "Banks",
  "Hospitals",
  "Glass Facades",
  "Curtain Wall Buildings",
  "Auto Showrooms",
  "Stage Events"
];

export const productSeriesList: ProductSeries[] = [
  {
    id: "o-series",
    name: "O Series",
    category: "Outdoor Facade Film",
    title: "O Series Premium Facade Film",
    subtitle: "High-Brightness Outdoor Weatherproof Self-Adhesive Film",
    description: "The Reefilm O Series is the premium industry standard for outdoor-facing commercial glass envelopes. Engineered specifically to withstand severe UV rays and direct sunlight, it delivers extremely high luminance outputs. Ideal for main glass facades, modern skyscrapers, luxury storefronts, and double-height atriums where daytime visibility is a critical commercial requirement.",
    mainImage: imgOSeries,
    highlights: [
      "Ultra-high daytime brightness up to 4,000 Nits",
      "Superior lamination stability against direct tropical UV exposure",
      "Completely invisible circuitry grid design",
      "Supports seamless cascading over hundreds of square meters"
    ],
    benefits: [
      "Transforms standard glass envelopes into highly profitable advertising screens",
      "Protects indoor thermal comfort with advanced heat dissipation technology",
      "Retains natural lighting to preserve building green energy (LEED ratings)",
      "Bypasses city building regulations by installing directly behind interior glass face"
    ],
    applications: [
      "Glass Facades",
      "Curtain Wall Buildings",
      "Luxury Stores",
      "Shopping Malls",
      "Retail Stores",
      "Auto Showrooms",
      "Airports"
    ],
    features: [
      { title: "Ultra-Thin Design", description: "At only 2.0 mm thickness, the active film core sits flat on glass without any visual volume.", icon: Layers },
      { title: "Self-Adhesive Installation", description: "Optical-grade adhesive lamination requires zero steel support frames or intrusive mounting structures.", icon: ShieldCheck },
      { title: "No Steel Structure Needed", description: "Saves massive costs and structural weight load restrictions by bonding directly to glass.", icon: Cpu },
      { title: "High Transparency", description: "Maintains a pristine 90% – 94% transparency index for clear sightlines and daylight ingress.", icon: Eye },
      { title: "Invisible Circuit Design", description: "Utilizes nanotech micro-circuits that completely disappear when the display is switched off.", icon: Sliders },
      { title: "Energy Saving", description: "Consumes just 220W/㎡ on average, minimizing operating carbon footprints.", icon: Zap }
    ],
    specs: {
      pixelPitch: "P4 / P8 / P10 / P15 / P20",
      brightness: "Up to 4,000 cd/㎡ (Nits)",
      transparency: "90% – 94% Light Transmission",
      thickness: "2.0 mm Profile",
      weight: "1.5 kg / ㎡",
      inputVoltage: "AC 110V – 240V, 50/60Hz",
      power: "Avg: 220 W/㎡, Max: 600 W/㎡",
      angle: "H: 160° / V: 160° Ultra-Wide",
      refreshRate: "≥ 3,840 Hz High Broadcast Speed",
      grayscale: "16-Bit Processing",
      temp: "-10°C to +60°C",
      humidity: "10% – 90% RH (Non-condensing)",
      controller: "Novastar / Colorlight Synchronous System",
      driveMode: "Static Constant Current Drive",
      lifespan: "100,000 Hours"
    },
    models: [
      { name: "P4", pitch: "4.0 mm", viewingDistance: "≥ 4 Meters", brightness: "3,500 cd/㎡", bestFor: "Short-distance premium boutique storefronts" },
      { name: "P5", pitch: "5.0 mm", viewingDistance: "≥ 5 Meters", brightness: "3,800 cd/㎡", bestFor: "High-street retail glass facades" },
      { name: "P6.25", pitch: "6.25 mm", viewingDistance: "≥ 6 Meters", brightness: "4,000 cd/㎡", bestFor: "Shopping mall glass envelopes" },
      { name: "P8", pitch: "8.0 mm", viewingDistance: "≥ 8 Meters", brightness: "4,000 cd/㎡", bestFor: "Medium range structural glass facades" },
      { name: "P10", pitch: "10.0 mm", viewingDistance: "≥ 10 Meters", brightness: "4,000 cd/㎡", bestFor: "Skyscraper glass curtain walls" },
      { name: "P15", pitch: "15.0 mm", viewingDistance: "≥ 15 Meters", brightness: "3,500 cd/㎡", bestFor: "Multi-story atrium hanging displays" },
      { name: "P20", pitch: "20.0 mm", viewingDistance: "≥ 20 Meters", brightness: "3,000 cd/㎡", bestFor: "Large scale structural facade crowns" }
    ],
    gallery: {
      closeup: [
        { title: "94% Active Transparency Matrix", img: imgTransparencyDemo },
        { title: "RGB Microcircuit Scanning Board", img: imgBreakpointTech }
      ],
      installation: [
        { title: "Lamination Calibration Screen", img: imgBeforeAfter },
        { title: "Seamless Joint Alignment", img: imgTransparentLed }
      ],
      application: [
        { title: "Automobile Showroom Facade", img: imgShowroom },
        { title: "Luxury Brand Storefront", img: imgLuxury }
      ]
    },
    installationGuide: [
      { step: "01", title: "Glass Surface Prepping", desc: "Polish glass with isopropyl compound to ensure zero dust, grease, or bubbles." },
      { step: "02", title: "Alignment Measurement", desc: "Lay out guidelines on the glass to guarantee straight vertical and horizontal seams." },
      { step: "03", title: "PET Release Peel", desc: "Carefully detach the protective PET backing liner to expose the optical-grade self-adhesive." },
      { step: "04", title: "Dry Lamination", desc: "Apply the film from top to bottom, using a rubber roller to expel microscopic air pockets." },
      { step: "05", title: "FPC Ribbon Routing", desc: "Route thin flat ribbon cables into the perimeter aluminum tracks to hide all wiring." },
      { step: "06", title: "Controller Startup", desc: "Connect drivers to the controller, then boot to run diagnostic alignments." }
    ],
    faqs: [
      { q: "What is the primary application of the O Series?", a: "The O Series is specifically engineered for building glass envelopes, corporate offices, airports, and luxury high-street retail storefronts that demand high transparency without structural bulk." },
      { q: "Can the O Series withstand heavy wind load on skyscrapers?", a: "Yes. Since the film is directly laminated on the glass face, it does not add any wind resistance profile or structural crossbar frames, making it extremely safe for tall glass curtain walls." },
      { q: "Is the adhesive safe for long-term exposure to harsh Indian sunlight?", a: "Absolutely. The film uses premium automotive-grade UV-resistant compound adhesives that will not yellow, degrade, or bubble over years of direct sunlight." },
      { q: "How are individual faulty pixels repaired?", a: "The O Series features advanced auto-bypass ICs. If an individual LED fails, it stays isolated while the rest of the display operates normally. Individual panels or modules can be swapped cleanly." },
      { q: "What is the typical lifespan under continuous 24/7 operation?", a: "The O Series utilizes industrial-grade LEDs rated for a lifespan of up to 100,000 hours, which equates to over 11 years of non-stop operation." },
      { q: "What control system does the O Series use?", a: "It integrates seamlessly with professional Novastar controllers, supporting real-time HDMI input, WiFi, or cloud-based scheduling playlists via smartphone/PC apps." },
      { q: "Is the film waterproof?", a: "The film is designed for interior-side lamination facing outwards (which is fully protected from weather), but we also supply IP65 moisture-proof coated models for humid atmospheres." },
      { q: "Does the lamination void the glass manufacturer's warranty?", a: "No. The dry lamination process is entirely non-destructive and requires no drilling, heavy clamping, or chemical glass alteration." },
      { q: "What is the maximum height of a single vertical run?", a: "Single segment film runs can go up to 3.2 meters, and are seamlessly cascaded to cover unlimited vertical and horizontal areas." },
      { q: "What is the typical installation time for a standard storefront?", a: "A standard 4m x 3m installation takes approximately 1 to 2 days, including structural calibration, testing, and training by our Chennai-based technicians." }
    ]
  },
  {
    id: "if-series",
    name: "I-F Series",
    category: "Flexible Creative Film",
    title: "I-F Series Flexible Curve Film",
    subtitle: "Ultra-Flexible Curved Transparent LED Film Solutions",
    description: "The Reefilm I-F Series breaks boundaries in architectural design. Its advanced flexible polymer substrate allows the screen to bend and curve smoothly around pillars, cylindrical structures, spiral balustrades, and curved glass partitions. Perfect for futuristic retail displays, museum exhibits, and cutting-edge corporate experience centers.",
    mainImage: imgIfSeries,
    highlights: [
      "Extreme bend radius down to 500mm",
      "Super lightweight 1.2 kg/㎡ profile",
      "On-site custom cutouts along grid lines",
      "Ultra-clear fiber-core lamination sheets"
    ],
    benefits: [
      "Wraps round pillars and cylindrical glass elements into beautiful digital displays",
      "Matches the exact curvature of the glass with zero visual panel gaps or seams",
      "Low power consumption reduces thermal load on interior HVAC systems",
      "Bespoke aesthetic integrates naturally with high-concept modern interiors"
    ],
    applications: [
      "Museums",
      "Auto Showrooms",
      "Luxury Stores",
      "Hotels",
      "Restaurants",
      "Corporate Offices",
      "Stage Events"
    ],
    features: [
      { title: "Flexible Film Tech", description: "Bends easily with zero micro-fracturing or signal routing traces cracking on curved glass.", icon: Sliders },
      { title: "Self-Adhesive Lamination", description: "Bonds instantly with optical compound adhesive, resisting edge curling.", icon: ShieldCheck },
      { title: "High Transparency", description: "Retains up to 95% light transmission for a completely see-through, hollow appearance.", icon: Eye },
      { title: "Ultra-Thin Design", description: "Incredible resolution packed into a highly durable 1.8mm depth sheet.", icon: Layers },
      { title: "Invisible Circuit Design", description: "High-density copper micro-grids ensure zero grid lines are visible.", icon: Cpu },
      { title: "Energy Saving", description: "Optimized thermal paths draw just 180W/㎡ on average.", icon: Zap }
    ],
    specs: {
      pixelPitch: "P4 / P5 / P6.25 / P8",
      brightness: "Up to 3,500 cd/㎡ (Nits)",
      transparency: "91% – 95% Light Transmission",
      thickness: "1.8 mm Profile",
      weight: "1.2 kg / ㎡",
      inputVoltage: "DC 5V Low Voltage (AC adapter 100-240V)",
      power: "Avg: 180 W/㎡, Max: 550 W/㎡",
      angle: "H: 140° / V: 140°",
      refreshRate: "≥ 3,840 Hz Speed Rate",
      grayscale: "16-Bit Processing",
      temp: "-15°C to +55°C",
      humidity: "10% – 85% RH",
      controller: "Novastar Controller with WiFi/4G Cloud Capability",
      driveMode: "1/16 Scan Constant Current",
      lifespan: "100,000 Hours"
    },
    models: [
      { name: "P4", pitch: "4.0 mm", viewingDistance: "≥ 4 Meters", brightness: "3,000 cd/㎡", bestFor: "Close-range museum display showcases" },
      { name: "P5", pitch: "5.0 mm", viewingDistance: "≥ 5 Meters", brightness: "3,200 cd/㎡", bestFor: "Retail boutique entrance curved windows" },
      { name: "P6.25", pitch: "6.25 mm", viewingDistance: "≥ 6 Meters", brightness: "3,500 cd/㎡", bestFor: "Shopping mall curved balcony pillars" },
      { name: "P8", pitch: "8.0 mm", viewingDistance: "≥ 8 Meters", brightness: "3,500 cd/㎡", bestFor: "Double-height round architectural lobby pillars" },
      { name: "P10", pitch: "10.0 mm", viewingDistance: "≥ 10 Meters", brightness: "3,200 cd/㎡", bestFor: "Suspended circular atrium banners" },
      { name: "P15", pitch: "15.0 mm", viewingDistance: "≥ 15 Meters", brightness: "3,000 cd/㎡", bestFor: "Far-distance creative dome displays" },
      { name: "P20", pitch: "20.0 mm", viewingDistance: "≥ 20 Meters", brightness: "2,500 cd/㎡", bestFor: "Large outdoor spiral column wrapping" }
    ],
    gallery: {
      closeup: [
        { title: "Bending Mechanics Demo", img: imgBreakpointTech },
        { title: "95% Clear Fiber Core", img: imgTransparencyDemo }
      ],
      installation: [
        { title: "Flexible Ribbon Routing", img: imgBeforeAfter },
        { title: "Lightweight Segment Bonding", img: imgTransparentLed }
      ],
      application: [
        { title: "Creative Curved Glass Corner", img: imgMuseum },
        { title: "Boutique Frameless Glass Door", img: imgIfSeries }
      ]
    },
    installationGuide: [
      { step: "01", title: "Glass curvature mapping", desc: "Map the exact curvature parameters to verify the minimum 500mm bend bounds." },
      { step: "02", title: "Surface clean polish", desc: "Wipe glass using optical cleaning agents to make it completely speck-free." },
      { step: "03", title: "Film segmentation trim", desc: "Carefully trim film edges on-site along specific cutting tracks if required." },
      { step: "04", title: "Curved peel and stick", desc: "Slowly apply from the center of the curve outward, smoothing with soft rollers." },
      { step: "05", title: "Cable connector mapping", desc: "Route flexible flat ribbon connectors cleanly around structural framing seams." },
      { step: "06", title: "System boot test", desc: "Power up and run custom pixel-mapping profiles to correct for visual distortion." }
    ],
    faqs: [
      { q: "What is the maximum bend angle of the I-F Series?", a: "The I-F Series can bend around curves with a minimum radius of 500mm without cracking the micro-circuitry." },
      { q: "Is the film safe to touch for visitors in museums?", a: "Yes. It operates on super-low voltage DC currents (5V) and features an isolated protective top layer which is fully anti-static and shockproof." },
      { q: "Can we trim the I-F Series on-site?", a: "The film features dedicated cutting paths. On-site trimming should only be performed by certified Reefilm engineers to maintain signal integrity." },
      { q: "Does the flexible film support curved corners?", a: "Yes, it is perfect for 90-degree curved glass corners, luxury showroom bays, and round columns." },
      { q: "How is power delivered to a curved film installation?", a: "Ultra-thin copper busbars are integrated along the top edge of the film, hiding all connections inside minimalist metallic tracks." },
      { q: "What is the main benefit of the I-F series in commercial retail?", a: "It transforms standard curved store display glass into digital advertising without blocking the visibility of products inside the store." },
      { q: "Does it work with standard media player formats?", a: "Yes, it plays all MP4, AVI, high-res photos, and generative graphics directly through HDMI/USB players." },
      { q: "What is the weight of the flexible film?", a: "It is extremely light, weighing less than 1.5 kg per square meter, making it ideal for glass partitions with weight limit constraints." },
      { q: "Is any high-voltage wiring needed near the glass?", a: "No. The main power supplies are housed in a remote control box, keeping only safe 5V DC low voltage on the glass surface." },
      { q: "How is the I-F series cleaned?", a: "It should be wiped with a dry or slightly damp micro-fiber cloth. Avoid using highly abrasive chemicals or wire-mesh scrubbers." }
    ]
  },
  {
    id: "ir-series",
    name: "I-R Series",
    category: "Indoor Fine Pitch Film",
    title: "I-R Series Fine Pitch Partition Film",
    subtitle: "High-Density Corporate Office Glass Display Solutions",
    description: "The Reefilm I-R Series is optimized for indoor close-up viewing. Combining superior pixel density with pristine transparency, it transforms standard glass boardrooms, office dividers, banking partitions, and hospital lobbies into dynamic visual systems that can toggle instantly from transparent glass to interactive presentation displays.",
    mainImage: imgIrSeries,
    highlights: [
      "Fine pitch configurations for close-range viewing",
      "Highly compatible with acoustic noise-isolation glass",
      "Static whisper-quiet fanless cooling system",
      "Rich color saturation and professional 16-bit grayscale"
    ],
    benefits: [
      "Converts conference glass walls into dynamic presentation and branding displays",
      "Maintains open office spacial aesthetics with near-invisible wiring grid",
      "High refresh rate prevents visual strain or camera flickers during video conferences",
      "Increases productivity and client wow-factor with interactive digital glass"
    ],
    applications: [
      "Corporate Offices",
      "Banks",
      "Hospitals",
      "Hotels",
      "Museums",
      "Restaurants",
      "Retail Stores"
    ],
    features: [
      { title: "Invisible Circuit Design", description: "Ultra-thin microscopic copper tracks remain entirely invisible to the naked eye.", icon: Cpu },
      { title: "Self-Adhesive Installation", description: "Applies smoothly to existing interior glass windows without modifying frames.", icon: ShieldCheck },
      { title: "High Transparency", description: "88% – 92% transmission maintains spatial brightness and boardroom transparency.", icon: Eye },
      { title: "Ultra-Thin Design", description: "At 2.2 mm thickness, it preserves flush, minimalist interior layouts.", icon: Layers },
      { title: "No Steel Structure Needed", description: "Mounts directly to existing partitioning with zero structural reinforcement.", icon: Sliders },
      { title: "Energy Saving", description: "Draws only 200W/㎡ on average, maintaining safe low thermal footprints.", icon: Zap }
    ],
    specs: {
      pixelPitch: "P4 / P5 / P6.25 / P8 / P10",
      brightness: "Up to 3,800 cd/㎡ (Nits)",
      transparency: "88% – 92% Light Transmission",
      thickness: "2.2 mm Profile",
      weight: "1.6 kg / ㎡",
      inputVoltage: "AC 100V – 240V, 50/60Hz",
      power: "Avg: 200 W/㎡, Max: 580 W/㎡",
      angle: "H: 150° / V: 150°",
      refreshRate: "≥ 3,840 Hz High Broadcast Speed",
      grayscale: "16-Bit Processing",
      temp: "-10°C to +60°C",
      humidity: "10% – 90% RH",
      controller: "Synchronous Control System with HDMI Interface",
      driveMode: "Static Constant Current Drive",
      lifespan: "100,000 Hours"
    },
    models: [
      { name: "P4", pitch: "4.0 mm", viewingDistance: "≥ 4 Meters", brightness: "3,000 cd/㎡", bestFor: "Corporate executive boardroom glass partitions" },
      { name: "P5", pitch: "5.0 mm", viewingDistance: "≥ 5 Meters", brightness: "3,200 cd/㎡", bestFor: "Banking transaction teller glass panes" },
      { name: "P6.25", pitch: "6.25 mm", viewingDistance: "≥ 6 Meters", brightness: "3,500 cd/㎡", bestFor: "Hotel lobby interior partitions" },
      { name: "P8", pitch: "8.0 mm", viewingDistance: "≥ 8 Meters", brightness: "3,800 cd/㎡", bestFor: "Double-height office lobby feature dividers" },
      { name: "P10", pitch: "10.0 mm", viewingDistance: "≥ 10 Meters", brightness: "3,800 cd/㎡", bestFor: "Hospital main lobby glass atriums" },
      { name: "P15", pitch: "15.0 mm", viewingDistance: "≥ 15 Meters", brightness: "3,200 cd/㎡", bestFor: "Commercial building center hanging rings" },
      { name: "P20", pitch: "20.0 mm", viewingDistance: "≥ 20 Meters", brightness: "2,800 cd/㎡", bestFor: "High-level glass roof skylight overlays" }
    ],
    gallery: {
      closeup: [
        { title: "Pillar Curving Mechanism", img: imgBreakpointTech },
        { title: "Micro-Adhesive Surface Layer", img: imgTransparencyDemo }
      ],
      installation: [
        { title: "Magnetic Lock Alignment", img: imgBeforeAfter },
        { title: "Column Power Distribution", img: imgTransparentLed }
      ],
      application: [
        { title: "Corporate Boardroom Dividers", img: imgIrSeries },
        { title: "Office Partition Active Screen", img: imgMuseum }
      ]
    },
    installationGuide: [
      { step: "01", title: "Glass face degreasing", desc: "Wash glass partition with optical residue-free degreaser to prepare backing." },
      { step: "02", title: "Panel mapping layout", desc: "Map multi-panel layouts perfectly, ensuring zero overlap across panel corners." },
      { step: "03", title: "Polymer backing release", desc: "Slowly strip the protective poly liner, keeping the film free of static charge." },
      { step: "04", title: "Optical dry bond", desc: "Bond starting from top edge, applying consistent roller pressure to push out air." },
      { step: "05", title: "Plenum track integration", desc: "Route flat micro cables into the ceiling plenum or bottom aluminum track." },
      { step: "06", title: "HDMI signal lock", desc: "Connect the HDMI player block to the synchronous card and test live projection." }
    ],
    faqs: [
      { q: "Can the I-R Series form a complete 360-degree pillar wrap?", a: "Yes, it is designed to lock edge-to-edge magnetically to form continuous cylindrical 360° visual screens around pillars." },
      { q: "How is visual stretching or distortion avoided on curves?", a: "Our dedicated software controller performs advanced pixel-mapping to pre-compensate for curved geometry, guaranteeing 1:1 ratios." },
      { q: "Is the curved film susceptible to peeling over time?", a: "We apply a secondary optical edge-sealing technique with flexible composite borders to prevent any edge peeling." },
      { q: "What is the standard column diameter supported?", a: "It easily wraps around standard columns with a diameter of 1 meter or larger. For smaller pillars, we construct customized micro-segmented layouts." },
      { q: "Is the power supply unit hidden?", a: "Yes, our ultra-slim power supply drivers are neatly tucked into matching black anodized aluminum header and footer tracks." },
      { q: "What is the maximum brightness of the curved screen?", a: "It provides a robust brightness of up to 3,800 cd/㎡, remaining highly vibrant even in intensely lit glass atriums." },
      { q: "Does the curved display produce audible noise?", a: "No, it utilizes 100% fanless heat conductive technology, making it completely silent for galleries and corporate boardrooms." },
      { q: "Can we run live streaming television feeds on it?", a: "Yes. It supports standard high-speed HDMI video inputs, perfect for real-time news tickers, branding videos, or television feeds." },
      { q: "What is the refresh rate performance?", a: "It has a high broadcast refresh rate of ≥ 3,840 Hz, ensuring zero visual scanning lines during smartphone or professional video recording." },
      { q: "How is it shipped and transported?", a: "The displays are packed flat or slightly rolled in custom heavily padded flight cases to guarantee absolute transport safety across India." }
    ]
  },
  {
    id: "escalator-series",
    name: "Escalator Series",
    category: "Vibration-Proof Public Film",
    title: "Escalator Series Specialty Film",
    subtitle: "High-Adhesion Vibration-Proof Glass Balustrade Display",
    description: "The Reefilm Escalator Series is a pioneering structural solution for public transport, shopping malls, and transit terminals. Specially engineered with vibration-dampening micro-circuits and industrial-grade high-adhesion optical glues, it withstands continuous structural mechanical motion, heavy public flow, and direct touch while serving wayfinding, safety, and branding messages.",
    mainImage: imgEscalator,
    highlights: [
      "Vibration-isolated signal paths to avoid circuit fractures",
      "Ultra-strong anti-tamper chemical adhesive borders",
      "Public-grade anti-scratch outer PET sheet protector",
      "Child-safe extra-low voltage AC/DC insulation"
    ],
    benefits: [
      "Monetizes unutilized escalator glass balustrades into premium advertising avenues",
      "Provides highly visible real-time wayfinding, security notices, and safety alerts",
      "Vibration-proof layout handles constant motion without pixel dropout or signal loss",
      "Chemically sealed against liquid spills, cleaning detergents, and heavy humidity"
    ],
    applications: [
      "Shopping Malls",
      "Airports",
      "Hotels",
      "Corporate Offices",
      "Museums",
      "Restaurants",
      "Stage Events"
    ],
    features: [
      { title: "Invisible Circuit Design", description: "Advanced microscopic grids vanish when inactive, leaving balustrades clear.", icon: Cpu },
      { title: "Self-Adhesive Installation", description: "Applies directly to escalator glass panels using tough anti-peel chemical glues.", icon: ShieldCheck },
      { title: "No Steel Structure Needed", description: "Zero heavy frames or cladding needed, keeping handrails light and clean.", icon: Sliders },
      { title: "High Transparency", description: "85% – 90% transmission guarantees clear visibility for children safety.", icon: Eye },
      { title: "Flexible Film Tech", description: "Fits perfectly along angled, rising, and tapered balustrade glass profiles.", icon: Layers },
      { title: "Energy Saving", description: "Extremely optimized driver layouts draw only 150W/㎡ on average.", icon: Zap }
    ],
    specs: {
      pixelPitch: "P6.25 / P8 / P10",
      brightness: "Up to 3,000 cd/㎡ (Nits)",
      transparency: "85% – 90% Light Transmission",
      thickness: "2.5 mm Impact Profile",
      weight: "1.9 kg / ㎡",
      inputVoltage: "AC 110V/220V Dual-Grid System",
      power: "Avg: 150 W/㎡, Max: 450 W/㎡",
      angle: "H: 120° / V: 120°",
      refreshRate: "≥ 1,920 Hz Standard Speed",
      grayscale: "14-Bit Processing",
      temp: "-10°C to +50°C",
      humidity: "10% – 95% RH (Moisture Sealed Coating)",
      controller: "Synchronous Multi-Panel Master Controller",
      driveMode: "Constant Current Scan (Vibration-Isolated)",
      lifespan: "100,000 Hours"
    },
    models: [
      { name: "P4", pitch: "4.0 mm", viewingDistance: "≥ 4 Meters", brightness: "2,500 cd/㎡", bestFor: "Ultra-luxury hotel atrium escalator glass balustrades" },
      { name: "P5", pitch: "5.0 mm", viewingDistance: "≥ 5 Meters", brightness: "2,800 cd/㎡", bestFor: "High-end corporate office escalator rails" },
      { name: "P6.25", pitch: "6.25 mm", viewingDistance: "≥ 6 Meters", brightness: "3,000 cd/㎡", bestFor: "Premium shopping mall central walkways" },
      { name: "P8", pitch: "8.0 mm", viewingDistance: "≥ 8 Meters", brightness: "3,000 cd/㎡", bestFor: "Busy international airport terminal escalator balustrades" },
      { name: "P10", pitch: "10.0 mm", viewingDistance: "≥ 10 Meters", brightness: "3,000 cd/㎡", bestFor: "Metro & train terminal public escalators" },
      { name: "P15", pitch: "15.0 mm", viewingDistance: "≥ 15 Meters", brightness: "2,500 cd/㎡", bestFor: "Large public walkway overhead glass ramps" },
      { name: "P20", pitch: "20.0 mm", viewingDistance: "≥ 20 Meters", brightness: "2,000 cd/㎡", bestFor: "Industrial theme park escalator bridges" }
    ],
    gallery: {
      closeup: [
        { title: "Vibration Isolated Core Grid", img: imgBreakpointTech },
        { title: "Anti-Scratch Protective Shield Layer", img: imgTransparencyDemo }
      ],
      installation: [
        { title: "Handrail Wiring Integration Setup", img: imgBeforeAfter },
        { title: "Under-Steps Signal Matrix Link", img: imgTransparentLed }
      ],
      application: [
        { title: "Vibration-Resistant Balustrade Active View", img: imgEscalator },
        { title: "Airport Public Wayfinding Display", img: imgAirport }
      ]
    },
    installationGuide: [
      { step: "01", title: "Glass vibration check", desc: "Inspect structural handrail clamp stability before starting lamination." },
      { step: "02", title: "Anti-grease micro scrub", desc: "Scrub glass pane with heavy degreasing chemicals to prep for high-adhesion glue." },
      { step: "03", title: "Tapered film drafting", desc: "Cut and verify the rise angle matching the specific escalator model profiles." },
      { step: "04", title: "Chemical-border bond", desc: "Carefully bond film, sealing edges with optical moisture-proof silicone barrier." },
      { step: "05", title: "Chassis wire hide", desc: "Route electrical wires completely hidden inside the handrail base frame track." },
      { step: "06", title: "Calibration sweep", desc: "Perform sweep signal tests to ensure zero signal drops under structural vibration." }
    ],
    faqs: [
      { q: "Is the Escalator Series safe for children and mall visitors to touch?", a: "Yes, completely. It is fully insulated, waterproofed, and operates on safe, low-voltage DC power. The surface is completely cool to the touch." },
      { q: "How does the film handle continuous escalator vibration?", a: "We utilize industrial-grade poly-composite lamination sheets with flexible soldered joints that completely absorb structural vibrations without cracking." },
      { q: "Does the film block security visibility?", a: "No. With 85-90% transparency, security teams and parents can easily see through the glass balustrade at all times." },
      { q: "Where are the power cables routed?", a: "All electrical cables and signal buses are neatly routed inside the metal handrail structural profiles, remaining entirely invisible to the public." },
      { q: "What happens if someone scratches the film with keys or bags?", a: "The Escalator Series features an ultra-tough, public-grade anti-scratch outer shield. If damaged, only the outer protective sheet needs to be replaced, leaving the active LEDs unharmed." },
      { q: "Can we sync the video across left and right sides of the escalator?", a: "Yes, our Novastar synchronization processor perfectly aligns both sides for a cohesive, immersive spatial visual experience." },
      { q: "How is the film protected from cleaning liquids used by mall staff?", a: "It is rated IP54, featuring a hydrophobic sealed coating that is completely safe against standard damp mopping and glass cleaners." },
      { q: "Can the film be shaped to match curved escalator glass?", a: "Yes, we custom fabricate each set to match the precise template, rise angle, and curves of your escalator model." },
      { q: "What is the warranty period for this series?", a: "We provide a comprehensive 1-Year Warranty, which includes on-site diagnostics, calibration, and swift part replacements." },
      { q: "What is the best pixel pitch for public escalators?", a: "P6.25 and P8 are highly recommended as they provide an ideal balance of visual clarity and optimal cost efficiency for public crowds." }
    ]
  },
  {
    id: "handheld-series",
    name: "Handheld Sample Series",
    category: "Compact Mobile Demo Kit",
    title: "Handheld Sample Series Demo Kit",
    subtitle: "Portable Briefcase Tech Demo Solution for Architects",
    description: "The Reefilm Handheld Sample Series is the ultimate tool for developers, architectural glass distributors, and consultants. It encloses an A4-sized live, functional matrix of Reefilm LED Film inside an elegant, lightweight aircraft-grade aluminum flight case. Complete with an on-board battery, built-in smart controller, and WiFi screen mirroring for quick live demos.",
    mainImage: imgHandheld,
    highlights: [
      "Integrated 2-hour high-capacity lithium battery",
      "Universal charging via USB-C ports",
      "Wireless mobile app control for instant logo uploads",
      "Extremely robust flight case for airline transport"
    ],
    benefits: [
      "Demonstrates actual 92% transparency and brightness live in any executive boardroom",
      "Drastically accelerates spec approvals with hands-on technical interaction",
      "Toggles brightness outputs instantly to adapt to intimate office lighting conditions",
      "Provides sales forces with a portable, self-contained interactive playground"
    ],
    applications: [
      "Museums",
      "Corporate Offices",
      "Luxury Stores",
      "Auto Showrooms",
      "Hotels",
      "Restaurants",
      "Stage Events"
    ],
    features: [
      { title: "Ultra-Thin Design", description: "Active demo film segment is only 2.0 mm, fitted within a 85mm deep travel case.", icon: Layers },
      { title: "Self-Adhesive Lamination", description: "Uses optical adhesive polymer, demonstrating realistic texture and clarity.", icon: ShieldCheck },
      { title: "No Steel Structure Needed", description: "Completely self-contained; runs on any flat table without screws or hooks.", icon: Sliders },
      { title: "High Transparency", description: "Demonstrates standard-setting 92% transmission right before the client's eyes.", icon: Eye },
      { title: "Invisible Circuit Design", description: "Micro circuit arrays are invisible from up close, illustrating absolute clarity.", icon: Cpu },
      { title: "Energy Saving", description: "Highly optimized low-power core draws under 50W in active battery mode.", icon: Zap }
    ],
    specs: {
      pixelPitch: "P4 / P8 (Dual-Segment Demo Grid)",
      brightness: "Up to 2,500 cd/㎡ (Nits)",
      transparency: "92% Light Transmission",
      thickness: "2.0 mm (Film Core, Case: 85mm)",
      weight: "3.5 kg Briefcase",
      inputVoltage: "USB Type-C 12V / AC Adapter 100V – 240V",
      power: "Max 50W Output Power (Battery Optimized)",
      angle: "H: 140° / V: 140°",
      refreshRate: "≥ 1,920 Hz Portable Sync Speed",
      grayscale: "14-Bit Processing",
      temp: "0°C to +40°C",
      humidity: "10% – 80% RH",
      controller: "Integrated AP Wireless Controller (Mobile Smart App)",
      driveMode: "Dynamic Low-Power Drive Scan",
      lifespan: "100,000 Hours"
    },
    models: [
      { name: "P4", pitch: "4.0 mm", viewingDistance: "≥ 2 Meters", brightness: "2,000 cd/㎡", bestFor: "Hands-on desk presentation close-ups" },
      { name: "P5", pitch: "5.0 mm", viewingDistance: "≥ 3 Meters", brightness: "2,200 cd/㎡", bestFor: "Consultant client display tables" },
      { name: "P6.25", pitch: "6.25 mm", viewingDistance: "≥ 4 Meters", brightness: "2,500 cd/㎡", bestFor: "Architect boardroom technical evaluations" },
      { name: "P8", pitch: "8.0 mm", viewingDistance: "≥ 5 Meters", brightness: "2,500 cd/㎡", bestFor: "Distributor training showrooms" },
      { name: "P10", pitch: "10.0 mm", viewingDistance: "≥ 6 Meters", brightness: "2,500 cd/㎡", bestFor: "Quick exhibition booth counter mockups" },
      { name: "P15", pitch: "15.0 mm", viewingDistance: "≥ 8 Meters", brightness: "2,000 cd/㎡", bestFor: "Commercial spatial division trials" },
      { name: "P20", pitch: "20.0 mm", viewingDistance: "≥ 10 Meters", brightness: "1,800 cd/㎡", bestFor: "Macro grid alignment diagnostics" }
    ],
    gallery: {
      closeup: [
        { title: "Precision Control Switch Board", img: imgBreakpointTech },
        { title: "Optical Lamination Layer Detail", img: imgTransparencyDemo }
      ],
      installation: [
        { title: "Briefcase Flight-Case Protection", img: imgHandheld },
        { title: "Plug-and-Play Diagnostics Block", img: imgBeforeAfter }
      ],
      application: [
        { title: "Architect Boardroom Live Demo", img: imgTransparencyDemo },
        { title: "Trade Show Stand Active Display", img: imgTransparentLed }
      ]
    },
    installationGuide: [
      { step: "01", title: "Unlatch the briefcase", desc: "Unlock and open the heavy-duty aircraft-grade flight case on a flat tabletop." },
      { step: "02", title: "Erect stabilizing stand", desc: "Pull up and snap the integrated acrylic stabilizing support stand into vertical position." },
      { step: "03", title: "Check power reserves", desc: "Press the battery diagnostics button to verify battery levels are above 20%." },
      { step: "04", title: "Switch active system", desc: "Flip the mechanical red master toggle switch to boot up the integrated media player." },
      { step: "05", title: "WiFi mobile login", desc: "Connect to the kit's local WiFi hot-spot using the custom smart companion app." },
      { step: "06", title: "Upload client media", desc: "Drag and drop any custom logo or 3D mp4 video file to project it instantly." }
    ],
    faqs: [
      { q: "What is the primary benefit of the Handheld Sample Kit?", a: "It lets sales engineers, dealers, and architects demonstrate actual glass transparency and vivid brightness live in any meeting room." },
      { q: "How long does the built-in battery last on a single charge?", a: "The heavy-duty lithium battery supports up to 2 hours of continuous video loop playback at 80% brightness." },
      { q: "How do we upload custom corporate logos or video loops?", a: "You can upload them instantly via a local WiFi connection using our free smartphone app, or simply load them onto a standard USB-C drive." },
      { q: "What is the weight and physical dimensions of the flight case?", a: "The entire kit weighs only 3.5 kg, fitting easily in aircraft overhead bins (Dimensions: 420mm x 320mm x 85mm)." },
      { q: "Can we adjust the brightness to prevent blinding clients indoors?", a: "Yes, the kit features a built-in brightness adjustment knob to scale the intensity from 10% up to 100%." },
      { q: "Does the kit require internet connectivity to run?", a: "No. The kit functions entirely offline, pulling video files from its local solid-state internal storage." },
      { q: "Does it come with international plug adapters?", a: "Yes, the flight case includes a universal AC charging adapter (100V-240V) suited for Indian, US, UK, and European power sockets." },
      { q: "What is the warranty on the Handheld Sample Kit?", a: "It includes a 1-Year replacement warranty on the battery, control card, and LED film segment." },
      { q: "Can we purchase multiple kits for our nationwide sales force?", a: "Yes, Reefilm India supplies discounted multi-unit packages specifically for architects, design agencies, and sales teams." },
      { q: "Is the video content pre-loaded?", a: "Yes, it ships with a handpicked selection of ultra-high-definition transparent 3D loops and product explanation videos." }
    ]
  }
];

export const techHighlights = [
  {
    title: "Ultra-Thin Design",
    desc: "Active transparent core ranges from a slim 1.8mm to 2.5mm depth, remaining perfectly flush on glass profiles.",
    icon: Layers
  },
  {
    title: "Self-Adhesive Installation",
    desc: "Optical-grade chemical backing ensures standard bubble-free peel-and-stick dry lamination with zero mess.",
    icon: ShieldCheck
  },
  {
    title: "No Steel Structure Required",
    desc: "Ultra-lightweight architecture eliminates heavy, expensive load-bearing metal support frames entirely.",
    icon: Sliders
  },
  {
    title: "High Transparency",
    desc: "Achieves outstanding light transmission indexes up to 95%, keeping natural daylight fully unblocked.",
    icon: Eye
  },
  {
    title: "Flexible Film Technology",
    desc: "Can be curved or twisted smoothly down to 500mm radius, unlocking spectacular pillar and arch displays.",
    icon: Sliders
  },
  {
    title: "Invisible Circuit Design",
    desc: "Microscopic nanotech electrical grid wiring completely vanishes, turning back into clear glass when switched off.",
    icon: Cpu
  },
  {
    title: "Energy Saving",
    desc: "Requires just 150W – 220W/㎡ on average, supporting sustainable green architectures and LEED ratings.",
    icon: Zap
  },
  {
    title: "100,000 Hours Lifespan",
    desc: "Assembled with highest-specification optoelectronics rated for over 11 years of continuous round-the-clock service.",
    icon: Activity
  },
  {
    title: "3,840 Hz Refresh Rate",
    desc: "Delivers flicker-free, broadcast-grade refresh rates ensuring flawless captures on high-speed mobile feeds.",
    icon: Activity
  }
];
