interface EmptyStateProps {
  targetMinutes: number;
}

export function EmptyState({ targetMinutes }: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      <p className="text-neutral-400 text-lg">
        No albums in your library match <span className="text-white font-medium">{targetMinutes} minutes</span> (±2:30).
      </p>
      <p className="text-neutral-500 text-sm mt-2">Try a different duration.</p>
    </div>
  );
}
