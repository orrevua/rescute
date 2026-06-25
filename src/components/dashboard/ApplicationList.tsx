'use client';

import { useState } from 'react';
import type { AdoptionApplication, FosterApplication } from '../../lib/types';
import { ApplicationStatus } from '../foster/ApplicationStatus';

type Application = AdoptionApplication | FosterApplication;

function isAdoption(app: Application): app is AdoptionApplication {
  return 'applicant_name' in app;
}

function ApplicationCard({ application }: { application: Application }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article
      className="cursor-pointer rounded-xl border border-stone-100 p-4 transition-colors hover:bg-stone-50"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="font-semibold">
            {isAdoption(application) ? application.applicant_name : 'Foster home candidate'}
          </p>
          <p className="text-sm text-stone-500">
            {new Date(application.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ApplicationStatus status={application.status} />
          <span className="text-stone-400 text-sm">{expanded ? '▲' : '▼'}</span>
        </div>
      </div>

      {expanded && (
        <div className="mt-3 space-y-1 border-t border-stone-100 pt-3 text-sm text-stone-600">
          {isAdoption(application) ? (
            <>
              <p><span className="font-medium text-stone-700">Email:</span> {application.applicant_email}</p>
              <p><span className="font-medium text-stone-700">Phone:</span> {application.applicant_phone}</p>
              {application.message && (
                <p><span className="font-medium text-stone-700">Message:</span> {application.message}</p>
              )}
            </>
          ) : (
            <>
              <p><span className="font-medium text-stone-700">City:</span> {application.city}</p>
              <p><span className="font-medium text-stone-700">Existing pets:</span> {application.existing_pets}</p>
              <p><span className="font-medium text-stone-700">Compatibility:</span> {application.compatibility}</p>
              <p><span className="font-medium text-stone-700">Prior experience:</span> {application.prior_experience}</p>
              <p><span className="font-medium text-stone-700">Cost aware:</span> {application.cost_aware ? 'Yes' : 'No'}</p>
            </>
          )}
        </div>
      )}
    </article>
  );
}

export function ApplicationList({ title, applications }: { title: string; applications: Application[] }) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold">{title}</h2>
      <div className="mt-4 space-y-3">
        {applications.map((application) => (
          <ApplicationCard application={application} key={application.id} />
        ))}
      </div>
      {applications.length === 0 && <p className="text-stone-600">No applications.</p>}
    </section>
  );
}
