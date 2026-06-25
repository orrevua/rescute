import type { ApplicationStatus as Status } from '../../lib/types';

const labels: Record<Status, string> = { pending: 'Received', under_review: 'Under review', approved: 'Approved', rejected: 'Not approved' };
const colors: Record<Status, string> = { pending: 'bg-amber-100 text-amber-900', under_review: 'bg-sky-100 text-sky-900', approved: 'bg-teal-100 text-teal-900', rejected: 'bg-stone-200 text-stone-700' };
export function ApplicationStatus({ status }: { status: Status }) { return <span className={`rounded-full px-3 py-1 text-xs font-bold ${colors[status]}`}>{labels[status]}</span>; }
