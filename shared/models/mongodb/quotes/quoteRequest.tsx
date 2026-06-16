import mongoose, { Schema } from "mongoose";

const quoteRequestSchema = new Schema(
  {
    name:       { type: String, required: true, trim: true },
    company:    { type: String, trim: true },
    email:      { type: String, required: true, lowercase: true, trim: true },
    country:    { type: String, trim: true },
    product:    { type: String },
    message:    { type: String },
    status: {
      type:    String,
      enum:    ["pending", "reviewing", "responded", "closed"],
      default: "pending",
      index:   true,
    },
    adminNotes: { type: String },
  },
  { timestamps: true },
);

quoteRequestSchema.index({ createdAt: -1 });
quoteRequestSchema.index({ status: 1, createdAt: -1 });

const QuoteRequestModel =
  mongoose.models.QuoteRequest || mongoose.model("QuoteRequest", quoteRequestSchema);
export default QuoteRequestModel;
