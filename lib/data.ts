import type { Product, Testimonial, ProcessStep, WhyChooseItem, Country, NavLink } from "@/types";

export const NAV_LINKS: NavLink[] = [
  { label: "About", href: "#about" },
  { label: "Products", href: "#products" },
  { label: "Global Reach", href: "#global" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
];

export const PRODUCTS: Product[] = [
  {
    id: "1",
    title: "Basmati Rice",
    description: "Premium long-grain basmati rice, aged to perfection. Sourced from the finest farms in India, meeting international food safety standards.",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80",
    category: "Agri Commodities",
    tags: ["FSSAI", "ISO 22000", "Organic Available"],
  },
  {
    id: "2",
    title: "Spices & Masalas",
    description: "Authentic Indian spices — turmeric, cumin, coriander, cardamom and more. Processed in hygienic, certified facilities for global markets.",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80",
    category: "Spices",
    tags: ["APEDA", "GMP Certified", "100+ SKUs"],
  },
  {
    id: "3",
    title: "Textiles & Fabrics",
    description: "High-quality cotton, silk, and blended textiles. From raw fabric to finished garments, we supply global fashion and industrial buyers.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    category: "Textiles",
    tags: ["OEKO-TEX", "Custom Weaves", "MOQ Flexible"],
  },
  {
    id: "4",
    title: "Handicrafts & Décor",
    description: "Artisan-crafted home décor, wooden handicrafts, and brassware representing India's rich cultural heritage for global retail buyers.",
    image: "https://images.unsplash.com/photo-1567538096621-38d2284b23ff?w=600&q=80",
    category: "Handicrafts",
    tags: ["Fair Trade", "Artisan Made", "Custom OEM"],
  },
  {
    id: "5",
    title: "Organic Pulses",
    description: "Red lentils, chickpeas, moong dal and more. Certified organic, protein-rich pulses destined for health-conscious markets worldwide.",
    image: "https://images.unsplash.com/photo-1610725664285-7c57e6eeac3f?w=600&q=80",
    category: "Agri Commodities",
    tags: ["Organic Certified", "Non-GMO", "Bulk & Retail"],
  },
  {
    id: "6",
    title: "Industrial Chemicals",
    description: "Industrial-grade chemicals, dyes, and compounds for manufacturing sectors. Fully compliant with REACH, RoHS and international safety norms.",
    image: "https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=600&q=80",
    category: "Chemicals",
    tags: ["REACH Compliant", "ISO 9001", "SDS Available"],
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
  { name: "United States", flag: "🇺🇸", region: "Americas" },
  { name: "United Kingdom", flag: "🇬🇧", region: "Europe" },
  { name: "Germany", flag: "🇩🇪", region: "Europe" },
  { name: "Japan", flag: "🇯🇵", region: "Asia Pacific" },
  { name: "Australia", flag: "🇦🇺", region: "Asia Pacific" },
  { name: "UAE", flag: "🇦🇪", region: "Middle East" },
  { name: "Saudi Arabia", flag: "🇸🇦", region: "Middle East" },
  { name: "Singapore", flag: "🇸🇬", region: "Asia Pacific" },
  { name: "Canada", flag: "🇨🇦", region: "Americas" },
  { name: "France", flag: "🇫🇷", region: "Europe" },
  { name: "Netherlands", flag: "🇳🇱", region: "Europe" },
  { name: "South Africa", flag: "🇿🇦", region: "Africa" },
  { name: "Nigeria", flag: "🇳🇬", region: "Africa" },
  { name: "Brazil", flag: "🇧🇷", region: "Americas" },
  { name: "Malaysia", flag: "🇲🇾", region: "Asia Pacific" },
  { name: "New Zealand", flag: "🇳🇿", region: "Asia Pacific" },
];
