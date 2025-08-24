import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Heart, ArrowRight, Send } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

const footerLinks = {
  platform: [
    { name: "Browse Campaigns", href: "/campaigns" },
    { name: "Start a Campaign", href: "/create-campaign" },
    { name: "Success Stories", href: "/success-stories" },
    { name: "How it Works", href: "/how-it-works" },
    { name: "Pricing", href: "/pricing" },
  ],
  support: [
    { name: "Help Center", href: "/help" },
    { name: "Contact Support", href: "/contact" },
    { name: "FAQ", href: "/help#faq" },
    { name: "Mobile Money Guide", href: "/help#mobile-money" },
    { name: "KYC Verification", href: "/kyc" },
  ],
  company: [
    { name: "About FundWaveSL", href: "/about" },
    { name: "Our Mission", href: "/about#mission" },
    { name: "Careers", href: "/careers" },
    { name: "Press & Media", href: "/press" },
    { name: "Blog", href: "/blog" },
  ],
  legal: [
    { name: "Terms of Service", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Cookie Policy", href: "/cookie-policy" },
    { name: "Refund Policy", href: "/refund-policy" },
    { name: "Community Guidelines", href: "/community-guidelines" },
  ],
}

const socialLinks = [
  { icon: Facebook, href: "https://facebook.com/fundwavesl", label: "Facebook", color: "hover:text-blue-600" },
  { icon: Twitter, href: "https://twitter.com/fundwavesl", label: "Twitter", color: "hover:text-sky-500" },
  { icon: Instagram, href: "https://instagram.com/fundwavesl", label: "Instagram", color: "hover:text-pink-600" },
  { icon: Linkedin, href: "https://linkedin.com/company/fundwavesl", label: "LinkedIn", color: "hover:text-blue-700" },
]

const contactInfo = [
  {
    icon: Mail,
    value: "support@fundwavesl.com",
    label: "Email Support",
    href: "mailto:support@fundwavesl.com",
  },
  {
    icon: Phone,
    value: "+232 76 123 456",
    label: "Phone Support",
    href: "tel:+23276123456",
  },
  {
    icon: MapPin,
    value: "15 Siaka Stevens Street, Freetown",
    label: "Our Office",
    href: "https://maps.google.com",
  },
]

const achievements = [
  { value: "500+", label: "Successful Campaigns" },
  { value: "Le 2.5B+", label: "Funds Raised" },
  { value: "50K+", label: "Happy Donors" },
  { value: "98%", label: "Success Rate" },
]

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-[length:60px_60px] opacity-5"></div>

      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 mb-8 lg:mb-12">
          {/* Company Info & Newsletter */}
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            {/* Logo & Description */}
            <div>
              <div className="flex items-center mb-4 lg:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 gradient-bg rounded-xl mr-3 sm:mr-4 flex items-center justify-center shadow-lg">
                  <Heart className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-bold text-white">FundWave</span>
                  <span className="text-base sm:text-lg text-ocean-300 font-medium">SL</span>
                </div>
              </div>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-4 lg:mb-6">
                Empowering Sierra Leone communities through innovative crowdfunding solutions. Together, we&apos;re building
                a brighter future for our nation.
              </p>

              {/* Achievements */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 sm:gap-4">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="text-center p-3 sm:p-4 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10"
                  >
                    <p className="text-lg sm:text-2xl font-bold gradient-text">{achievement.value}</p>
                    <p className="text-slate-400 text-xs sm:text-sm">{achievement.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-gradient-to-r from-ocean-600/20 to-azure-600/20 p-4 sm:p-6 rounded-xl border border-ocean-500/20 backdrop-blur-sm">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Stay Updated</h3>
              <p className="text-slate-300 mb-4 text-sm sm:text-base">
                Get the latest campaigns and success stories delivered to your inbox.
              </p>
              <form className="flex flex-col sm:flex-row gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-ocean-400 flex-1"
                />
                <Button type="submit" className="btn-primary shrink-0 w-full sm:w-auto">
                  <Send className="w-4 h-4 mr-2 sm:mr-0" />
                  <span className="sm:hidden">Subscribe</span>
                </Button>
              </form>
            </div>
          </div>

          {/* Footer Links */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-4 lg:mb-6 text-white">Platform</h3>
              <ul className="space-y-2 lg:space-y-3">
                {footerLinks.platform.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-slate-300 hover:text-ocean-300 transition-colors text-sm flex items-center group"
                    >
                      <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-4 lg:mb-6 text-white">Support</h3>
              <ul className="space-y-2 lg:space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-slate-300 hover:text-ocean-300 transition-colors text-sm flex items-center group"
                    >
                      <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="sm:col-span-2 lg:col-span-1">
              <h3 className="text-base sm:text-lg font-semibold mb-4 lg:mb-6 text-white">Company</h3>
              <ul className="space-y-2 lg:space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-slate-300 hover:text-ocean-300 transition-colors text-sm flex items-center group"
                    >
                      <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-slate-700 pt-8 lg:pt-12 mb-8 lg:mb-12">
          <h3 className="text-lg sm:text-xl font-semibold mb-6 lg:mb-8 text-center text-white">Get in Touch</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
            {contactInfo.map((info, index) => (
              <a
                key={index}
                href={info.href}
                className="flex items-start p-4 sm:p-6 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-ocean-400/50 group"
              >
                <div className="bg-gradient-to-r from-ocean-500 to-azure-500 p-2 sm:p-3 rounded-lg mr-3 sm:mr-4 group-hover:scale-110 transition-transform">
                  <info.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs sm:text-sm text-slate-400 mb-1">{info.label}</div>
                  <div className="text-sm sm:text-base text-white font-medium break-words">{info.value}</div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Social Links */}
        <div className="border-t border-slate-700 pt-6 lg:pt-8 mb-6 lg:mb-8">
          <div className="flex justify-center space-x-4 sm:space-x-6">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 sm:p-3 rounded-full bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-ocean-400/50 hover:scale-110 ${social.color}`}
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </a>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-700 pt-6 lg:pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="text-slate-400 text-xs sm:text-sm text-center lg:text-left">
              © {new Date().getFullYear()} FundWaveSL. All rights reserved. Built with ❤️ in Sierra Leone.
            </div>

            <div className="flex flex-wrap justify-center lg:justify-end items-center gap-x-4 lg:gap-x-6 gap-y-2 text-xs sm:text-sm">
              {footerLinks.legal.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="text-slate-400 hover:text-ocean-300 transition-colors whitespace-nowrap"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-row justify-between items-center mt-4 lg:mt-6 pt-4 lg:pt-6 border-t border-slate-700 space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-2 text-slate-400 text-xs sm:text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>All systems operational</span>
            </div>

            <div className="text-slate-400 text-xs sm:text-sm">Proudly serving Sierra Leone since 2024</div>
          </div>
        </div>
      </div>
    </footer>
  )
}
