import Link from "next/link"
import { Users, Target, Globe, Heart, Award, TrendingUp } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-sky-500 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-6">About FundWaveSL</h1>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
            Empowering Sierra Leone communities through innovative crowdfunding solutions. We&apos;re building bridges
            between dreams and reality, one campaign at a time.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">Our Mission</h2>
              <p className="text-lg text-slate-700 mb-6">
                FundWaveSL was born from a simple belief: every Sierra Leonean should have the opportunity to turn their
                dreams into reality. We&apos;re democratizing access to funding by creating a platform that connects
                passionate project creators with supportive communities.
              </p>
              <p className="text-lg text-slate-700 mb-8">
                Whether it&apos;s building clean water systems in rural communities, supporting education initiatives, or
                helping entrepreneurs launch their businesses, we&apos;re here to make it happen.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/campaigns" className="btn-primary">
                  Explore Campaigns
                </Link>
                <Link href="/create-campaign" className="btn-outline">
                  Start Your Campaign
                </Link>
              </div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-indigo-600" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900">10K+</div>
                  <div className="text-sm text-slate-600">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900">500+</div>
                  <div className="text-sm text-slate-600">Campaigns Funded</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900">NLe2.5B</div>
                  <div className="text-sm text-slate-600">Funds Raised</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-8 h-8 text-orange-600" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900">14</div>
                  <div className="text-sm text-slate-600">Districts Reached</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Our Values</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              These core values guide everything we do and shape how we serve the Sierra Leone community.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm border text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Community First</h3>
              <p className="text-slate-600">
                We prioritize the needs of Sierra Leone communities, ensuring our platform serves local interests and
                cultural values.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Transparency</h3>
              <p className="text-slate-600">
                We believe in complete transparency in all transactions, ensuring donors and creators have full
                visibility into fund usage.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Accessibility</h3>
              <p className="text-slate-600">
                Our platform is designed to be accessible to all Sierra Leoneans, regardless of technical expertise or
                economic background.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Our Story</h2>
            <p className="text-xl text-slate-600">How FundWaveSL came to be and where we&apos;re heading</p>
          </div>

          <div className="prose prose-lg prose-slate max-w-none">
            <p>
              FundWaveSL was founded in 2024 by a team of Sierra Leonean entrepreneurs and technologists who recognized
              the immense potential within our communities. We saw talented individuals with brilliant ideas struggling
              to access the funding they needed to make their visions reality.
            </p>

            <p>
              Traditional funding mechanisms often excluded many Sierra Leoneans due to complex requirements,
              geographical barriers, or lack of collateral. We knew there had to be a better way – a way that leveraged
              the power of community support and modern technology.
            </p>

            <p>
              Starting with a small team in Freetown, we built FundWaveSL from the ground up, incorporating feedback
              from potential users across all 16 districts of Sierra Leone. We integrated mobile money solutions that
              Sierra Leoneans already use and trust, making it easy for anyone to participate in the crowdfunding
              ecosystem.
            </p>

            <p>
              Today, FundWaveSL is proud to be Sierra Leone&apos;s leading crowdfunding platform, having helped hundreds of
              campaigns raise millions of Leones for projects that matter to our communities. From clean water
              initiatives in rural areas to tech startups in urban centers, we&apos;re facilitating positive change across
              the country.
            </p>

            <p>
              But we&apos;re just getting started. Our vision extends beyond Sierra Leone – we aim to become the premier
              crowdfunding platform for all of West Africa, always staying true to our roots and the communities that
              made our success possible.
            </p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Leadership Team</h2>
            <p className="text-xl text-slate-600">Meet the passionate individuals driving FundWaveSL forward</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">AK</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Mohamed Lamin Walon-Jalloh</h3>
              <p className="text-indigo-600 font-medium mb-3">CEO & Co-Founder</p>
              <p className="text-slate-600 text-sm">
                A fullstack engineer and Electrical and Electronic Engineer
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">MS</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Alusine Swaray</h3>
              <p className="text-indigo-600 font-medium mb-3">CTO & Co-Founder</p>
              <p className="text-slate-600 text-sm">
                An Electrical Engineer with technical idea in a lot of areas&apos;s
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-red-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">FB</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Fatima Bangura</h3>
              <p className="text-indigo-600 font-medium mb-3">Head of Operations</p>
              <p className="text-slate-600 text-sm">
                Operations specialist with deep knowledge of Sierra Leone&apos;s business landscape and regulatory
                environment.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">Join Our Mission</h2>
          <p className="text-xl text-slate-600 mb-8">
            Whether you&apos;re looking to fund your next big idea or support meaningful projects in Sierra Leone, FundWaveSL
            is here to help you make an impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="btn-primary">
              Get Started Today
            </Link>
            <Link href="/contact" className="btn-outline">
              Partner With Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
