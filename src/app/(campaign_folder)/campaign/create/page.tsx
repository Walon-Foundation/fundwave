"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { ToastContainer } from "react-toastify"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function Campaign() {
  const [activeSection, setActiveSection] = useState("basic")
  const [campaignName, setCampaignName] = useState("")
  const [campaignDescription, setCampaignDescription] = useState("")
  const [fundingGoal, setFundingGoal] = useState("")
  const [milestoneTitle, setMilestoneTitle] = useState("")
  const [amountNeeded, setAmountNeeded] = useState("")
  const [completionDate, setCompletionDate] = useState("")
  const [teamInformation, setTeamInformation] = useState("")
  const [expectedImpact, setExpectedImpact] = useState("")
  const [risksAndChallenges, setRisksAndChallenges] = useState("")
  const [category, setCategory] = useState("")
  const [milestones, setMilestones] = useState<[]>([])

  const handleSectionChange = (section: string) => {
    setActiveSection(section)
  }

  const addMilestone = () => {
    if (milestoneTitle && amountNeeded && completionDate) {
      const newMilestone = {
        id: Date.now(),
        title: milestoneTitle,
        amount: amountNeeded,
        date: completionDate,
      }
      setMilestones([...milestones, newMilestone])
      setMilestoneTitle("")
      setAmountNeeded("")
      setCompletionDate("")
    }
  }

  const removeMilestone = (id: number) => {
    setMilestones(milestones.filter((milestone) => milestone.id !== id))
  }

  return (
    <section className="my-12 px-4 w-full bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <div className="flex flex-col items-center mx-auto max-w-7xl">
        <div className="p-8 w-full bg-white rounded-xl shadow-md border border-blue-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-blue-800">Create Your Campaign</h1>
            <p className="text-lg text-blue-600 mt-2">Fill in the details to launch your fundraising campaign</p>
          </div>

          <div className="flex flex-wrap gap-4 mb-8">
            <button
              className={`flex-1 py-3 px-4 rounded-lg border border-blue-200 text-lg font-semibold transition-all ${
                activeSection === "basic"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-blue-700 hover:bg-blue-50"
              }`}
              onClick={() => handleSectionChange("basic")}
            >
              Basic
            </button>
            <button
              className={`flex-1 py-3 px-4 rounded-lg border border-blue-200 text-lg font-semibold transition-all ${
                activeSection === "milestones"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-blue-700 hover:bg-blue-50"
              }`}
              onClick={() => handleSectionChange("milestones")}
            >
              Milestones
            </button>
            <button
              className={`flex-1 py-3 px-4 rounded-lg border border-blue-200 text-lg font-semibold transition-all ${
                activeSection === "details"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-blue-700 hover:bg-blue-50"
              }`}
              onClick={() => handleSectionChange("details")}
            >
              Details
            </button>
          </div>

          <form className="space-y-8">
            {activeSection === "basic" && (
              <div className="space-y-6 bg-blue-50 p-6 rounded-xl border border-blue-100">
                <div>
                  <Label htmlFor="campaign_name" className="text-lg font-semibold text-blue-800 mb-2">
                    Campaign Name
                  </Label>
                  <Input
                    id="campaign_name"
                    placeholder="Enter your campaign name"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    className="w-full max-w-2xl border-blue-200 focus-visible:ring-blue-400 text-blue-900 bg-white"
                  />
                </div>
                <div>
                  <Label htmlFor="campaign_description" className="text-lg font-semibold text-blue-800 mb-2">
                    Campaign Description
                  </Label>
                  <Textarea
                    id="campaign_description"
                    placeholder="Describe your campaign"
                    value={campaignDescription}
                    onChange={(e) => setCampaignDescription(e.target.value)}
                    className="w-full max-w-2xl border-blue-200 focus-visible:ring-blue-400 text-blue-900 bg-white min-h-[120px]"
                  />
                </div>
                <div>
                  <Label htmlFor="funding_goal" className="text-lg font-semibold text-blue-800 mb-2">
                    Funding Goal
                  </Label>
                  <Input
                    id="funding_goal"
                    placeholder="Enter amount (e.g. $10,000)"
                    value={fundingGoal}
                    onChange={(e) => setFundingGoal(e.target.value)}
                    className="w-full max-w-2xl border-blue-200 focus-visible:ring-blue-400 text-blue-900 bg-white"
                  />
                </div>
                <div>
                  <Label htmlFor="category" className="text-lg font-semibold text-blue-800 mb-2">
                    Category
                  </Label>
                  <Input
                    id="category"
                    placeholder="Select or enter a category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full max-w-2xl border-blue-200 focus-visible:ring-blue-400 text-blue-900 bg-white"
                  />
                </div>
              </div>
            )}

            {activeSection === "milestones" && (
              <div className="space-y-6 bg-blue-50 p-6 rounded-xl border border-blue-100">
                {milestones.length > 0 && (
                  <div className="space-y-4 mb-6">
                    <h3 className="text-xl font-semibold text-blue-800">Your Milestones</h3>
                    {milestones.map((milestone) => (
                      <Card key={milestone.id} className="border-blue-200 bg-white">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="space-y-2">
                              <h4 className="font-semibold text-blue-700">{milestone.title}</h4>
                              <p className="text-blue-600">Amount: {milestone.amount}</p>
                              <p className="text-blue-600">
                                Target Date: {new Date(milestone.date).toLocaleDateString()}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeMilestone(milestone.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-5 w-5" />
                              <span className="sr-only">Remove milestone</span>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                <div className="border border-blue-200 rounded-lg bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-blue-800 mb-4">Add New Milestone</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="milestone_title" className="font-semibold text-blue-700">
                        Milestone Title
                      </Label>
                      <Input
                        id="milestone_title"
                        placeholder="What will you achieve?"
                        value={milestoneTitle}
                        onChange={(e) => setMilestoneTitle(e.target.value)}
                        className="border-blue-200 focus-visible:ring-blue-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="amount_needed" className="font-semibold text-blue-700">
                        Amount Needed
                      </Label>
                      <Input
                        id="amount_needed"
                        placeholder="Funding required"
                        value={amountNeeded}
                        onChange={(e) => setAmountNeeded(e.target.value)}
                        className="border-blue-200 focus-visible:ring-blue-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="completion_date" className="font-semibold text-blue-700">
                        Completion Date
                      </Label>
                      <Input
                        type="date"
                        id="completion_date"
                        value={completionDate}
                        onChange={(e) => setCompletionDate(e.target.value)}
                        className="border-blue-200 focus-visible:ring-blue-400"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={addMilestone}
                    type="button"
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Add Milestone
                  </Button>
                </div>
              </div>
            )}

            {activeSection === "details" && (
              <div className="space-y-6 bg-blue-50 p-6 rounded-xl border border-blue-100">
                <div>
                  <Label htmlFor="team_info" className="text-lg font-semibold text-blue-800 mb-2">
                    Team Information
                  </Label>
                  <Textarea
                    id="team_info"
                    placeholder="Tell us about your team"
                    value={teamInformation}
                    onChange={(e) => setTeamInformation(e.target.value)}
                    className="w-full max-w-2xl border-blue-200 focus-visible:ring-blue-400 text-blue-900 bg-white min-h-[120px]"
                  />
                </div>
                <div>
                  <Label htmlFor="expected_impact" className="text-lg font-semibold text-blue-800 mb-2">
                    Expected Impact
                  </Label>
                  <Textarea
                    id="expected_impact"
                    placeholder="How will your campaign make a difference?"
                    value={expectedImpact}
                    onChange={(e) => setExpectedImpact(e.target.value)}
                    className="w-full max-w-2xl border-blue-200 focus-visible:ring-blue-400 text-blue-900 bg-white min-h-[120px]"
                  />
                </div>
                <div>
                  <Label htmlFor="risks_challenges" className="text-lg font-semibold text-blue-800 mb-2">
                    Risks and Challenges
                  </Label>
                  <Textarea
                    id="risks_challenges"
                    placeholder="What obstacles might you face?"
                    value={risksAndChallenges}
                    onChange={(e) => setRisksAndChallenges(e.target.value)}
                    className="w-full max-w-2xl border-blue-200 focus-visible:ring-blue-400 text-blue-900 bg-white min-h-[120px]"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-4 md:flex-row md:justify-between mt-8">
              <Button
                type="button"
                variant="outline"
                className="w-full md:w-auto border-blue-300 text-blue-700 hover:bg-blue-50 hover:text-blue-800 font-semibold"
              >
                Save Draft
              </Button>
              <Button type="submit" className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                Submit Campaign
              </Button>
            </div>
          </form>
        </div>
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      </div>
    </section>
  )
}

