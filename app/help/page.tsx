"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, ChevronDown, ChevronRight, MessageCircle, Mail, Phone } from "lucide-react"

const helpCategories = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: "🚀",
    articles: [
      {
        id: "create-account",
        title: "How to create an account",
        content: "Learn how to sign up and set up your FundWaveSL account in just a few simple steps.",
      },
      {
        id: "verify-account",
        title: "Account verification (KYC)",
        content: "Understand the verification process and what documents you need to provide.",
      },
      {
        id: "platform-overview",
        title: "Platform overview",
        content: "Get familiar with FundWaveSL's features and how to navigate the platform.",
      },
    ],
  },
  {
    id: "creating-campaigns",
    title: "Creating Campaigns",
    icon: "📝",
    articles: [
      {
        id: "create-campaign",
        title: "How to create a campaign",
        content: "Step-by-step guide to creating your first crowdfunding campaign.",
      },
      {
        id: "campaign-guidelines",
        title: "Campaign guidelines and best practices",
        content: "Learn what makes a successful campaign and follow our guidelines.",
      },
      {
        id: "campaign-approval",
        title: "Campaign approval process",
        content: "Understand how campaigns are reviewed and approved on our platform.",
      },
      {
        id: "campaign-promotion",
        title: "Promoting your campaign",
        content: "Tips and strategies to promote your campaign and reach more donors.",
      },
    ],
  },
  {
    id: "donations",
    title: "Making Donations",
    icon: "💝",
    articles: [
      {
        id: "how-to-donate",
        title: "How to make a donation",
        content: "Learn how to support campaigns and make donations safely.",
      },
      {
        id: "payment-methods",
        title: "Payment methods",
        content: "Available payment options including mobile money and international payments.",
      },
      {
        id: "donation-security",
        title: "Donation security",
        content: "How we protect your payment information and ensure secure transactions.",
      },
      {
        id: "refunds",
        title: "Refunds and disputes",
        content: "Information about refund policies and how to report issues.",
      },
    ],
  },
  {
    id: "mobile-money",
    title: "Mobile Money",
    icon: "📱",
    articles: [
      {
        id: "orange-money",
        title: "Using Orange Money",
        content: "How to donate and receive funds using Orange Money.",
      },
      {
        id: "africell-money",
        title: "Using Africell Money",
        content: "Step-by-step guide for Africell Money transactions.",
      },
      {
        id: "qmoney",
        title: "Using QMoney",
        content: "How to use QMoney for donations and withdrawals.",
      },
      {
        id: "mobile-money-fees",
        title: "Mobile money fees",
        content: "Understanding transaction fees for mobile money payments.",
      },
    ],
  },
  {
    id: "account-management",
    title: "Account Management",
    icon: "👤",
    articles: [
      {
        id: "profile-settings",
        title: "Managing your profile",
        content: "How to update your profile information and settings.",
      },
      {
        id: "password-security",
        title: "Password and security",
        content: "Tips for keeping your account secure and updating passwords.",
      },
      {
        id: "notification-settings",
        title: "Notification preferences",
        content: "How to manage email and SMS notification settings.",
      },
      {
        id: "delete-account",
        title: "Deleting your account",
        content: "How to permanently delete your FundWaveSL account.",
      },
    ],
  },
  {
    id: "troubleshooting",
    title: "Troubleshooting",
    icon: "🔧",
    articles: [
      {
        id: "login-issues",
        title: "Login problems",
        content: "Solutions for common login and access issues.",
      },
      {
        id: "payment-issues",
        title: "Payment problems",
        content: "What to do when payments fail or encounter errors.",
      },
      {
        id: "technical-issues",
        title: "Technical issues",
        content: "Troubleshooting common technical problems on the platform.",
      },
      {
        id: "contact-support",
        title: "Contacting support",
        content: "How to get help when you can't find the answer you need.",
      },
    ],
  },
]

const faqItems = [
  {
    question: "Is FundWaveSL free to use?",
    answer:
      "Creating an account and browsing campaigns is free. We charge a 5% platform fee on successfully funded campaigns, plus payment processing fees.",
  },
  {
    question: "What payment methods are accepted?",
    answer:
      "We accept Orange Money, Africell Money, QMoney, and international payment methods like credit cards and bank transfers.",
  },
  {
    question: "How long does KYC verification take?",
    answer:
      "KYC verification typically takes 1-3 business days. You'll receive an email notification once your verification is complete.",
  },
  {
    question: "Can I edit my campaign after it's published?",
    answer:
      "Yes, you can edit most campaign details, but changes to funding goals require admin approval for transparency.",
  },
  {
    question: "What happens if my campaign doesn't reach its goal?",
    answer: "FundWaveSL uses a flexible funding model. You keep all funds raised, even if you don't reach your goal.",
  },
  {
    question: "How do I withdraw funds from my campaign?",
    answer:
      "Funds can be withdrawn to your verified mobile money account or bank account after completing KYC verification.",
  },
]

