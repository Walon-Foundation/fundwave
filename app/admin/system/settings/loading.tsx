export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-slate-200 rounded w-1/4 mb-4"></div>
      <div className="border-b border-slate-200 mb-6">
        <div className="flex space-x-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-6 bg-slate-200 rounded w-20"></div>
          ))}
        </div>
      </div>
      <div className="card">
        <div className="h-6 bg-slate-200 rounded w-1/3 mb-6"></div>
        <div className="grid md:grid-cols-2 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-slate-200 rounded w-1/3"></div>
              <div className="h-10 bg-slate-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
