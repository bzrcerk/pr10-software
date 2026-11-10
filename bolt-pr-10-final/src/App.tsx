import { useState } from 'react';
import { GraduationCap, Search } from 'lucide-react';
import RoomCard from '@/components/RoomCard';
import BookingsList from '@/components/BookingsList';
import ResultDisplay from '@/components/ResultDisplay';
import { checkAvailability, type AvailabilityResult, type Booking } from '@/lib/availability';
import { formatClock, readableTime } from '@/lib/format';

// Initial application data (all times are minutes after midnight).
const ROOM = {
  name: 'Study Room A101',
  location: 'Main Campus Library',
  capacity: 8,
  status: 'Available',
};
const INITIAL_NOW = 540;
const INITIAL_BLOCKED = false;
const INITIAL_EXISTING: Booking[] = [[600, 660]];

export default function App() {
  const [startInput, setStartInput] = useState('');
  const [endInput, setEndInput] = useState('');
  const [result, setResult] = useState<AvailabilityResult | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Pass the raw string inputs through; parseTime handles emptiness/typing.
    const rawStart = startInput.trim() === '' ? '' : Number(startInput);
    const rawEnd = endInput.trim() === '' ? '' : Number(endInput);
    setResult(
      checkAvailability(rawStart, rawEnd, INITIAL_NOW, INITIAL_BLOCKED, INITIAL_EXISTING)
    );
  }

  function handleReset() {
    setStartInput('');
    setEndInput('');
    setResult(null);
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-5 sm:px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-700 text-white">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight text-slate-900 sm:text-xl">
              Smart Campus Room Availability Checker
            </h1>
            <p className="text-xs text-slate-500 sm:text-sm">
              Check whether a study room is free during your requested time.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6">
        {/* Room information */}
        <RoomCard
          name={ROOM.name}
          location={ROOM.location}
          capacity={ROOM.capacity}
          status={ROOM.status}
          now={INITIAL_NOW}
        />

        {/* Availability form */}
        <section
          aria-label="Check availability"
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-slate-900">Check Availability</h2>
          <p className="mt-1 text-sm text-slate-500">
            Times are in minutes after midnight (0–1440). Maximum booking length is 120 minutes.
          </p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="start-time"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Start time (min)
                </label>
                <input
                  id="start-time"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={1440}
                  step={1}
                  value={startInput}
                  onChange={(e) => {
                    setStartInput(e.target.value);
                    setResult(null);
                  }}
                  placeholder="e.g. 560"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 placeholder-slate-400 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                {readableTime(startInput) && (
                  <p className="mt-1 text-xs font-medium text-blue-700">
                    {startInput} min = {readableTime(startInput)}
                  </p>
                )}
                <p className="mt-1 text-xs text-slate-400">
                  Must be later than current time ({formatClock(INITIAL_NOW)}).
                </p>
              </div>

              <div>
                <label
                  htmlFor="end-time"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  End time (min)
                </label>
                <input
                  id="end-time"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={1440}
                  step={1}
                  value={endInput}
                  onChange={(e) => {
                    setEndInput(e.target.value);
                    setResult(null);
                  }}
                  placeholder="e.g. 680"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 placeholder-slate-400 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                {readableTime(endInput) && (
                  <p className="mt-1 text-xs font-medium text-blue-700">
                    {endInput} min = {readableTime(endInput)}
                  </p>
                )}
                <p className="mt-1 text-xs text-slate-400">
                  Max 120 minutes after start.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-1">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <Search className="h-4 w-4" />
                Check Availability
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200"
              >
                Clear
              </button>
            </div>
          </form>
        </section>

        {/* Result */}
        <ResultDisplay result={result} />

        {/* Existing bookings */}
        <BookingsList bookings={INITIAL_EXISTING} />

        <footer className="pt-2 text-center text-xs text-slate-400">
          Prototype v1 · Fictional university data · No bookings are created by checking availability.
        </footer>
      </main>
    </div>
  );
}
