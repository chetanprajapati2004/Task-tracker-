export default function RouteLoader() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(29,78,216,0.18),_transparent_45%),linear-gradient(180deg,#f8fafc_0%,#eef4ff_100%)] px-6 py-10">
      <div className="mx-auto max-w-6xl animate-pulse">
        <div className="mb-8 h-20 rounded-[28px] bg-white/80 shadow-sm" />
        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <div className="hidden rounded-[32px] bg-slate-900/90 p-6 lg:block">
            <div className="mb-8 h-12 rounded-2xl bg-white/10" />
            <div className="space-y-4">
              <div className="h-14 rounded-2xl bg-white/10" />
              <div className="h-14 rounded-2xl bg-white/10" />
              <div className="h-14 rounded-2xl bg-white/10" />
            </div>
          </div>
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="h-36 rounded-[28px] bg-white/80 shadow-sm" />
              <div className="h-36 rounded-[28px] bg-white/80 shadow-sm" />
              <div className="h-36 rounded-[28px] bg-white/80 shadow-sm" />
            </div>
            <div className="h-80 rounded-[32px] bg-white/80 shadow-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
