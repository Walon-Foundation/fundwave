"use client"
import { useState } from 'react';
import { logo } from '@/assets/assets';
import { ToastContainer } from 'react-toastify';
import Link from 'next/link';
import Image from 'next/image';

function SignIn() {
  const [email,setEmail] = useState<string>()
  const [password, setPassword] = useState<string>("")

  
  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 md:p-14 w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Image src={logo} alt="logo" className="w-20" />
        </div>
        <h1 className="text-center text-3xl md:text-4xl font-semibold mb-6">
          Welcome Back
        </h1>
        <p className="text-center text-sm text-gray-500 mb-8">
          Sign in to continue
        </p>

        <form  className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-lg font-medium">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-lg font-medium">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end text-sm">
            <a href="#" className="text-blue-600 hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Sign In
          </button>
        </form>

        <div className="mt-8">
          <p className="text-center text-gray-500">or continue with</p>
          <div className="mt-4 flex gap-4 justify-center">
            <button className="w-full flex items-center justify-center py-2 border rounded-lg hover:bg-gray-100 transition">
              <p className="text-lg font-semibold">Google</p>
            </button>
            <button className="w-full flex items-center justify-center py-2 border rounded-lg hover:bg-gray-100 transition">
              <p className="text-lg font-semibold">Facebook</p>
            </button>
          </div>
          <Link href='/signup'><p className='text-center mt-2 text-blue-500'>or create an account</p></Link>
        </div>
      </div>
      <ToastContainer
         position="top-right"
         autoClose={5000}
         hideProgressBar={false}
      />
    </section>
  );
}

export default SignIn;
