"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LandlordPropertiesPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            My Properties
          </h1>
          <p className="text-gray-600">
            Manage your property listings
          </p>
        </div>
        <Button className="bg-gray-900 hover:bg-gray-800 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Property
        </Button>
      </div>

      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle>Properties</CardTitle>
          <CardDescription>Your property listings will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <Building2 className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium mb-2">No properties yet</p>
            <p className="text-sm text-gray-400">
              Start by adding your first property
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
