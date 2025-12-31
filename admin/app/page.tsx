"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Building2, Eye, EyeOff, Fingerprint, Lock, Mail, ShieldCheck, Sparkles, AlertCircle } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Login from "@/services/auth.service"
import { useAuthStore } from "@/store/authStore"
import { useRouter } from "next/navigation"

const perks = [
  {
    icon: ShieldCheck,
    title: "Enterprise-grade security",
    desc: "Encryption, device checks, and smart session lockouts baked in.",
  },
  {
    icon: Building2,
    title: "Operations overview",
    desc: "See rent, maintenance, and balances by landlord and tenant the moment you land.",
  },
  {
    icon: Sparkles,
    title: "One-click workflows",
    desc: "Approve payments, dispatch vendors, and notify landlords and tenants instantly.",
  },
]


export default function Home() {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login } = useAuthStore();

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user starts typing
    if (error) {
      setError(null)
    }
  }


  const HandleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null)
    setIsLoading(true)

    try {
      const data = await Login(formData.email, formData.password);
      
      // Store user data
      login({
        token: data.token,
        name: data.name,
        email: data.email,
        role: data.role,
      });

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Login failed:", error);
      setError(error instanceof Error ? error.message : "Failed to login. Please try again.");
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-[#2a6f97]/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-12 right-12 h-64 w-64 rounded-full bg-[#2a6f97]/5 blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2a6f97]/5 blur-3xl" />
      </div>

      <section className="relative mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-center gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.2fr_1fr] lg:gap-16 lg:px-8 xl:px-12">
        <div className="space-y-8 lg:space-y-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#2a6f97]/20 bg-[#2a6f97]/10 px-4 py-1.5 text-sm font-medium text-[#2a6f97]">
              <ShieldCheck className="h-4 w-4" />
              Secure Admin Portal
            </div>
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-5xl xl:text-6xl">
              Sign in to manage landlords, tenants, and properties
            </h1>
            <p className="max-w-2xl text-base text-gray-600 sm:text-lg">
              Your secure gateway to payments, maintenance, and communications across your management company. Log in
              with your work email to keep every team in sync.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:gap-6">
            {perks.map((perk) => (
              <div
                key={perk.title}
                className="group rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#2a6f97]/40 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#2a6f97]/10 text-[#2a6f97] transition-colors group-hover:bg-[#2a6f97]/20">
                  <perk.icon className="h-6 w-6" />
                </div>
                <p className="mt-4 text-base font-semibold text-gray-900">{perk.title}</p>
                <p className="mt-1.5 text-sm text-gray-600 leading-relaxed">{perk.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <Card className=" shadow-none ">
          <CardHeader className="space-y-3 pb-6">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-2xl font-bold text-gray-900 sm:text-3xl">Log in</CardTitle>
              <Badge variant="outline" className="border-[#2a6f97]/30 bg-[#2a6f97]/10 text-[#2a6f97] font-medium">
                Admin
              </Badge>
            </div>
            <CardDescription className="text-gray-600">Sign in with your company credentials to continue.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form className="space-y-5" onSubmit={HandleSubmit}>
              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle className="text-red-800">Login Failed</AlertTitle>
                  <AlertDescription className="text-red-700">
                    {error}
                  </AlertDescription>
                </Alert>
              )}
              <Button 
                variant="outline" 
                className="w-full justify-center gap-2 h-11 border-gray-300 hover:bg-gray-50" 
                type="button"
              >
                <Fingerprint className="h-4 w-4" />
                Sign in with fingerprint
              </Button>

              <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-gray-500">
                <div className="h-px flex-1 bg-gray-300" />
                <span>or with email</span>
                <div className="h-px flex-1 bg-gray-300" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                <InputGroup 
                  className="h-12 rounded-lg bg-white border-gray-300 focus-within:border-[#2a6f97] focus-within:ring-2 focus-within:ring-[#2a6f97]/20 transition-all"
                >
                  <InputGroupAddon>
                    <Mail className="h-4 w-4 text-gray-400" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@company.com"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="placeholder:text-gray-400"
                  />
                </InputGroup>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                <InputGroup 
                  className="h-12 rounded-lg bg-white border-gray-300 focus-within:border-[#2a6f97] focus-within:ring-2 focus-within:ring-[#2a6f97]/20 transition-all"
                >
                  <InputGroupAddon>
                    <Lock className="h-4 w-4 text-gray-400" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="placeholder:text-gray-400"
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      size="sm"
                      variant="ghost"
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      <span className="ml-1.5 text-xs">{showPassword ? "Hide" : "Show"}</span>
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
                <p className="text-xs text-gray-500">
                  At least 8 characters. SSO/MFA enforced for sensitive actions.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <Checkbox id="remember" name="remember" />
                  <span>Keep me signed in</span>
                </label>
                <Button variant="link" className="h-auto px-0 text-sm text-[#2a6f97] hover:text-[#1f5a7a]" asChild>
                  <Link href="/reset-password">Forgot password?</Link>
                </Button>
              </div>
              <Button 
                className="w-full h-11 bg-[#2a6f97] hover:bg-[#1f5a7a] text-white font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed" 
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Continue"}
                {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
