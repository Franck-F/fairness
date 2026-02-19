'use client'

import { Bell, Search, Menu } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function DashboardHeader({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 bg-transparent py-4 lg:py-8 px-4 lg:px-12 pointer-events-none">
      <div className="flex items-center gap-4 lg:gap-6 pointer-events-auto">
        {/* Mobile Menu Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden w-11 h-11 glass-card rounded-xl text-white/70 hover:text-white"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>


        {/* Spacer for mobile search hidden */}
        <div className="sm:hidden flex-1" />

        {/* Notifications */}
        <button className="w-11 h-11 lg:w-12 lg:h-12 glass-card rounded-full flex items-center justify-center hover:bg-brand-primary/20 transition-all group">
          <Bell className="h-5 w-5 text-white/70 group-hover:text-white transition-colors" />
        </button>
      </div>
    </header>
  )
}
