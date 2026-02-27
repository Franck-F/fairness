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
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigationItems = [
  { name: 'Tableau de Bord', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Nouvel Audit', href: '/dashboard/upload', icon: Upload },
  { name: 'Mes Audits', href: '/dashboard/audits', icon: FileBarChart2 },
  { name: 'Conformité', href: '/dashboard/compliance', icon: Shield },
  { name: 'Rapports', href: '/dashboard/reports', icon: FileText },
  { name: 'Analyse', href: '/dashboard/data-science', icon: BarChart3 },
  { name: 'Analyse WhatIf', href: '/dashboard/whatif', icon: Sparkles },
  { name: 'Assistant IA', href: '/dashboard/chat', icon: MessageSquare },
  { name: 'Connexions', href: '/dashboard/connections', icon: Link2 },
  { name: 'Équipe', href: '/dashboard/team', icon: Users },
  { name: 'Profil', href: '/dashboard/profile', icon: User },
  { name: 'Notifications', href: '/dashboard/notifications', icon: Bell },
  { name: 'Paramètres', href: '/dashboard/settings', icon: Settings },
]

export function DashboardSidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[45] lg:hidden transition-opacity duration-300"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 h-screen transition-all duration-300 z-50',
          collapsed ? 'w-20' : 'w-72',
          'max-w-[85vw]',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="h-full bg-sidebar border-r border-sidebar-border flex flex-col overflow-hidden">
          {/* Header */}
          <div className={cn(
            "p-6 flex items-center transition-all duration-300",
            collapsed ? "justify-center" : "gap-3"
          )}>
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <Brain className="h-5 w-5 text-primary-foreground" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <h1 className="text-xl font-display font-bold tracking-tight text-sidebar-foreground leading-none">
                  AuditIQ
                </h1>
                <span className="text-[10px] text-primary font-semibold uppercase tracking-widest mt-0.5">Premium</span>
              </div>
            )}

            {/* Mobile Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden ml-auto text-sidebar-foreground/60 hover:text-sidebar-foreground"
              onClick={onMobileClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto scrollbar-thin">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 group/nav relative',
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                      : 'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
                  )}
                >
                  {isActive && (
                    <div className="absolute left-0 w-1 h-6 bg-primary rounded-r-full" />
                  )}

                  <item.icon className={cn(
                    "h-[18px] w-[18px] flex-shrink-0 transition-colors",
                    isActive ? "text-primary" : "group-hover/nav:text-primary"
                  )} />

                  {!collapsed && (
                    <span className="text-sm truncate">
                      {item.name}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* User Profile Section */}
          <div className="p-3 mt-auto border-t border-sidebar-border">
            <div className={cn(
              "rounded-lg p-3 transition-colors",
              collapsed ? "p-2" : ""
            )}>
              {!collapsed ? (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full border border-sidebar-border overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={user?.user_metadata?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Franck"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-sidebar-foreground truncate">
                      {user?.user_metadata?.full_name || 'Utilisateur'}
                    </p>
                    <p className="text-xs text-sidebar-foreground/50 truncate">
                      {user?.email || ''}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center">
                  <div className="w-9 h-9 rounded-full border border-sidebar-border overflow-hidden bg-muted">
                    <img
                      src={user?.user_metadata?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Franck"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {!collapsed && (
                <div className="mt-3 pt-3 border-t border-sidebar-border flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 h-8 rounded-lg text-xs text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                    asChild
                  >
                    <Link href="/dashboard/settings">
                      <Settings className="h-3.5 w-3.5 mr-1.5" />
                      Paramètres
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-lg text-destructive/60 hover:text-destructive hover:bg-destructive/10"
                    onClick={signOut}
                  >
                    <LogOut className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </div>

            {collapsed && (
              <Button
                variant="ghost"
                className="w-full p-0 h-9 rounded-lg text-destructive/60 hover:text-destructive hover:bg-destructive/10 mt-2"
                onClick={signOut}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Toggle button */}
          <button
            onClick={onToggle}
            className="absolute -right-3 top-10 bg-card border border-border rounded-full w-6 h-6 hidden lg:flex items-center justify-center hover:bg-accent transition-colors text-muted-foreground hover:text-foreground shadow-sm z-50"
          >
            {collapsed ? (
              <ChevronRight className="h-3.5 w-3.5" />
            ) : (
              <ChevronLeft className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </aside>
    </>
  )
}
