import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Cookie, Shield, Eye, Settings, FileText, Clock } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"

export const metadata: Metadata = {
  title: "Cookie Policy | FundWaveSL",
  description: "Learn about how FundWaveSL uses cookies to improve your experience and protect your privacy.",
}

export default function CookiePolicyPage() {
  const lastUpdated = "December 24, 2024"

  const cookieTypes = [
    {
      name: "Essential Cookies",
      icon: Shield,
      description: "Required for the website to function properly",
      examples: ["Authentication tokens", "Session management", "Security features"],
      retention: "Session or until logout",
      canDisable: false,
    },
    {
      name: "Analytics Cookies",
      icon: Eye,
      description: "Help us understand how visitors use our website",
      examples: ["Page views", "User interactions", "Performance metrics"],
      retention: "Up to 2 years",
      canDisable: true,
    },
    {
      name: "Functional Cookies",
      icon: Settings,
      description: "Remember your preferences and settings",
      examples: ["Language preferences", "Theme settings", "Form data"],
      retention: "Up to 1 year",
      canDisable: true,
    },
    {
      name: "Marketing Cookies",
      icon: FileText,
      description: "Used to deliver relevant advertisements",
      examples: ["Ad targeting", "Campaign tracking", "Social media integration"],
      retention: "Up to 1 year",
      canDisable: true,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button asChild variant="ghost" className="mb-4 text-slate-600 hover:text-ocean-600">
            <Link href="/" className="flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>

          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
              <Cookie className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Cookie Policy</h1>
              <p className="text-slate-600">How we use cookies to enhance your experience</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-sm text-slate-500">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              Last updated: {lastUpdated}
            </div>
            <Badge variant="secondary">Version 2.0</Badge>
          </div>
        </div>

        {/* Introduction */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-slate-900">What are Cookies?</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-slate max-w-none">
            <p>
              Cookies are small text files that are stored on your device when you visit our website. They help us
              provide you with a better experience by remembering your preferences, keeping you logged in, and helping
              us understand how you use our platform.
            </p>
            <p>
              At FundWaveSL, we are committed to transparency about how we collect and use your data. This policy
              explains what cookies we use, why we use them, and how you can control them.
            </p>
          </CardContent>
        </Card>

        {/* Cookie Types */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Types of Cookies We Use</h2>
          <div className="grid gap-6">
            {cookieTypes.map((type, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-ocean-500 to-azure-500 flex items-center justify-center">
                        <type.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{type.name}</CardTitle>
                        <CardDescription>{type.description}</CardDescription>
                      </div>
                    </div>
                    <Badge variant={type.canDisable ? "secondary" : "destructive"}>
                      {type.canDisable ? "Optional" : "Required"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-slate-900 mb-2">Examples:</h4>
                      <ul className="text-sm text-slate-600 space-y-1">
                        {type.examples.map((example, i) => (
                          <li key={i} className="flex items-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-ocean-500 mr-2" />
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900 mb-2">Retention Period:</h4>
                      <p className="text-sm text-slate-600">{type.retention}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Managing Cookies */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-slate-900">Managing Your Cookie Preferences</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-slate max-w-none">
            <h3>Browser Settings</h3>
            <p>
              You can control cookies through your browser settings. Most browsers allow you to view, delete, and block
              cookies. However, please note that blocking essential cookies may affect the functionality of our website.
            </p>

            <h3>Cookie Consent</h3>
            <p>
              When you first visit our website, we'll ask for your consent to use non-essential cookies. You can change
              your preferences at any time by clicking the "Cookie Settings" link in our footer.
            </p>

            <h3>Third-Party Cookies</h3>
            <p>
              Some cookies are set by third-party services that appear on our pages. We don't control these cookies, and
              you should check the relevant third party's website for more information.
            </p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-slate-900">Questions About Our Cookie Policy?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-4">
              If you have any questions about our use of cookies or this policy, please don't hesitate to contact us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild className="btn-primary">
                <Link href="/contact">Contact Us</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/privacy">Privacy Policy</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
