export default function SMSLoading() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <div className="h-8 bg-slate-200 rounded w-48 mb-2 animate-pulse"></div>
          <div className="h-4 bg-slate-200 rounded w-96 animate-pulse"></div>
        </div>
        <div className="h-10 bg-slate-200 rounded w-32 animate-pulse"></div>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-4 bg-slate-200 rounded w-24 mb-2 animate-pulse"></div>
                <div className="h-8 bg-slate-200 rounded w-12 animate-pulse"></div>
              </div>
              <div className="w-8 h-8 bg-slate-200 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="h-10 bg-slate-200 rounded animate-pulse"></div>
          </div>
          <div className="flex gap-4">
            <div className="h-10 bg-slate-200 rounded w-32 animate-pulse"></div>
            <div className="h-10 bg-slate-200 rounded w-32 animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="h-6 bg-slate-200 rounded w-full mb-2 animate-pulse"></div>
                  <div className="flex space-x-2">
                    <div className="h-4 bg-slate-200 rounded w-20 animate-pulse"></div>
                    <div className="h-4 bg-slate-200 rounded w-16 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="bg-slate-100 p-3 rounded-lg">
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-full animate-pulse"></div>
                    <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse"></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <div className="flex space-x-2">
                    <div className="h-8 w-8 bg-slate-200 rounded animate-pulse"></div>
                    <div className="h-8 w-8 bg-slate-200 rounded animate-pulse"></div>
                    <div className="h-8 w-8 bg-slate-200 rounded animate-pulse"></div>
                  </div>
                  <div className="h-8 bg-slate-200 rounded w-20 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
