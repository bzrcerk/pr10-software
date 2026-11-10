import { DoorOpen, MapPin, Users, CircleCheck } from 'lucide-react';
import { formatClock } from '@/lib/format';

type RoomCardProps = {
  name: string;
  location: string;
  capacity: number;
  status: string;
  now: number;
};

export default function RoomCard({ name, location, capacity, status, now }: RoomCardProps) {
  return (
    <section
      aria-label="Room information"
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
          <DoorOpen className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-semibold text-slate-900">{name}</h2>
          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-slate-600">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-slate-400" />
              {location}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-4 w-4 text-slate-400" />
              Capacity: {capacity} students
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CircleCheck className="h-4 w-4 text-emerald-500" />
              {status}
            </span>
          </div>
          <p className="mt-3 text-xs text-slate-400">
            Current time: {formatClock(now)} ({now} min after midnight)
          </p>
        </div>
      </div>
    </section>
  );
}
