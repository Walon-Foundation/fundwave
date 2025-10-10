"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { useUser, useClerk } from "@clerk/nextjs"
import {
  Menu,
  X,
  Heart,
  ChevronDown,
  User,
  LogOut,
  Users,
  Target,
  AlertTriangle,
  Settings,
  LayoutDashboard,
  Shield,
} from "lucide-react"
import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

export default function AdminNavigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const { user, isSignedIn } = useUser()
  const clerk = useClerk()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const adminNavLinks = [
    { name: "Dashboard", href: "/admin", icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: "Users", href: "/admin/users", icon: <Users className="w-4 h-4" /> },
    { name: "Campaigns", href: "/admin/campaigns", icon: <Target className="w-4 h-4" /> },
    { name: "Reports", href: "/admin/reports", icon: <AlertTriangle className="w-4 h-4" /> },
    { name: "Settings", href: "/admin/settings", icon: <Settings className="w-4 h-4" /> },
  ]

  const handleLogout = () => {
    clerk.signOut()
  }

  return (
    <header className="sticky top-0 z-50">
      <nav
        className={`transition-all duration-300 ${
          isScrolled 
            ? "bg-white/95 shadow-xl border-b border-gray-100/50" 
            : "bg-white/98 border-b border-transparent"
        } backdrop-blur-md`}
        aria-label="Admin navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Admin Logo */}
            <Link
              href="/admin"
              className="flex items-center space-x-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 rounded-lg p-2 transition-all hover:scale-[1.02] group"
              aria-label="Admin Dashboard"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 via-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold bg-gradient-to-r from-red-600 via-red-500 to-orange-600 bg-clip-text text-transparent">
                  FundWave<span className="text-red-400 text-lg ml-0.5">Admin</span>
                </div>
                <div className="text-xs text-gray-500 -mt-1 font-medium">Platform Management</div>
              </div>
            </Link>

            {/* Admin Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              {adminNavLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-all duration-200 flex items-center gap-2 px-4 py-2.5 rounded-lg hover:bg-red-50/80 border-2 border-transparent ${
                    pathname === link.href 
                      ? "text-red-700 bg-red-50 border-red-200 shadow-sm" 
                      : "text-gray-600 hover:text-red-600 hover:border-red-100"
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Admin User Menu */}
            <div className="hidden md:flex items-center space-x-3">
              {isSignedIn && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center space-x-2 hover:bg-gray-100 transition-colors"
                    >
                      <Avatar className="w-8 h-8 ring-2 ring-red-200">
                        <AvatarImage src={user?.imageUrl || ""} alt={user.firstName || ""} />
                        <AvatarFallback className="bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold">
                          {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <div className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-xs text-red-600 font-medium">Admin</div>
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 shadow-xl border-0 bg-white/95 backdrop-blur-md">
                    <DropdownMenuLabel>
                      <p className="font-medium">{user.firstName} {user.lastName}</p>
                      <p className="text-sm text-gray-500 font-normal">{user.primaryEmailAddress?.emailAddress}</p>
                      <p className="text-xs text-red-600 font-medium mt-1">Platform Administrator</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/" className="flex items-center">
                        <Heart className="w-4 h-4 mr-2" />
                        View Main Site
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/settings" className="flex items-center">
                        <Settings className="w-4 h-4 mr-2" />
                        Admin Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-600 focus:bg-red-50 focus:text-red-700"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="text-sm text-gray-500">Loading...</div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile menu */}
          <div
            className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
              isOpen ? "max-h-screen py-4 border-t border-gray-100" : "max-h-0"
            }`}
            aria-hidden={!isOpen}
          >
            <div className="flex flex-col space-y-1">
              {adminNavLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 rounded-xl text-base font-medium transition-all flex items-center gap-3 mx-2 ${
                    pathname === link.href
                      ? "bg-gradient-to-r from-red-50 to-orange-50 text-red-600 border-l-4 border-red-500 shadow-sm"
                      : "text-gray-700 hover:bg-gray-50 hover:text-red-600"
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}

              <div className="pt-4 mt-4 border-t border-gray-200 mx-2">
                {isSignedIn && user ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 px-4 py-3 bg-red-50 rounded-xl">
                      <Avatar className="w-10 h-10 ring-2 ring-red-200">
                        <AvatarImage src={user.imageUrl || ""} alt={user.firstName || ""} />
                        <AvatarFallback className="bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold">
                          {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-gray-900">{user.firstName} {user.lastName}</p>
                        <p className="text-sm text-red-600 font-medium">Administrator</p>
                      </div>
                    </div>
                    <Link
                      href="/"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-red-600 rounded-xl transition-all mx-2"
                    >
                      <Heart className="w-4 h-4" />
                      View Main Site
                    </Link>
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 bg-transparent"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">Loading...</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}