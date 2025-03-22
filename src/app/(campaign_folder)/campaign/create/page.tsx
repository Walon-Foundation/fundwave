"use client"
import { useState } from "react"
import type React from "react"
import { ToastContainer, toast } from "react-toastify"
import { ArrowLeft, ArrowRight, Save, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"


export default function Campaign() {
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 3

  // Form state
  const [campaignName, setCampaignName] = useState("")
  const [campaignDescription, setCampaignDescription] = useState("")
  const [fundingGoal, setFundingGoal] = useState("")
  const [milestone, setMilestone] = useState("")
  const [amountNeeded, setAmountNeeded] = useState("")
  const [completionDate, setCompletionDate] = useState("")
  const [teamInformation, setTeamInformation] = useState("")
  const [expectedImpact, setExpectedImpact] = useState("")
  const [risksAndChallenges, setRisksAndChallenges] = useState("")
  const [category, setCategory] = useState("")
  const [solution, setSolution] = useState("")
  const [problem, setProblem] = useState("")

  // Step navigation
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("Campaign submitted successfully!")
    // Here you would typically send the data to your API
  }

  // Save draft
  const saveDraft = () => {
    toast.info("Campaign draft saved!")
    // Here you would typically save the draft to your API or localStorage
  }

  // Calculate progress percentage
  const progressPercentage = (currentStep / totalSteps) * 100

  // Step titles for the progress indicator
  const stepTitles = ["Basic Information", "Milestones", "Campaign Details"]

  return (
    <section className="mx-auto my-12 px-4 w-full bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <div className="flex flex-col justify-center min-h-screen items-center mx-auto max-w-3xl">
        <div className="p-6 sm:p-8 w-full bg-white rounded-xl shadow-md border border-blue-100">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-800">Create Your Campaign</h1>
            <p className="text-base sm:text-lg text-blue-600 mt-2">
              Step {currentStep} of {totalSteps}: {stepTitles[currentStep - 1]}
            </p>
          </div>

          {/* Progress bar */}
          <div className="mb-8">
            <Progress value={progressPercentage} className="h-2 bg-blue-100" />
            <div className="flex justify-between mt-2 text-sm text-blue-600">
              {stepTitles.map((title, index) => (
                <div
                  key={index}
                  className={`text-center ${index + 1 === currentStep ? "font-semibold text-blue-800" : ""}`}
                >
                  Step {index + 1}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6 bg-blue-50 p-6 rounded-xl border border-blue-100 animate-in fade-in duration-300">
                <div>
                  <Label htmlFor="campaign_name" className="text-lg font-semibold text-blue-800 mb-2">
                    Campaign Name
                  </Label>
                  <Input
                    id="campaign_name"
                    placeholder="Enter your campaign name"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    className="w-full border-blue-200 focus-visible:ring-blue-400 text-blue-900 bg-white"
                    required
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
                    className="w-full border-blue-200 focus-visible:ring-blue-400 text-blue-900 bg-white min-h-[120px]"
                    required
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
                    className="w-full border-blue-200 focus-visible:ring-blue-400 text-blue-900 bg-white"
                    required
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
                    className="w-full border-blue-200 focus-visible:ring-blue-400 text-blue-900 bg-white"
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 2: Milestones */}
            {currentStep === 2 && (
              <div className="space-y-6 bg-blue-50 p-6 rounded-xl border border-blue-100 animate-in fade-in duration-300">
                <div className="border border-blue-200 rounded-lg bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-blue-800 mb-4">Add Milestone</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="milestone_title" className="font-semibold text-blue-700">
                        Milestone Title
                      </Label>
                      <Input
                        id="milestone_title"
                        placeholder="What will you achieve?"
                        value={milestone}
                        onChange={(e) => setMilestone(e.target.value)}
                        className="border-blue-200 focus-visible:ring-blue-400"
                        required
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
                        required
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
                        required
                      />
                    </div>
                  </div>
                </div>
                <p className="text-sm text-blue-600 italic">
                  You can add more milestones after creating your campaign.
                </p>
              </div>
            )}

            {/* Step 3: Campaign Details */}
            {currentStep === 3 && (
              <div className="space-y-6 bg-blue-50 p-6 rounded-xl border border-blue-100 animate-in fade-in duration-300">
                <div>
                  <Label htmlFor="problem" className="text-lg font-semibold text-blue-800 mb-2">
                    Problem
                  </Label>
                  <Textarea
                    id="problem"
                    placeholder="What problems are you trying to solve?"
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    className="w-full border-blue-200 focus-visible:ring-blue-400 text-blue-900 bg-white min-h-[120px]"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="solution" className="text-lg font-semibold text-blue-800 mb-2">
                    Solution
                  </Label>
                  <Textarea
                    id="solution"
                    placeholder="What is your solution to the problem?"
                    value={solution}
                    onChange={(e) => setSolution(e.target.value)}
                    className="w-full border-blue-200 focus-visible:ring-blue-400 text-blue-900 bg-white min-h-[120px]"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="team_info" className="text-lg font-semibold text-blue-800 mb-2">
                    Team Information
                  </Label>
                  <Textarea
                    id="team_info"
                    placeholder="Tell us about your team"
                    value={teamInformation}
                    onChange={(e) => setTeamInformation(e.target.value)}
                    className="w-full border-blue-200 focus-visible:ring-blue-400 text-blue-900 bg-white min-h-[120px]"
                    required
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
                    className="w-full border-blue-200 focus-visible:ring-blue-400 text-blue-900 bg-white min-h-[120px]"
                    required
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
                    className="w-full border-blue-200 focus-visible:ring-blue-400 text-blue-900 bg-white min-h-[120px]"
                    required
                  />
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between mt-8">
              <div className="flex gap-2">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="flex-1 sm:flex-none border-blue-300 text-blue-700 hover:bg-blue-50 hover:text-blue-800 font-semibold"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Previous
                  </Button>
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={saveDraft}
                  className="flex-1 sm:flex-none border-blue-300 text-blue-700 hover:bg-blue-50 hover:text-blue-800 font-semibold"
                >
                  <Save className="w-4 h-4 mr-2" /> Save Draft
                </Button>
              </div>

              <div>
                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                  >
                    Next <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                  >
                    Submit Campaign <Send className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      </div>
    </section>
  )
}

