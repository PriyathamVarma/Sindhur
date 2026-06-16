export type RFQStatus =
  | "new"
  | "contacted"
  | "negotiation"
  | "sample_sent"
  | "quotation_sent"
  | "won"
  | "lost";

export type BusinessType =
  | "Importer"
  | "Distributor"
  | "Retailer"
  | "Wholesaler"
  | "Manufacturer"
  | "Other";

export interface IRFQ {
  _id?: string;
  buyerName: string;
  companyName: string;
  email: string;
  phone?: string;
  country: string;
  businessType: BusinessType;
  productInterested: string;
  quantityRequired?: string;
  targetPrice?: string;
  destinationPort?: string;
  preferredIncoterm?: string;
  packagingRequirements?: string;
  customRequirements?: string;
  message?: string;
  uploadedDocumentUrl?: string;
  status: RFQStatus;
  adminNotes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
