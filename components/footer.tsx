import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Heart } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

const footerSections = [
  {
    title: "Platform",
    links: [
      { name: "Browse Campaigns", href: "/campaigns" },
      { name: "Start a Campaign", href: "/create-campaign" },
      { name: "Success Stories", href: "/success-stories" },
    ]
  },
  {
    title: "Support",
    links: [
      { name: "Help Center", href: "/help" },
      { name: "Contact", href: "/contact" },
      { name: "FAQ", href: "/help#faq" },
    ]
  },
  {
    title: "Company",
    links: [
      { name: "About", href: "/about" },
      { name: "Blog", href: "/blog" },
      { name: "Careers", href: "/careers" },
    ]
  }
]

const socialLinks = [
  { icon: Facebook, href: "https://facebook.com/fundwavesl", label: "Facebook" },
  { icon: Twitter, href: "https://twitter.com/fundwavesl", label: "Twitter" },
  { icon: Instagram, href: "https://instagram.com/fundwavesl", label: "Instagram" },
  { icon: Linkedin, href: "https://linkedin.com/company/fundwavesl", label: "LinkedIn" },
]

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand & Newsletter - spans 2 columns on desktop */}
          <div className="lg:col-span-2 space-y-6">
            {/* Brand */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold">FundWave</span>
                <span className="text-lg text-cyan-300 font-medium">SL</span>
              </div>
            </div>
            
            <p className="text-slate-300 text-lg leading-relaxed">
              Empowering Sierra Leone through innovative crowdfunding solutions.
            </p>

            {/* Newsletter */}
            <div className="space-y-4">
              <p className="text-slate-300 font-medium">Stay updated with our latest campaigns</p>
              <form className="flex space-x-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 flex-1"
                />
                <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>

          {/* Links - spans 4 columns on desktop */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="font-semibold text-white mb-4 text-lg">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-slate-300 hover:text-cyan-300 transition-colors duration-200"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Contact & Social */}
        <div className="border-t border-slate-700 mt-12 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
            {/* Contact */}
            <div className="text-center lg:text-left">
              <a
                href="mailto:fundwavesl@gmail.com"
                className="flex items-center justify-center lg:justify-start space-x-2 text-slate-300 hover:text-cyan-300 transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span>fundwavesl@gmail.com</span>
              </a>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 hover:scale-110"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-700 mt-8 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="text-slate-400 text-sm text-center lg:text-left">
              © {new Date().getFullYear()} FundWaveSL. All rights reserved.
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link href="/privacy" className="text-slate-400 hover:text-cyan-300 transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-slate-400 hover:text-cyan-300 transition-colors">
                Terms
              </Link>
              <Link href="/cookie-policy" className="text-slate-400 hover:text-cyan-300 transition-colors">
                Cookies
              </Link>
            </div>
          </div>
          
          <div className="text-center mt-4 pt-4 border-t border-slate-700">
            <p className="text-slate-500 text-sm">
              Proudly serving Sierra Leone with ❤️
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}