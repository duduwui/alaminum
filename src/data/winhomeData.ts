export interface ProductItem {
  id: string;
  name: string;
  category: 'upvc' | 'aluminum' | 'accessories';
  subCategory?: string;
  image: string;
  fallbackImage: string;
  description: string;
  chambers?: number;
  depth?: string;
  insulationValue?: string;
  acousticValue?: string;
  features: string[];
  colors?: string[];
  specs?: Record<string, string>;
  basePrice?: number;
  pricePerSqm?: number;
  profitMargin?: number;
}

export interface BrochureItem {
  id: string;
  title: string;
  brand: string;
  origin: string;
  coverImage: string;
  fallbackCover: string;
  description: string;
  pages: number;
  fileSize: string;
  downloadUrl: string;
  highlights: string[];
}

export const WINHOME_CONTACT = {
  companyName: "Winhome Company",
  parentCompany: "Nafza Almanzl",
  fullName: "Winhome Company by Nafza Almanzl",
  tagline: "Architectural uPVC & Aluminum Solutions in Iraq",
  logo: "/assets/winhome/1-1-scaled.png",
  logoFallback: "https://winhome.co/wp-content/uploads/2018/12/1-1-scaled.png",
  nafzaLogo: "/assets/winhome/nafza-logo.png",
  nafzaFallback: "http://winhome.co/wp-content/uploads/2018/12/nafza-logo.png",
  hotline: "00964-750-444-0402",
  hotlineRaw: "+9647504440402",
  branches: {
    sales: {
      name: "Sales & Showroom Branch",
      phones: ["+964 750 444 0402", "+964 750 555 0402"],
      phonesRaw: ["+9647504440402", "+9647505550402"],
      description: "Consultations, architectural specifications & client showroom"
    },
    manufacturing: {
      name: "Manufacturing & Fabrication Plant",
      phones: ["+964 750 222 0402", "+964 750 333 0402"],
      phonesRaw: ["+9647502220402", "+9647503330402"],
      description: "CNC profile processing, double glazing assembly & logistics dispatch"
    }
  },
  emails: ["info@winhome.co", "winhome-iq@hotmail.com"],
  address: "Rasty Qr., Old Kirkuk Road, near Directorate of Water, Erbil, Kurdistan Region, Iraq",
  workHours: "Saturday – Thursday: 08:00 – 17:00 (Friday: Closed)",
  whatsapp: "+9647504440402",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d102985.34415847587!2d43.921319762499995!3d36.191113!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x400722fe13443461%3A0x3e24b0716477bb32!2sErbil%2C%20Kurdistan%20Region%2C%20Iraq!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
};

export const PARTNER_LOGOS = [
  {
    src: "/assets/winhome/1-2.png",
    fallbackSrc: "http://winhome.co/wp-content/uploads/2018/12/1-2.png",
    alt: "Deceuninck",
    title: "Deceuninck uPVC Systems",
    country: "Belgium",
    category: "uPVC Profiles"
  },
  {
    src: "/assets/winhome/2-1.png",
    fallbackSrc: "http://winhome.co/wp-content/uploads/2018/12/2-1.png",
    alt: "Winsa",
    title: "Winsa Windows & Doors",
    country: "Europe",
    category: "uPVC Profiles"
  },
  {
    src: "/assets/winhome/3-1.png",
    fallbackSrc: "http://winhome.co/wp-content/uploads/2018/12/3-1.png",
    alt: "Master Italy",
    title: "Master Italy Hardware",
    country: "Italy",
    category: "Architectural Hardware"
  },
  {
    src: "/assets/winhome/4-1.png",
    fallbackSrc: "http://winhome.co/wp-content/uploads/2018/12/4-1.png",
    alt: "Lorenzoline",
    title: "Lorenzoline Aluminum Systems",
    country: "Turkey / Europe",
    category: "Aluminum Profiles"
  },
  {
    src: "/assets/winhome/5-2.png",
    fallbackSrc: "http://winhome.co/wp-content/uploads/2018/12/5-2.png",
    alt: "Comunello",
    title: "Comunello Window Automation",
    country: "Italy",
    category: "Automation & Fittings"
  },
  {
    src: "/assets/winhome/6-2.png",
    fallbackSrc: "http://winhome.co/wp-content/uploads/2018/12/6-2.png",
    alt: "STAC",
    title: "STAC Architectural Hardware",
    country: "Spain",
    category: "Hardware & Polyamides"
  },
  {
    src: "/assets/winhome/7-1.png",
    fallbackSrc: "http://winhome.co/wp-content/uploads/2018/12/7-1.png",
    alt: "Vorne",
    title: "Vorne Multi-Locking Systems",
    country: "Europe",
    category: "Tilt & Turn Hardware"
  },
  {
    src: "/assets/winhome/8-1.png",
    fallbackSrc: "http://winhome.co/wp-content/uploads/2018/12/8-1.png",
    alt: "Gretsch-Unitas",
    title: "G-U Lift & Slide Systems",
    country: "Germany",
    category: "Sliding Systems"
  },
  {
    src: "/assets/winhome/9-1.png",
    fallbackSrc: "http://winhome.co/wp-content/uploads/2018/12/9-1.png",
    alt: "Hoppe",
    title: "Hoppe Handle Hardware",
    country: "Germany",
    category: "Architectural Handles"
  },
  {
    src: "/assets/winhome/10.png",
    fallbackSrc: "http://winhome.co/wp-content/uploads/2018/12/10.png",
    alt: "Nafza Group",
    title: "Nafza Almanzl Holding",
    country: "Iraq",
    category: "Parent Enterprise"
  }
];

