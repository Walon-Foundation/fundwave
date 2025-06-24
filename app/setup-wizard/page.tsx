"use client"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Progress } from "../../components/ui/progress"
import {
  ArrowRight,
  ArrowLeft,
  Target,
  CreditCard,
  Shield,
  BarChart3,
  MessageCircle,
  Bell,
  Settings,
  CheckCircle,
  Play,
  Heart,
  Wallet,
  UserCheck,
  TrendingUp,
  Smartphone,
} from "lucide-react"

const wizardSteps = [
  {
    id: "welcome",
    title: "Welcome to FundWaveSL",
    description: "Your trusted crowdfunding platform for Sierra Leone",
    icon: Heart,
    content: {
      overview:
        "FundWaveSL connects Sierra Leoneans to fund projects that matter - from education and healthcare to community development and personal goals.",
      features: [
        "Create and manage fundraising campaigns",
        "Support causes you care about",
        "Secure payment processing",
        "Real-time progress tracking",
        "Community engagement tools",
      ],
    },
  },
  {
    id: "campaigns",
    title: "Creating Campaigns",
    description: "Learn how to start your fundraising journey",
    icon: Target,
    content: {
      overview:
        "Creating a campaign is simple and straightforward. Share your story, set your goal, and start raising funds.",
      steps: [
        {
          title: "Tell Your Story",
          description: "Write a compelling description of your project or cause",
          tips: ["Be specific about your goals", "Include photos and videos", "Explain how funds will be used"],
        },
        {
          title: "Set Your Target",
          description: "Choose a realistic funding goal and timeline",
          tips: ["Research similar campaigns", "Account for platform fees", "Set achievable milestones"],
        },
        {
          title: "Launch & Promote",
          description: "Share your campaign with friends, family, and social networks",
          tips: ["Use social media effectively", "Send personal messages", "Provide regular updates"],
        },
      ],
    },
  },
  {
    id: "donations",
    title: "Making Donations",
    description: "Support causes and make a difference",
    icon: Wallet,
    content: {
      overview: "Supporting campaigns is easy and secure. Every donation helps bring projects to life.",
      process: [
        "Browse campaigns by category or search",
        "Read campaign details and updates",
        "Choose your donation amount",
        "Select payment method",
        "Complete secure payment",
        "Receive confirmation and updates",
      ],
      benefits: [
        "Track your donation impact",
        "Receive campaign updates",
        "Connect with campaign creators",
        "Build your donor profile",
      ],
    },
  },
  {
    id: "payments",
    title: "Payment Methods",
    description: "Secure and convenient payment options",
    icon: CreditCard,
    content: {
      overview: "We support multiple payment methods to make donations and withdrawals convenient for everyone.",
      methods: [
        {
          name: "Mobile Money",
          options: ["Orange Money", "Africell Money"],
          fees: "2.5%",
          processing: "Instant",
        },
        {
          name: "Credit/Debit Cards",
          options: ["Visa", "Mastercard"],
          fees: "3.5%",
          processing: "Instant",
        },
        {
          name: "Bank Transfer",
          options: ["Local Banks"],
          fees: "1.5%",
          processing: "1-2 business days",
        },
      ],
      security: [
        "SSL encryption for all transactions",
        "PCI DSS compliant payment processing",
        "Fraud detection and prevention",
        "Secure data storage",
      ],
    },
  },
  {
    id: "kyc",
    title: "KYC Verification",
    description: "Secure your account and enable withdrawals",
    icon: UserCheck,
    content: {
      overview: "Know Your Customer (KYC) verification is required to withdraw funds and ensures platform security.",
      requirements: [
        "Valid government-issued ID",
        "Proof of address (utility bill or bank statement)",
        "Phone number verification",
        "Email verification",
      ],
      process: [
        "Upload required documents",
        "Complete identity verification",
        "Wait for admin review (24-48 hours)",
        "Receive approval notification",
        "Start withdrawing funds",
      ],
      benefits: [
        "Withdraw campaign funds",
        "Higher donation limits",
        "Verified badge on profile",
        "Enhanced account security",
      ],
    },
  },
  {
    id: "dashboard",
    title: "User Dashboard",
    description: "Manage your campaigns and donations",
    icon: BarChart3,
    content: {
      overview: "Your dashboard is your control center for managing all your FundWaveSL activities.",
      sections: [
        {
          name: "Campaign Overview",
          features: [
            "View all your campaigns",
            "Track funding progress",
            "Manage campaign updates",
            "View donor lists",
          ],
        },
        {
          name: "Donation History",
          features: ["See all your donations", "Track supported campaigns", "Download receipts", "View impact reports"],
        },
        {
          name: "Analytics",
          features: ["Campaign performance metrics", "Donor demographics", "Traffic sources", "Conversion rates"],
        },
        {
          name: "Settings",
          features: [
            "Update profile information",
            "Manage payment methods",
            "Notification preferences",
            "Privacy settings",
          ],
        },
      ],
    },
  },
  {
    id: "features",
    title: "Platform Features",
    description: "Explore all the tools available to you",
    icon: Settings,
    content: {
      overview: "FundWaveSL offers comprehensive features to enhance your crowdfunding experience.",
      categories: [
        {
          name: "Communication",
          icon: MessageCircle,
          features: [
            "Real-time chat with supporters",
            "Campaign comments and discussions",
            "Direct messaging system",
            "Community forums",
          ],
        },
        {
          name: "Notifications",
          icon: Bell,
          features: [
            "Real-time donation alerts",
            "Campaign milestone notifications",
            "Email and SMS updates",
            "Custom notification preferences",
          ],
        },
        {
          name: "Analytics",
          icon: TrendingUp,
          features: [
            "Detailed campaign analytics",
            "Donor insights and demographics",
            "Performance tracking",
            "Export data and reports",
          ],
        },
        {
          name: "Mobile Experience",
          icon: Smartphone,
          features: [
            "Responsive web design",
            "Mobile-optimized interface",
            "PWA installation",
            "Offline functionality",
          ],
        },
      ],
    },
  },
  {
    id: "admin",
    title: "Admin Features",
    description: "Platform management and moderation tools",
    icon: Shield,
    content: {
      overview: "Admin users have access to comprehensive platform management tools.",
      capabilities: [
        {
          name: "User Management",
          features: [
            "View and manage all users",
            "KYC approval process",
            "Account suspension/activation",
            "User analytics",
          ],
        },
        {
          name: "Campaign Moderation",
          features: [
            "Review and approve campaigns",
            "Monitor campaign content",
            "Handle reported campaigns",
            "Campaign analytics",
          ],
        },
        {
          name: "Financial Oversight",
          features: ["Transaction monitoring", "Withdrawal approvals", "Financial reporting", "Fee management"],
        },
        {
          name: "Platform Settings",
          features: ["System configuration", "Payment method settings", "Email templates", "Security settings"],
        },
      ],
    },
  },
  {
    id: "complete",
    title: "You're All Set!",
    description: "Ready to start your FundWaveSL journey",
    icon: CheckCircle,
    content: {
      overview: "Congratulations! You now know how to use all the features of FundWaveSL.",
      nextSteps: [
        "Complete your profile setup",
        "Verify your account with KYC",
        "Create your first campaign or make a donation",
        "Explore the community and connect with others",
        "Share FundWaveSL with friends and family",
      ],
      support: [
        "Visit our Help Center for detailed guides",
        "Contact support for any questions",
        "Join our community forums",
        "Follow us on social media for updates",
      ],
    },
  },
]

