export default function Loading() {
  return (
    <div className="fixed inset-0 bg-neutral-950 z-[9999] flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-neutral-800 border-t-emerald-400 rounded-full animate-spin mb-4"></div>
      <div className="text-xs font-bold tracking-[0.3em] text-neutral-500 uppercase animate-pulse">
        Loading
      </div>
    </div>
  );
}
