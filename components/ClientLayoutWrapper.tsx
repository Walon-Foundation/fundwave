'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Navigation from './navigation'
import AdminNavigation from './admin-navigation'
import Footer from './footer'

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isAdminHost, setIsAdminHost] = useState(false)
  
  useEffect(() => {
    // Check if we're on admin subdomain
    if (typeof window !== 'undefined') {
      const host = window.location.host
      const isAdmin = host.includes('admin.') || pathname.startsWith('/admin')
      setIsAdminHost(isAdmin)
    }
  }, [pathname])
  
  const isAdminPath = pathname.startsWith('/admin')
  const showAdminLayout = isAdminHost || isAdminPath

  return (
    <>
      {/* Admin pages should not render global nav or footer */}
      {!showAdminLayout && <Navigation />}
      <main className={`min-h-screen ${showAdminLayout ? 'bg-gray-50' : 'bg-slate-50'}`}>
        {children}
      </main>
      {!showAdminLayout && <Footer />}
    </>
  )
}
