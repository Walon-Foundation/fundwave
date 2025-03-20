"use client"

import Link from 'next/link';
import Image from 'next/image';
import { FaXTwitter, FaFacebookF } from 'react-icons/fa6';
import { holder } from '@/assets/assets';


const FeaturedCampaign = () => {
  const campaignList = [
    {
      "_id": "1a2b3c4d5e",
      "campaignName": "Clean Water for All",
      "campaignDescription": "Providing clean and safe drinking water to underprivileged communities.",
      "money_raised": 12000,
      "fundingGoal": 50000,
      "goal": 654000
    },
    {
      "_id": "2b3c4d5e6f",
      "campaignName": "Education for Every Child",
      "campaignDescription": "Supporting children's education by providing school supplies and scholarships.",
      "money_raised": 25000,
      "fundingGoal": 60000,
      "goal": 700000000
    },
    {
      "_id": "3c4d5e6f7g",
      "campaignName": "Tech for Youth",
      "campaignDescription": "Empowering young minds with access to technology and coding education.",
      "money_raised": 18000,
      "fundingGoal": 40000,
      "goal": 69000000
    },
    {
      "_id": "4d5e6f7g8h",
      "campaignName": "Healthcare for All",
      "campaignDescription": "Providing free medical checkups and medicines to those in need.",
      "money_raised": 15000,
      "fundingGoal": 70000,
      "goal": 5600000
    },
    {
      "_id": "5e6f7g8h9i",
      "campaignName": "Green Earth Initiative",
      "campaignDescription": "Planting trees and promoting sustainability to fight climate change.",
      "money_raised": 30000,
      "fundingGoal": 80000,
      "goal": 8000000
    }
  ]
  
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-center mb-16 text-4xl md:text-5xl font-extrabold">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Featured Campaigns
          </span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaignList.map((card) => (
            <div key={card._id} className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
              <div className="relative">
                <Image
                  src={holder}
                  alt={card.campaignName}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                  {100} days left
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl mb-2 truncate">{card.campaignDescription}</h3>
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Raised: NLe{card.money_raised}</span>
                    <span>Goal: NLe{card.fundingGoal}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${(card.money_raised / card.goal) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Link 
                    href="/support" 
                    className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-full hover:bg-blue-700 transition-colors"
                  >
                    Support
                  </Link>
                  <div className="flex gap-3">
                    <button className="text-gray-600 hover:text-blue-600 transition-colors">
                      <FaXTwitter size={20} />
                    </button>
                    <button className="text-gray-600 hover:text-blue-600 transition-colors">
                      <FaFacebookF size={20} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4">
                <Link 
                  href="/campaign/1" 
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  <button>
                    learn more.....
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link 
            href="/campaign" 
            className="inline-block bg-gray-200 text-gray-800 font-semibold py-3 px-8 rounded-full hover:bg-gray-300 transition-colors"
          >
            Explore More Campaigns
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCampaign;