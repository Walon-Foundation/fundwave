"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const useAuthRedirect = () => {
  const router = useRouter();
  const token = Cookies.get("sessionToken");

  useEffect(() => {
    if (token) {
      router.push("/campaign"); 
    }
  }, [token, router]);
};

export default useAuthRedirect;