export default function SetupWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const currentStepData = wizardSteps[currentStep]
  const progress = ((currentStep + 1) / wizardSteps.length) * 100

  const handleNext = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep])
    }
    if (currentStep < wizardSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex)
  }

  const renderStepContent = () => {
    const step = currentStepData
    const Icon = step.icon

    switch (step.id) {
      case "welcome":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon className="w-10 h-10 text-indigo-600" />
              </div>
              <p className="text-lg text-slate-600 mb-6">{step.content.overview}</p>
            </div>

            <div className="grid gap-4">
              <h3 className="font-semibold text-slate-900">Key Features:</h3>
              {step.content.features?.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-slate-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )

      case "campaigns":
        return (
          <div className="space-y-6">
            <p className="text-slate-600">{step.content.overview}</p>

            <div className="space-y-4">
              {step?.content?.steps?.map((stepItem, index) => (
                <Card key={index} className="border-l-4 border-l-indigo-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                        {index + 1}
                      </span>
                      {stepItem.title}
                    </CardTitle>
                    <CardDescription>{stepItem.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-slate-900">Tips:</h4>
                      {stepItem.tips.map((tip, tipIndex) => (
                        <div key={tipIndex} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm text-slate-600">{tip}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case "donations":
        return (
          <div className="space-y-6">
            <p className="text-slate-600">{step.content.overview}</p>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Donation Process</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {step.content.process?.map((item, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-sm text-slate-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {step.content.benefits?.map((benefit, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-slate-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case "payments":
        return (
          <div className="space-y-6">
            <p className="text-slate-600">{step.content.overview}</p>

            <div className="grid gap-4">
              <h3 className="font-semibold text-slate-900">Available Payment Methods:</h3>
              {step.content.methods?.map((method, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium text-slate-900">{method.name}</h4>
                      <Badge variant="secondary">{method.fees} fee</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-500">Options:</span>
                        <div className="mt-1">
                          {method.options.map((option, optIndex) => (
                            <Badge key={optIndex} variant="outline" className="mr-1 mb-1">
                              {option}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-500">Processing:</span>
                        <p className="text-slate-700 mt-1">{method.processing}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-lg text-green-800 flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Security Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {step.content.security?.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm text-green-800">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "features":
        return (
          <div className="space-y-6">
            <p className="text-slate-600">{step.content.overview}</p>

            <div className="grid md:grid-cols-2 gap-6">
              {step.content.categories?.map((category, index) => {
                const CategoryIcon = category.icon
                return (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <CategoryIcon className="w-5 h-5 mr-2 text-indigo-600" />
                        {category.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {category.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full flex-shrink-0" />
                            <span className="text-sm text-slate-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )

      case "complete":
        return (
          <div className="space-y-6 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>

            <p className="text-lg text-slate-600 mb-6">{step.content.overview}</p>

            <div className="grid md:grid-cols-2 gap-6 text-left">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Next Steps</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {step.content.nextSteps?.map((item, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-sm text-slate-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Get Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {step.content.support?.map((item, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-slate-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      default:
        return (
          <div className="space-y-6">
            <p className="text-slate-600">{step.content.overview}</p>
            {/* Render other step types similarly */}
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">FundWaveSL Setup Wizard</h1>
          <p className="text-slate-600">Learn how to make the most of our crowdfunding platform</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-600">
              Step {currentStep + 1} of {wizardSteps.length}
            </span>
            <span className="text-sm text-slate-600">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {wizardSteps.map((step, index) => {
            const Icon = step.icon
            const isActive = index === currentStep
            const isCompleted = completedSteps.includes(index)

            return (
              <button
                key={step.id}
                onClick={() => handleStepClick(index)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-100 text-indigo-700 border-2 border-indigo-200"
                    : isCompleted
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{step.title}</span>
                {isCompleted && <CheckCircle className="w-4 h-4" />}
              </button>
            )
          })}
        </div>

        {/* Main Content */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <currentStepData.icon className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <CardTitle className="text-2xl">{currentStepData.title}</CardTitle>
                <CardDescription className="text-base">{currentStepData.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>{renderStepContent()}</CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>

          {currentStep === wizardSteps.length - 1 ? (
            <Button asChild className="flex items-center space-x-2">
              <a href="/dashboard">
                <Play className="w-4 h-4" />
                <span>Start Using FundWaveSL</span>
              </a>
            </Button>
          ) : (
            <Button onClick={handleNext} className="flex items-center space-x-2">
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