export const UPVC_PRODUCTS: ProductItem[] = [
  {
    id: "upvc-everest-max-60",
    name: "EVEREST MAX 60 MM",
    category: "upvc",
    subCategory: "Casement & Opening",
    image: "/assets/winhome/2-2.jpg",
    fallbackImage: "https://winhome.co/wp-content/uploads/2023/08/2-2.jpg",
    description: "Engineered for maximum thermal insulation and wind resistance. Features a 4-chamber internal structure that guarantees superior durability in extreme climate zones.",
    chambers: 4,
    depth: "60 mm",
    insulationValue: "Uf = 1.2 W/m²K",
    acousticValue: "Rw = 36 dB",
    features: [
      "4-Chamber profile structure for balanced thermal efficiency",
      "Co-extruded TPE or EPDM weather seals preventing air infiltration",
      "Galvanized steel reinforcement channels for structural rigidity",
      "Glazing capability from 4mm single glass up to 32mm acoustic double glass",
      "Smooth dirt-repelling surface with high UV resistance"
    ],
    colors: ["White", "Golden Oak", "Anthracite Grey", "Nussbaum", "Ash Black"],
    specs: {
      "Frame Depth": "60 mm",
      "Chamber Count": "4 Chambers",
      "Gasket Type": "2-Stage EPDM / TPE",
      "Reinforcement": "1.5mm Galvanized Steel",
      "Thermal Transmittance": "1.2 W/m²K",
      "Sound Insulation": "Up to 36 dB"
    }
  },
  {
    id: "upvc-legend-art-70",
    name: "LEGEND ART 70 MM",
    category: "upvc",
    subCategory: "Premium Architectural",
    image: "/assets/winhome/8-2.jpg",
    fallbackImage: "https://winhome.co/wp-content/uploads/2023/08/8-2.jpg",
    description: "Sleek bevelled aesthetic with a 5-chamber design that balances contemporary architectural elegance with class-leading acoustic and thermal barriers.",
    chambers: 5,
    depth: "70 mm",
    insulationValue: "Uf = 1.1 W/m²K",
    acousticValue: "Rw = 42 dB",
    features: [
      "Slim frame sightline with 5 thermal insulating chambers",
      "Optimized central gasket system for extreme air and water tightness",
      "Glazing pocket depth accepting triple glazing up to 44mm",
      "Concealed drainage system for clean exterior facade lines",
      "Certified acoustic dampening for urban environments"
    ],
    colors: ["Anthracite Grey", "Golden Oak", "Win-Wood", "White", "Dark Oak"],
    specs: {
      "Frame Depth": "70 mm",
      "Chamber Count": "5 Chambers",
      "Gasket Type": "3-Stage Gasket System",
      "Reinforcement": "Reinforced Box Steel",
      "Thermal Transmittance": "1.1 W/m²K",
      "Sound Insulation": "Up to 42 dB"
    }
  },
  {
    id: "upvc-legend-80",
    name: "LEGEND 80 MM",
    category: "upvc",
    subCategory: "Ultra Thermal Performance",
    image: "/assets/winhome/11-2.jpg",
    fallbackImage: "https://winhome.co/wp-content/uploads/2023/08/11-2.jpg",
    description: "The pinnacle of thermal and acoustic performance. With an 80mm installation depth and 6 internal chambers, Legend 80 meets Passive House criteria.",
    chambers: 6,
    depth: "80 mm",
    insulationValue: "Uf = 0.95 W/m²K",
    acousticValue: "Rw = 45 dB",
    features: [
      "6-Chamber design meeting rigorous low-energy architectural standards",
      "Triple seal barrier with middle acoustic compression gasket",
      "Supports heavy triple-glazed units up to 52mm thickness",
      "Heavy load-bearing hinges for oversized ceiling-height sashes",
      "Resistant to high ultraviolet solar radiation and sandstorms"
    ],
    colors: ["Anthracite Grey", "Golden Oak", "White", "Sheffield Oak", "Basalt Grey"],
    specs: {
      "Frame Depth": "80 mm",
      "Chamber Count": "6 Chambers",
      "Gasket Type": "3 Continuous Compression Gaskets",
      "Reinforcement": "Heavy Industrial Structural Steel",
      "Thermal Transmittance": "0.95 W/m²K",
      "Sound Insulation": "Up to 45 dB"
    }
  },
  {
    id: "upvc-opening-76",
    name: "OPENING – 76 MM",
    category: "upvc",
    subCategory: "Heavy Architectural Casement",
    image: "/assets/winhome/2026-04-19-20.45.09.jpg",
    fallbackImage: "https://winhome.co/wp-content/uploads/2026/04/2026-04-19-20.45.09.jpg",
    description: "Heavy-duty 76mm opening system suitable for luxury villas, commercial developments, and high-wind elevation installations with multi-point perimeter locks.",
    chambers: 5,
    depth: "76 mm",
    insulationValue: "Uf = 1.05 W/m²K",
    acousticValue: "Rw = 40 dB",
    features: [
      "Tilt & Turn, Inward & Outward opening configurations",
      "High inertia moment steel for large structural spans",
      "Security hardware groove standard with RC2 anti-burglary fitment",
      "UV-stabilized compound formulated for Middle Eastern heat"
    ],
    colors: ["Anthracite", "White", "Golden Oak", "Walnut"],
    specs: {
      "Frame Depth": "76 mm",
      "Chamber Count": "5 Chambers",
      "Gasket Type": "Double EPDM",
      "Max Sash Weight": "130 kg"
    }
  },
  {
    id: "upvc-opening-60",
    name: "OPENING – 60 MM",
    category: "upvc",
    subCategory: "Classic Casement",
    image: "/assets/winhome/2026-04-19-20.46.21.jpg",
    fallbackImage: "https://winhome.co/wp-content/uploads/2026/04/2026-04-19-20.46.21.jpg",
    description: "Reliable, cost-effective residential opening system combining ease of operation with proven European weather sealing.",
    chambers: 4,
    depth: "60 mm",
    insulationValue: "Uf = 1.3 W/m²K",
    acousticValue: "Rw = 34 dB",
    features: [
      "Optimized for standard residential windows and balcony doors",
      "Multi-point espagnolette locking mechanisms",
      "Easy maintenance and scratch-resistant lamination"
    ],
    colors: ["White", "Golden Oak", "Anthracite"],
    specs: {
      "Frame Depth": "60 mm",
      "Chambers": "4",
      "Glazing": "Up to 28 mm"
    }
  },
  {
    id: "upvc-sliding-hs76",
    name: "SLIDING HS76 (HEBE-SCHIEBE)",
    category: "upvc",
    subCategory: "Lift & Slide Monumental",
    image: "/assets/winhome/1-2.jpg",
    fallbackImage: "https://winhome.co/wp-content/uploads/2023/08/1-2.jpg",
    description: "Premium Hebe-Schiebe lift-and-slide door engineered for grand panoramic openings. The sash effortlessly glides along a low-profile anodized track.",
    depth: "175 mm frame / 76 mm sash",
    insulationValue: "Uf = 1.25 W/m²K",
    acousticValue: "Rw = 41 dB",
    features: [
      "Lift-and-slide carriage holding up to 300kg per glass sash",
      "Zero-barrier flush floor threshold for barrier-free living",
      "Multi-point perimeter locking for exceptional air and water tightness",
      "Large glass areas providing uninterrupted views and natural light"
    ],
    colors: ["Anthracite Grey", "Golden Oak", "Nussbaum", "White"],
    specs: {
      "System Type": "Lift & Slide (HS)",
      "Sash Depth": "76 mm",
      "Frame Depth": "175 mm",
      "Max Sash Weight": "300 kg",
      "Glass Range": "Up to 44 mm"
    }
  },
  {
    id: "upvc-legend-sliding",
    name: "LEGEND SLIDING SYSTEM",
    category: "upvc",
    subCategory: "Smooth Patio Sliding",
    image: "/assets/winhome/14-2.jpg",
    fallbackImage: "https://winhome.co/wp-content/uploads/2023/08/14-2.jpg",
    description: "Modern sliding patio system with enhanced central sealing that prevents the drafts common in conventional sliding windows.",
    depth: "70 mm",
    insulationValue: "Uf = 1.35 W/m²K",
    acousticValue: "Rw = 35 dB",
    features: [
      "Double and triple track rail options for multi-leaf configurations",
      "Stainless steel roller tracks ensuring whisper-quiet movement",
      "Interlocking brush seals with central rubber fin for windproofing"
    ],
    colors: ["White", "Anthracite Grey", "Golden Oak"],
    specs: {
      "System Depth": "70 mm",
      "Configuration": "2, 3, or 4 Sash Options",
      "Rollers": "Adjustable Stainless Steel Tandem"
    }
  },
  {
    id: "upvc-sliding-60",
    name: "SLIDING – 60 MM",
    category: "upvc",
    subCategory: "Standard Patio Sliding",
    image: "/assets/winhome/2026-04-19-20.47.11.jpg",
    fallbackImage: "https://winhome.co/wp-content/uploads/2026/04/2026-04-19-20.47.11.jpg",
    description: "Compact sliding solution ideal for residential apartments and spaces where inward swinging is constrained.",
    depth: "60 mm",
    insulationValue: "Uf = 1.4 W/m²K",
    features: [
      "Space-saving sliding geometry with built-in insect screen track",
      "Smooth nylon or brass roller carriages",
      "Affordable high-volume solution with reliable sealing"
    ],
    colors: ["White", "Golden Oak", "Anthracite"]
  }
];

