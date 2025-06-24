export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-slate-200 rounded w-1/4 mb-4"></div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card">
            <div className="h-20 bg-slate-200 rounded"></div>
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="card">
          <div className="h-64 bg-slate-200 rounded"></div>
        </div>
        <div className="card">
          <div className="h-64 bg-slate-200 rounded"></div>
        </div>
      </div>
    </div>
  )
}
