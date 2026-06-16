export const SUPABASE_STORAGE_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_BUCKET ||
  process.env.NEXT_PUBLIC_SUPABASE_SUPABASE_BUCKET ||
  "products";

export function getUploadErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error && "message" in error) {
    return String(error.message);
  }
  return "Upload failed";
}
