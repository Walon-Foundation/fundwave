'use client'

import { usePathname } from 'next/navigation'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  return (
    <>
      {!isAdmin && <Navigation />}
      <main className="min-h-screen bg-slate-50">{children}</main>
      {!isAdmin && <Footer />}
    </>
  )
}
