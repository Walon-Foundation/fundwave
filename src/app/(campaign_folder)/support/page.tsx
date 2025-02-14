"use client"

import { useState } from 'react';
import { Calendar, Heart,  Users } from 'lucide-react';
import Link from 'next/link';
import { water } from '@/assets/assets';
import Image from 'next/image';

const SupportCampaign = () => {
  const [donationAmount, setDonationAmount] = useState('');
  
  const campaign = {
    title: "Clean Water for Rural Schools",
    description: "Help us bring clean water to 10 rural schools in Tanzania, impacting over 5,000 students.",
    raised: 6500,
    goal: 10000,
    daysLeft: 30,
    backers: 250,
    image: water,
  };

  const predefinedAmounts = [10, 25, 50];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">


      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">{campaign.title}</h2>
                <p className="text-gray-600 mb-4">{campaign.description}</p>
                <Image
                  src={campaign.image}
                  alt={campaign.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${(campaign.raised / campaign.goal) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm mb-4">
                  <span className="font-medium">NLe{campaign.raised.toLocaleString()} raised</span>
                  <span className="text-gray-500">NLe{campaign.goal.toLocaleString()} goal</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{campaign.daysLeft} days left</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{campaign.backers} backers</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">Support This Campaign</h2>
                <p className="text-gray-600 mb-4">Choose how you would like to contribute</p>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    {predefinedAmounts.map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setDonationAmount(amount.toString())}
                        className={`py-2 px-4 rounded-md transition-colors ${
                          donationAmount === amount.toString()
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        NLe{amount}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                      placeholder="Other amount"
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-500">USD</span>
                  </div>
                </div>
              </div>
              <div className="px-6 pb-6">
                <Link href='/payment'>
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center">
                  Proceed to Payment <Heart className="ml-2 h-4 w-4" />
                </button>
                </Link>
                <p className="text-xs text-center text-gray-500 mt-4">
                  By contributing, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      
    </div>
  );
};

export default SupportCampaign;