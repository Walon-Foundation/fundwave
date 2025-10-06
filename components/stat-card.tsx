"use client"

import { ElementType } from "react"

export function StatCard({
  icon: Icon,
  value,
  label,
}: {
  icon: ElementType
  value: string
  label: string
}) {
  return (
    <div className="text-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-ocean-100/50 group">
      <div className="w-12 h-12 gradient-bg rounded-xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
        <Icon className="w-6 h-6 text-white" />
      </div>
      {value ? (
        <p className="text-3xl lg:text-4xl font-bold gradient-text mb-2">{value}</p>
      ) : (
        <div className="h-8 w-24 mx-auto mb-2 rounded bg-slate-200 animate-pulse" />
      )}
      <p className="text-slate-600">{label}</p>
    </div>
  )
}
