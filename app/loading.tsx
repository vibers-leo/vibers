export default function Loading() {
  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{ backgroundColor: "#050505" }}
    >
      <div
        className="w-12 h-12 rounded-full animate-spin mb-4"
        style={{
          border: "4px solid rgba(57, 255, 20, 0.15)",
          borderTopColor: "#39FF14",
        }}
      ></div>
      <div
        className="text-xs font-bold tracking-[0.3em] uppercase animate-pulse"
        style={{ color: "#39FF14" }}
      >
        Loading Vibers
      </div>
    </div>
  );
}
