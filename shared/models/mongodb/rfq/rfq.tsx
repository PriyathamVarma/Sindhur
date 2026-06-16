import mongoose, { Schema } from "mongoose";

const rfqSchema = new Schema(
  {
    buyerName:             { type: String, required: true },
    companyName:           { type: String, required: true },
    email:                 { type: String, required: true, lowercase: true },
    phone:                 { type: String },
    country:               { type: String, required: true },
    businessType:          {
      type: String,
      enum: ["Importer", "Distributor", "Retailer", "Wholesaler", "Manufacturer", "Other"],
      required: true,
    },
    productInterested:     { type: String, required: true },
    quantityRequired:      { type: String },
    targetPrice:           { type: String },
    destinationPort:       { type: String },
    preferredIncoterm:     { type: String },
    packagingRequirements: { type: String },
    customRequirements:    { type: String },
    message:               { type: String },
    uploadedDocumentUrl:   { type: String },
    status:                {
      type: String,
      enum: ["new", "contacted", "negotiation", "sample_sent", "quotation_sent", "won", "lost"],
      default: "new",
      index: true,
    },
    adminNotes:            { type: String },
  },
  { timestamps: true }
);

rfqSchema.index({ createdAt: -1 });
rfqSchema.index({ status: 1, createdAt: -1 });
rfqSchema.index({ country: 1 });

const RFQModel = mongoose.models.RFQ || mongoose.model("RFQ", rfqSchema);
export default RFQModel;
