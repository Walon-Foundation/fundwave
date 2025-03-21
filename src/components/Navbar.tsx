"use client"
import { Menu, Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "@/core/store/store"
import { logout } from "@/core/store/features/user/userSlice"

export default function Navbar() {
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const isAuthenticated = useSelector((state:RootState) => state.user.isAuthenticated)
  const dispatch = useDispatch()

 

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-2 flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            {/* Replace with your actual logo import */}
            <div className="relative h-8 w-[100px]">
              <Image
                src="/placeholder.svg?height=32&width=100"
                alt="FundWave Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>
          <Link
            href="/howitworks"
            className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground md:block"
          >
            How it works
          </Link>
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <div className="relative">
            <Search
              className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-opacity ${isSearchFocused ? "opacity-0" : "opacity-100"}`}
            />
            <Input
              type="search"
              placeholder="Search"
              className={`w-[200px] bg-background pl-10 transition-all focus-visible:w-[300px] focus-visible:pl-4 lg:w-[300px] ${isSearchFocused ? "pl-4" : "pl-10"}`}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
          </div>

          {!isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="bg-blue-600">Sign Up</Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/profile">
                <Button variant="ghost" size="sm">
                  Profile
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={() => dispatch(logout())}>
                Logout
              </Button>
            </div>
          )}
        </div>

        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[80%] sm:w-[350px]">
            <div className="flex flex-col gap-6 pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input type="search" placeholder="Search" className="w-full pl-10" />
              </div>

              <nav className="flex flex-col gap-4">
                <Link href="/howitworks" className="text-sm font-medium">
                  <SheetClose className="flex w-full items-center py-2">How it works</SheetClose>
                </Link>

                {!isAuthenticated ? (
                  <div className="flex flex-col gap-2">
                    <Link href="/login" className="w-full">
                      <SheetClose asChild>
                        <Button variant="outline" className="w-full justify-start">
                          Sign In
                        </Button>
                      </SheetClose>
                    </Link>
                    <Link href="/signup" className="w-full">
                      <SheetClose asChild>
                        <Button className="w-full justify-start">Sign Up</Button>
                      </SheetClose>
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link href="/profile" className="w-full">
                      <SheetClose asChild>
                        <Button variant="ghost" className="w-full justify-start">
                          Profile
                        </Button>
                      </SheetClose>
                    </Link>
                    <SheetClose asChild>
                      <Button variant="outline" className="w-full justify-start" onClick={() => dispatch(logout())}>
                        Logout
                      </Button>
                    </SheetClose>
                  </div>
                )}
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

