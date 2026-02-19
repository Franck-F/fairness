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
  { name: 'Conformite', href: '/dashboard/compliance', icon: Shield },
  { name: 'Rapports', href: '/dashboard/reports', icon: FileText },
  { name: 'Analyse', href: '/dashboard/data-science', icon: BarChart3 },
  { name: 'WhatIf Analysis', href: '/dashboard/whatif', icon: Sparkles },
  { name: 'Chat AI', href: '/dashboard/chat', icon: MessageSquare },
  { name: 'Connexions', href: '/dashboard/connections', icon: Link2 },
  { name: 'Equipe', href: '/dashboard/team', icon: Users },
  { name: 'Profil', href: '/dashboard/profile', icon: User },
  { name: 'Notifications', href: '/dashboard/notifications', icon: Bell },
  { name: 'Parametres', href: '/dashboard/settings', icon: Settings },
]

export function DashboardSidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] lg:hidden transition-opacity duration-500"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 h-screen p-4 lg:p-6 transition-all duration-500 z-50',
          collapsed ? 'w-20' : 'w-80',
          // Mobile classes
          'max-w-[85vw]',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="lg:slanted-sidebar h-full glass-card rounded-r-3xl lg:rounded-3xl flex flex-col lg:glow-border overflow-hidden relative group/sidebar">
          {/* Decorative background gradients for nested glass feel */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none group-hover/sidebar:bg-brand-primary/20 transition-all duration-700" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-brand-cotton/10 rounded-full blur-3xl pointer-events-none group-hover/sidebar:bg-brand-cotton/20 transition-all duration-700" />

          {/* Header */}
          <div className={cn(
            "p-8 mb-4 flex items-center transition-all duration-500",
            collapsed ? "justify-center" : "gap-4"
          )}>
            <div className="relative group/logo">
              <div className="absolute -inset-2 bg-brand-primary/20 rounded-xl blur-md opacity-0 group-hover/logo:opacity-100 transition-opacity" />
              <div className="relative w-11 h-11 bg-gradient-to-br from-brand-primary to-brand-cotton rounded-xl flex items-center justify-center flex-shrink-0 shadow-xl shadow-brand-primary/30 transform transition-transform duration-500 group-hover/logo:scale-110 group-hover/logo:rotate-3">
                <Brain className="h-6 w-6 text-white" />
              </div>
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <h1 className="text-2xl font-display font-black tracking-tighter text-white leading-none">
                  AuditIQ
                </h1>
                <span className="text-[10px] text-brand-primary font-black uppercase tracking-[0.2em] mt-1 ml-0.5">Premium</span>
              </div>
            )}

            {/* Mobile Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden ml-auto text-white/40 hover:text-white"
              onClick={onMobileClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto scrollbar-none relative z-10">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-500 group/nav relative overflow-hidden',
                    isActive
                      ? 'text-white bg-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.1)]'
                      : 'text-white/50 hover:text-white hover:bg-white/5'
                  )}
                >
                  {/* Active Glow Backdrop */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/20 to-transparent opacity-50" />
                  )}

                  <item.icon className={cn(
                    "h-5 w-5 transition-all duration-500 relative z-10",
                    isActive
                      ? "text-brand-primary scale-110 drop-shadow-[0_0_8px_rgba(226,8,161,0.5)]"
                      : "group-hover/nav:text-brand-primary group-hover/nav:scale-110"
                  )} />

                  {!collapsed && (
                    <span className={cn(
                      "font-display font-bold text-sm tracking-wide relative z-10 transition-all duration-500",
                      isActive ? "translate-x-1" : "group-hover/nav:translate-x-1"
                    )}>
                      {item.name}
                    </span>
                  )}

                  {/* Active Indicator Bar */}
                  {isActive && (
                    <div className="absolute left-0 w-1.5 h-8 bg-brand-primary rounded-r-full shadow-[0_0_15px_rgba(226,8,161,0.8)] z-20" />
                  )}

                  {/* Hover Particle Effect (CSS only) */}
                  <div className="absolute right-4 w-1 h-1 bg-brand-primary rounded-full opacity-0 group-hover/nav:opacity-40 transition-opacity blur-[1px]" />
                </Link>
              )
            })}
          </nav>

          {/* User Profile Section (Premium Card) */}
          <div className="p-4 mt-auto relative z-10">
            <div className={cn(
              "glass-card border-white/5 bg-white/5 rounded-3xl p-3 transition-all duration-500 mb-4",
              collapsed ? "p-1.5" : "hover:bg-white/10 hover:border-white/10 shadow-lg"
            )}>
              {!collapsed ? (
                <div className="flex items-center gap-3">
                  <div className="relative group/avatar">
                    <div className="absolute -inset-1 bg-gradient-to-tr from-brand-primary to-brand-cotton rounded-full blur-[2px] opacity-70 animate-pulse" />
                    <div className="relative w-11 h-11 rounded-full border-2 border-brand-violet/50 overflow-hidden bg-brand-violet/30">
                      <img
                        src={user?.user_metadata?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Franck"}
                        alt="Profile"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover/avatar:scale-110"
                      />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-display font-black text-white truncate group-hover/avatar:text-brand-primary transition-colors">
                      {user?.user_metadata?.full_name || 'Franck L.'}
                    </p>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      <p className="text-[9px] text-white/40 uppercase font-black tracking-widest truncate">
                        Senior Lead Analyst
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center py-1">
                  <div className="relative w-10 h-10 rounded-full border-2 border-brand-primary/30 overflow-hidden shadow-lg shadow-brand-primary/10">
                    <img
                      src={user?.user_metadata?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Franck"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {!collapsed && (
                <div className="mt-3 pt-3 border-t border-white/5 flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-[10px] font-bold uppercase tracking-wider text-white/60 hover:text-white"
                    asChild
                  >
                    <Link href="/dashboard/settings">
                      <Settings className="h-3 w-3 mr-1.5" />
                      Stats
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-xl bg-red-400/5 hover:bg-red-400/10 text-red-400/40 hover:text-red-400 transition-colors"
                    onClick={signOut}
                  >
                    <LogOut className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>

            {collapsed && (
              <Button
                variant="ghost"
                className="w-full p-0 h-10 rounded-xl bg-red-400/5 hover:bg-red-400/10 text-red-400/40 hover:text-red-400"
                onClick={signOut}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Improved Toggle button */}
          <button
            onClick={onToggle}
            className="absolute -right-3 top-10 bg-brand-violet border border-white/10 rounded-full w-7 h-7 hidden lg:flex items-center justify-center hover:bg-brand-primary transition-all duration-500 text-white/60 hover:text-white shadow-xl shadow-black/50 z-50 group/toggle"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4 transform group-hover/toggle:translate-x-0.5 transition-transform" />
            ) : (
              <ChevronLeft className="h-4 w-4 transform group-hover/toggle:-translate-x-0.5 transition-transform" />
            )}
          </button>
        </div>
      </aside>
    </>
  )
}
