import type { Metadata } from "next";
import ProductCatalog from "@/components/ProductCatalog";
import type { IProduct } from "@/shared/interfaces/mongodb/products/product";

export const metadata: Metadata = {
  title: "Export Products — Sindhur Exports",
  description:
    "Browse export-ready Indian products: fresh coconuts, rice, organic dehydrated powders, spices and herbal extracts. Certified and compliant for global markets.",
  openGraph: {
    title: "Export Products — Sindhur Exports",
    description: "Certified Indian export products sourced from 200+ verified manufacturers.",
  },
};

async function getProducts(): Promise<IProduct[]> {
  try {
    const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res  = await fetch(`${base}/api/v1/products?limit=100`, { cache: "no-store" });
    const data = await res.json();
    return data.success ? data.data.items : [];
  } catch {
    return [];
  }
}

export default async function ProductsPage() {
  const products = await getProducts();
  return <ProductCatalog initialProducts={products} />;
}
