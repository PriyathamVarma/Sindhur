export type DownloadType =
  | "Company Profile"
  | "Product Catalog"
  | "Certification"
  | "Brochure"
  | "Other";

export type DownloadStatus = "draft" | "published";

export interface IDownload {
  _id?: string;
  title: string;
  description: string;
  fileUrl: string;
  type: DownloadType;
  requiresLeadCapture: boolean;
  status: DownloadStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
