"use client"
import  { useState } from 'react';
import { Calendar, MessageCircle, Share2, ThumbsUp, Users } from 'lucide-react';
import { Link } from 'lucide-react';
import Image from 'next/image';
import { water } from '@/assets/assets';

const CampaignDetails = () => {
  const [activeTab, setActiveTab] = useState('about');
  const [commentText, setCommentText] = useState('');

  const tabs = ['About', 'Updates', 'Comments'];

  return (
    <div className="flex flex-col min-h-screen">
      

      <main className="flex-1 py-12 bg-gray-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-2">Clean Water for Rural Schools</h1>
                  <p className="text-gray-600 mb-4">Help us bring clean water to 10 rural schools in Tanzania</p>
                  <Image
                    src={water}
                    alt="Campaign Image"
                    className="w-full h-[300px] object-cover rounded-lg mb-6"
                  />
                  <div className="flex border-b mb-6">
                    {tabs.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab.toLowerCase())}
                        className={`py-2 px-4 font-medium ${
                          activeTab === tab.toLowerCase()
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-500 hover:text-blue-600'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  {activeTab === 'about' && (
                    <div className="space-y-4">
                      <p className="text-gray-700">
                        Our project aims to provide clean and safe drinking water to 10 rural schools in Tanzania,
                        impacting over 5,000 students. With your support, we can install water purification systems
                        and educate communities on proper water management.
                      </p>
                      {['The Problem', 'Our Solution', 'Impact'].map((section) => (
                        <div key={section}>
                          <h3 className="text-lg font-semibold mb-2">{section}</h3>
                          <p className="text-gray-700">
                            {section === 'The Problem'
                              ? 'Many rural schools in Tanzania lack access to clean water, leading to waterborne diseases and decreased school attendance.'
                              : section === 'Our Solution'
                              ? 'We will install modern water purification systems in each school and provide education on water conservation and hygiene practices.'
                              : 'This project will directly benefit over 5,000 students, improving their health, increasing school attendance, and empowering communities with knowledge about water management.'}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  {activeTab === 'updates' && (
                    <div className="space-y-6">
                      {[
                        {
                          title: 'First School Installation Complete!',
                          date: 'June 15, 2023',
                          content:
                            "We're excited to announce that we've completed the installation of our first water purification system at Mwanza Primary School. The students and teachers are thrilled with the new clean water source!",
                        },
                        {
                          title: 'Halfway to Our Goal',
                          date: 'May 30, 2023',
                          content:
                            "Thanks to your generous support, we've reached the halfway point of our funding goal. We're now preparing for installations in the next three schools. Keep the momentum going!",
                        },
                      ].map((update, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="font-semibold text-lg mb-1">{update.title}</h3>
                          <p className="text-sm text-gray-500 mb-2">Posted on {update.date}</p>
                          <p className="text-gray-700">{update.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {activeTab === 'comments' && (
                    <div className="space-y-6">
                      {[
                        { name: 'John Doe', comment: "This is an amazing initiative! I'm glad to be part of this project." },
                        {
                          name: 'Jane Smith',
                          comment: "I've seen firsthand the impact of clean water in rural areas. Keep up the great work!",
                        },
                      ].map((comment, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <Image
                            src="/placeholder.svg"
                            alt={`${comment.name} avatar`}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <p className="font-semibold">{comment.name}</p>
                            <p className="text-gray-700 mt-1">{comment.comment}</p>
                          </div>
                        </div>
                      ))}
                      <div className="mt-6">
                        <textarea
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="Add a comment..."
                          className="w-full p-2 border rounded-md"
                          rows={3}
                        />
                        <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                          Post Comment
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="bg-gray-50 px-6 py-4 flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      30 days left
                    </span>
                    <span className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      250 backers
                    </span>
                    <span className="flex items-center">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      45 comments
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:sticky lg:top-4 space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-2">Support This Project</h2>
                <p className="text-gray-600 mb-4">Help us reach our goal of NLe10,000</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <p className="text-lg font-semibold mb-4">NLe6,500 raised of NLe10,000 goal</p>
                <input
                  type="number"
                  placeholder="Enter amount"
                  className="w-full p-2 border rounded-md mb-4"
                />
              <Link to='/support'>
              <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors mb-4">
                  Donate Now
                </button>
              </Link>
                <div className="flex justify-between">
                  <button className="flex items-center px-3 py-1 border rounded-md hover:bg-gray-50 transition-colors">
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Support
                  </button>
                  <button className="flex items-center px-3 py-1 border rounded-md hover:bg-gray-50 transition-colors">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </button>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-semibold mb-2">Current Milestone</h3>
                <p className="text-sm text-gray-600 mb-2">Equipment Procurement: NLe3,000 of NLe4,000 raised</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

    
    </div>
  );
};

export default CampaignDetails;