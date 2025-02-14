import Link from "next/link";
import { ArrowRight, CheckCircle, Shield, Users, Zap } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      title: "Create Your Campaign",
      description:
        "Set up your fundraising campaign with a compelling story, clear goals, and impactful visuals.",
      icon: <Zap className="h-12 w-12 text-blue-500" />,
    },
    {
      title: "Share Your Vision",
      description:
        "Spread the word about your campaign through social media, email, and your network.",
      icon: <Users className="h-12 w-12 text-green-500" />,
    },
    {
      title: "Receive Donations",
      description:
        "Watch as supporters contribute to your cause through our secure payment system.",
      icon: <Shield className="h-12 w-12 text-purple-500" />,
    },
    {
      title: "Achieve Milestones",
      description:
        "Update backers on your progress and unlock funds as you reach campaign milestones.",
      icon: <CheckCircle className="h-12 w-12 text-yellow-500" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <main className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-8 text-gray-900">
          How <span className="text-blue-600">FundWave</span> Works
        </h1>
        <p className="text-xl text-center text-gray-600 mb-16 max-w-3xl mx-auto">
          FundWave empowers you to raise funds for your projects and support
          causes you care about. Here is our simple four-step process:
        </p>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-16">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-lg text-center flex flex-col items-center transform transition duration-500 hover:scale-105"
            >
              <div className="mb-6 p-4 bg-gray-50 rounded-full">{step.icon}</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Ready to make a difference?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="w-full sm:w-auto">
             <Link href='/createcampaign'><button className="w-full sm:w-auto bg-blue-600 text-white py-3 px-8 rounded-full hover:bg-blue-700 transition duration-300 flex items-center justify-center text-lg font-semibold">
                Start a Campaign
                <ArrowRight className="ml-2 h-5 w-5" />
              </button></Link>
            </div>
            <div className="w-full sm:w-auto">
              <Link href='/explore'><button className="w-full sm:w-auto border-2 border-blue-600 text-blue-600 py-3 px-8 rounded-full hover:bg-blue-50 transition duration-300 text-lg font-semibold">
                Explore Campaigns
              </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HowItWorks;