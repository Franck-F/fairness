'use client'

import { useState } from 'react'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardHeader } from '@/components/dashboard/header'
import { cn } from '@/lib/utils'

export function DashboardShell({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      <DashboardSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      <div
        className={cn(
          'transition-all duration-500 ease-in-out min-h-screen flex flex-col',
          'ml-0', // Default mobile margin
          sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-80'
        )}
      >
        <DashboardHeader onMenuClick={() => setMobileSidebarOpen(true)} />

        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
