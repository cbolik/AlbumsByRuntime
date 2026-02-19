import { useMemo } from 'react';
import { type AlbumData } from '../types/spotify';

interface DurationPickerProps {
  value: number | null;
  onChange: (minutes: number) => void;
  albums: AlbumData[];
}

const WINDOW_MS = 2.5 * 60 * 1000;

const OPTIONS: number[] = [];
for (let m = 10; m <= 120; m += 5) {
  OPTIONS.push(m);
}

export function DurationPicker({ value, onChange, albums }: DurationPickerProps) {
  const availableMinutes = useMemo(() => {
    const available = new Set<number>();
    for (const minutes of OPTIONS) {
      const targetMs = minutes * 60 * 1000;
      if (albums.some((a) => Math.abs(a.durationMs - targetMs) <= WINDOW_MS)) {
        available.add(minutes);
      }
    }
    return available;
  }, [albums]);

  return (
    <div className="flex items-center gap-3">
      <label htmlFor="duration" className="text-neutral-400 text-sm whitespace-nowrap">
        Target duration
      </label>
      <select
        id="duration"
        value={value ?? ''}
        onChange={(e) => onChange(Number(e.target.value))}
        className="bg-neutral-800 text-white border border-neutral-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#1ED760] cursor-pointer"
      >
        <option value="" disabled>Select...</option>
        {OPTIONS.map((m) => (
          <option key={m} value={m} disabled={!availableMinutes.has(m)}>
            {m} minutes{!availableMinutes.has(m) ? '' : ''}
          </option>
        ))}
      </select>
    </div>
  );
}
