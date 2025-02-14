import { IoShieldOutline } from "react-icons/io5"
import { IoMdCheckmarkCircleOutline } from "react-icons/io"
import { BsPeopleFill } from "react-icons/bs"


function AboutUs() {
  return (
    <section className="mt-10">
        <div className="flex flex-col items-center justify-center mx-2 bg-green-50 py-10">
        <h1 className="font-bold text-5xl text-center tracking-tight mb-5">Why FundWave?</h1>
            <div className="flex flex-col md:flex-row gap-5">
                <div className="flex flex-col items-center">
                    <IoShieldOutline className="w-28 h-28 text-green-400"/>
                    <h1 className="font-semibold text-xl tracking-normal mb-4">Strict Vetting</h1>
                    <p className="text-center text-sm font-medium text-black/50">We througly verify all campaigns to ensure your donation go to legitimate cause</p>
                </div>
                <div className="flex flex-col items-center">
                    <IoMdCheckmarkCircleOutline className="w-28 h-28 text-green-400"/>
                    <h1 className="font-semibold text-xl tracking-normal mb-4">MileStone-Based Funding</h1>
                    <p className="text-center text-sm font-medium text-black/50">Funds are released in stages, ensuring project stay on track and accountable</p>
                </div>
                <div className="flex flex-col items-center">
                    <BsPeopleFill className="w-28 h-28 text-green-400"/>
                    <h1 className="font-semibold text-xl tracking-normal mb-4">Community Engagement</h1>
                    <p className="text-center text-sm font-medium text-black/50">Connect dierectly with project creators and fellow donor to maximize impact</p>
                </div>
            </div>
        </div>
    </section>
  )
}

export default AboutUs