export default function HelpCenter() {
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedCategory, setExpandedCategory] = useState<string | null>("getting-started")
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null)
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)

  const filteredCategories = helpCategories.map((category) => ({
    ...category,
    articles: category.articles.filter(
      (article) =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase()),
    ),
  }))

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Help Center</h1>
          <p className="text-xl text-slate-600 mb-8">Find answers to your questions and learn how to use FundWaveSL</p>

          {/* Search */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for help articles..."
                className="w-full pl-12 pr-4 py-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Categories</h3>
              <nav className="space-y-2">
                {filteredCategories.map((category) => (
                  <div key={category.id}>
                    <button
                      onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                      className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-50 rounded-lg transition-colors"
                    >
                      <div className="flex items-center">
                        <span className="text-xl mr-3">{category.icon}</span>
                        <span className="font-medium text-slate-900">{category.title}</span>
                      </div>
                      {expandedCategory === category.id ? (
                        <ChevronDown className="w-4 h-4 text-slate-500" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-500" />
                      )}
                    </button>
                    {expandedCategory === category.id && (
                      <div className="ml-6 mt-2 space-y-1">
                        {category.articles.map((article) => (
                          <button
                            key={article.id}
                            onClick={() => setSelectedArticle(article.id)}
                            className={`block w-full text-left p-2 text-sm rounded hover:bg-slate-50 transition-colors ${
                              selectedArticle === article.id ? "text-indigo-600 bg-indigo-50" : "text-slate-600"
                            }`}
                          >
                            {article.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {selectedArticle ? (
              // Article View
              <div className="bg-white rounded-xl shadow-sm border p-8">
                {(() => {
                  const article = helpCategories
                    .flatMap((cat) => cat.articles)
                    .find((art) => art.id === selectedArticle)
                  return (
                    <div>
                      <button
                        onClick={() => setSelectedArticle(null)}
                        className="text-indigo-600 hover:text-indigo-800 mb-4"
                      >
                        ← Back to help topics
                      </button>
                      <h2 className="text-3xl font-bold text-slate-900 mb-6">{article?.title}</h2>
                      <div className="prose prose-slate max-w-none">
                        <p className="text-lg text-slate-700">{article?.content}</p>
                        {/* Add more detailed content here based on article ID */}
                      </div>
                    </div>
                  )
                })()}
              </div>
            ) : (
              // Overview
              <div className="space-y-8">
                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Quick Actions</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Link
                      href="/create-campaign"
                      className="flex items-center p-4 border border-slate-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                    >
                      <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                        <span className="text-2xl">🚀</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">Create Campaign</h3>
                        <p className="text-sm text-slate-600">Start your crowdfunding journey</p>
                      </div>
                    </Link>
                    <Link
                      href="/campaigns"
                      className="flex items-center p-4 border border-slate-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                    >
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                        <span className="text-2xl">💝</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">Browse Campaigns</h3>
                        <p className="text-sm text-slate-600">Find campaigns to support</p>
                      </div>
                    </Link>
                  </div>
                </div>

                {/* FAQ */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
                  <div className="space-y-4">
                    {faqItems.map((faq, index) => (
                      <div key={index} className="border border-slate-200 rounded-lg">
                        <button
                          onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                        >
                          <span className="font-medium text-slate-900">{faq.question}</span>
                          {expandedFAQ === index ? (
                            <ChevronDown className="w-5 h-5 text-slate-500" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-slate-500" />
                          )}
                        </button>
                        {expandedFAQ === index && (
                          <div className="px-4 pb-4">
                            <p className="text-slate-700">{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Support */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Still Need Help?</h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageCircle className="w-8 h-8 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-2">Live Chat</h3>
                      <p className="text-sm text-slate-600 mb-4">Chat with our support team</p>
                      <button className="btn-primary">Start Chat</button>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-2">Email Support</h3>
                      <p className="text-sm text-slate-600 mb-4">Get help via email</p>
                      <Link href="/contact" className="btn-outline">
                        Send Email
                      </Link>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Phone className="w-8 h-8 text-purple-600" />
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-2">Phone Support</h3>
                      <p className="text-sm text-slate-600 mb-4">Call us directly</p>
                      <a href="tel:+232XXXXXXX" className="btn-outline">
                        Call Now
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
