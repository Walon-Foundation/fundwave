"use client"
import { useState } from "react"
import type React from "react"
import { ToastContainer, toast } from "react-toastify"
import { ArrowLeft, ArrowRight, Briefcase, GraduationCap, Save, Send, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { useAppDispatch } from "@/core/hooks/storeHooks"
import { fetchCampaigns } from "@/core/store/features/campaigns/campaignSlice"
import { useRouter } from "next/navigation"
import { Minus, Plus, List } from "lucide-react"
import CampaignPicturePreview from "@/components/campaign-picture-preview"
import { axiosInstance } from "@/core/api/axiosInstance"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import useIsCampaign from "@/core/hooks/useIsCampaign"

interface Team {
  name: string
  qualification: string
  experience: string
}

export default function CampaignCreateForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 3

  useIsCampaign()

  // Form state
  const [campaignName, setCampaignName] = useState("")
  const [campaignDescription, setCampaignDescription] = useState("")
  const [milestone, setMilestone] = useState("")
  const [amountNeeded, setAmountNeeded] = useState("")
  const [completionDate, setCompletionDate] = useState("")
  const [teamMembers, setTeamMembers] = useState<Team[]>([{ name: "", qualification: "", experience: "" }])
  const [expectedImpact, setExpectedImpact] = useState("")
  const [risksAndChallenges, setRisksAndChallenges] = useState("")
  const [category, setCategory] = useState("")
  const [solution, setSolution] = useState<string[]>([])
  const [problem, setProblem] = useState("")
  const [campaignPicture, setCampaignPicture] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const dispatch = useAppDispatch()

  //team members
  const handleMemberChange = (index: number, field: keyof Team, value: string) => {
    const updatedMembers = [...teamMembers]
    updatedMembers[index] = {
      ...updatedMembers[index],
      [field]: value,
    }
    setTeamMembers(updatedMembers)
  }

  const addMember = () => {
    setTeamMembers([...teamMembers, { name: "", qualification: "", experience: "" }])
  }

  const removeMember = (index: number) => {
    if (teamMembers.length === 1) return
    const updatedMembers = teamMembers.filter((_, i) => i !== index)
    setTeamMembers(updatedMembers)
  }

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

  //step to adding the solution
  const addSolution = () => {
    setSolution([...solution, ""])
  }

  const removeSolution = (index: number) => {
    if (solution.length > 1) {
      const newSolution = solution.filter((_, i) => i !== index)
      setSolution(newSolution)
    }
  }

  const handleSolutionChange = (index: number, value: string) => {
    const newSolution = [...solution]
    newSolution[index] = value
    setSolution(newSolution)
  }

  // Form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      const formData = new FormData()
      formData.append("campaignName", campaignName)
      formData.append("campaignDescription", campaignDescription)
      formData.append("amountNeeded", amountNeeded)
      formData.append("milestone", milestone)
      formData.append("teamInformation", JSON.stringify(teamMembers))
      formData.append("problem", problem)
      formData.append("solution", JSON.stringify(solution))
      formData.append("risksAndChallenges", risksAndChallenges)
      formData.append("expectedImpact", expectedImpact)
      formData.append("category", category)
      formData.append("completionDate", completionDate)
      if (campaignPicture) {
        formData.append("campaignPicture", campaignPicture)
      }
      const response = await axiosInstance.post("/campaign", formData)
      if (response.status === 201) {
        await dispatch(fetchCampaigns())
        console.log(response.data)
        router.push("/campaign")
      } else {
        setError(response.data.error)
      }
    } catch (error) {
      console.error(error)
      setError("An error occurred while creating the campaign.")
    } finally {
      setIsLoading(false)
    }
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
            <h1 className={`${error ? "text-red-600" : "text-blue-600"} text-2xl sm:text-3xl lg:text-4xl font-bold`}>
              {error ? error : "Create a Campaign"}
            </h1>
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
                  <CampaignPicturePreview onImageChange={setCampaignPicture} />
                </div>
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
                  <Label htmlFor="category" className="text-lg font-semibold text-blue-800 mb-2">
                    Category
                  </Label>
                  <Select onValueChange={setCategory} value={category}>
                    <SelectTrigger id="gender" className="border-blue-200 focus:border-blue-400 bg-white">
                      <SelectValue placeholder="Select your category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Health">Health</SelectItem>
                      <SelectItem value="College">College</SelectItem>
                      <SelectItem value="School">School</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="Startup">Startup</SelectItem>
                    </SelectContent>
                  </Select>
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
                        placeholder="NLe 500000"
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
                <div className="grid gap-4 py-4">
                  {solution.map((solution, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Label htmlFor={`solution-${index}`} className="sr-only">
                        Solution {index + 1}
                      </Label>
                      <div className="relative flex-grow">
                        <List className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-900 bg-white h-5 w-5" />
                        <Input
                          id={`solution-${index}`}
                          value={solution}
                          onChange={(e) => handleSolutionChange(index, e.target.value)}
                          placeholder={`Solution ${index + 1}`}
                          className="pl-10 bg-white text-blue-900"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeSolution(index)}
                        disabled={solution.length === 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addSolution} className="w-full">
                    <Plus className="h-4 w-4 mr-2" /> Add Solution
                  </Button>
                </div>
                <div>
                  <Card className="w-full max-w-3xl mx-auto">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold text-blue-800">Team Members</CardTitle>
                    </CardHeader>

                    <CardContent>
                      {teamMembers.map((member, index) => (
                        <div key={index} className="mb-8 border border-blue-100 rounded-lg p-4">
                          <div className="text-sm font-medium text-blue-800 mb-2">Team Member {index + 1}</div>
                          <div className="grid gap-4 py-2">
                            <div className="flex items-center gap-2">
                              <Label htmlFor={`name-${index}`} className="sr-only">
                                Name
                              </Label>
                              <div className="relative flex-grow">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-900 bg-white h-5 w-5" />
                                <Input
                                  id={`name-${index}`}
                                  value={member.name}
                                  onChange={(e) => handleMemberChange(index, "name", e.target.value)}
                                  placeholder="Team Member Name"
                                  className="pl-10 bg-white text-blue-900"
                                />
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Label htmlFor={`qualification-${index}`} className="sr-only">
                                Qualification
                              </Label>
                              <div className="relative flex-grow">
                                <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-900 bg-white h-5 w-5" />
                                <Input
                                  id={`qualification-${index}`}
                                  value={member.qualification}
                                  onChange={(e) => handleMemberChange(index, "qualification", e.target.value)}
                                  placeholder="Qualification"
                                  className="pl-10 bg-white text-blue-900"
                                />
                              </div>
                            </div>

                            <div className="flex items-start gap-2">
                              <div className="relative flex-grow">
                                <Briefcase className="absolute left-3 top-3 text-blue-900 bg-white h-5 w-5" />
                                <Textarea
                                  id={`experience-${index}`}
                                  value={member.experience}
                                  onChange={(e) => handleMemberChange(index, "experience", e.target.value)}
                                  placeholder="Experience"
                                  className="pl-10 bg-white text-blue-900 min-h-[80px]"
                                />
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => removeMember(index)}
                                disabled={teamMembers.length === 1}
                                className="mt-1"
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}

                      <Button
                        type="button"
                        variant="outline"
                        onClick={addMember}
                        className="w-full mt-2 border-blue-200 text-blue-700 hover:bg-blue-50"
                      >
                        <Plus className="h-4 w-4 mr-2" /> Add Team Member
                      </Button>
                    </CardContent>
                  </Card>
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
                    disabled={isLoading}
                    type="submit"
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                  >
                    {isLoading ? "Submitting..." : "Submit Campaign"} <Send className="w-4 h-4 ml-2" />
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
