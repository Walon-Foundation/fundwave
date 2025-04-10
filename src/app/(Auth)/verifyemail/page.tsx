"use client"

import Link from "next/link"
import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import useAuthRedirect from "@/core/hooks/useAuthRedirect"


export default function VerifyEmail() {
  useAuthRedirect()
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center">
            <div className="rounded-full bg-primary/10 p-3">
              <Mail className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Verify your email</CardTitle>
          <CardDescription>We&apos;ve sent a verification link to your email address</CardDescription>
        </CardHeader>
        <CardContent className="text-center text-sm">
          <p className="mb-4">
            Please check your inbox and click on the verification link to complete your registration.
          </p>
          <p className="text-muted-foreground">
            If you don&apos;t see the email, check your spam folder or try resending the verification email.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <Button className="w-full" variant="outline">
            Resend verification email
          </Button>
          <div className="text-center text-sm">
            <Link href="/login" className="text-primary hover:underline">
              Back to login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
