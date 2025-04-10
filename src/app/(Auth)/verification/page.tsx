"use client"
import { useRouter } from "next/navigation"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import useAuthRedirect from "@/core/hooks/useAuthRedirect"

export default function Verification() {
  const router = useRouter()
  useAuthRedirect()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 p-4">
      <Card className="w-full max-w-md border-blue-200 bg-white shadow-lg">
        <CardHeader className="pb-4 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
            <CheckCircle className="h-12 w-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-blue-800">Account Verified!</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-blue-700">
            Your email has been successfully verified. Your account is now active and you can access all features.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center pb-6 pt-2">
          <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={() => router.push("/login")} >
            login to continue
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
