"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  Shield,
  Settings,
  DollarSign,
  BarChart3,
  Mail,
  ChevronDown,
  FileText,
  Globe,
  Database,
  Key,
  UserCheck,
  AlertTriangle,
  CreditCard,
  Download,
  Upload,
  Activity,
  Menu,
  X,
  Flag,
  PieChart,
  BookOpen,
  MousePointer,
  Megaphone,
  Smartphone,
  Search,
  ScrollText,
} from "lucide-react"

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
    color: "text-sky-500",
  },
  {
    title: "Users",
    icon: Users,
    href: "/admin/users",
    color: "text-emerald-500",
    submenu: [
      { title: "All Users", href: "/admin/users", icon: Users },
      { title: "KYC Verification", href: "/admin/users/kyc", icon: UserCheck },
      { title: "Suspended", href: "/admin/users/suspended", icon: AlertTriangle },
      { title: "Analytics", href: "/admin/users/analytics", icon: BarChart3 },
      { title: "Activity", href: "/admin/users/activity", icon: Activity },
    ],
  },
  {
    title: "Campaigns",
    icon: TrendingUp,
    href: "/admin/campaigns",
    color: "text-purple-500",
    submenu: [
      { title: "All Campaigns", href: "/admin/campaigns", icon: TrendingUp },
      { title: "Pending", href: "/admin/campaigns/pending", icon: AlertTriangle },
      { title: "Reported", href: "/admin/campaigns/reported", icon: Flag },
      { title: "Analytics", href: "/admin/campaigns/analytics", icon: PieChart },
    ],
  },
  {
    title: "Finance",
    icon: DollarSign,
    href: "/admin/finance",
    color: "text-amber-500",
    submenu: [
      { title: "Overview", href: "/admin/finance", icon: DollarSign },
      { title: "Transactions", href: "/admin/finance/transactions", icon: CreditCard },
      { title: "Withdrawals", href: "/admin/finance/withdrawals", icon: Download },
      { title: "Refunds", href: "/admin/finance/refunds", icon: Upload },
    ],
  },
  {
    title: "Content",
    icon: FileText,
    href: "/admin/content",
    color: "text-indigo-500",
    submenu: [
      { title: "Pages", href: "/admin/content/pages", icon: FileText },
      { title: "Blog Posts", href: "/admin/content/blog", icon: BookOpen },
      { title: "Media Library", href: "/admin/content/media", icon: Globe },
    ],
  },
  {
    title: "Communications",
    icon: Mail,
    href: "/admin/communications",
    color: "text-rose-500",
    submenu: [
      { title: "Email Templates", href: "/admin/communications/emails", icon: Mail },
      { title: "Notifications", href: "/admin/communications/notifications", icon: Megaphone },
      { title: "SMS Templates", href: "/admin/communications/sms", icon: Smartphone },
    ],
  },
  {
    title: "Security",
    icon: Shield,
    href: "/admin/security",
    color: "text-red-500",
    submenu: [
      { title: "Security Logs", href: "/admin/security/logs", icon: ScrollText },
      { title: "Access Control", href: "/admin/security/access", icon: Key },
      { title: "Audit Trail", href: "/admin/security/audit", icon: Activity },
    ],
  },
  {
    title: "Analytics",
    icon: BarChart3,
    href: "/admin/analytics",
    color: "text-indigo-500",
    submenu: [
      { title: "Overview", href: "/admin/analytics", icon: BarChart3 },
      { title: "User Behavior", href: "/admin/analytics/users", icon: MousePointer },
      { title: "Campaigns", href: "/admin/analytics/campaigns", icon: TrendingUp },
      { title: "Revenue", href: "/admin/analytics/revenue", icon: DollarSign },
    ],
  },
  {
    title: "System",
    icon: Settings,
    href: "/admin/system",
    color: "text-gray-500",
    submenu: [
      { title: "Settings", href: "/admin/system/settings", icon: Settings },
      { title: "System Logs", href: "/admin/system/logs", icon: ScrollText },
      { title: "API Management", href: "/admin/system/api", icon: Key },
      { title: "Database", href: "/admin/system/database", icon: Database },
      { title: "Backups", href: "/admin/system/backups", icon: Download },
    ],
  },
]

interface AdminSidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

