'use client'

import { useState } from 'react'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardHeader } from '@/components/dashboard/header'
import { cn } from '@/lib/utils'

export function DashboardShell({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <DashboardSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      <div
        className={cn(
          'transition-all duration-300 min-h-screen flex flex-col',
          'ml-0',
          sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'
        )}
      >
        <DashboardHeader onMenuClick={() => setMobileSidebarOpen(true)} />

        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
