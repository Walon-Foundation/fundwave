export default function MaintenancePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-lg w-full bg-white border rounded-2xl shadow-sm p-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Were undergoing maintenance</h1>
        <p className="text-slate-600">
          FundWaveSL is temporarily unavailable while we perform scheduled maintenance.
          Please check back soon.
        </p>
      </div>
    </main>
  )
}
