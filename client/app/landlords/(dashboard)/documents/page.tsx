"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LandlordDocumentsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Documents
          </h1>
          <p className="text-gray-600">
            Manage your property documents
          </p>
        </div>
        <Button className="bg-gray-900 hover:bg-gray-800 text-white">
          <Upload className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </div>

      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle>Documents</CardTitle>
          <CardDescription>Your documents will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium mb-2">No documents yet</p>
            <p className="text-sm text-gray-400">
              Upload your first document to get started
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
