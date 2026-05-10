export interface Product {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  tags: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  country: string;
  flag: string;
  quote: string;
  avatar: string;
}

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
  icon: string;
}

export interface WhyChooseItem {
  title: string;
  description: string;
  icon: string;
}

export interface Country {
  name: string;
  flag: string;
  region: string;
}

export interface NavLink {
  label: string;
  href: string;
}
