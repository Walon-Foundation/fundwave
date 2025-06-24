export default function NotificationsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <div className="h-8 bg-slate-200 rounded w-64 mb-2 animate-pulse"></div>
          <div className="h-4 bg-slate-200 rounded w-96 animate-pulse"></div>
        </div>
        <div className="h-10 bg-slate-200 rounded w-40 animate-pulse"></div>
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

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-slate-200">
          <div className="h-6 bg-slate-200 rounded w-48 animate-pulse"></div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {[...Array(6)].map((_, i) => (
                  <th key={i} className="py-3 px-4">
                    <div className="h-4 bg-slate-200 rounded w-20 animate-pulse"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-slate-100">
                  {[...Array(6)].map((_, j) => (
                    <td key={j} className="py-4 px-4">
                      <div className="h-4 bg-slate-200 rounded w-full animate-pulse"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