export const ALUMINUM_PRODUCTS: ProductItem[] = [
  {
    id: "al-opening-c60",
    name: "OPENING – C60",
    category: "aluminum",
    subCategory: "Casement Windows",
    image: "/assets/winhome/2026-04-19-19.58.03-300x290.jpg",
    fallbackImage: "https://winhome.co/wp-content/uploads/2026/04/2026-04-19-19.58.03-300x290.jpg",
    description: "Architectural non-insulated or insulated casement series with 60mm profile depth. Exceptional torsional strength and clean lines.",
    depth: "60 mm",
    features: [
      "Euro-groove compatible with world-class European hardware",
      "Vulcanized EPDM gasket corners for waterproof jointing",
      "High structural moment of inertia for multi-story buildings"
    ],
    colors: ["RAL 7016 Anthracite", "Matte Black", "Silver Anodized", "Custom RAL"]
  },
  {
    id: "al-opening-60t",
    name: "OPENING – 60T (THERMAL BREAK)",
    category: "aluminum",
    subCategory: "Thermally Broken Casement",
    image: "/assets/winhome/2026-04-19-20.06.10-e1776809691165-300x300.jpg",
    fallbackImage: "https://winhome.co/wp-content/uploads/2026/04/2026-04-19-20.06.10-e1776809691165-300x300.jpg",
    description: "High-performance thermal break profile featuring 24mm polyamide insulation bars that eliminate condensation and heat transfer.",
    depth: "60 mm",
    insulationValue: "Uf = 1.9 W/m²K",
    features: [
      "Polyamide PA66 GF25 thermal insulation barrier",
      "Compatible with double and triple insulating glass units",
      "Multi-point security locking for enhanced anti-burglary protection"
    ],
    colors: ["Anthracite Texture", "Matte Black", "Bronze Anodized", "RAL Colors"]
  },
  {
    id: "al-opening-74t",
    name: "OPENING – 74T (HEAVY THERMAL BREAK)",
    category: "aluminum",
    subCategory: "Premium Heavy Architectural",
    image: "/assets/winhome/2026-04-19-20.06.46-e1776809660805-300x300.jpg",
    fallbackImage: "https://winhome.co/wp-content/uploads/2026/04/2026-04-19-20.06.46-e1776809660805-300x300.jpg",
    description: "Robust 74mm thermally insulated system for large-dimension entrance doors, pivot doors, and high-specification architectural villas.",
    depth: "74 mm",
    insulationValue: "Uf = 1.5 W/m²K",
    features: [
      "Reinforced multi-chamber polyamide thermal struts",
      "Heavy load bearing up to 200kg per sash",
      "Coplanar exterior and interior aesthetic styling"
    ],
    colors: ["Graphite Black", "Dark Bronze", "Pearl Grey", "Custom Anodizing"]
  },
  {
    id: "al-lift-slide-70ls",
    name: "LIFT & SLIDE – 70LS",
    category: "aluminum",
    subCategory: "Monumental Panoramic Doors",
    image: "/assets/winhome/2026-04-19-20.30.20-e1776809533801-300x300.jpg",
    fallbackImage: "https://winhome.co/wp-content/uploads/2026/04/2026-04-19-20.30.20-e1776809533801-300x300.jpg",
    description: "Heavy architectural lift-and-slide system designed for panoramic floor-to-ceiling glass expanses with sashes up to 400kg.",
    depth: "70 mm sash / 160 mm frame",
    insulationValue: "Uf = 1.8 W/m²K",
    features: [
      "Effortless fingertip glide with Italian Master/Comunello carriages",
      "Motorized automated opening integration available",
      "Flush recessed bottom rail for seamless indoor-outdoor floor transitions",
      "Glazing thickness up to 50mm for extreme acoustic barrier"
    ],
    colors: ["Matte Black", "Anthracite Fine Texture", "Champagne Anodized"]
  },
  {
    id: "al-lift-slide-51ls",
    name: "LIFT & SLIDE – 51LS",
    category: "aluminum",
    subCategory: "Slim Architectural Sliding",
    image: "/assets/winhome/2026-04-26-20.48.51-e1779047826296-300x300.jpg",
    fallbackImage: "https://winhome.co/wp-content/uploads/2026/04/2026-04-26-20.48.51-e1779047826296-300x300.jpg",
    description: "Slim profile sightlines combined with heavy-duty lift-slide performance for modern residential architecture.",
    depth: "51 mm",
    features: [
      "Narrow interlocking mullion for maximized glass visibility",
      "High weather protection against torrential rain and dust storms",
      "Multi-point perimeter locking handles"
    ],
    colors: ["Anthracite", "Black", "Natural Anodized"]
  },
  {
    id: "al-curtain-wall-50f",
    name: "CURTAIN WALL – 50F",
    category: "aluminum",
    subCategory: "Commercial Façades",
    image: "/assets/winhome/LIFT-SLIDE-70LS-Medium-300x300.jpeg",
    fallbackImage: "https://winhome.co/wp-content/uploads/2026/04/LIFT-SLIDE-70LS-Medium-300x300.jpeg",
    description: "Structural stick façade system with 50mm visible width. Perfect for corporate towers, showrooms, and glass curtain walls.",
    depth: "50 mm sightline, 50mm - 250mm mullion depths",
    features: [
      "Standard capped or semi-structural silicone glazing (SSG)",
      "Integrated pressure-equalized drainage system",
      "Compatible with projected top-hung and parallel-opening façade vents"
    ],
    colors: ["Matte Dark Grey", "Black", "Silver Anodized"]
  },
  {
    id: "al-sky-light-50f",
    name: "SKY LIGHT – 50F",
    category: "aluminum",
    subCategory: "Glass Roofs & Atriums",
    image: "/assets/winhome/2026-04-19-20.31.49-e1776809570272-300x300.jpg",
    fallbackImage: "https://winhome.co/wp-content/uploads/2026/04/2026-04-19-20.31.49-e1776809570272-300x300.jpg",
    description: "Engineered overhead glass canopy and skylight framing system with condensation channels and extreme load ratings.",
    depth: "50 mm",
    features: [
      "Multi-tier internal condensation guttering",
      "Engineered for heavy thermal expansion and solar loads",
      "Integrates with solar control and laminated safety glass"
    ],
    colors: ["Dark Grey", "Black", "White"]
  },
  {
    id: "al-folding-77bf",
    name: "FOLDING – 77BF (BI-FOLD)",
    category: "aluminum",
    subCategory: "Concertina Bi-Fold Doors",
    image: "/assets/winhome/IMG_20260420_112855_427-1-scaled-e1777373296366-300x300.jpg",
    fallbackImage: "https://winhome.co/wp-content/uploads/2026/04/IMG_20260420_112855_427-1-scaled-e1777373296366-300x300.jpg",
    description: "Premium bi-folding accordion door system that folds away completely to open entire walls up to 12 meters wide.",
    depth: "77 mm",
    features: [
      "Top-hung or bottom-bearing heavy-duty stainless steel carriages",
      "Flexible folding configurations from 2 to 10 leaf panels",
      "Continuous double EPDM gasket weather sealing"
    ],
    colors: ["Matte Black", "Anthracite Grey", "Custom Woodgrain Powdercoat"]
  },
  {
    id: "al-sliding-38t",
    name: "SLIDING – 38T (THERMAL)",
    category: "aluminum",
    subCategory: "Sliding Systems",
    image: "/assets/winhome/2026-04-19-20.10.01-e1776809374635-300x300.jpg",
    fallbackImage: "https://winhome.co/wp-content/uploads/2026/04/2026-04-19-20.10.01-e1776809374635-300x300.jpg",
    description: "Thermally broken sliding profile designed for contemporary apartments and commercial balcony enclosures.",
    depth: "38 mm sash",
    features: [
      "Polyamide thermal breaks to minimize solar heat transmission",
      "Reinforced interlocks with slim central meeting stiles",
      "Built-in track for insect screens"
    ],
    colors: ["Anthracite", "White", "Silver Anodized"]
  },
  {
    id: "al-office-partition",
    name: "OFFICE PARTITION – 18D / 24Z",
    category: "aluminum",
    subCategory: "Interior Architecture",
    image: "/assets/winhome/2026-04-19-20.08.41-e1776809415410-300x300.jpg",
    fallbackImage: "https://winhome.co/wp-content/uploads/2026/04/2026-04-19-20.08.41-e1776809415410-300x300.jpg",
    description: "Interior glass wall and acoustic office partition system for corporate headquarters and modern offices.",
    depth: "18 mm - 24 mm",
    features: [
      "Single and double glazed acoustic room dividers",
      "Integrated door frames with drop-down acoustic threshold seals",
      "Minimalist profiles maximizing natural light transmission"
    ],
    colors: ["Matte Black", "Silver", "Anthracite"]
  }
];

