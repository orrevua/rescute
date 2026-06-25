'use client';

import { type FormEvent, useState } from 'react';
import { createCat, updateCat } from '@/lib/api/cats';
import type { Cat } from '@/lib/types';

export function CatForm({ cat }: { cat?: Cat }) {
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [photoUrls, setPhotoUrls] = useState<string[]>(cat?.photos ?? ['']);

  function addPhotoField() {
    setPhotoUrls((prev) => [...prev, '']);
  }

  function removePhotoField(index: number) {
    setPhotoUrls((prev) => prev.filter((_, i) => i !== index));
  }

  function updatePhotoUrl(index: number, value: string) {
    setPhotoUrls((prev) => prev.map((url, i) => (i === index ? value : url)));
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setSaving(true);
    try {
      const photos = photoUrls.map((u) => u.trim()).filter(Boolean);
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
        photos,
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
        <p className="mb-2 text-sm font-semibold text-stone-700">Photos (paste image URLs)</p>
        {photoUrls.map((url, i) => (
          <div key={i} className="mb-2 flex gap-2">
            <input
              className="min-w-0 flex-1 rounded-xl border p-3"
              value={url}
              onChange={(e) => updatePhotoUrl(i, e.target.value)}
              placeholder="https://example.com/cat-photo.jpg"
              type="url"
            />
            {photoUrls.length > 1 && (
              <button type="button" className="rounded-xl bg-red-100 px-3 text-red-700 font-bold" onClick={() => removePhotoField(i)}>
                ✕
              </button>
            )}
          </div>
        ))}
        <button type="button" className="text-sm font-semibold text-teal-700 hover:underline" onClick={addPhotoField}>
          + Add another photo
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
