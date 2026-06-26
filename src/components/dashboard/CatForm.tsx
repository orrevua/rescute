'use client';

import { type FormEvent, useRef, useState } from 'react';
import { createCat, updateCat, uploadPhoto } from '@/lib/api/cats';
import type { Cat } from '@/lib/types';

interface PhotoEntry {
  url: string;
  preview?: string;
  file?: File;
}

export function CatForm({ cat }: { cat?: Cat }) {
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [photos, setPhotos] = useState<PhotoEntry[]>(
    cat?.photos?.length ? cat.photos.map((url) => ({ url })) : [],
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  function addFiles(files: FileList) {
    const entries: PhotoEntry[] = Array.from(files).map((file) => ({
      url: '',
      preview: URL.createObjectURL(file),
      file,
    }));
    setPhotos((prev) => [...prev, ...entries]);
  }

  function removePhoto(index: number) {
    setPhotos((prev) => {
      const removed = prev[index];
      if (removed.preview) URL.revokeObjectURL(removed.preview);
      return prev.filter((_, i) => i !== index);
    });
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setSaving(true);
    try {
      const uploadedUrls: string[] = [];
      for (const photo of photos) {
        if (photo.file) {
          const url = await uploadPhoto(photo.file);
          uploadedUrls.push(url);
        } else if (photo.url) {
          uploadedUrls.push(photo.url);
        }
      }
      const data = {
        name: f.get('name'),
        age_months: Number(f.get('age')),
        sex: f.get('sex'),
        city: f.get('city'),
        state: f.get('state'),
        sociability: Number(f.get('sociability')),
        energy: Number(f.get('energy')),
        playfulness: Number(f.get('playfulness')),
        castrated: f.get('castrated') === 'on',
        vaccinated: f.get('vaccinated') === 'on',
        dewormed: f.get('dewormed') === 'on',
        personality: f.get('personality') || undefined,
        backstory: f.get('backstory') || undefined,
        photos: uploadedUrls,
      };
      if (cat) await updateCat(cat.id, data);
      else await createCat(data);
      setDone(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="space-y-4 rounded-3xl bg-white p-6 shadow-sm" onSubmit={submit}>
      <input className="w-full rounded-xl border p-3" defaultValue={cat?.name} name="name" placeholder="Name" required />
      <div className="grid gap-3 sm:grid-cols-2">
        <input className="rounded-xl border p-3" defaultValue={cat?.age_months} min="0" name="age" placeholder="Age in months" required type="number" />
        <select className="rounded-xl border p-3" defaultValue={cat?.sex ?? 'female'} name="sex">
          <option value="female">Female</option>
          <option value="male">Male</option>
        </select>
        <input className="rounded-xl border p-3" defaultValue={cat?.city} name="city" placeholder="City" required />
        <input className="rounded-xl border p-3" defaultValue={cat?.state} maxLength={2} name="state" placeholder="State" required />
      </div>

      <textarea className="w-full rounded-xl border p-3" defaultValue={cat?.personality} name="personality" placeholder="Personality (optional)" rows={2} />
      <textarea className="w-full rounded-xl border p-3" defaultValue={cat?.backstory} name="backstory" placeholder="Backstory (optional)" rows={3} />

      <div>
        <p className="mb-2 text-sm font-semibold text-stone-700">Photos</p>
        {photos.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-3">
            {photos.map((photo, i) => (
              <div key={i} className="relative h-24 w-24 overflow-hidden rounded-xl border-2 border-stone-300">
                <img
                  src={photo.preview || photo.url}
                  alt=""
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white"
                  onClick={() => removePhoto(i)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => { if (e.target.files?.length) addFiles(e.target.files); e.target.value = ''; }}
        />
        <button
          type="button"
          className="rounded-xl border-2 border-dashed border-teal-700 px-4 py-2 text-sm font-semibold text-teal-700 hover:bg-teal-50"
          onClick={() => fileInputRef.current?.click()}
        >
          + Add photos
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {['sociability', 'energy', 'playfulness'].map((field) => (
          <label className="text-sm capitalize" key={field}>
            {field}
            <input className="mt-1 w-full" defaultValue={(cat?.[field as keyof Cat] as number | undefined) ?? 3} max="5" min="1" name={field} type="range" />
          </label>
        ))}
      </div>
      <div className="flex flex-wrap gap-4 text-sm">
        {['castrated', 'vaccinated', 'dewormed'].map((field) => (
          <label key={field}>
            <input defaultChecked={Boolean(cat?.[field as keyof Cat])} name={field} type="checkbox" /> {field}
          </label>
        ))}
      </div>
      {done && <p className="text-teal-800">Cat saved.</p>}
      <button className="rounded-xl bg-teal-800 px-4 py-3 font-bold text-white" disabled={saving}>
        {saving ? 'Saving...' : 'Save cat'}
      </button>
    </form>
  );
}
