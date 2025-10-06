"use client"

import Link from "next/link"
import {
  ArrowRight,
  Users,
  Target,
  Shield,
  TrendingUp,
  Check,
  Star,
  Globe,
  Smartphone,
  CreditCard,
  Zap,
  Award,
  ChevronRight,
  Heart,
} from "lucide-react"
import CampaignCard from "../components/campaign-card"
import ChatSystem from "../components/chat-system"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import type { Campaign } from "@/types/api"
import { useEffect, useState } from "react"
import { api } from "@/lib/api/api"
import Image from "next/image"

export default function HomePage() {
  const [data, setData] = useState<Campaign[]>([])

  useEffect(() => {
    const getCampaign = async () => {
      const data = await api.getCampaigns()
      setData(data)
    }

    getCampaign()
  }, [])

  const howItWorksSteps = [
    {
      icon: Target,
      title: "Create Your Campaign",
      description: "Set up your fundraising campaign with compelling photos, your story, and funding goal in minutes",
      color: "from-azure-500 to-ocean-500",
    },
    {
      icon: Users,
      title: "Share & Promote",
      description: "Share your campaign across social networks, WhatsApp, and with your community to maximize reach",
      color: "from-ocean-500 to-teal-500",
    },
    {
      icon: TrendingUp,
      title: "Receive Donations",
      description: "Collect donations seamlessly through mobile money, bank transfers, and international payments",
      color: "from-teal-500 to-azure-500",
    },
    {
      icon: Shield,
      title: "Withdraw Funds",
      description: "Access your funds securely after KYC verification with transparent tracking throughout",
      color: "from-azure-600 to-ocean-600",
    },
  ]

  const stats = [
    { value: "500+", label: "Successful Campaigns", icon: Award },
    { value: "Le 2.5B+", label: "Raised for Communities", icon: TrendingUp },
    { value: "50K+", label: "Happy Donors", icon: Users },
    { value: "98%", label: "Success Rate", icon: Star },
  ]

  const features = [
    {
      icon: Smartphone,
      title: "Mobile Money Integration",
      description: "Seamless integration with Orange Money, Africell Money, and other local payment methods",
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Accept donations from Sierra Leoneans worldwide through international payment gateways",
    },
    {
      icon: Shield,
      title: "Secure & Transparent",
      description: "Bank-level security with real-time tracking and transparent fund management",
    },
    {
      icon: Zap,
      title: "Instant Notifications",
      description: "Real-time updates via SMS, WhatsApp, and email for all campaign activities",
    },
  ]

  const testimonials = [
    {
      name: "Aminata Kamara",
      role: "Community Leader",
      image: "/placeholder.svg?height=60&width=60",
      quote:
        "FundWaveSL helped us raise Le 5M for our community well. The platform is so easy to use and the support team is amazing!",
      campaign: "Clean Water Project",
    },
    {
      name: "Dr. Mohamed Bangura",
      role: "Healthcare Professional",
      image: "/placeholder.svg?height=60&width=60",
      quote:
        "We successfully funded medical equipment for our clinic. The transparent tracking gave donors confidence in our project.",
      campaign: "Medical Equipment Fund",
    },
    {
      name: "Fatima Sesay",
      role: "Education Advocate",
      image: "/placeholder.svg?height=60&width=60",
      quote:
        "Thanks to FundWaveSL, we built a computer lab for our school. The mobile money integration made it accessible to everyone.",
      campaign: "Digital Learning Initiative",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative gradient-bg text-white overflow-hidden min-h-[90vh] flex items-center">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-[length:100px_100px] opacity-10"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        ></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
                🚀 Trusted by 50,000+ Sierra Leoneans
              </Badge>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                Fund Your Dreams,
                <br />
                <span className="bg-gradient-to-r from-ocean-200 to-azure-200 bg-clip-text text-transparent">
                  Transform Lives
                </span>
              </h1>

              <p className="text-xl md:text-2xl mb-8 text-ocean-100 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                The most trusted crowdfunding platform in Sierra Leone. From education to healthcare, community
                development to personal goals - we make funding accessible to everyone.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                <Link href="/create-campaign">
                  <Button
                    size="lg"
                    className="bg-white text-ocean-700 hover:bg-ocean-50 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center"
                  >
                    Start Your Campaign
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>

                {/* Fixed Button 2 */}
                <Link href="/campaigns">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm bg-transparent"
                  >
                    Explore Campaigns
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-6 text-sm text-ocean-200">
                <div className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-green-400" />
                  No platform fees
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-green-400" />
                  Mobile money ready
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-green-400" />
                  Secure & verified
                </div>
              </div>
            </div>

            {/* Right Content - Hero Image/Animation */}
            <div className="relative">
              <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <div className="aspect-w-16 aspect-h-12 bg-gradient-to-br from-white/20 to-white/5 rounded-2xl overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center text-white/60">
                    <div className="text-center">
                      <div className="w-24 h-24 gradient-bg rounded-full mx-auto mb-4 flex items-center justify-center">
                        <Heart className="w-12 h-12 text-white" />
                      </div>
                      <p className="text-lg font-medium">Platform Demo</p>
                      <p className="text-sm opacity-75">Interactive showcase</p>
                    </div>
                  </div>
                </div>

                {/* Floating Cards */}
                <div className="absolute -top-4 -right-4 bg-white rounded-lg p-4 shadow-xl animate-float">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-slate-700">Live Campaign</span>
                  </div>
                </div>

                <div
                  className="absolute -bottom-4 -left-4 bg-white rounded-lg p-4 shadow-xl animate-float"
                  style={{ animationDelay: "0.5s" }}
                >
                  <div className="text-sm text-slate-600">
                    <div className="font-bold text-ocean-600">Le 2.5M</div>
                    <div>Raised Today</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rest of the page content remains the same */}
      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-slate-50 to-ocean-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-ocean-100/50 group"
              >
                <div className="w-12 h-12 gradient-bg rounded-xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-3xl lg:text-4xl font-bold gradient-text mb-2">{stat.value}</p>
                <p className="text-slate-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Campaigns */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-ocean-100 text-ocean-700 hover:bg-ocean-200">✨ Featured Projects</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Support These <span className="gradient-text">Amazing Causes</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Discover campaigns making a real difference in Sierra Leone communities. Every donation, no matter the
              size, creates lasting impact.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {data?.slice(0,3).map((campaign, index) => (
              <div key={campaign.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CampaignCard campaign={campaign} featured={index < 2} />
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="group border-ocean-200 text-ocean-700 hover:bg-ocean-50 bg-transparent"
            >
              <Link href="/campaigns">
                View All Campaigns
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gradient-to-br from-slate-50 to-ocean-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-azure-100 text-azure-700 hover:bg-azure-200">🎯 Simple Process</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              How <span className="gradient-text">FundWaveSL</span> Works
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Four simple steps to start fundraising or support causes you care about. Our platform makes crowdfunding
              accessible to every Sierra Leonean.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorksSteps.map((step, index) => (
              <div
                key={index}
                className="relative bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group"
              >
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-azure-500 to-ocean-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  {index + 1}
                </div>

                {/* Icon */}
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg`}
                >
                  <step.icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-xl font-semibold text-slate-900 mb-4 text-center">{step.title}</h3>
                <p className="text-slate-600 text-center leading-relaxed">{step.description}</p>

                {/* Arrow for desktop */}
                {index < howItWorksSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ChevronRight className="w-6 h-6 text-ocean-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div>
              <Badge className="mb-4 bg-teal-100 text-teal-700 hover:bg-teal-200">🌟 Why Choose Us</Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                Built for <span className="gradient-text">Sierra Leone</span>
              </h2>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                FundWaveSL is designed specifically for Sierra Leoneans, with local payment options, community-focused
                features, and support in local languages.
              </p>

              <div className="space-y-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4 group">
                    <div className="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                      <p className="text-slate-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content */}
            <div className="relative">
              <div className="bg-gradient-to-br from-ocean-50 to-azure-50 rounded-3xl p-8 border border-ocean-100">
                <div className="aspect-w-16 aspect-h-12 bg-white rounded-2xl overflow-hidden shadow-inner">
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <div className="text-center">
                      <div className="w-20 h-20 gradient-bg rounded-2xl mx-auto mb-4 flex items-center justify-center">
                        <Smartphone className="w-10 h-10 text-white" />
                      </div>
                      <p className="text-lg font-medium text-slate-600">Platform Features</p>
                      <p className="text-sm text-slate-500">Interactive demo</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 bg-white rounded-xl p-4 shadow-xl border border-ocean-100 animate-float">
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5 text-ocean-600" />
                  <span className="text-sm font-medium text-slate-700">Mobile Money</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {/* <section className="py-20 bg-gradient-to-br from-slate-50 to-ocean-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-100 text-green-700 hover:bg-green-200">💬 Success Stories</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              What Our <span className="gradient-text">Community Says</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Real stories from real people who have successfully funded their dreams through FundWaveSL
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100"
              >
                <div className="flex items-center mb-6">
                  <Image
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    width={60}
                    height={60}
                    className="rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-slate-900">{testimonial.name}</h4>
                    <p className="text-sm text-slate-500">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-slate-600 mb-4 italic">&quot;{testimonial.quote}&quot;</p>
                <div className="text-sm text-ocean-600 font-medium">Campaign: {testimonial.campaign}</div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-20 gradient-bg text-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-[length:80px_80px] opacity-10"></div>
        <div className="absolute top-10 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-10 left-10 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1.5s" }}
        ></div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">🚀 Join the Movement</Badge>

          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Make a <span className="text-ocean-200">Difference?</span>
          </h2>

          <p className="text-xl text-ocean-100 mb-10 leading-relaxed max-w-2xl mx-auto">
            Join thousands of Sierra Leoneans who are already using FundWaveSL to fund their projects and support their
            communities. Your dream project is just one click away.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              asChild
              size="lg"
              className="bg-white text-ocean-700 hover:bg-ocean-50 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <Link href="/signup" className="flex items-center">
                Get Started Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm bg-transparent"
            >
              <Link href="/campaigns">Browse Campaigns</Link>
            </Button>
          </div>

          {/* Additional CTAs */}
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="font-semibold mb-2">For Fundraisers</h3>
              <p className="text-sm text-ocean-100 mb-4">Start your campaign in under 5 minutes</p>
              <Button asChild variant="ghost" className="text-white hover:bg-white/10 w-full">
                <Link href="/create-campaign">Create Campaign</Link>
              </Button>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="font-semibold mb-2">For Donors</h3>
              <p className="text-sm text-ocean-100 mb-4">Discover causes that matter to you</p>
              <Button asChild variant="ghost" className="text-white hover:bg-white/10 w-full">
                <Link href="/campaigns">Explore Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Chat System */}
      <ChatSystem
        campaignId="general"
        currentUserId="user1"
        currentUserName="Guest User"
        currentUserAvatar="/placeholder.svg?height=40&width=40"
      />
    </div>
  )
}