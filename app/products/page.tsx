import type { Metadata } from "next";
import ProductCatalog from "@/components/ProductCatalog";
import { mongoDB } from "@/shared/lib/db/mongo";
import ProductModel from "@/shared/models/mongodb/products/product";
import type { IProduct } from "@/shared/interfaces/mongodb/products/product";
import { cacheGet, cacheSet, CACHE_KEYS, TTL } from "@/utils/redis";

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
  const cached = await cacheGet<IProduct[]>(CACHE_KEYS.PRODUCTS_LIST);
  if (cached) return cached;

  try {
    await mongoDB();
    const items = await ProductModel.find({ status: "published" })
      .select("-fullDescription -specifications")
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();
    const result = items as unknown as IProduct[];
    await cacheSet(CACHE_KEYS.PRODUCTS_LIST, result, TTL.LIST);
    return result;
  } catch {
    return [];
  }
}

export default async function ProductsPage() {
  const products = await getProducts();
  return <ProductCatalog initialProducts={products} />;
}
