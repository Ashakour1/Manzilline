"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  User,
  FileText,
  Calendar,
  Image as ImageIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getFieldAgentById } from "@/services/field-agents.service"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type FieldAgent = {
  id: string
  name: string
  email: string
  phone?: string
  image?: string
  document_image?: string
  createdAt?: string
  updatedAt?: string
}

export default function FieldAgentDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const agentId = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : undefined

  const [agent, setAgent] = useState<FieldAgent | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!agentId) return

    const load = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await getFieldAgentById(agentId)
        setAgent(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load field agent")
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [agentId])

  if (isLoading)
    return (
      <main className="flex-1 p-3 sm:p-4 lg:p-5">
        <div className="mx-auto flex max-w-7xl flex-col gap-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="px-0">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="space-y-4 w-full max-w-2xl">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </main>
    )

  if (error) {
    return (
      <main className="flex-1 p-3 sm:p-4 lg:p-5">
        <div className="mx-auto flex max-w-7xl flex-col gap-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="px-0">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>
          <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        </div>
      </main>
    )
  }

  if (!agent) {
    return null
  }

  return (
    <main className="flex-1 p-3 sm:p-4 lg:p-5">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="px-0">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Field Agent Details</h1>
              <p className="text-sm text-muted-foreground">View complete information about this field agent</p>
            </div>
          </div>
          <Button onClick={() => router.push(`/field-agents/${agentId}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Agent
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Basic details about the field agent</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  {agent.image ? (
                    <Avatar className="h-24 w-24 border-2 border-[#2a6f97]">
                      <AvatarImage src={agent.image} alt={agent.name} />
                      <AvatarFallback className="bg-[#2a6f97] text-white text-xl font-semibold">
                        {agent.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="h-24 w-24 rounded-full border-2 border-[#2a6f97] bg-[#2a6f97]/10 flex items-center justify-center">
                      <User className="h-12 w-12 text-[#2a6f97]" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-foreground">{agent.name}</h2>
                    <p className="text-sm text-muted-foreground mt-1">Field Agent</p>
                  </div>
                </div>

                <Separator />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span className="font-medium">Email</span>
                    </div>
                    <p className="text-sm font-medium text-foreground pl-6">{agent.email}</p>
                  </div>

                  {agent.phone && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span className="font-medium">Phone</span>
                      </div>
                      <p className="text-sm font-medium text-foreground pl-6">{agent.phone}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Documents Card */}
            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
                <CardDescription>Agent documents and verification</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {agent.document_image ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-4 border rounded-lg">
                      <FileText className="h-5 w-5 text-[#2a6f97]" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Verification Document</p>
                        <p className="text-xs text-muted-foreground">Click to view full document</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(agent.document_image, "_blank")}
                      >
                        View Document
                      </Button>
                    </div>
                    <div className="mt-4">
                      <img
                        src={agent.document_image}
                        alt="Verification document"
                        className="w-full rounded-lg border max-h-96 object-contain"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No document uploaded</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Created</span>
                  </div>
                  <p className="text-sm font-medium text-foreground pl-6">
                    {agent.createdAt
                      ? new Date(agent.createdAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "N/A"}
                  </p>
                </div>

                {agent.updatedAt && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Last Updated</span>
                    </div>
                    <p className="text-sm font-medium text-foreground pl-6">
                      {new Date(agent.updatedAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                )}

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ImageIcon className="h-3.5 w-3.5" />
                    <span>Profile Image</span>
                  </div>
                  <Badge variant={agent.image ? "default" : "secondary"} className="ml-6">
                    {agent.image ? "Uploaded" : "Not uploaded"}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <FileText className="h-3.5 w-3.5" />
                    <span>Document</span>
                  </div>
                  <Badge variant={agent.document_image ? "default" : "secondary"} className="ml-6">
                    {agent.document_image ? "Uploaded" : "Not uploaded"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push(`/field-agents/${agentId}/edit`)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Agent
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.back()}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to List
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}

