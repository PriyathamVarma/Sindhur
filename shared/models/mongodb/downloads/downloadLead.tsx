import mongoose, { Schema } from "mongoose";

const downloadLeadSchema = new Schema(
  {
    name:          { type: String, required: true },
    email:         { type: String, required: true, lowercase: true },
    company:       { type: String },
    country:       { type: String },
    phone:         { type: String },
    downloadId:    { type: String, required: true, index: true },
    downloadTitle: { type: String, required: true },
  },
  { timestamps: true }
);

downloadLeadSchema.index({ createdAt: -1 });

const DownloadLeadModel =
  mongoose.models.DownloadLead || mongoose.model("DownloadLead", downloadLeadSchema);
export default DownloadLeadModel;
