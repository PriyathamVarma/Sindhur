import mongoose, { Schema } from "mongoose";

const certificationSchema = new Schema(
  {
    name:              { type: String, required: true },
    issuingAuthority:  { type: String, required: true },
    certificateNumber: { type: String },
    validFrom:         { type: Date },
    validTo:           { type: Date },
    imageUrl:          { type: String },
    documentUrl:       { type: String },
    description:       { type: String },
    status:            { type: String, enum: ["active", "expired", "hidden"], default: "active", index: true },
  },
  { timestamps: true }
);

const CertificationModel =
  mongoose.models.Certification || mongoose.model("Certification", certificationSchema);
export default CertificationModel;
