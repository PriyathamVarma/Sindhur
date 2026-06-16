export type PostStatus = "draft" | "published";

export interface IBlogPost {
  _id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  tags: string[];
  status: PostStatus;
  authorId?: string;
  publishedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
