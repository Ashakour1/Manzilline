"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Lock, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react"
import { useState, FormEvent } from "react"
import Link from "next/link"
import Image from "next/image"
import { loginLandlord, LandlordLoginData } from "@/services/landlords.service"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/authStore"

export default function LandlordLoginPage() {
  const [formData, setFormData] = useState<LandlordLoginData>({
    email: "",
    password: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const router = useRouter()
  const { login } = useAuthStore()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (submitStatus === "error") {
      setSubmitStatus("idle")
      setErrorMessage("")
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")
    setErrorMessage("")

    try {
      // Validate required fields
      if (!formData.email.trim() || !formData.password.trim()) {
        setErrorMessage("Email and password are required fields")
        setSubmitStatus("error")
        setIsSubmitting(false)
        return
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        setErrorMessage("Please enter a valid email address")
        setSubmitStatus("error")
        setIsSubmitting(false)
        return
      }

      const response = await loginLandlord({
        email: formData.email.trim(),
        password: formData.password.trim(),
      })

      // Store user info in auth store
      if (response.token) {
        login({
          _id: response._id,
          name: response.name,
          email: response.email,
          role: response.role,
          status: response.status,
          token: response.token,
        })
      }

      setSubmitStatus("success")
      setFormData({ email: "", password: "" })
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push("/landlords/dashboard")
      }, 2000)
    
    } catch (error) {
      setSubmitStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Failed to login. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 py-18">
        {/* Logo */}
        <div className="mb-8">
          <Link href="/">
            <Image src="/icon-logo.png" alt="Manzilini" width={100} height={100} />
          </Link>
        </div>

        {/* Title and Subtitle */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back
          </h1>
          <p className="text-sm text-gray-600">
            Sign in to your landlord account to manage your properties.
          </p>
        </div>

        {submitStatus === "success" ? (
          <Card className="border-none shadow-none">
            <CardContent className="pt-12 pb-12">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Login Successful!
                  </h2>
                  <p className="text-sm text-gray-600 mb-2">
                    You have successfully logged in to your account.
                  </p>
                  <p className="text-sm text-gray-600">
                    Redirecting you to the homepage...
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Message */}
              {submitStatus === "error" && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="pl-10 border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="pl-10 border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing in..." : "Sign in"}
                </Button>
              </div>

              {/* Register Link */}
              <div className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <Link href="/landlords/register" className="text-gray-900 hover:underline font-medium">
                  Create account
                </Link>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
