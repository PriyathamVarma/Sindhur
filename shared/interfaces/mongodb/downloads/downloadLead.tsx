export interface IDownloadLead {
  _id?: string;
  name: string;
  email: string;
  company?: string;
  country?: string;
  phone?: string;
  downloadId: string;
  downloadTitle: string;
  createdAt?: Date;
  updatedAt?: Date;
}
