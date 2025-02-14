"use client"

import { Menu } from "lucide-react";
import { logo } from "@/assets/assets";
import { useState } from "react";
import Link from "next/link";
// import { useContext } from "react";
// import AuthContext from "@/libs/context/authContext";
import Image from "next/image";

function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const isAuthenticated = false
  

    function hanldeopen() {
        setIsOpen(!isOpen);
    }

    return (
        <header className="sticky top-0 bg-white shadow-md z-50">
            <nav>
                <div className="flex justify-between items-center px-4 py-3 lg:px-6">
                    <div className="flex items-center gap-5">
                        <Link href='/'>
                        <Image src={logo} alt="logo" className=" w-[100px]" />
                        </Link>
                        <Link href='/howitworks'><p className="font-thin hidden md:flex ">How it works</p>
                        </Link>
                    </div>
                    {!isAuthenticated && (
                        <div className="hidden md:flex  items-center gap-3 lg:gap-5">
                        <input 
                            type="text" 
                            placeholder="Search" 
                            className="border-2 border-gray-300 w-[200px] lg:w-[300px] px-2 py-1 rounded-md focus:outline-none" 
                        />
                       <Link href='/login'>
                       <button
                            className="border-2 border-blue-700 bg-blue-700 text-white px-2 py-1 rounded-md text-sm lg:text-lg lg:py-1"
                        > 
                            Sign In
                        </button>
                       </Link>
                        <Link href='/signup'>
                        <button
                            className="border-2 border-blue-700 bg-blue-700 text-white px-2 py-1 rounded-md text-sm lg:text-lg lg:py-1"
                        > 
                            Sign Up
                        </button>
                        </Link>
                    </div>
                    )}
                    {isAuthenticated && (
                        <div className="hidden md:flex gap-2 ">
                            <Link href='/profile'><button className="text-blue-500 font-bold">Profile</button></Link>
                            <button>logout</button>
                        </div>
                    )}
                    <div className="md:hidden">
                        <Menu onClick={hanldeopen} className="cursor-pointer" />
                    </div>
                </div>
            </nav>
            {isOpen && (
                <div className="flex flex-col md:hidden mx-4 gap-2 pb-3">
                    <input 
                        type="text" 
                        placeholder="Search" 
                        className="border-2 border-gray-300 w-full px-2 py-1 rounded-md focus:outline-none" 
                    />
                    <Link href='/howitworks'><p className="font-thin text-center text-blue-500">How it works</p>
                    </Link>
                    {!isAuthenticated && (
                        <div className="flex flex-col gap-2">
                            <Link href='/login' className="w-full "><button 
                        className="border-2 border-gray-800 px-4 py-2 w-full text-sm rounded-md"
                    >
                        Login
                    </button></Link>
                    <Link href='/signup'>
                    <button 
                        className="border-2 border-blue-700 bg-blue-700 w-full text-white px-4 py-2 text-sm rounded-md"
                    >
                        Sign up
                    </button>
                    </Link>
                        </div>
                    )}
                    {isAuthenticated && (
                         <div className="flex flex-col items-center justify-center gap-2 ">
                            <Link href='/profile'><button className="text-blue-500 font-bold">Profile</button></Link>
                         <button>logout</button>
                     </div>
                    )}
                </div>
            )}
        </header>
    );
}

export default Navbar;