export default function AdminSidebar({ isCollapsed, onToggle }: AdminSidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const pathname = usePathname()

  const toggleExpanded = (title: string) => {
    if (isCollapsed) return
    setExpandedItems((prev) => (prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]))
  }

  const isActive = (href: string) => pathname === href
  const isParentActive = (submenu: any[]) => submenu?.some((item) => pathname === item.href)

  const filteredMenuItems = menuItems.filter((item) => {
    const matchesItem = item.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSubmenu = item.submenu?.some((subItem) =>
      subItem.title.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    return matchesItem || matchesSubmenu
  })

  useEffect(() => {
    // Auto-expand parent menu if a submenu item is active
    menuItems.forEach((item) => {
      if (item.submenu && isParentActive(item.submenu) && !expandedItems.includes(item.title)) {
        setExpandedItems((prev) => [...prev, item.title])
      }
    })
  }, [pathname])

  return (
    <div
      className={`
        ${isCollapsed ? "w-16" : "w-64"}
        bg-white
        border-r border-gray-100
        h-screen
        flex flex-col
        transition-all duration-200
        fixed
        overflow-hidden
        hover:overflow-y-auto
        scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent
      `}
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white p-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-md bg-gradient-to-r from-sky-500 to-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">FW</span>
              </div>
              <h2 className="text-lg font-bold text-gray-900">Admin</h2>
            </div>
          )}
          <button
            onClick={onToggle}
            className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <Menu className="w-5 h-5 text-gray-600" /> : <X className="w-5 h-5 text-gray-600" />}
          </button>
        </div>
        {!isCollapsed && (
          <div className="mt-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-gray-50"
              />
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        {filteredMenuItems.map((item) => (
          <div key={item.title} className="mb-1">
            {item.submenu ? (
              <div className="group">
                <button
                  onClick={() => toggleExpanded(item.title)}
                  className={`
                    w-full flex items-center justify-between
                    px-3 py-2 rounded-lg
                    transition-all duration-200
                    ${isParentActive(item.submenu) ? "bg-sky-50 text-sky-600" : "text-gray-600 hover:bg-gray-50"}
                    group-hover:bg-gray-50
                  `}
                  title={isCollapsed ? item.title : ""}
                >
                  <div className="flex items-center">
                    <item.icon
                      className={`
                        w-5 h-5 mr-3
                        ${isParentActive(item.submenu) ? item.color : "text-gray-500 group-hover:" + item.color}
                      `}
                    />
                    {!isCollapsed && <span className="font-medium text-sm">{item.title}</span>}
                  </div>
                  {!isCollapsed && (
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${expandedItems.includes(item.title) ? "rotate-180" : ""}`}
                    />
                  )}
                </button>

                {isCollapsed && (
                  <div className="absolute left-16 ml-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 z-50">
                    {item.title}
                  </div>
                )}

                {!isCollapsed && expandedItems.includes(item.title) && (
                  <div className="ml-2 pl-6 mt-1 space-y-1 border-l-2 border-gray-100">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className={`
                          flex items-center px-3 py-2 rounded-lg
                          text-sm transition-all duration-200
                          ${
                            isActive(subItem.href)
                              ? "bg-sky-50 text-sky-600 font-medium"
                              : "text-gray-600 hover:bg-gray-50"
                          }
                        `}
                      >
                        <subItem.icon className="w-4 h-4 mr-3 text-gray-400" />
                        {subItem.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                href={item.href}
                className={`
                  flex items-center px-3 py-2 rounded-lg
                  transition-all duration-200 group
                  ${isActive(item.href) ? "bg-sky-50 text-sky-600 font-medium" : "text-gray-600 hover:bg-gray-50"}
                `}
                title={isCollapsed ? item.title : ""}
              >
                <item.icon
                  className={`
                    w-5 h-5 mr-3
                    ${isActive(item.href) ? item.color : "text-gray-500 group-hover:" + item.color}
                  `}
                />
                {!isCollapsed && <span className="font-medium text-sm">{item.title}</span>}
                {isCollapsed && (
                  <div className="absolute left-16 ml-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 z-50">
                    {item.title}
                  </div>
                )}
              </Link>
            )}
          </div>
        ))}
      </nav>
    </div>
  )
}
