import type { Metadata } from "next";
import ProductCatalog from "@/components/ProductCatalog";
import { mongoDB } from "@/shared/lib/db/mongo";
import ProductModel from "@/shared/models/mongodb/products/product";
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
    await mongoDB();
    const items = await ProductModel.find({ status: "published" })
      .select("-fullDescription -specifications")
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();
    return items as unknown as IProduct[];
  } catch {
    return [];
  }
}

export default async function ProductsPage() {
  const products = await getProducts();
  return <ProductCatalog initialProducts={products} />;
}
