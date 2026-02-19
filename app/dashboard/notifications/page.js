'use client'

import { useState, useEffect } from 'react'
import { DashboardShell } from '@/components/dashboard/shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  FileBarChart2,
  Shield,
  Trash2,
  Check,
  ChevronRight,
  Loader2,
  MailOpen,
  Inbox
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { useAuth } from '@/lib/auth-context'

export default function NotificationsPage() {
  const { session } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.access_token) {
      generateNotificationsFromAudits()
    }
  }, [session])

  // Derive notifications from real audit results
  const generateNotificationsFromAudits = async () => {
    try {
      const response = await fetch('/api/audits', {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        const audits = data.audits || []
        const notifs = []

        audits.forEach((audit) => {
          if (audit.status === 'completed') {
            notifs.push({
              id: `audit-${audit.id}`,
              type: 'audit',
              title: `Audit terminé : ${audit.audit_name}`,
              message: audit.bias_detected
                ? `Score de ${audit.overall_score || 0}%. ${audit.critical_bias_count || 0} biais critique(s) détecté(s).`
                : `Score de ${audit.overall_score || 0}%. Aucun biais majeur détecté.`,
              time: new Date(audit.completed_at || audit.created_at),
              read: false,
              priority: audit.bias_detected ? 'high' : 'normal',
            })

            // Add compliance notification if score is low
            if ((audit.overall_score || 0) < 80) {
              notifs.push({
                id: `compliance-${audit.id}`,
                type: 'compliance',
                title: `Conformité AI Act — ${audit.audit_name}`,
                message: `Score de ${audit.overall_score || 0}% inférieur au seuil de conformité (80%). Actions recommandées.`,
                time: new Date(audit.completed_at || audit.created_at),
                read: false,
                priority: 'high',
              })
            }
          }

          if (audit.status === 'failed') {
            notifs.push({
              id: `failed-${audit.id}`,
              type: 'info',
              title: `Échec de l'analyse : ${audit.audit_name}`,
              message: 'L\'analyse de fairness n\'a pas pu aboutir. Vérifiez que le backend FastAPI est accessible.',
              time: new Date(audit.created_at),
              read: false,
              priority: 'high',
            })
          }
        })

        // Sort by time, most recent first
        notifs.sort((a, b) => b.time - a.time)
        setNotifications(notifs)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    toast.success('Toutes les notifications marquées comme lues')
  }

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
    toast.success('Notification supprimée')
  }

  const getIcon = (type) => {
    switch (type) {
      case 'audit':
        return <FileBarChart2 className="h-5 w-5" />
      case 'compliance':
        return <Shield className="h-5 w-5" />
      case 'info':
        return <Info className="h-5 w-5" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  const getIconColor = (type) => {
    switch (type) {
      case 'audit':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      case 'compliance':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/20'
      case 'info':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20'
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
    }
  }

  const formatTime = (date) => {
    const now = new Date()
    const diff = now - date
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)

    if (hours < 1) return 'À l\'instant'
    if (hours < 24) return `Il y a ${hours}h`
    if (days < 7) return `Il y a ${days}j`
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
  }

  return (
    <DashboardShell>
      <div className="space-y-10 max-w-4xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-white leading-none">
              <span className="text-brand-primary">Notifications</span>
            </h1>
            <p className="text-white/40 font-display font-medium text-lg max-w-2xl">
              Alertes et mises à jour basées sur vos audits de fairness.
            </p>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              className="border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-xl"
              onClick={markAllAsRead}
            >
              <Check className="h-4 w-4 mr-2" />
              Tout marquer comme lu ({unreadCount})
            </Button>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
          </div>
        )}

        {/* Empty State */}
        {!loading && notifications.length === 0 && (
          <div className="glass-card p-16 text-center rounded-[3rem] border-white/5 bg-white/[0.02]">
            <Inbox className="h-16 w-16 text-white/10 mx-auto mb-4" />
            <h3 className="text-xl font-display font-black text-white/40 mb-2">Aucune notification</h3>
            <p className="text-white/20 font-display font-medium text-sm max-w-md mx-auto">
              Les notifications apparaîtront ici lorsque vos audits seront terminés.
            </p>
          </div>
        )}

        {/* Notifications List */}
        {!loading && notifications.length > 0 && (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "glass-card rounded-2xl p-6 border transition-all duration-300 group relative overflow-hidden",
                  notification.read
                    ? "bg-white/[0.02] border-white/5"
                    : "bg-white/[0.05] border-brand-primary/20 shadow-lg shadow-brand-primary/5"
                )}
              >
                {!notification.read && (
                  <div className="absolute top-0 left-0 w-1 h-full bg-brand-primary rounded-l-2xl" />
                )}

                <div className="flex items-start gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0",
                    getIconColor(notification.type)
                  )}>
                    {getIcon(notification.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={cn(
                        "font-display font-black text-sm",
                        notification.read ? "text-white/60" : "text-white"
                      )}>
                        {notification.title}
                      </h4>
                      {notification.priority === 'high' && !notification.read && (
                        <Badge className="bg-red-500/10 text-red-400 border-red-500/20 text-[9px] font-black">
                          URGENT
                        </Badge>
                      )}
                    </div>
                    <p className={cn(
                      "text-sm",
                      notification.read ? "text-white/30" : "text-white/50"
                    )}>
                      {notification.message}
                    </p>
                    <span className="text-[10px] text-white/20 font-black uppercase tracking-widest mt-2 block">
                      {formatTime(notification.time)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-white/30 hover:text-white"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-white/20 hover:text-red-400"
                      onClick={() => deleteNotification(notification.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
