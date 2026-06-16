export type QuoteStatus = "pending" | "reviewing" | "responded" | "closed";

export interface IQuoteRequest {
  _id?: string;
  name: string;
  company?: string;
  email: string;
  country?: string;
  product?: string;
  message?: string;
  status: QuoteStatus;
  adminNotes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
