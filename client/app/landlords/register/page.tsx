"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Mail, Phone, MapPin, User, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react"
import { useState, FormEvent } from "react"
import Link from "next/link"
import { registerLandlord, LandlordRegistrationData } from "@/services/landlords.service"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LandlordRegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<LandlordRegistrationData>({
    name: "",
    email: "",
    phone: "",
    company_name: "",
    address: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

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
      if (!formData.name.trim() || !formData.email.trim()) {
        setErrorMessage("Name and email are required fields")
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

      await registerLandlord({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone?.trim() || undefined,
        company_name: formData.company_name?.trim() || undefined,
        address: formData.address?.trim() || undefined,
      })

      setSubmitStatus("success")
      setFormData({ name: "", email: "", phone: "", company_name: "", address: "" })

   
    
    } catch (error) {
      setSubmitStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Failed to register. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Hero Section - Hidden on success */}
      {submitStatus !== "success" && (
        <section className="pt-16 pb-8">
          <div className="max-w-6xl mx-auto px-4  sm:px-6 lg:px-8">
            <div className="text-start">
              {/* <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-primary" />
              </div> */}
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Register as a Landlord
              </h1>
              <p className="text-lg text-muted-foreground">
                Join Manzilini and start listing your properties. Reach thousands of potential tenants
                and manage your properties efficiently.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Registration Form Section */}
      <section id="registration-form" className="py-4 bg-background border-none">
        <div className="max-w-6xl mx-auto ">
          <div className="">
            {submitStatus === "success" ? (
              <Card className="border-none">
                <CardContent className="pt-12 pb-12">
                  <div className="max-w-2xl mx-auto text-center space-y-6">
                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-12 h-12 text-green-600" />
                    </div>
                    
                    <div>
                      <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                        Registration Successful!
                      </h2>
                      <p className="text-lg text-muted-foreground mb-2">
                        Thank you for registering as a landlord with Manzilini.
                      </p>
                      <p className="text-lg text-muted-foreground">
                        We'll review your application and contact you as soon as possible.
                      </p>
                    </div>

                    <div className="pt-6 space-y-4">
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                          asChild
                          size="lg"
                          className="gap-2"
                        >
                          <Link href="/">
                            <ArrowRight className="w-5 h-5 rotate-180" />
                            Back to Home
                          </Link>
                        </Button>
                        <Button
                          asChild
                          size="lg"
                          variant="outline"
                          className="gap-2"
                        >
                          <Link href="/properties">
                            Browse Properties
                            <ArrowRight className="w-5 h-5" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-none">
                <CardHeader>
                  <CardTitle>Landlord Information</CardTitle>
                  <CardDescription>
                    Please fill in your details to create your landlord account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Error Message */}
                    {submitStatus === "error" && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{errorMessage}</AlertDescription>
                      </Alert>
                    )}

                  {/* Name Field */}
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Full Name <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="pl-10"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email Address <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="pl-10"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  {/* Phone Field */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+254 700 000 000"
                        value={formData.phone}
                        onChange={handleChange}
                        className="pl-10"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  {/* Company Name Field */}
                  <div className="space-y-2">
                    <Label htmlFor="company_name">Company Name</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="company_name"
                        name="company_name"
                        type="text"
                        placeholder="ABC Properties Ltd"
                        value={formData.company_name}
                        onChange={handleChange}
                        className="pl-10"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  {/* Address Field */}
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="address"
                        name="address"
                        type="text"
                        placeholder="123 Main Street, Nairobi, Kenya"
                        value={formData.address}
                        onChange={handleChange}
                        className="pl-10"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary/90"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Registering..." : "Register as Landlord"}
                    </Button>
                  </div>

                    {/* Login Link */}
                    <div className="text-center text-sm text-muted-foreground">
                      Already have an account?{" "}
                      <Link href="/contact" className="text-primary hover:underline">
                        Contact us
                      </Link>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Benefits Section */}
            {/* <div className="mt-8 grid md:grid-cols-3 gap-4">
              <Card className="border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Building2 className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold">List Properties</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Easily list and manage all your rental properties in one place
                  </p>
                </CardContent>
              </Card>
              <Card className="border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <User className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold">Reach Tenants</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Connect with thousands of potential tenants looking for properties
                  </p>
                </CardContent>
              </Card>
              <Card className="border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold">Easy Management</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Streamline your property management with our intuitive platform
                  </p>
                </CardContent>
              </Card>
            </div> */}
          </div>
        </div>
      </section>

      {/* CTA Section */}
    
    </>
  )
}
