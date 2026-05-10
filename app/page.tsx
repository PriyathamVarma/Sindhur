import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProductsSection from "@/components/ProductsSection";
import GlobalSection from "@/components/GlobalSection";
import WhyChooseSection from "@/components/WhyChooseSection";
import ProcessSection from "@/components/ProcessSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Sindhur Exports — India's Premium Export Partner",
  description:
    "Sindhur Exports is a trusted Indian export company delivering quality products to 50+ countries. From agri commodities and spices to textiles and handicrafts — we connect Indian excellence with global markets.",
  keywords: [
    "Indian export company",
    "basmati rice export",
    "spices export India",
    "textile export India",
    "import from India",
    "Hyderabad exporter",
    "Sindhur Exports",
  ],
  openGraph: {
    title: "Sindhur Exports — India's Premium Export Partner",
    description: "Delivering quality Indian products to 50+ countries worldwide.",
    type: "website",
    locale: "en_US",
  },
};

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ProductsSection />
      <GlobalSection />
      <WhyChooseSection />
      <ProcessSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