export const ACCESSORIES_LINES: ProductItem[] = [
  {
    id: "acc-window-line",
    name: "WINDOW HARDWARE LINE",
    category: "accessories",
    subCategory: "Window Mechanics",
    image: "/assets/winhome/photo_2023-07-03_15-38-36-600x390.jpg",
    fallbackImage: "https://winhome.co/wp-content/uploads/2023/07/photo_2023-07-03_15-38-36-600x390.jpg",
    description: "Comprehensive European window mechanics including Tilt & Turn drive gears, scissor arms, friction hinges, and multi-point corner transmissions.",
    features: [
      "Master Italy and Vorne certified European hardware",
      "Anti-corrosion silver trivalent chromate coating",
      "Adjustable 3D locking cams for precision gasket compression"
    ]
  },
  {
    id: "acc-door-line",
    name: "DOOR HARDWARE LINE",
    category: "accessories",
    subCategory: "Door Systems",
    image: "/assets/winhome/photo_2023-07-03_15-40-04-1104x720.jpg",
    fallbackImage: "https://winhome.co/wp-content/uploads/2023/07/photo_2023-07-03_15-40-04-1104x720.jpg",
    description: "Heavy-duty door hardware including 3D adjustable barrel hinges, multipoint automatic gear locks, panic exit devices, and security cylinders.",
    features: [
      "Tested for over 200,000 opening cycles",
      "Supports door sash weights up to 160kg",
      "Certified anti-drill and anti-snap security cylinders"
    ]
  },
  {
    id: "acc-sliding-line",
    name: "SLIDING HARDWARE LINE",
    category: "accessories",
    subCategory: "Sliding Mechanics",
    image: "/assets/winhome/photo_2023-07-03_15-41-20-1280x820.jpg",
    fallbackImage: "https://winhome.co/wp-content/uploads/2023/07/photo_2023-07-03_15-41-20-1280x820.jpg",
    description: "Precision engineered ball-bearing rollers, lift-and-slide mechanism sets, track covers, and flush perimeter locks.",
    features: [
      "Stainless steel needle bearings with nylon casing for silent operation",
      "Heavy lift-slide gears rated up to 400kg per leaf",
      "Keyed flush pulls and multi-point locking rods"
    ]
  },
  {
    id: "acc-curtain-wall-line",
    name: "CURTAIN WALL LINE",
    category: "accessories",
    subCategory: "Façade Hardware",
    image: "/assets/winhome/photo_2023-07-03_15-42-28-1120x716.jpg",
    fallbackImage: "https://winhome.co/wp-content/uploads/2023/07/photo_2023-07-03_15-42-28-1120x716.jpg",
    description: "EPDM weatherproofing gaskets, thermal isolator clips, stainless anchoring brackets, and structural pressure plate fasteners.",
    features: [
      "High UV and ozone resistant EPDM compounds",
      "Pre-formed vulcanized corners preventing joint leakage",
      "Seismic movement and thermal expansion joints"
    ]
  },
  {
    id: "acc-roller-shutter-line",
    name: "ROLLER SHUTTER LINE",
    category: "accessories",
    subCategory: "Shading & Security",
    image: "/assets/winhome/photo_2023-07-03_15-44-50.png",
    fallbackImage: "https://winhome.co/wp-content/uploads/2023/07/photo_2023-07-03_15-44-50.png",
    description: "Tubular electric motors, smart wireless remotes, polyurethane-injected aluminum slats, and secure locking guide rails.",
    features: [
      "Somfy and Comunello compatible tubular drive motors",
      "Extruded security slats providing thermal barrier and blackout",
      "Obstacle detection and manual override in case of power failure"
    ]
  },
  {
    id: "acc-corner-joint-line",
    name: "CORNER JOINT LINE",
    category: "accessories",
    subCategory: "Structural Assembly",
    image: "/assets/winhome/photo_2023-07-03_15-49-24-760x485.jpg",
    fallbackImage: "https://winhome.co/wp-content/uploads/2023/07/photo_2023-07-03_15-49-24-760x485.jpg",
    description: "High-precision mechanical corner cleats, eccentric alignment pins, crimping corners, and chemical bonding sealants.",
    features: [
      "Die-cast and extruded aircraft-grade aluminum cleats",
      "Ensures exact 45° and 90° mitre alignment and water tightness",
      "Chemical injection ports for structural structural adhesive"
    ]
  },
  {
    id: "acc-handle-line",
    name: "HANDLE & PULL HANDLE LINE",
    category: "accessories",
    subCategory: "Architectural Touchpoints",
    image: "/assets/winhome/photo_2023-07-03_15-50-46-1104x700.jpg",
    fallbackImage: "https://winhome.co/wp-content/uploads/2023/07/photo_2023-07-03_15-50-46-1104x700.jpg",
    description: "Ergonomic designer handles for windows and doors in stainless steel 316, anodized aluminum, and antibacterial powder coat.",
    features: [
      "Secustik® certified anti-manipulation security window handles",
      "Monumental T-bar and offset entrance pull handles up to 1800mm",
      "Luxury finishes: Matte Black, Satin Gold, Brushed Inox, Graphite"
    ]
  }
];

