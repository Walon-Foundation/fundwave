export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-slate-200 rounded w-1/2"></div>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-16 bg-slate-200 rounded"></div>
          </div>
        ))}
      </div>

      <div className="card animate-pulse">
        <div className="h-64 bg-slate-200 rounded"></div>
      </div>
    </div>
  )
}
