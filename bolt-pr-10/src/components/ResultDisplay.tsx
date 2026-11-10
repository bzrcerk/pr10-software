import { CheckCircle2, XCircle, Clock } from 'lucide-react';
import type { AvailabilityResult } from '@/lib/availability';

type ResultDisplayProps = {
  result: AvailabilityResult | null;
};

export default function ResultDisplay({ result }: ResultDisplayProps) {
  if (!result) {
    return (
      <div
        aria-live="polite"
        className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center"
      >
        <Clock className="mx-auto h-8 w-8 text-slate-300" />
        <p className="mt-2 text-sm text-slate-500">
          Enter a start and end time, then check availability.
        </p>
      </div>
    );
  }

  if (result.available) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6"
      >
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-7 w-7 shrink-0 text-emerald-600" />
          <div>
            <p className="text-lg font-semibold text-emerald-800">Available</p>
            <p className="text-sm text-emerald-700">
              Study Room A101 is free for the requested time interval.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="rounded-2xl border border-rose-200 bg-rose-50 p-6"
    >
      <div className="flex items-start gap-3">
        <XCircle className="mt-0.5 h-7 w-7 shrink-0 text-rose-600" />
        <div>
          <p className="text-lg font-semibold text-rose-800">Unavailable</p>
          {result.reason && (
            <p className="mt-1 text-sm text-rose-700">{result.reason}</p>
          )}
        </div>
      </div>
    </div>
  );
}
