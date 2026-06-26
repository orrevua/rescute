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
        fiv_status: f.get('fiv_status') === 'on',
        felv_status: f.get('felv_status') === 'on',
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
    <form className="cartoon-section space-y-6 bg-[#f0fdf8] p-8" onSubmit={submit}>
      {/* Basic info */}
      <fieldset className="space-y-4">
        <legend className="mb-2 text-lg font-extrabold tracking-wide text-teal-900">Basic info</legend>
        <div>
          <label className="mb-1 block text-sm font-bold text-stone-700" htmlFor="cat-name">Name</label>
          <input className="cartoon-input w-full bg-white p-3" defaultValue={cat?.name} id="cat-name" name="name" placeholder="e.g. Whiskers" required />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-bold text-stone-700" htmlFor="cat-age">Age (months)</label>
            <input className="cartoon-input w-full bg-white p-3" defaultValue={cat?.age_months} id="cat-age" min="0" name="age" placeholder="e.g. 12" required type="number" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-bold text-stone-700" htmlFor="cat-sex">Sex</label>
            <select className="cartoon-input w-full bg-white p-3" defaultValue={cat?.sex ?? 'female'} id="cat-sex" name="sex">
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-bold text-stone-700" htmlFor="cat-city">City</label>
            <input className="cartoon-input w-full bg-white p-3" defaultValue={cat?.city} id="cat-city" name="city" placeholder="e.g. São Paulo" required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-bold text-stone-700" htmlFor="cat-state">State</label>
            <input className="cartoon-input w-full bg-white p-3" defaultValue={cat?.state} id="cat-state" maxLength={2} name="state" placeholder="e.g. SP" required />
          </div>
        </div>
      </fieldset>

      {/* Story */}
      <fieldset className="space-y-4">
        <legend className="mb-2 text-lg font-extrabold tracking-wide text-teal-900">Story</legend>
        <div>
          <label className="mb-1 block text-sm font-bold text-stone-700" htmlFor="cat-personality">Personality</label>
          <textarea className="cartoon-input w-full bg-white p-3" defaultValue={cat?.personality} id="cat-personality" name="personality" placeholder="What makes this cat special?" rows={2} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-bold text-stone-700" htmlFor="cat-backstory">Backstory</label>
          <textarea className="cartoon-input w-full bg-white p-3" defaultValue={cat?.backstory} id="cat-backstory" name="backstory" placeholder="How did you find this cat?" rows={3} />
        </div>
      </fieldset>

      {/* Photos */}
      <fieldset className="space-y-3">
        <legend className="mb-2 text-lg font-extrabold tracking-wide text-teal-900">Photos</legend>
        {photos.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {photos.map((photo, i) => (
              <div key={i} className="relative h-24 w-24 overflow-hidden rounded-2xl shadow-[0_0_0_2.5px_#1a3a38,3px_3px_0_#1a3a38]">
                <img
                  src={photo.preview || photo.url}
                  alt=""
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white shadow-[2px_2px_0_#1a3a38] hover:bg-red-500"
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
          className="rounded-full border-[2.5px] border-dashed border-teal-800 px-5 py-2.5 text-sm font-extrabold text-teal-800 transition-all duration-100 hover:-translate-y-0.5 hover:bg-teal-50 hover:shadow-[0_4px_8px_rgba(0,0,0,0.12)] active:translate-y-0 active:shadow-none"
          onClick={() => fileInputRef.current?.click()}
        >
          + Add photos
        </button>
      </fieldset>

      {/* Traits */}
      <fieldset className="space-y-4">
        <legend className="mb-2 text-lg font-extrabold tracking-wide text-teal-900">Traits</legend>
        <div className="grid gap-4 sm:grid-cols-3">
          {['sociability', 'energy', 'playfulness'].map((field) => (
            <div key={field} className="rounded-2xl bg-white p-4 shadow-[0_0_0_2.5px_#1a3a38,3px_3px_0_#1a3a38]">
              <label className="block text-sm font-bold capitalize text-stone-700">
                {field}
                <input
                  className="mt-2 w-full accent-teal-700"
                  defaultValue={(cat?.[field as keyof Cat] as number | undefined) ?? 3}
                  max="5"
                  min="1"
                  name={field}
                  type="range"
                />
              </label>
            </div>
          ))}
        </div>
      </fieldset>

      {/* Health */}
      <fieldset>
        <legend className="mb-3 text-lg font-extrabold tracking-wide text-teal-900">Health</legend>
        <div className="flex flex-wrap gap-4">
          {[
            ['castrated', 'Castrated'],
            ['vaccinated', 'Vaccinated'],
            ['dewormed', 'Dewormed'],
            ['fiv_status', 'FIV Negative'],
            ['felv_status', 'FeLV Negative'],
          ].map(([field, label]) => (
            <label
              key={field}
              className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-stone-700 shadow-[0_0_0_2.5px_#1a3a38,3px_3px_0_#1a3a38]"
            >
              <input className="h-4 w-4 accent-teal-700" defaultChecked={Boolean(cat?.[field as keyof Cat])} name={field} type="checkbox" />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Submit */}
      {done && (
        <p className="rounded-full bg-teal-100 px-4 py-2 text-center text-sm font-bold text-teal-900 shadow-[0_0_0_2.5px_#0d9488,3px_3px_0_#0d9488]">
          Cat saved successfully!
        </p>
      )}
      <button
        className="cartoon-btn w-full bg-teal-800 px-6 py-3 text-base font-extrabold text-white hover:bg-teal-700 disabled:opacity-50"
        disabled={saving}
      >
        {saving ? 'Saving...' : 'Save cat'}
      </button>
    </form>
  );
}
