export type CertificationStatus = "active" | "expired" | "hidden";

export interface ICertification {
  _id?: string;
  name: string;
  issuingAuthority: string;
  certificateNumber?: string;
  validFrom?: Date;
  validTo?: Date;
  imageUrl?: string;
  documentUrl?: string;
  description?: string;
  status: CertificationStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
