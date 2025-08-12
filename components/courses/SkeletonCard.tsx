export default function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl border border-slate-200 bg-white overflow-hidden">
      <div className="aspect-video bg-slate-200" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-slate-200 rounded w-3/4" />
        <div className="h-3 bg-slate-200 rounded w-1/2" />
        <div className="h-3 bg-slate-200 rounded w-full" />
        <div className="h-9 bg-slate-200 rounded-lg w-full mt-3" />
      </div>
    </div>
  )
}


