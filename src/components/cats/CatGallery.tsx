'use client';

import { useState } from 'react';

export function CatGallery({ photos, name }: { photos: string[]; name: string }) {
  const [selected, setSelected] = useState(0);

  if (photos.length === 0) {
    return (
      <div
        className="grid min-h-72 place-items-center overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_30%_20%,#f9d9bb_0,transparent_25%),linear-gradient(145deg,#244c49,#7fb9ac)] text-center text-8xl"
        aria-label={`${name}'s gallery`}
      >
        🐾
      </div>
    );
  }

  return (
    <div aria-label={`${name}'s gallery`}>
      <div className="overflow-hidden rounded-[2rem]">
        <img
          src={photos[selected]}
          alt={`${name} photo ${selected + 1}`}
          className="h-80 w-full object-cover"
        />
      </div>
      {photos.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {photos.map((photo, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelected(i)}
              className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border-2 transition ${
                i === selected ? 'border-teal-700' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img src={photo} alt={`${name} thumbnail ${i + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
