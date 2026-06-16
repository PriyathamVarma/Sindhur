"use client";

import { useState } from "react";

interface Props {
  images: string[];
  name: string;
}

export default function ProductGallery({ images, name }: Props) {
  const [active, setActive] = useState(0);
  const safeImages = images?.length ? images : ["https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80"];

  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-2xl bg-gray-100 aspect-[4/3]">
        <img
          src={safeImages[active]}
          alt={name}
          className="w-full h-full object-cover transition-opacity duration-300"
        />
        {safeImages.length > 1 && (
          <>
            <button
              onClick={() => setActive((a) => (a - 1 + safeImages.length) % safeImages.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center hover:bg-white transition"
            >
              <svg className="w-4 h-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setActive((a) => (a + 1) % safeImages.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center hover:bg-white transition"
            >
              <svg className="w-4 h-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
        <span className="absolute top-3 right-3 bg-black/50 text-white text-[11px] px-2 py-1 rounded-full">
          {active + 1} / {safeImages.length}
        </span>
      </div>

      {safeImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {safeImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                i === active ? "border-orange-500 shadow-lg" : "border-gray-200 opacity-70 hover:opacity-100"
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
