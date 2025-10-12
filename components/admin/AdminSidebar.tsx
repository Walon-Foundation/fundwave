"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import {
  LayoutDashboard,
  Users,
  Target,
  CreditCard,
  Settings,
  ShieldCheck,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"

const navItems = [
  { label: "Overview", href: "/admin/overview", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Campaigns", href: "/admin/campaigns", icon: Target },
  { label: "Payments", href: "/admin/payments", icon: CreditCard },
  { label: "Settings", href: "/admin/settings", icon: Settings },
]

export default function AdminSidebarLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Array<{ id: string; name: string; email: string }>>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let active = true
    const run = async () => {
      if (!query || query.length < 2) {
        setResults([])
        return
      }
      setLoading(true)
      try {
        const params = new URLSearchParams({ page: "1", limit: "8", search: query, status: "all" })
        const res = await fetch(`/api/admin/users?${params.toString()}`)
        const j = await res.json()
        if (active && j?.ok) {
          setResults(j.data.users.map((u: any) => ({ id: u.id, name: u.name, email: u.email })))
        }
      } catch {}
      finally { if (active) setLoading(false) }
    }
    const t = setTimeout(run, 250)
    return () => { active = false; clearTimeout(t) }
  }, [query])

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="bg-white border-r border-gray-200">
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-600 via-red-500 to-orange-500 text-white flex items-center justify-center font-bold">FW</div>
            <div className="leading-tight">
              <div className="text-sm font-semibold">FundWave Admin</div>
              <div className="text-xs text-gray-500">Platform</div>
            </div>
          </div>
        </SidebarHeader>
        <SidebarSeparator />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Management</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <SidebarMenuItem key={item.href}>
                      <Link href={item.href}>
                        <SidebarMenuButton isActive={isActive}>
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                  )
                })}
                {/* Logs link */}
                <SidebarMenuItem>
                  <Link href="/admin/logs">
                    <SidebarMenuButton isActive={pathname === "/admin/logs"}>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Logs</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                {/* Pages link */}
                <SidebarMenuItem>
                  <Link href="/admin/pages">
                    <SidebarMenuButton isActive={pathname === "/admin/pages"}>
                      <Settings className="w-4 h-4" />
                      <span>Pages</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          {/* Quick User Search */}
          <SidebarGroup>
            <SidebarGroupLabel>Find User</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="px-2 py-1">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name or email"
                  className="w-full text-sm px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              {query && (
                <div className="mx-2 mb-2 bg-white border border-gray-200 rounded-md max-h-60 overflow-auto">
                  {loading ? (
                    <div className="p-3 text-xs text-gray-500">Searching...</div>
                  ) : results.length === 0 ? (
                    <div className="p-3 text-xs text-gray-500">No users</div>
                  ) : (
                    results.map((r) => (
                      <Link key={r.id} href={`/admin/users/${r.id}`} className="block px-3 py-2 text-sm hover:bg-gray-50">
                        <div className="font-medium">{r.name}</div>
                        <div className="text-xs text-gray-500">{r.email}</div>
                      </Link>
                    ))
                  )}
                </div>
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="p-2 text-xs text-gray-500">
          <div className="flex items-center gap-2 text-gray-500">
            <ShieldCheck className="w-4 h-4" />
            Admin Access
          </div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <div className="min-h-svh bg-gray-50">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
