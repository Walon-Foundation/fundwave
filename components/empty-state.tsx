"use client"

import Image from "next/image"
import { ReactNode } from "react"
import { Button } from "@/components/ui/button"

export function EmptyState({
  illustration,
  title,
  description,
  action,
}: {
  illustration?: string
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="text-center py-12 sm:py-16 bg-white/60 rounded-2xl border border-slate-200">
      {illustration && (
        <div className="mx-auto mb-6">
          <Image src={illustration} alt={title} width={200} height={200} />
        </div>
      )}
      <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-2">{title}</h3>
      {description && (
        <p className="text-slate-600 max-w-md mx-auto mb-6">{description}</p>
      )}
      {action ? action : null}
    </div>
  )
}

export function EmptyActionButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Button asChild>
      <a href={href}>{children}</a>
    </Button>
  )
}
