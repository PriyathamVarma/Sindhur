"use client";

import { useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { SUPABASE_STORAGE_BUCKET, getUploadErrorMessage } from "@/utils/supabase/storage";
import toast from "react-hot-toast";

function isImageUrl(url: string) {
  return /\.(jpg|jpeg|png|gif|webp|svg|avif)(\?.*)?$/i.test(url);
}

interface Props {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  accept?: string;
  label?: string;
  hint?: string;
}

export default function UploadInput({
  value,
  onChange,
  folder = "uploads",
  accept = "image/*",
  label = "file",
  hint,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setUploading(true);
    try {
      const supabase = createClient();
      const ext  = file.name.split(".").pop() || "bin";
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error } = await supabase.storage.from(SUPABASE_STORAGE_BUCKET).upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (error) throw error;

      const { data } = supabase.storage.from(SUPABASE_STORAGE_BUCKET).getPublicUrl(path);
      onChange(data.publicUrl);
      toast.success("Uploaded");
    } catch (err: unknown) {
      toast.error(getUploadErrorMessage(err));
    } finally {
      setUploading(false);
      if (ref.current) ref.current.value = "";
    }
  }

  const showImage = value && isImageUrl(value);
  const showFile  = value && !isImageUrl(value);
  const fileName  = value ? decodeURIComponent(value.split("/").pop()?.split("?")[0] || "") : "";

  return (
    <div>
      <input
        ref={ref}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
      />

      {/* Image preview */}
      {showImage && (
        <div className="relative mt-1">
          <img
            src={value}
            alt="preview"
            className="w-full h-44 object-cover rounded-xl border border-gray-200"
          />
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              type="button"
              onClick={() => ref.current?.click()}
              className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-700 text-[12px] font-semibold rounded-lg border border-gray-200 hover:border-orange-300 transition"
            >
              Change
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="px-3 py-1 bg-white/90 backdrop-blur-sm text-red-500 text-[12px] font-semibold rounded-lg border border-red-200 hover:bg-red-50 transition"
            >
              Remove
            </button>
          </div>
        </div>
      )}

      {/* File preview */}
      {showFile && (
        <div className="mt-1 flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-gray-900 truncate">{fileName}</p>
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-orange-500 hover:underline"
            >
              View file ↗
            </a>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => ref.current?.click()}
              className="px-3 py-1.5 text-gray-600 text-[12px] font-semibold rounded-lg border border-gray-200 hover:border-orange-300 transition"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="px-3 py-1.5 text-red-500 text-[12px] font-semibold rounded-lg border border-red-200 hover:bg-red-50 transition"
            >
              Remove
            </button>
          </div>
        </div>
      )}

      {/* Drop zone */}
      {!value && (
        <button
          type="button"
          onClick={() => ref.current?.click()}
          disabled={uploading}
          className="w-full h-36 rounded-xl border-2 border-dashed border-gray-200 hover:border-orange-300 hover:bg-orange-50/30 flex flex-col items-center justify-center gap-2 transition-all disabled:opacity-60"
        >
          {uploading ? (
            <>
              <div className="w-6 h-6 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-gray-400 text-[12px]">Uploading...</span>
            </>
          ) : (
            <>
              {accept.includes("image") ? (
                <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              ) : (
                <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              )}
              <span className="text-gray-400 text-[13px] font-medium">Click to upload {label}</span>
              {hint && <span className="text-gray-300 text-[11px]">{hint}</span>}
            </>
          )}
        </button>
      )}
    </div>
  );
}
