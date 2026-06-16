"use client";

import { useState } from "react";

interface Props {
  images: string[];
  name: string;
}

export default function ProductGallery({ images, name }: Props) {
  const [active, setActive] = useState(0);
  const safeImages = images?.length
    ? images
    : ["https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80"];

  function prev() { setActive((a) => (a - 1 + safeImages.length) % safeImages.length); }
  function next() { setActive((a) => (a + 1) % safeImages.length); }

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative overflow-hidden rounded-2xl bg-gray-100 aspect-[4/3]">
        <img
          key={active}
          src={safeImages[active]}
          alt={`${name} — image ${active + 1}`}
          className="w-full h-full object-cover"
        />

        {safeImages.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:bg-white hover:shadow-lg transition"
            >
              <svg className="w-4 h-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={next}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:bg-white hover:shadow-lg transition"
            >
              <svg className="w-4 h-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Counter pill */}
            <div className="absolute bottom-3 right-3 bg-gray-950/70 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
              {active + 1} / {safeImages.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {safeImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {safeImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              className={`flex-shrink-0 w-[72px] h-[72px] rounded-xl overflow-hidden border-2 transition-all duration-150 ${
                i === active
                  ? "border-orange-500 shadow-md shadow-orange-100 opacity-100"
                  : "border-gray-200 opacity-60 hover:opacity-90 hover:border-gray-300"
              }`}
            >
              <img src={img} alt={`${name} view ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
