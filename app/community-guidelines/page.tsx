import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Users, Shield, Heart, AlertTriangle, CheckCircle, XCircle, Flag, Clock } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Alert, AlertDescription } from "../../components/ui/alert"

export const metadata: Metadata = {
  title: "Community Guidelines | FundWaveSL",
  description:
    "Learn about our community standards and guidelines for creating a safe, supportive fundraising environment.",
}

export default function CommunityGuidelinesPage() {
  const lastUpdated = "December 24, 2024"

  const guidelines = [
    {
      title: "Be Honest and Transparent",
      icon: CheckCircle,
      color: "text-green-600",
      description: "Always provide accurate information about your campaign and use of funds.",
      rules: [
        "Provide truthful descriptions of your cause",
        "Use real photos and documentation",
        "Update donors on how funds are being used",
        "Be transparent about any changes to your campaign",
      ],
    },
    {
      title: "Respect Others",
      icon: Heart,
      color: "text-pink-600",
      description: "Treat all community members with kindness and respect.",
      rules: [
        "Use respectful language in all communications",
        "Respect different opinions and perspectives",
        "No harassment, bullying, or discrimination",
        "Be supportive of other fundraisers when appropriate",
      ],
    },
    {
      title: "Follow Legal Requirements",
      icon: Shield,
      color: "text-blue-600",
      description: "Ensure your campaign complies with all applicable laws and regulations.",
      rules: [
        "Only fundraise for legal purposes",
        "Comply with local fundraising regulations",
        "Respect intellectual property rights",
        "Follow tax reporting requirements",
      ],
    },
    {
      title: "Maintain Privacy",
      icon: Users,
      color: "text-purple-600",
      description: "Protect your privacy and respect the privacy of others.",
      rules: [
        "Don't share personal information of others without consent",
        "Be cautious about sharing sensitive personal details",
        "Respect donor privacy preferences",
        "Report privacy violations to our team",
      ],
    },
  ]

  const prohibitedContent = [
    "Fraudulent or misleading campaigns",
    "Hate speech or discriminatory content",
    "Harassment or bullying",
    "Illegal activities or products",
    "Adult content or services",
    "Gambling or lottery schemes",
    "Multi-level marketing schemes",
    "Political campaigns (unless pre-approved)",
    "Campaigns that violate intellectual property",
    "Medical treatments not approved by authorities",
  ]

  const consequences = [
    {
      level: "Warning",
      description: "First-time minor violations receive a warning and guidance",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      level: "Campaign Suspension",
      description: "Serious violations may result in campaign suspension",
      color: "bg-orange-100 text-orange-800",
    },
    {
      level: "Account Suspension",
      description: "Repeated or severe violations may result in account suspension",
      color: "bg-red-100 text-red-800",
    },
    {
      level: "Permanent Ban",
      description: "Extreme violations result in permanent removal from the platform",
      color: "bg-gray-100 text-gray-800",
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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Community Guidelines</h1>
              <p className="text-slate-600">Building a safe and supportive fundraising community</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-sm text-slate-500">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              Last updated: {lastUpdated}
            </div>
            <Badge variant="secondary">Version 3.0</Badge>
          </div>
        </div>

        {/* Introduction */}
        <Alert className="mb-8 border-blue-200 bg-blue-50">
          <Heart className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Welcome to FundWaveSL!</strong> Our community guidelines help create a safe, supportive environment
            where genuine causes can thrive. By using our platform, you agree to follow these guidelines.
          </AlertDescription>
        </Alert>

        {/* Core Guidelines */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Core Community Guidelines</h2>
          <div className="grid gap-6">
            {guidelines.map((guideline, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-ocean-500 to-azure-500 flex items-center justify-center">
                      <guideline.icon className={`w-5 h-5 text-white`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{guideline.title}</CardTitle>
                      <CardDescription>{guideline.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {guideline.rules.map((rule, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-600">{rule}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Prohibited Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-slate-900 flex items-center">
              <XCircle className="w-5 h-5 text-red-500 mr-2" />
              Prohibited Content
            </CardTitle>
            <CardDescription>The following types of content are not allowed on our platform:</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              {prohibitedContent.map((item, index) => (
                <div key={index} className="flex items-center p-3 bg-red-50 rounded-lg">
                  <XCircle className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" />
                  <span className="text-sm text-red-800">{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reporting Violations */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-slate-900 flex items-center">
              <Flag className="w-5 h-5 text-orange-500 mr-2" />
              Reporting Violations
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-slate max-w-none">
            <p>
              If you encounter content or behavior that violates our community guidelines, please report it immediately.
              We take all reports seriously and investigate them promptly.
            </p>
            <div className="not-prose">
              <h3 className="font-semibold text-slate-900 mb-3">How to Report:</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-ocean-500 mr-3" />
                  <span className="text-sm">Use the "Report" button on campaigns or comments</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-ocean-500 mr-3" />
                  <span className="text-sm">Contact our support team directly</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-ocean-500 mr-3" />
                  <span className="text-sm">Email us at support@fundwavesl.com</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Consequences */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-slate-900 flex items-center">
              <AlertTriangle className="w-5 h-5 text-amber-500 mr-2" />
              Consequences of Violations
            </CardTitle>
            <CardDescription>
              We enforce our guidelines fairly and consistently. Consequences depend on the severity and frequency of
              violations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {consequences.map((consequence, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <Badge className={consequence.color}>{consequence.level}</Badge>
                    <p className="text-sm text-slate-600 mt-1">{consequence.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-slate-900">Questions or Concerns?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-4">
              If you have questions about our community guidelines or need to report a violation, we're here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild className="btn-primary">
                <Link href="/contact">Contact Support</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/help">Help Center</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
