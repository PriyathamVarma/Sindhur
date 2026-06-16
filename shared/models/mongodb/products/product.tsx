import mongoose, { Schema } from "mongoose";

const specSchema = new Schema({ label: String, value: String }, { _id: false });

const productSchema = new Schema(
  {
    name:                  { type: String, required: true, trim: true },
    slug:                  { type: String, required: true, unique: true, lowercase: true, index: true },
    category:              { type: String, required: true },
    shortDescription:      { type: String, required: true },
    fullDescription:       { type: String, required: true },
    images:                [{ type: String }],
    scientificName:        { type: String },
    hsCode:                { type: String },
    origin:                { type: String },
    availableGrades:       [{ type: String }],
    specifications:        [specSchema],
    moq:                   { type: String },
    packagingOptions:      [{ type: String }],
    containerCapacity:     { type: String },
    shelfLife:             { type: String },
    certifications:        [{ type: String }],
    leadTime:              { type: String },
    incotermsSupported:    [{ type: String }],
    paymentTerms:          [{ type: String }],
    exportMarkets:         [{ type: String }],
    privateLabelAvailable: { type: Boolean, default: false },
    sampleAvailable:       { type: Boolean, default: false },
    status:                { type: String, enum: ["draft", "published"], default: "draft", index: true },
  },
  { timestamps: true }
);

productSchema.index({ status: 1, createdAt: -1 });
productSchema.index({ category: 1, status: 1 });

const ProductModel = mongoose.models.Product || mongoose.model("Product", productSchema);
export default ProductModel;
