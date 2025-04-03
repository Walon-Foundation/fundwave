import { logo } from "@/assets/assets"
import Image from "next/image"
import Link from "next/link"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-background">
      <div className="mx-2 py-8">
        <div className="grid  md:grid-cols-3 lg:grid-cols-4">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              {/* Replace with your actual logo import */}
              <div className="relative h-8 w-[100px]">
                <Image src={logo}  fill alt="FundWave Logo"  className="object-contain" />
              </div>
            </Link>
            <p className="text-sm text-muted-foreground">
              Empowering your financial journey with innovative solutions.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-medium">Quick Links</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/howitworks" className="text-sm text-muted-foreground hover:text-foreground">
                How it works
              </Link>
              <Link href="/aboutus" className="text-sm text-muted-foreground hover:text-foreground">
                About Us
              </Link>
              <Link href="/contactus" className="text-sm text-muted-foreground hover:text-foreground">
                Contact Us
              </Link>
              <Link href='/admin/login' className="text-sm text-muted-foreground hover:text-foreground" >
              Admin</Link>
            </nav>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-medium">Legal</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                Terms of Service
              </Link>
              <Link href="/privacypolicy" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy Policy
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-8 border-t pt-6">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {currentYear} <span className="font-semibold">FundWave</span>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

