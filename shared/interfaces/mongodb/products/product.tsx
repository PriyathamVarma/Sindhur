export type ProductStatus = "draft" | "published";

export interface IProductSpecification {
  label: string;
  value: string;
}

export interface IProduct {
  _id?: string;
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  images: string[];
  scientificName?: string;
  hsCode?: string;
  origin?: string;
  availableGrades: string[];
  specifications: IProductSpecification[];
  moq?: string;
  packagingOptions: string[];
  containerCapacity?: string;
  shelfLife?: string;
  certifications: string[];
  leadTime?: string;
  incotermsSupported: string[];
  paymentTerms: string[];
  exportMarkets: string[];
  privateLabelAvailable: boolean;
  sampleAvailable: boolean;
  status: ProductStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
