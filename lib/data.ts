import type { Product, Testimonial, ProcessStep, WhyChooseItem, Country, NavLink } from "@/types";

export const NAV_LINKS: NavLink[] = [
  { label: "About",       href: "#about" },
  { label: "Products",    href: "/products" },
  { label: "Global Reach",href: "#global" },
  { label: "Process",     href: "#process" },
  { label: "Blog",        href: "/blog" },
  { label: "Contact",     href: "#contact" },
];

export const PRODUCTS: Product[] = [
  {
    id: "1",
    title: "Fresh Coconuts",
    description: "Premium-grade fresh coconuts sourced from coastal Andhra Pradesh. Available as whole coconuts, tender coconuts, and copra. Ideal for food processors, oil mills and FMCG buyers.",
    image: "https://images.unsplash.com/photo-1580984969071-a8da5656c2fb?w=600&q=80",
    category: "Agri Commodities",
    tags: ["APEDA Registered", "Grade A", "Bulk & Retail"],
  },
  {
    id: "2",
    title: "Coconut By-Products",
    description: "Value-added coconut derivatives — desiccated coconut, coconut milk powder, virgin coconut oil and copra. Processed in hygienic facilities meeting international food safety standards.",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&q=80",
    category: "Agri Commodities",
    tags: ["FSSAI Licensed", "ISO 22000", "Private Label"],
  },
  {
    id: "3",
    title: "Basmati & Non-Basmati Rice",
    description: "Long-grain aged Basmati and premium non-basmati varieties (Sona Masoori, IR64, Ponni). Sourced from India's finest rice belts, milled and graded for global markets.",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80",
    category: "Agri Commodities",
    tags: ["APEDA", "ISO 22000", "Organic Available"],
  },
  {
    id: "4",
    title: "Organic Dehydrated Powders",
    description: "Certified organic dehydrated vegetable and superfood powders — amla, moringa, turmeric, ginger, beetroot, spinach and more. Ideal for nutraceutical, health food and supplement brands.",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&q=80",
    category: "Organic Products",
    tags: ["Organic Certified", "Non-GMO", "100+ SKUs"],
  },
  {
    id: "5",
    title: "Spices & Masalas",
    description: "Authentic Indian spices — turmeric, cumin, coriander, cardamom, black pepper, red chilli and blended masalas. Processed in GMP-certified facilities with zero adulteration.",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80",
    category: "Spices",
    tags: ["APEDA", "GMP Certified", "Bulk & Retail"],
  },
  {
    id: "6",
    title: "Herbal & Botanical Extracts",
    description: "Standardised herbal extracts and botanical powders — ashwagandha, neem, tulsi, brahmi and triphala. Meeting USP, EP and Ayurvedic standards for global wellness markets.",
    image: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=600&q=80",
    category: "Organic Products",
    tags: ["GMP Certified", "Lab Tested", "COA Available"],
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Marcus Bauer",
    role: "Head of Procurement",
    company: "EuroTrade GmbH",
    country: "Germany",
    flag: "🇩🇪",
    quote: "Sindhur Exports has been our trusted partner for 6 years. Their quality consistency and on-time shipping record is unmatched in the industry. We confidently recommend them to any European buyer.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
  },
  {
    id: "2",
    name: "Aiko Tanaka",
    role: "Import Director",
    company: "Sakura Trade Co.",
    country: "Japan",
    flag: "🇯🇵",
    quote: "The documentation accuracy and compliance expertise of Sindhur's team made our FDA and Japanese customs clearance seamless. True professionals in every sense.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
  },
  {
    id: "3",
    name: "Robert Mensah",
    role: "CEO",
    company: "AfriSource Ltd.",
    country: "Ghana",
    flag: "🇬🇭",
    quote: "From first inquiry to final delivery, the experience was exceptional. Competitive pricing, transparent communication and a product quality that keeps our customers coming back.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
  },
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: 1,
    title: "Inquiry & Quotation",
    description: "Submit your product requirements. Our team responds with detailed quotations, product specs, and compliance documentation within 24 hours.",
    icon: "📋",
  },
  {
    step: 2,
    title: "Sampling & Approval",
    description: "We dispatch pre-shipment samples for your approval. Our quality team verifies each sample against international standards before dispatch.",
    icon: "🔬",
  },
  {
    step: 3,
    title: "Production & Packing",
    description: "Once approved, we initiate production or sourcing, following your packaging and labelling specifications with precision.",
    icon: "⚙️",
  },
  {
    step: 4,
    title: "Quality Inspection",
    description: "Third-party quality inspections are conducted at our facility. We provide full inspection reports, COAs and compliance certificates.",
    icon: "✅",
  },
  {
    step: 5,
    title: "Shipping & Delivery",
    description: "We manage end-to-end logistics — FCL/LCL container booking, freight forwarding, customs documentation and real-time shipment tracking.",
    icon: "🚢",
  },
];

export const WHY_CHOOSE: WhyChooseItem[] = [
  {
    title: "ISO 9001:2015 Certified",
    description: "Our operations conform to international quality management standards, ensuring consistent product quality across all exports.",
    icon: "🏅",
  },
  {
    title: "15+ Years of Export Experience",
    description: "Over a decade and a half of navigating global trade, regulatory frameworks, and supply chain complexities for our clients.",
    icon: "📅",
  },
  {
    title: "50+ Countries Served",
    description: "From Southeast Asia to Europe, Americas to Africa — our global distribution network ensures timely and reliable deliveries.",
    icon: "🌍",
  },
  {
    title: "End-to-End Logistics",
    description: "We handle freight, insurance, customs documentation, and last-mile delivery — a true single-window export solution.",
    icon: "🔗",
  },
  {
    title: "Dedicated Account Managers",
    description: "Every client gets a dedicated point of contact who understands your market, preferences and communication expectations.",
    icon: "🤝",
  },
  {
    title: "100% Documentation Accuracy",
    description: "Clean paperwork means smooth customs clearance. We take pride in zero documentation errors across thousands of shipments.",
    icon: "📄",
  },
];

export const COUNTRIES: Country[] = [
  { name: "United States",  flag: "🇺🇸", region: "Americas" },
  { name: "United Kingdom", flag: "🇬🇧", region: "Europe" },
  { name: "Germany",        flag: "🇩🇪", region: "Europe" },
  { name: "Japan",          flag: "🇯🇵", region: "Asia Pacific" },
  { name: "Australia",      flag: "🇦🇺", region: "Asia Pacific" },
  { name: "UAE",            flag: "🇦🇪", region: "Middle East" },
  { name: "Saudi Arabia",   flag: "🇸🇦", region: "Middle East" },
  { name: "Singapore",      flag: "🇸🇬", region: "Asia Pacific" },
  { name: "Canada",         flag: "🇨🇦", region: "Americas" },
  { name: "France",         flag: "🇫🇷", region: "Europe" },
  { name: "Netherlands",    flag: "🇳🇱", region: "Europe" },
  { name: "South Africa",   flag: "🇿🇦", region: "Africa" },
  { name: "Nigeria",        flag: "🇳🇬", region: "Africa" },
  { name: "Brazil",         flag: "🇧🇷", region: "Americas" },
  { name: "Malaysia",       flag: "🇲🇾", region: "Asia Pacific" },
  { name: "New Zealand",    flag: "🇳🇿", region: "Asia Pacific" },
];
