import { HeartIcon, UsersIcon, TrendingUpIcon, ShieldCheckIcon } from 'lucide-react';
import Link from 'next/link';
import { walon,nema,swaray,tjalloh,funding } from '@/assets/assets';
import Image from 'next/image';

export default function AboutUs() {
  const impactStats = [
    { icon: HeartIcon, value: "10+", label: "Campaigns Funded" },
    { icon: UsersIcon, value: "50+", label: "Donors" },
    { icon: TrendingUpIcon, value: "NLe50+", label: "Raised" },
    { icon: ShieldCheckIcon, value: "4+", label: "Countries & Regions" },
  ];

  const teamMembers = [
    { name: "Mohamed Lamin Walon-Jalloh", role: "CEO & Co-founder, lead developer", image: walon },
    { name: "Alusine Swaray", role: "AI prompter & Co-founder", image:swaray },
    { name: "Nematulia Barrie", role: "Head of Communication", image: nema },
    { name: "Ibrahim Jalloh", role: "Lead Designer", image: tjalloh },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <header className="text-center mb-12">
        <h1 className="text-4xl font-extrabold mb-4">FundWave</h1>
        <p className="text-xl text-gray-600">Empowering dreams, one donation at a time</p>
      </header>

      {/* Mission Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-6">Our Mission</h2>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-lg mb-4">
              At FundWave, we believe in the power of community to change lives. Our mission is to create a platform where compassion meets action, enabling individuals and organizations to raise funds for causes that matter most to them.
            </p>
            <p className="text-lg mb-4">
              Whether it is helping a family in need, supporting a local charity, or funding a groundbreaking project, we are here to make fundraising accessible, transparent, and impactful.
            </p>
            <Link href='/campaign/create'><button className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">Start a Campaign</button></Link>
          </div>
          <div className="relative h-64 md:h-full">
            <Image
              src={funding}
              alt="People collaborating on a fundraising campaign"
              className="rounded-lg object-cover w-full h-full"
            />
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-6">Our Impact</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {impactStats.map((stat, index) => (
            <div key={index} className="bg-white shadow-lg p-6 rounded-lg text-center">
              <stat.icon className="w-12 h-12 mx-auto mb-4 text-blue-500" />
              <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

    

      {/* Team Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-6">Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white shadow-lg p-6 rounded-lg text-center">
              <div className="w-24 h-24 mx-auto mb-4">
                <Image
                  src={member.image}
                  alt={member.name}
                  className="rounded-full w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
              <span className="text-gray-500 bg-gray-200 px-3 py-1 rounded-full">{member.role}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Commitment Section */}
      <section>
        <h2 className="text-3xl font-semibold mb-6">Our Commitment</h2>
        <div className="bg-white shadow-lg p-6 rounded-lg">
          <p className="text-lg">
            At FundWave, we are committed to providing a secure, transparent, and user-friendly platform for all your fundraising needs. We believe in the power of community and the impact of collective giving. Our dedicated team works tirelessly to ensure that every campaign gets the support it deserves, and every donor feels confident in their contribution.
          </p>
          <div className="mt-4">
            <Link href='/privacypolicy'><button className="border border-blue-600 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50">Learn About Our Policies</button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
