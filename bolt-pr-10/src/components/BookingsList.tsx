import { CalendarDays } from 'lucide-react';
import type { Booking } from '@/lib/availability';
import { formatInterval } from '@/lib/format';

type BookingsListProps = {
  bookings: Booking[];
};

export default function BookingsList({ bookings }: BookingsListProps) {
  return (
    <section
      aria-label="Existing bookings"
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="flex items-center gap-2">
        <CalendarDays className="h-5 w-5 text-blue-700" />
        <h2 className="text-lg font-semibold text-slate-900">Existing Bookings</h2>
      </div>
      {bookings.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500">No existing bookings for this room.</p>
      ) : (
        <ul className="mt-4 divide-y divide-slate-100">
          {bookings.map(([start, end], i) => (
            <li
              key={`${start}-${end}-${i}`}
              className="flex items-center justify-between py-3 text-sm"
            >
              <span className="font-medium text-slate-800">{formatInterval(start, end)}</span>
              <span className="text-slate-400">
                {start}–{end} min
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
