"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useUser, useClerk } from "@clerk/nextjs"
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
  LayoutDashboard,
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
import { api } from "@/lib/api/api"
import { CombinedUserData } from "@/types/api"

// Define the notification type based on the API response (logTable schema)
interface Notification {
  id: string
  level: "success" | "error" | "warning" | "info"
  timestamp: string // ISO date string
  category: string
  details: string
}

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [notifications, _setNotifications] = useState<Notification[]>([])
  const [user, setUser] = useState<CombinedUserData>()
  const [loadingNotifications, _setLoadingNotifications] = useState(true)
  const pathname = usePathname()
  const router = useRouter()
  const { isSignedIn: isAuthenticated } = useUser()
  const clerk = useClerk()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const getData = async() => {
      if(isAuthenticated){
        try{
          const res = await api.getProfile()
          console.log(res)
          setUser(res)
        }catch(err){
          console.log(err)
        }
      }
    }
    getData()
  }, [isAuthenticated])

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
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50">
      <nav
        className={`transition-all duration-300 ${
          isScrolled 
            ? "bg-white/95 shadow-xl border-b border-gray-100/50" 
            : "bg-white/98 border-b border-transparent"
        } backdrop-blur-md`}
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              href="/"
              className="flex items-center space-x-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:ring-offset-2 rounded-lg p-2 transition-all hover:scale-[1.02] group"
              aria-label="FundWave homepage"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-ocean-500 via-azure-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold bg-gradient-to-r from-ocean-600 via-azure-600 to-teal-600 bg-clip-text text-transparent">
                  FundWave<span className="text-ocean-400 text-lg ml-0.5">SL</span>
                </div>
                <div className="text-xs text-gray-500 -mt-1 font-medium">Sierra Leone&apos;s Platform</div>
              </div>
            </Link>

            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-all duration-200 flex items-center gap-2 px-4 py-2.5 rounded-lg hover:bg-ocean-50/80 border-2 border-transparent ${
                    pathname === link.href 
                      ? "text-ocean-700 bg-ocean-50 border-ocean-200 shadow-sm" 
                      : "text-gray-600 hover:text-ocean-600 hover:border-ocean-100"
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center space-x-3">
              {isAuthenticated && user ? (
                <>
                  <Button
                    asChild
                    className="bg-gradient-to-r from-ocean-600 to-teal-600 hover:from-ocean-700 hover:to-teal-700 shadow-md hover:shadow-lg transition-all duration-300 text-sm"
                    size="sm"
                  >
                    <Link href="/create-campaign">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Campaign
                    </Link>
                  </Button>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="relative hover:bg-gray-100 transition-colors">
                        <Bell className="w-5 h-5" />
                        {notifications.length > 0 && (
                          <span className="absolute -top-1 -right-1 block h-3 w-3 rounded-full bg-red-500 ring-2 ring-white animate-pulse" />
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-0 shadow-xl border-0 bg-white/95 backdrop-blur-md">
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
                      <Button
                        variant="ghost"
                        className="flex items-center space-x-2 hover:bg-gray-100 transition-colors"
                      >
                        <Avatar className="w-8 h-8 ring-2 ring-gray-200">
                          <AvatarImage src={user?.profile.profilePicture || ""} alt={user.profile.firstName} />
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white font-semibold">
                            {user.profile.firstName
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 shadow-xl border-0 bg-white/95 backdrop-blur-md">
                      <DropdownMenuLabel>
                        <p className="font-medium">{`${user.profile.firstName} ${user.profile.lastName}`}</p>
                        <p className="text-sm text-gray-500 font-normal">{user.profile.email}</p>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="flex items-center">
                          <User className="w-4 h-4 mr-2" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      {/* <DropdownMenuItem asChild>
                        <Link href="/settings" className="flex items-center">
                          <Settings className="w-4 h-4 mr-2" />
                          Settings
                        </Link>
                      </DropdownMenuItem> */}
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
                  <Button asChild variant="ghost" className="hover:bg-ocean-50 text-gray-600 hover:text-ocean-600 text-sm">
                    <Link href="/sign-in">
                      Login
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className="bg-gradient-to-r from-ocean-600 to-teal-600 hover:from-ocean-700 hover:to-teal-700 shadow-md hover:shadow-lg transition-all duration-300 text-sm"
                    size="sm"
                  >
                    <Link href="/sign-up">
                      Get Started
                    </Link>
                  </Button>
                </>
              )}
            </div>

            <button
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          <div
            className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
              isOpen ? "max-h-screen py-4 border-t border-gray-100" : "max-h-0"
            }`}
            aria-hidden={!isOpen}
          >
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 rounded-xl text-base font-medium transition-all flex items-center gap-3 mx-2 ${
                    pathname === link.href
                      ? "bg-gradient-to-r from-blue-50 to-emerald-50 text-blue-600 border-l-4 border-blue-500 shadow-sm"
                      : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}

              <div className="pt-4 mt-4 border-t border-gray-200 mx-2">
                {isAuthenticated && user ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-xl">
                      <Avatar className="w-10 h-10 ring-2 ring-gray-200">
                        <AvatarImage src={user.profile.profilePicture ||"/placeholder.svg"} alt={user.profile.firstName} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white font-semibold">
                          {user.profile.firstName
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-gray-900">{user.profile.firstName}</p>
                        <p className="text-sm text-gray-500">{user.profile.email}</p>
                      </div>
                    </div>
                    <Button
                      asChild
                      className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 shadow-md"
                      onClick={() => setIsOpen(false)}
                    >
                      <Link href="/create-campaign" className="flex items-center justify-center">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Campaign
                      </Link>
                    </Button>
                    <Link
                      href="/profile"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-xl transition-all mx-2"
                    >
                      <Settings className="w-4 h-4" />
                      Profile
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
                  <div className="flex flex-col space-y-3">
                    <Button
                      asChild
                      variant="outline"
                      className="w-full hover:bg-gray-50 bg-transparent"
                      onClick={() => setIsOpen(false)}
                    >
                      <Link href="/sign-in">Login</Link>
                    </Button>
                    <Button
                      asChild
                      className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 shadow-md"
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
