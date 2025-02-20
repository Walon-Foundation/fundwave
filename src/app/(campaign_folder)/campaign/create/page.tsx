"use client"

import { useState } from "react";
import { FaRegTrashCan } from "react-icons/fa6";
import { ToastContainer } from "react-toastify";

export default function Campaign() {
  const [activeSection, setActiveSection] = useState('basic');
  const [campaignName, setCampaignName] = useState("");
  const [campaignDescription, setCampaignDescription] = useState("");
  const [fundingGoal, setFundingGoal] = useState("");
  const [milestoneTitle, setMilestoneTitle] = useState("");
  const [amountNeeded, setAmountNeeded] = useState("");
  const [completionDate, setCompletionDate] = useState("");
  const [teamInformation, setTeamInformation] = useState("");
  const [expectedImpact, setExpectedImpact] = useState("");
  const [risksAndChallenges, setRisksAndChallenges] = useState("");
  const [category, setCategory] = useState("");
  
 

  const handleSectionChange = (section:string) => {
    setActiveSection(section);
  };

  return (
    <section className="my-12 px-4 w-full">
      <div className="flex flex-col items-center mx-auto max-w-7xl">
        <div className="  p-6 lg:p-8 w-full bg-white">
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold">Create Your Campaign</h1>
            <p className="text-lg text-gray-600 mt-2">Fill in the details to launch your fundraising campaign</p>
          </div>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <button
              className={`flex-1 py-2 px-4 rounded-lg border-2 border-gray-300 bg-white shadow-md text-lg font-semibold ${activeSection === 'basic' ? 'bg-gray-100' : ''}`}
              onClick={() => handleSectionChange('basic')}
            >
              Basic
            </button>
            <button
              className={`flex-1 py-2 px-4 rounded-lg border-2 border-gray-300 bg-white shadow-md text-lg font-semibold ${activeSection === 'milestones' ? 'bg-gray-100' : ''}`}
              onClick={() => handleSectionChange('milestones')}
            >
              Milestones
            </button>
            <button
              className={`flex-1 py-2 px-4 rounded-lg border-2 border-gray-300 bg-white shadow-md text-lg font-semibold ${activeSection === 'details' ? 'bg-gray-100' : ''}`}
              onClick={() => handleSectionChange('details')}
            >
              Details
            </button>
          </div>

          <form>
            {activeSection === 'basic' && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="campaign_name" className="block text-lg font-semibold mb-2">Campaign Name</label>
                  <input
                    type="text"
                    id="campaign_name"
                    placeholder="Campaign Name"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    className="w-full max-w-2xl border-2 border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="campaign_description" className="block text-lg font-semibold mb-2">Campaign Description</label>
                  <textarea
                    id="campaign_description"
                    placeholder="Campaign Description"
                    value={campaignDescription}
                    onChange={(e) => setCampaignDescription(e.target.value)}
                    className="w-full max-w-2xl border-2 border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
                <div>
                  <label htmlFor="funding_goal" className="block text-lg font-semibold mb-2">Funding Goal</label>
                  <input
                    type="text"
                    id="funding_goal"
                    placeholder="Funding Goal"
                    value={fundingGoal}
                    onChange={(e) => setFundingGoal(e.target.value)}
                    className="w-full max-w-2xl border-2 border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="category" className="block text-lg font-semibold mb-2">Category</label>
                  <input
                    type="text"
                    id="category"
                    placeholder="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full max-w-2xl border-2 border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {activeSection === 'milestones' && (
              <div className="space-y-6">
                <div className="border-2 border-gray-300 rounded-lg shadow-md p-6">
                  <div className="flex flex-col  gap-6 mb-4">
                    <div className="flex flex-col">
                      <label htmlFor="milestone_title" className="block text-lg font-semibold mb-2">Milestone Title</label>
                      <input
                        type="text"
                        id="milestone_title"
                        placeholder="Milestone Title"
                        value={milestoneTitle}
                        onChange={(e) => setMilestoneTitle(e.target.value)}
                        className="border-2 border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="amount_needed" className="block text-lg font-semibold mb-2">Amount Needed</label>
                      <input
                        type="text"
                        id="amount_needed"
                        placeholder="Amount Needed"
                        value={amountNeeded}
                        onChange={(e) => setAmountNeeded(e.target.value)}
                        className="border-2 border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="completion_date" className="block text-lg font-semibold mb-2">Completion Date</label>
                      <input
                        type="date"
                        id="completion_date"
                        value={completionDate}
                        onChange={(e) => setCompletionDate(e.target.value)}
                        className="border-2 border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <FaRegTrashCan className="text-red-600 text-xl cursor-pointer" />
                  </div>
                </div>
                <button className="w-full max-w-md mx-auto py-2 px-4 text-lg font-bold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  + Add Milestone
                </button>
              </div>
            )}

            {activeSection === 'details' && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="team_info" className="block text-lg font-semibold mb-2">Team Information</label>
                  <textarea
                    id="team_info"
                    placeholder="Team Information"
                    value={teamInformation}
                    onChange={(e) => setTeamInformation(e.target.value)}
                    className="w-full max-w-2xl border-2 border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
                <div>
                  <label htmlFor="expected_impact" className="block text-lg font-semibold mb-2">Expected Impact</label>
                  <textarea
                    id="expected_impact"
                    placeholder="Expected Impact"
                    value={expectedImpact}
                    onChange={(e) => setExpectedImpact(e.target.value)}
                    className="w-full max-w-2xl border-2 border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
                <div>
                  <label htmlFor="risks_challenges" className="block text-lg font-semibold mb-2">Risks and Challenges</label>
                  <textarea
                    id="risks_challenges"
                    placeholder="Risks and Challenges"
                    value={risksAndChallenges}
                    onChange={(e) => setRisksAndChallenges(e.target.value)}
                    className="w-full max-w-2xl border-2 border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-4 md:flex-row md:justify-between mt-8">
              <button className="w-full md:w-auto py-2 px-4 text-lg font-bold text-black border-2 border-gray-300 rounded-lg shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Save Draft
              </button>
              <button className="w-full md:w-auto py-2 px-4 text-lg font-bold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Submit Campaign
              </button>
            </div>
          </form>
        </div>
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false}/>
      </div>
    </section>
  );
}

