"use client"

import { useState } from 'react'

export default function PolicyPage() {
  const [activeTab, setActiveTab] = useState("general");

  const policies = {
    general: [
      {
        title: "Platform Overview",
        content: "FundWave is a crowdfunding platform designed to help individuals and organizations raise funds for various causes. By using our platform, you agree to comply with all applicable laws and our policies."
      },
      {
        title: "User Responsibilities",
        content: "Users are responsible for the content they post on FundWave. This includes campaign descriptions, updates, and comments. All content must be accurate, lawful, and not infringe on any third-party rights."
      },
      {
        title: "Prohibited Content",
        content: "FundWave prohibits campaigns that promote illegal activities, hate speech, violence, or discrimination. We also do not allow fraudulent or misleading campaigns."
      }
    ],
    fundraising: [
      {
        title: "Campaign Creation",
        content: "Anyone can create a campaign on FundWave, provided they comply with our policies. Campaigns must clearly state their purpose and intended use of funds."
      },
      {
        title: "Funding Goals",
        content: "While we encourage realistic funding goals, there is no limit to how much you can raise. Funds are available for withdrawal even if the goal is not met, subject to our processing times."
      },
      {
        title: "Campaign Duration",
        content: "Campaigns can run indefinitely unless ended by the creator. We encourage regular updates to keep donors informed of progress."
      }
    ],
    donations: [
      {
        title: "Donor Protection",
        content: "FundWave takes donor protection seriously. We use secure payment processing and do not store credit card information. In cases of suspected fraud, we may refund donations and suspend campaigns."
      },
      {
        title: "Refund Policy",
        content: "Generally, donations are non-refundable. However, if a campaign is found to be fraudulent or in violation of our policies, we may issue refunds at our discretion."
      },
      {
        title: "Fees",
        content: "FundWave charges a small platform fee and payment processing fee on each donation. These fees help us maintain and improve our services. Exact fee structures are detailed in our Terms of Service."
      }
    ],
    privacy: [
      {
        title: "Data Collection",
        content: "We collect personal information necessary to provide our services, such as names, email addresses, and payment information. We do not sell personal information to third parties."
      },
      {
        title: "Data Usage",
        content: "We use collected data to operate our platform, improve our services, and communicate with users. This may include sending updates about campaigns you've donated to or created."
      },
      {
        title: "Data Protection",
        content: "FundWave employs industry-standard security measures to protect user data. This includes encryption, secure servers, and regular security audits."
      }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 text-center">FundWave Policies</h1>
      <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 text-center">
        Our commitment to transparency, safety, and trust.
      </p>

      {/* Policy Highlights */}
      <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Policy Highlights</h2>
        <ul className="list-disc pl-5 space-y-1 sm:space-y-2 text-sm sm:text-base text-gray-700">
          <li>We prioritize the safety and security of our users and their data.</li>
          <li>All campaigns must be honest, legal, and clearly state their purpose.</li>
          <li>We do not allow fraudulent or misleading campaigns.</li>
          <li>Donations are generally non-refundable, except in cases of fraud.</li>
          <li>We charge small fees to maintain and improve our platform.</li>
        </ul>
      </div>

      {/* Tabs for Policies */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-wrap sm:flex-nowrap space-x-2 sm:space-x-4 border-b overflow-x-auto">
          {Object.keys(policies).map((tab) => (
            <button
              key={tab}
              className={`py-2 px-3 sm:px-4 text-sm sm:text-base font-semibold whitespace-nowrap ${
                activeTab === tab ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-4 bg-white shadow-md rounded-lg p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 capitalize">
            {activeTab} Policies
          </h3>
          <div className="space-y-4 sm:space-y-6">
            {policies[activeTab].map((policy, index) => (
              <div key={index} className="border-b pb-3 sm:pb-4 mb-3 sm:mb-4">
                <h4 className="text-base sm:text-lg font-semibold mb-2">{policy.title}</h4>
                <p className="text-sm sm:text-base text-gray-700">{policy.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}