import mongoose, { Schema } from "mongoose";

const downloadSchema = new Schema(
  {
    title:               { type: String, required: true },
    description:         { type: String, required: true },
    fileUrl:             { type: String, required: true },
    type:                {
      type: String,
      enum: ["Company Profile", "Product Catalog", "Certification", "Brochure", "Other"],
      required: true,
    },
    requiresLeadCapture: { type: Boolean, default: false },
    status:              { type: String, enum: ["draft", "published"], default: "draft", index: true },
  },
  { timestamps: true }
);

const DownloadModel = mongoose.models.Download || mongoose.model("Download", downloadSchema);
export default DownloadModel;
