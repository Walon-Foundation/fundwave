"use client"
import { useRouter } from "next/navigation"
import { useEffect } from "react";


export default function Verification() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push("/login");
        },2000)
        
        return () => {
            clearTimeout(timer);
        }
    }, [router])
  return (
    <div>account verified</div>
  )
}
