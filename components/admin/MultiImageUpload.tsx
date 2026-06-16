"use client";

import { useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { SUPABASE_STORAGE_BUCKET, getUploadErrorMessage } from "@/utils/supabase/storage";
import toast from "react-hot-toast";
import { X, Plus } from "lucide-react";

interface Props {
  values: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
}

export default function MultiImageUpload({ values, onChange, folder = "uploads" }: Props) {
  const [uploading, setUploading] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  async function upload(files: FileList) {
    setUploading(true);
    const supabase = createClient();
    const newUrls: string[] = [];

    try {
      for (const file of Array.from(files)) {
        const ext  = file.name.split(".").pop() || "jpg";
        const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        const { error } = await supabase.storage.from(SUPABASE_STORAGE_BUCKET).upload(path, file, {
          cacheControl: "3600",
          upsert: false,
        });
        if (error) throw error;

        const { data } = supabase.storage.from(SUPABASE_STORAGE_BUCKET).getPublicUrl(path);
        newUrls.push(data.publicUrl);
      }

      onChange([...values, ...newUrls]);
      toast.success(`${newUrls.length} image${newUrls.length > 1 ? "s" : ""} uploaded`);
    } catch (err: unknown) {
      toast.error(getUploadErrorMessage(err));
    } finally {
      setUploading(false);
      if (ref.current) ref.current.value = "";
    }
  }

  function remove(i: number) {
    onChange(values.filter((_, idx) => idx !== i));
  }

  return (
    <div>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => e.target.files?.length && upload(e.target.files)}
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {values.map((url, i) => (
          <div
            key={url + i}
            className="relative group aspect-video rounded-xl overflow-hidden border border-gray-200 bg-gray-50"
          >
            <img src={url} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
              <button
                type="button"
                onClick={() => remove(i)}
                className="opacity-0 group-hover:opacity-100 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {i === 0 && (
              <div className="absolute top-1.5 left-1.5 bg-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md tracking-wider">
                MAIN
              </div>
            )}
          </div>
        ))}

        {/* Add button */}
        <button
          type="button"
          onClick={() => ref.current?.click()}
          disabled={uploading}
          className="aspect-video rounded-xl border-2 border-dashed border-gray-200 hover:border-orange-300 hover:bg-orange-50/40 flex flex-col items-center justify-center gap-1.5 transition-all disabled:opacity-60"
        >
          {uploading ? (
            <div className="w-5 h-5 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Plus className="w-6 h-6 text-gray-300" />
              <span className="text-gray-400 text-[11px] font-medium">Add image</span>
            </>
          )}
        </button>
      </div>

      {values.length === 0 && (
        <p className="text-gray-300 text-[11px] mt-2">First image will be used as the product thumbnail.</p>
      )}
      {values.length > 0 && (
        <p className="text-gray-400 text-[11px] mt-2">Hover an image and click × to remove it. First image = main thumbnail.</p>
      )}
    </div>
  );
}
