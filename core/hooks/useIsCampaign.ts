import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { User } from "../types/types";

const useIsCampaign = () => {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("userToken") as string;
    console.log(token)

    if (!token) {
      router.replace("/login"); 
      return;
    }

    try {
      const decodedUser = jwtDecode(token) as User;

      if (!decodedUser?.isCampaign) {
        router.replace("/kyc");
      }
    } catch (err) {
      console.error("Token decoding error:", err);
      router.replace("/login");
    }
  }, [router]); 
};

export default useIsCampaign;
