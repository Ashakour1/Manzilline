"use client"

import type { ReactNode } from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <DashboardSidebar />
      <div className="relative flex flex-1 flex-col overflow-hidden bg-white">
        <DashboardHeader />
        <div className="flex-1 overflow-y-auto bg-white">{children}</div>
      </div>
    </div>
  )
}
