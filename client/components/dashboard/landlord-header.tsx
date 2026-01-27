'use client'

import { Bell, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"

export function LandlordHeader() {
  const pathname = usePathname()

  const getPageTitle = () => {
    const routes: Record<string, string> = {
      '/landlords/dashboard': 'Dashboard',
      '/landlords/properties': 'My Properties',
      '/landlords/documents': 'Documents',
      '/landlords/settings': 'Settings',
    }
    
    for (const [path, title] of Object.entries(routes)) {
      if (pathname === path || pathname.startsWith(`${path}/`)) {
        return title
      }
    }
    return 'Dashboard'
  }

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-gray-900">
            {getPageTitle()}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            title="Help"
          >
            <HelpCircle className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative h-8 w-8 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-red-500" />
          </Button>
        </div>
      </div>
    </header>
  )
}
