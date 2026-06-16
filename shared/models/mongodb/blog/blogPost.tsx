import mongoose, { Schema } from "mongoose";

const blogPostSchema = new Schema(
  {
    title:       { type: String, required: true, trim: true },
    slug:        { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    excerpt:     { type: String, required: true, trim: true },
    content:     { type: String, required: true },
    coverImage:  { type: String },
    tags:        { type: [String], default: [] },
    status:      { type: String, enum: ["draft", "published"], default: "draft", index: true },
    authorId:    { type: String },
    publishedAt: { type: Date },
  },
  { timestamps: true },
);

blogPostSchema.index({ status: 1, publishedAt: -1 });

const BlogPostModel =
  mongoose.models.BlogPost || mongoose.model("BlogPost", blogPostSchema);
export default BlogPostModel;
