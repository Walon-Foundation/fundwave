import Link from "next/link"

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-8">Privacy Policy</h1>

          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">1. Introduction</h2>
              <p className="text-slate-700 mb-4">
                FundWaveSL ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains
                how we collect, use, disclose, and safeguard your information when you use our crowdfunding platform
                designed for Sierra Leone.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">2. Information We Collect</h2>
              <div className="space-y-4">
                <h3 className="text-xl font-medium text-slate-800">2.1 Personal Information</h3>
                <ul className="list-disc pl-6 text-slate-700 space-y-2">
                  <li>Name, email address, and phone number</li>
                  <li>Physical address and location information</li>
                  <li>Date of birth and identification documents (for KYC)</li>
                  <li>Payment information and financial details</li>
                  <li>Profile photos and campaign images</li>
                </ul>

                <h3 className="text-xl font-medium text-slate-800">2.2 Usage Information</h3>
                <ul className="list-disc pl-6 text-slate-700 space-y-2">
                  <li>Device information and IP address</li>
                  <li>Browser type and operating system</li>
                  <li>Pages visited and time spent on the platform</li>
                  <li>Campaign interactions and donation history</li>
                  <li>Communication preferences</li>
                </ul>

                <h3 className="text-xl font-medium text-slate-800">2.3 Cookies and Tracking</h3>
                <p className="text-slate-700">
                  We use cookies and similar tracking technologies to enhance your experience, analyze usage patterns,
                  and provide personalized content and advertisements.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">3. How We Use Your Information</h2>
              <div className="space-y-4">
                <h3 className="text-xl font-medium text-slate-800">3.1 Platform Operations</h3>
                <ul className="list-disc pl-6 text-slate-700 space-y-2">
                  <li>Create and manage user accounts</li>
                  <li>Process donations and campaign transactions</li>
                  <li>Verify user identity (KYC compliance)</li>
                  <li>Provide customer support services</li>
                  <li>Send transactional notifications</li>
                </ul>

                <h3 className="text-xl font-medium text-slate-800">3.2 Communication</h3>
                <ul className="list-disc pl-6 text-slate-700 space-y-2">
                  <li>Send campaign updates and notifications</li>
                  <li>Provide marketing communications (with consent)</li>
                  <li>Respond to inquiries and support requests</li>
                  <li>Send important platform announcements</li>
                </ul>

                <h3 className="text-xl font-medium text-slate-800">3.3 Platform Improvement</h3>
                <ul className="list-disc pl-6 text-slate-700 space-y-2">
                  <li>Analyze usage patterns and user behavior</li>
                  <li>Improve platform features and functionality</li>
                  <li>Develop new services and features</li>
                  <li>Ensure platform security and prevent fraud</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">4. Information Sharing and Disclosure</h2>
              <div className="space-y-4">
                <h3 className="text-xl font-medium text-slate-800">4.1 Public Information</h3>
                <p className="text-slate-700">
                  Campaign information, including creator names, campaign descriptions, and donation amounts, may be
                  publicly visible on the platform.
                </p>

                <h3 className="text-xl font-medium text-slate-800">4.2 Service Providers</h3>
                <p className="text-slate-700">
                  We may share information with trusted third-party service providers who assist us in operating the
                  platform, including payment processors, email services, and analytics providers.
                </p>

                <h3 className="text-xl font-medium text-slate-800">4.3 Legal Requirements</h3>
                <p className="text-slate-700">
                  We may disclose information when required by law, to protect our rights, or to comply with legal
                  processes and government requests.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">5. Data Security</h2>
              <p className="text-slate-700 mb-4">
                We implement appropriate technical and organizational security measures to protect your personal
                information against unauthorized access, alteration, disclosure, or destruction. This includes:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li>Encryption of sensitive data in transit and at rest</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication measures</li>
                <li>Secure payment processing systems</li>
                <li>Regular backup and disaster recovery procedures</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">6. Your Rights and Choices</h2>
              <div className="space-y-4">
                <h3 className="text-xl font-medium text-slate-800">6.1 Access and Correction</h3>
                <p className="text-slate-700">
                  You have the right to access, update, or correct your personal information through your account
                  settings or by contacting us directly.
                </p>

                <h3 className="text-xl font-medium text-slate-800">6.2 Data Deletion</h3>
                <p className="text-slate-700">
                  You may request deletion of your personal information, subject to legal and operational requirements.
                  Some information may be retained for legitimate business purposes.
                </p>

                <h3 className="text-xl font-medium text-slate-800">6.3 Communication Preferences</h3>
                <p className="text-slate-700">
                  You can opt out of marketing communications at any time through your account settings or by following
                  unsubscribe instructions in our emails.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">7. International Data Transfers</h2>
              <p className="text-slate-700 mb-4">
                Your information may be transferred to and processed in countries other than Sierra Leone. We ensure
                appropriate safeguards are in place to protect your information during such transfers.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">8. Children's Privacy</h2>
              <p className="text-slate-700 mb-4">
                Our platform is not intended for children under 18 years of age. We do not knowingly collect personal
                information from children under 18. If we become aware of such collection, we will take steps to delete
                the information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">9. Changes to This Privacy Policy</h2>
              <p className="text-slate-700 mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by
                posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">10. Contact Us</h2>
              <div className="bg-slate-50 p-6 rounded-lg">
                <p className="text-slate-700 mb-2">
                  If you have any questions about this Privacy Policy, please contact us:
                </p>
                <ul className="text-slate-700 space-y-1">
                  <li>Email: privacy@fundwavesl.com</li>
                  <li>Phone: +232 XX XXX XXXX</li>
                  <li>Address: Freetown, Sierra Leone</li>
                </ul>
              </div>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/terms" className="btn-outline">
                Terms of Service
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
