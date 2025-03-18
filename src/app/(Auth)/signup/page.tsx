"use client"
import { g2_logo,f_logo } from "@/assets/assets";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import { useState } from "react";
import Image from "next/image";

function SignUp() {
  

  const [firstName, setFirstName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [lastName, setLastName] = useState<string>("")
  const [phoneNumber, setPhoneNumber] = useState<string>("")
  const [country, setCountry] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [capitalCity, setCapitalCity] = useState<string>("")


  return (
    <div className="flex flex-col items-center my-10 mx-4">
      {/* Header Section */}
      <div className="my-5 text-center">
        <p className="text-4xl font-extrabold text-gray-800">Create Your Account</p>
        <p className="text-lg font-medium text-blue-600">or sign in to an existing account</p>
      </div>

      {/* Form */}
      <form  className="flex flex-col items-center bg-white p-6 md:p-8 w-full max-w-lg shadow-lg rounded-xl">
        {/* Title */}
        <div className="flex flex-col mb-5">
          <p className="text-2xl font-bold text-gray-800">Sign Up</p>
          <p className="text-md font-medium text-gray-500">Enter your details to create your account</p>
        </div>

        {/* Input Fields */}
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col">
            <label htmlFor="first_name" className="font-semibold text-lg">First Name</label>
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="border border-gray-300 md:w-full px-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="last_name" className="font-semibold text-lg">Last Name</label>
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="border border-gray-300 px-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="email" className="font-semibold text-lg">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border border-gray-300 px-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="font-semibold text-lg">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border border-gray-300 px-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="capitalCity" className="font-semibold text-lg">Capital City</label>
            <input
              type="text"
              name="capitalCity"
              placeholder="Capital City"
              value={capitalCity}
              onChange={(e) => setCapitalCity(e.target.value)}
              required
              className="border border-gray-300 px-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="country" className="font-semibold text-lg">Country</label>
            <input
              type="text"
              name="country"
              placeholder="Select your country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
              className="border border-gray-300 px-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="phoneNumber" className="font-semibold text-lg">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              className="border border-gray-300 px-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>
        </div>

            
        {/* Social Login */}
        <div className="flex flex-col items-center mt-8">
          <p className="text-lg font-medium text-gray-700">Or continue with</p>
          <div className="flex gap-4 mt-4">
            <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer">
              <Image src={g2_logo} alt="google" className="h-8 w-8" />
              <p className="font-semibold text-gray-700">Google</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer">
              <Image src={f_logo} alt="facebook" className="h-8 w-8" />
              <p className="font-semibold text-gray-700">Facebook</p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-6 w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-md transition-all"
        >
          Sign Up
        </button>
        <Link href='/login' className="mt-2 text-center text-blue-500">or sign in to an existing account</Link>
      </form>
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
      />
    </div>
  );
}

export default SignUp;
