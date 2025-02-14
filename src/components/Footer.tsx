import Link from "next/link"
import { logo } from "@/assets/assets"
import Image from "next/image"


function Footer() {

    const date = new Date().getFullYear()

  return (
    <footer className="">
        <div className="flex flex-col md:flex-row justify-between mx-4 items-center">
          <div className="flex flex-col md:flex-row items-center my-5 ">
            <Image src={logo} alt="logo" className=" w-[100px] mb-1" />
            <p className="text-md"> &copy;{date}<span className="font-extrabold"> FundWave </span>All right reserved</p>
          </div>
          <div className="flex flex-col gap-2 md:flex-row text-center md:gap-4 font-light ">
            <p>Terms of Service</p>
            <Link href='/privacypolicy'><p>Privacy Policy</p></Link>
            <Link href='/contactus'><p>Contact Us</p></Link>
            <Link href='/aboutus'><p>About Us</p></Link>
          </div>
        </div>
    </footer>
  )
}

export default Footer