'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import {
  Brain,
  LayoutDashboard,
  Upload,
  FileBarChart2,
  FileText,
  BarChart3,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Link2,
  Shield,
  Bell,
  User,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigationItems = [
  { name: 'Tableau de Bord', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Nouvel Audit', href: '/dashboard/upload', icon: Upload },
  { name: 'Mes Audits', href: '/dashboard/audits', icon: FileBarChart2 },
  { name: 'Conformite', href: '/dashboard/compliance', icon: Shield },
  { name: 'Rapports', href: '/dashboard/reports', icon: FileText },
  { name: 'Analyse EDA', href: '/dashboard/eda', icon: BarChart3 },
  { name: 'WhatIf Analysis', href: '/dashboard/whatif', icon: Sparkles },
  { name: 'Chat AI', href: '/dashboard/chat', icon: MessageSquare },
  { name: 'Connexions', href: '/dashboard/connections', icon: Link2 },
  { name: 'Equipe', href: '/dashboard/team', icon: Users },
  { name: 'Profil', href: '/dashboard/profile', icon: User },
  { name: 'Notifications', href: '/dashboard/notifications', icon: Bell },
  { name: 'Parametres', href: '/dashboard/settings', icon: Settings },
]

export function DashboardSidebar({ collapsed, onToggle }) {
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  return (
    <div
      className={cn(
        'fixed left-0 top-0 h-screen bg-card border-r transition-all duration-300 z-40',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center justify-center w-full">
            <img
              src="https://customer-assets.emergentagent.com/job_auditiq/artifacts/snxql2e8_logo%20audiot-iq%20big%20without%20bg.png.png"
              alt="AuditIQ Logo"
              className="h-10 object-contain"
            />
          </Link>
        )}
        {collapsed && (
          <img
            src="https://customer-assets.emergentagent.com/job_auditiq/artifacts/snxql2e8_logo%20audiot-iq%20big%20without%20bg.png.png"
            alt="AuditIQ"
            className="h-8 object-contain mx-auto"
          />
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="space-y-1 px-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span className="text-sm font-medium">{item.name}</span>}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* User & Logout */}
      <div className="border-t p-4">
        {!collapsed && user && (
          <div className="mb-3 px-3">
            <p className="text-sm font-medium truncate">{user.user_metadata?.full_name || user.email}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        )}
        <Button
          variant="ghost"
          className={cn('w-full justify-start', collapsed && 'px-0 justify-center')}
          onClick={signOut}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span className="ml-3">Déconnexion</span>}
        </Button>
      </div>

      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-6 bg-background border rounded-full p-1 hover:bg-muted"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
    </div>
  )
}
