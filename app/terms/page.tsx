import Link from "next/link"

export default function TermsOfService() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-8">Terms of Service</h1>

          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-slate-700 mb-4">
                By accessing and using FundWaveSL (&quot;the Platform&quot;), you accept and agree to be bound by the terms and
                provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">2. Platform Description</h2>
              <p className="text-slate-700 mb-4">
                FundWaveSL is a crowdfunding platform specifically designed for Sierra Leone, enabling individuals and
                organizations to raise funds for various projects, causes, and initiatives within Sierra Leone and for
                the benefit of Sierra Leonean communities.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">3. User Accounts and Registration</h2>
              <div className="space-y-4">
                <h3 className="text-xl font-medium text-slate-800">3.1 Account Creation</h3>
                <p className="text-slate-700">
                  To use certain features of the Platform, you must register for an account. You agree to provide
                  accurate, current, and complete information during the registration process.
                </p>

                <h3 className="text-xl font-medium text-slate-800">3.2 KYC Requirements</h3>
                <p className="text-slate-700">
                  Campaign creators must complete Know Your Customer (KYC) verification, including providing valid
                  identification documents issued by Sierra Leone authorities or other acceptable documentation.
                </p>

                <h3 className="text-xl font-medium text-slate-800">3.3 Account Security</h3>
                <p className="text-slate-700">
                  You are responsible for maintaining the confidentiality of your account credentials and for all
                  activities that occur under your account.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">4. Campaign Guidelines</h2>
              <div className="space-y-4">
                <h3 className="text-xl font-medium text-slate-800">4.1 Permitted Campaigns</h3>
                <ul className="list-disc pl-6 text-slate-700 space-y-2">
                  <li>Community development projects</li>
                  <li>Educational initiatives</li>
                  <li>Healthcare and medical expenses</li>
                  <li>Emergency relief efforts</li>
                  <li>Small business development</li>
                  <li>Arts, culture, and sports projects</li>
                </ul>

                <h3 className="text-xl font-medium text-slate-800">4.2 Prohibited Campaigns</h3>
                <ul className="list-disc pl-6 text-slate-700 space-y-2">
                  <li>Illegal activities or purposes</li>
                  <li>Hate speech or discriminatory content</li>
                  <li>Political campaigns or lobbying</li>
                  <li>Gambling or lottery activities</li>
                  <li>Adult content or services</li>
                  <li>Fraudulent or misleading campaigns</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">5. Payment Terms</h2>
              <div className="space-y-4">
                <h3 className="text-xl font-medium text-slate-800">5.1 Payment Processing</h3>
                <p className="text-slate-700">
                  Payments are processed through secure payment gateways, including mobile money services popular in
                  Sierra Leone (Orange Money, Africell Money, etc.) and international payment methods.
                </p>

                <h3 className="text-xl font-medium text-slate-800">5.2 Platform Fees</h3>
                <p className="text-slate-700">
                  FundWaveSL charges a platform fee of 5% on successfully funded campaigns, plus applicable payment
                  processing fees. Fees are clearly disclosed before campaign creation.
                </p>

                <h3 className="text-xl font-medium text-slate-800">5.3 Refunds</h3>
                <p className="text-slate-700">
                  Refunds are handled on a case-by-case basis. Donors may request refunds for fraudulent campaigns or
                  campaigns that violate our terms of service.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">6. User Responsibilities</h2>
              <div className="space-y-4">
                <h3 className="text-xl font-medium text-slate-800">6.1 Campaign Creators</h3>
                <ul className="list-disc pl-6 text-slate-700 space-y-2">
                  <li>Provide accurate and truthful information about campaigns</li>
                  <li>Use funds for stated purposes only</li>
                  <li>Provide regular updates to donors</li>
                  <li>Comply with all applicable laws and regulations</li>
                </ul>

                <h3 className="text-xl font-medium text-slate-800">6.2 Donors</h3>
                <ul className="list-disc pl-6 text-slate-700 space-y-2">
                  <li>Make donations voluntarily and at your own risk</li>
                  <li>Understand that donations are not investments</li>
                  <li>Report suspicious or fraudulent campaigns</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">7. Intellectual Property</h2>
              <p className="text-slate-700 mb-4">
                Users retain ownership of content they post on the Platform but grant FundWaveSL a license to use,
                display, and promote such content in connection with the Platform&apos;s services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">8. Privacy and Data Protection</h2>
              <p className="text-slate-700 mb-4">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the
                Platform, to understand our practices regarding the collection and use of your personal information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">9. Limitation of Liability</h2>
              <p className="text-slate-700 mb-4">
                FundWaveSL acts as a platform connecting campaign creators and donors. We do not guarantee the success
                of campaigns or the proper use of funds by campaign creators. Users participate at their own risk.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">10. Governing Law</h2>
              <p className="text-slate-700 mb-4">
                These Terms of Service are governed by the laws of Sierra Leone. Any disputes arising from the use of
                this Platform will be subject to the jurisdiction of Sierra Leone courts.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">11. Changes to Terms</h2>
              <p className="text-slate-700 mb-4">
                FundWaveSL reserves the right to modify these terms at any time. Users will be notified of significant
                changes, and continued use of the Platform constitutes acceptance of modified terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">12. Contact Information</h2>
              <div className="bg-slate-50 p-6 rounded-lg">
                <p className="text-slate-700 mb-2">For questions about these Terms of Service, please contact us:</p>
                <ul className="text-slate-700 space-y-1">
                  <li>Email: legal@fundwavesl.com</li>
                  <li>Phone: +232 XX XXX XXXX</li>
                  <li>Address: Freetown, Sierra Leone</li>
                </ul>
              </div>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/privacy" className="btn-outline">
                Privacy Policy
              </Link>
              <Link href="/help" className="btn-outline">
                Help Center
              </Link>
              <Link href="/contact" className="btn-outline">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
