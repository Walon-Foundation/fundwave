"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, Heart, ChevronDown, User, Settings, LogOut, Bell, Plus } from "lucide-react"
import { usePathname } from "next/navigation"
import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"

// Mock user data - replace with actual auth state
const mockUser = {
  id: "1",
  name: "Aminata Kamara",
  email: "aminata@example.com",
  avatar: "/placeholder.svg?height=40&width=40",
  isVerified: true,
}

// Mock notifications
const mockNotifications = [
  {
    id: "1",
    title: "New donation received",
    message: "John Doe donated $50 to your campaign",
    time: "2 minutes ago",
    unread: true,
  },
  {
    id: "2",
    title: "Campaign milestone reached",
    message: "Your campaign has reached 75% of its goal!",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: "3",
    title: "New comment on campaign",
    message: "Someone left a supportive comment",
    time: "3 hours ago",
    unread: false,
  },
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false) // This should come from your auth context
  const [notifications, setNotifications] = useState(mockNotifications)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false) // Close mobile menu on route change
  }, [pathname])

  // Mock authentication check - replace with actual auth logic
  useEffect(() => {
    // Simulate checking auth status
    const checkAuth = () => {
      // This would typically check localStorage, cookies, or auth context
      const token = localStorage.getItem("authToken")
      setIsAuthenticated(!!token)
    }

    checkAuth()
  }, [])

  const publicNavLinks = [
    { name: "Home", href: "/" },
    { name: "Explore", href: "/campaigns" },
  ]

  const authenticatedNavLinks = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Explore", href: "/campaigns" },
  ]

  const navLinks = isAuthenticated ? authenticatedNavLinks : publicNavLinks

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    setIsAuthenticated(false)
    // Redirect to home or login page
    window.location.href = "/"
  }

  const unreadCount = notifications.filter((n) => n.unread).length

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, unread: false } : n)))
  }

  return (
    <header className="sticky top-0 z-50">
      <nav
        className={`transition-all duration-300 ${
          isScrolled ? "glass-effect shadow-lg border-b border-white/20" : "bg-white/95 backdrop-blur-sm"
        }`}
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center space-x-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:ring-offset-2 rounded-lg p-1 transition-all hover:scale-105"
              aria-label="FundWaveSL homepage"
            >
              <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center shadow-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="text-2xl font-bold gradient-text">FundWave</span>
                <span className="text-sm text-ocean-600 font-medium">SL</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative group ${
                    pathname === link.href
                      ? "text-ocean-600 bg-ocean-50"
                      : "text-slate-700 hover:text-ocean-600 hover:bg-ocean-50/50"
                  }`}
                >
                  {link.name}
                  <span
                    className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-azure-500 to-ocean-500 transition-all duration-300 ${
                      pathname === link.href ? "w-6" : "w-0 group-hover:w-6"
                    }`}
                  ></span>
                </Link>
              ))}
            </div>

            {/* Desktop Auth Section */}
            <div className="hidden md:flex items-center space-x-3">
              {isAuthenticated ? (
                <>
                  {/* Create Campaign Button */}
                  <Button asChild size="sm" className="btn-primary">
                    <Link href="/create-campaign" className="flex items-center">
                      <Plus className="w-4 h-4 mr-1" />
                      Create
                    </Link>
                  </Button>

                  {/* Notifications */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm" className="relative text-slate-600 hover:text-ocean-600">
                        <Bell className="w-4 h-4" />
                        {unreadCount > 0 && (
                          <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                            {unreadCount}
                          </Badge>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-0 z-50" align="end">
                      <div className="p-4 border-b">
                        <h3 className="font-semibold text-slate-900">Notifications</h3>
                        <p className="text-sm text-slate-500">You have {unreadCount} unread notifications</p>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.slice(0, 3).map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b hover:bg-slate-50 cursor-pointer transition-colors ${
                              notification.unread ? "bg-blue-50" : ""
                            }`}
                            onClick={() => markAsRead(notification.id)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="font-medium text-sm text-slate-900">{notification.title}</p>
                                <p className="text-sm text-slate-600 mt-1">{notification.message}</p>
                                <p className="text-xs text-slate-400 mt-2">{notification.time}</p>
                              </div>
                              {notification.unread && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1"></div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 border-t">
                        <Button asChild variant="ghost" className="w-full text-sm">
                          <Link href="/notifications">View all notifications</Link>
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>

                  {/* User Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="flex items-center space-x-2 hover:bg-ocean-50 focus:ring-2 focus:ring-ocean-500"
                      >
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={mockUser.avatar || "/placeholder.svg"} alt={mockUser.name} />
                          <AvatarFallback className="bg-gradient-to-r from-azure-500 to-ocean-500 text-white">
                            {mockUser.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="hidden lg:block text-left">
                          <p className="text-sm font-medium text-slate-900">{mockUser.name}</p>
                          <p className="text-xs text-slate-500">{mockUser.email}</p>
                        </div>
                        <ChevronDown className="w-4 h-4 text-slate-500" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 z-50">
                      <DropdownMenuLabel className="flex items-center space-x-2">
                        <div>
                          <p className="font-medium">{mockUser.name}</p>
                          <p className="text-sm text-slate-500">{mockUser.email}</p>
                        </div>
                        {mockUser.isVerified && (
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                            Verified
                          </Badge>
                        )}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="flex items-center cursor-pointer">
                          <User className="w-4 h-4 mr-2" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard" className="flex items-center cursor-pointer">
                          <Settings className="w-4 h-4 mr-2" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="text-red-600 focus:text-red-600 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Button asChild variant="ghost" className="text-slate-700 hover:text-ocean-600">
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button asChild className="btn-primary">
                    <Link href="/signup">Get Started</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-ocean-50 hover:text-ocean-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:ring-offset-2 transition-colors"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          <div
            className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
              isOpen ? "max-h-screen py-4" : "max-h-0"
            }`}
            aria-hidden={!isOpen}
          >
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                    pathname === link.href
                      ? "bg-ocean-50 text-ocean-600 border-l-4 border-ocean-500"
                      : "text-slate-700 hover:bg-ocean-50/50 hover:text-ocean-600"
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              <div className="pt-4 border-t border-slate-200">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 px-4 py-2">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={mockUser.avatar || "/placeholder.svg"} alt={mockUser.name} />
                        <AvatarFallback className="bg-gradient-to-r from-azure-500 to-ocean-500 text-white">
                          {mockUser.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-slate-900">{mockUser.name}</p>
                        <p className="text-sm text-slate-500">{mockUser.email}</p>
                      </div>
                      {unreadCount > 0 && <Badge className="bg-red-500 text-white">{unreadCount}</Badge>}
                    </div>
                    <Button asChild className="w-full btn-primary">
                      <Link href="/create-campaign" className="flex items-center justify-center">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Campaign
                      </Link>
                    </Button>
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      className="w-full text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-3">
                    <Button asChild variant="outline" className="btn-secondary">
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button asChild className="btn-primary">
                      <Link href="/signup">Get Started</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
