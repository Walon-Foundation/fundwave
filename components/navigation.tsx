"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useUser, useClerk } from "@clerk/nextjs"
import { axiosInstance } from "../lib/axiosInstance"
import { 
  Menu, 
  X, 
  Heart, 
  ChevronDown, 
  User, 
  Settings, 
  LogOut, 
  Bell, 
  Plus,
  Home,
  Compass,
  LayoutDashboard
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
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Skeleton } from "./ui/skeleton"

// Define the notification type based on the API response (logTable schema)
interface Notification {
  id: string;
  level: "success" | "error" | "warning" | "info";
  timestamp: string; // ISO date string
  category: string;
  details: string;
}

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loadingNotifications, setLoadingNotifications] = useState(true)
  const pathname = usePathname()
  const router = useRouter()
  const { isSignedIn: isAuthenticated, user } = useUser()
  const clerk = useClerk()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      setLoadingNotifications(true);
      const fetchNotifications = async () => {
        try {
          const response = await axiosInstance.get<{ data: Notification[] }>('/api/notifications');
          setNotifications(response.data.data);
        } catch (error) {
          console.error("Failed to fetch notifications", error);
          setNotifications([]); // Clear on error
        } finally {
          setLoadingNotifications(false);
        }
      };
      fetchNotifications();
    } else {
      setNotifications([]); // Clear notifications on logout
      setLoadingNotifications(false);
    }
  }, [isAuthenticated]);

  const publicNavLinks = [
    { name: "Home", href: "/", icon: <Home className="w-4 h-4" /> },
    { name: "Explore", href: "/campaigns", icon: <Compass className="w-4 h-4" /> },
  ]

  const authenticatedNavLinks = [
    { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: "Explore", href: "/campaigns", icon: <Compass className="w-4 h-4" /> },
  ]

  const navLinks = isAuthenticated ? authenticatedNavLinks : publicNavLinks

  const handleLogout = () => {
    clerk.signOut()
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-50">
      <nav
        className={`transition-all duration-300 ${
          isScrolled ? "bg-white/90 shadow-sm border-b" : "bg-white/95"
        } backdrop-blur-sm`}
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center space-x-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-lg p-1 transition-all hover:scale-105"
              aria-label="FundWave homepage"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl flex items-center justify-center shadow-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  FundWave
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-base font-medium transition-colors flex items-center gap-2 ${
                    pathname === link.href
                      ? "text-blue-600"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated && user ? (
                <>
                  <Button asChild className="bg-blue-600 hover:bg-blue-700">
                    <Link href="/create-campaign">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Campaign
                    </Link>
                  </Button>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="relative">
                        <Bell className="w-5 h-5" />
                        {notifications.length > 0 && (
                          <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-0">
                      <div className="p-4 border-b">
                        <h4 className="font-medium">Notifications</h4>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {loadingNotifications ? (
                          <div className="p-4 space-y-4">
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                          </div>
                        ) : notifications.length > 0 ? (
                          notifications.map((notification) => (
                            <div key={notification.id} className="p-4 border-t">
                              <p className="font-semibold capitalize">{notification.category}</p>
                              <p className="text-sm text-gray-600">{notification.details}</p>
                              <p className="text-xs text-gray-400 mt-2">
                                {new Date(notification.timestamp).toLocaleString()}
                              </p>
                            </div>
                          ))
                        ) : (
                          <p className="p-4 text-sm text-gray-500">No new notifications.</p>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center space-x-2">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={'/placeholder.svg'} alt={user.name} />
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-blue-400 text-white">
                            {user.name?.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-500 font-normal">
                          {user.email}
                        </p>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="flex items-center">
                          <User className="w-4 h-4 mr-2" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/settings" className="flex items-center">
                          <Settings className="w-4 h-4 mr-2" />
                          Settings
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
                </>
              ) : (
                <>
                  <Button asChild variant="ghost">
                  <Link href="/sign-in">Login</Link>
                  </Button>
                  <Button asChild className="bg-blue-600 hover:bg-blue-700">
                    <Link href="/sign-up">Get Started</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              onClick={() => setIsOpen(!isOpen)}
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
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 rounded-lg text-base font-medium transition-colors flex items-center gap-3 ${
                    pathname === link.href
                      ? "bg-blue-50 text-blue-600 border-l-4 border-blue-500"
                      : "text-gray-700 hover:bg-blue-50/50 hover:text-blue-600"
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}

              <div className="pt-4 border-t border-gray-200">
                {isAuthenticated && user ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 px-4 py-2">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={'/placeholder.svg'} alt={user.name} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-blue-400 text-white">
                          {user.name?.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <Button 
                      asChild 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => setIsOpen(false)}
                    >
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
                    <Button 
                      asChild 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setIsOpen(false)}
                    >
                    <Link href="/sign-in">Login</Link>
                    </Button>
                    <Button 
                      asChild 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => setIsOpen(false)}
                    >
                      <Link href="/sign-up">Get Started</Link>
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