export const BROCHURES_DATA: BrochureItem[] = [
  {
    id: "brochure-deceuninck",
    title: "Deceuninck uPVC Systems Complete Catalogue",
    brand: "Deceuninck",
    origin: "Belgium",
    coverImage: "/assets/winhome/brouchour-deceuninck-1-1000x1000.jpg",
    fallbackCover: "https://winhome.co/wp-content/uploads/2023/08/brouchour-deceuninck-1-1000x1000.jpg",
    description: "Detailed technical drawings, chamber sections, static calculations, and energy certification for Legend 80, Legend Art, and Everest Max systems.",
    pages: 124,
    fileSize: "18.4 MB",
    downloadUrl: "#",
    highlights: ["Chamber cross sections", "Uw thermal calculations", "Color decors chart", "Acoustic ratings"]
  },
  {
    id: "brochure-master",
    title: "Master Italy Hardware & Systems Catalogue",
    brand: "Master Italy",
    origin: "Italy",
    coverImage: "/assets/winhome/brouchour-Master-1-1000x1000.jpg",
    fallbackCover: "https://winhome.co/wp-content/uploads/2023/08/brouchour-Master-1-1000x1000.jpg",
    description: "Comprehensive catalogue of European high-end architectural window handles, multipoint locks, concealed hinges, and automation components.",
    pages: 96,
    fileSize: "14.2 MB",
    downloadUrl: "#",
    highlights: ["Concealed hinge specs", "Cycle test reports", "Automation wiring", "Handle finishes"]
  },
  {
    id: "brochure-lorenzoline",
    title: "Lorenzoline Architectural Aluminum Systems",
    brand: "Lorenzoline",
    origin: "Europe",
    coverImage: "/assets/winhome/lorenzoline-brochure2-01-1000x1000.jpg",
    fallbackCover: "https://winhome.co/wp-content/uploads/2023/08/lorenzoline-brochure2-01-1000x1000.jpg",
    description: "Thermal break aluminum profiles, curtain wall stick systems, skylights, and monumental sliding systems for residential and commercial projects.",
    pages: 148,
    fileSize: "22.1 MB",
    downloadUrl: "#",
    highlights: ["Profile inertia charts", "Curtain wall 50F details", "Lift & Slide 70LS assembly", "Polyamide specifications"]
  },
  {
    id: "brochure-comunello",
    title: "Comunello Window Automation & Gate Hardware",
    brand: "Comunello",
    origin: "Italy",
    coverImage: "/assets/winhome/brouchour-comunello-2-1-1000x1000.jpg",
    fallbackCover: "https://winhome.co/wp-content/uploads/2023/08/brouchour-comunello-2-1-1000x1000.jpg",
    description: "Chain actuators, rod drives, rack motors for smoke & heat extraction (SHEV), and residential window automation.",
    pages: 82,
    fileSize: "11.6 MB",
    downloadUrl: "#",
    highlights: ["Smart automation", "Smoke ventilation actuators", "Chain drive specs", "Remote controls"]
  },
  {
    id: "brochure-stac",
    title: "STAC Architectural Systems & Hardware",
    brand: "STAC",
    origin: "Spain",
    coverImage: "/assets/winhome/brouchour-stac-1-1000x1000.jpg",
    fallbackCover: "https://winhome.co/wp-content/uploads/2023/08/brouchour-stac-1-1000x1000.jpg",
    description: "Premium architectural hardware, polyamide thermal barrier strips, EPDM gaskets, and aluminum composite facade solutions.",
    pages: 110,
    fileSize: "16.8 MB",
    downloadUrl: "#",
    highlights: ["Polyamide thermal breaks", "Flush handles", "Perimeter multipoints", "CE certifications"]
  }
];

export const WINHOME_STATS = [
  { value: "25+", label: "Years in Industry", desc: "Decades of market leadership in Iraq" },
  { value: "10,000+", label: "Projects Completed", desc: "Residential villas, towers & commercial buildings" },
  { value: "100%", label: "European Quality", desc: "Belgium, Germany, Italy & Spain partners" },
  { value: "2 Branches", label: "Erbil Showroom & Plant", desc: "Fully equipped fabrication facility" }
];

export const ALL_PRODUCTS: ProductItem[] = [
  ...UPVC_PRODUCTS,
  ...ALUMINUM_PRODUCTS,
  ...ACCESSORIES_LINES
];
