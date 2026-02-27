'use client'

import { useState, useEffect } from 'react'
import { DashboardShell } from '@/components/dashboard/shell'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/dashboard/page-header'
import { EmptyState } from '@/components/dashboard/empty-state'
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
              title: `Audit termine : ${audit.audit_name}`,
              message: audit.bias_detected
                ? `Score de ${audit.overall_score || 0}%. ${audit.critical_bias_count || 0} biais critique(s) detecte(s).`
                : `Score de ${audit.overall_score || 0}%. Aucun biais majeur detecte.`,
              time: new Date(audit.completed_at || audit.created_at),
              read: false,
              priority: audit.bias_detected ? 'high' : 'normal',
            })

            // Add compliance notification if score is low
            if ((audit.overall_score || 0) < 80) {
              notifs.push({
                id: `compliance-${audit.id}`,
                type: 'compliance',
                title: `Conformite AI Act -- ${audit.audit_name}`,
                message: `Score de ${audit.overall_score || 0}% inferieur au seuil de conformite (80%). Actions recommandees.`,
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
              title: `Echec de l'analyse : ${audit.audit_name}`,
              message: 'L\'analyse de fairness n\'a pas pu aboutir. Verifiez que le backend FastAPI est accessible.',
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
      // Silently handle fetch errors
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
    toast.success('Toutes les notifications marquees comme lues')
  }

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
    toast.success('Notification supprimee')
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
        return 'bg-blue-100 text-blue-600 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20'
      case 'compliance':
        return 'bg-orange-100 text-orange-600 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20'
      case 'info':
        return 'bg-purple-100 text-purple-600 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20'
      default:
        return 'bg-muted text-muted-foreground border-border'
    }
  }

  const formatTime = (date) => {
    const now = new Date()
    const diff = now - date
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)

    if (hours < 1) return 'A l\'instant'
    if (hours < 24) return `Il y a ${hours}h`
    if (days < 7) return `Il y a ${days}j`
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
  }

  return (
    <DashboardShell>
      <div className="space-y-8 max-w-4xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
        {/* Header */}
        <PageHeader
          icon={Bell}
          title=""
          titleHighlight="Notifications"
          description="Alertes et mises a jour basees sur vos audits de fairness."
          actions={
            unreadCount > 0 ? (
              <Button
                variant="outline"
                className="border-border text-foreground rounded-xl"
                onClick={markAllAsRead}
              >
                <Check className="h-4 w-4 mr-2" />
                Tout marquer comme lu ({unreadCount})
              </Button>
            ) : null
          }
        />

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Empty State */}
        {!loading && notifications.length === 0 && (
          <EmptyState
            icon={Inbox}
            title="Aucune notification"
            description="Les notifications apparaitront ici lorsque vos audits seront termines."
          />
        )}

        {/* Notifications List */}
        {!loading && notifications.length > 0 && (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <Card
                key={notification.id}
                className={cn(
                  "p-5 transition-all duration-300 relative overflow-hidden",
                  notification.read
                    ? "bg-card border-border"
                    : "bg-primary/5 border-primary/20"
                )}
              >
                {!notification.read && (
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary rounded-l-xl" />
                )}

                <div className="flex items-start gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-lg border flex items-center justify-center flex-shrink-0",
                    getIconColor(notification.type)
                  )}>
                    {getIcon(notification.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={cn(
                        "font-display font-semibold text-sm",
                        notification.read ? "text-muted-foreground" : "text-foreground"
                      )}>
                        {notification.title}
                      </h4>
                      {notification.priority === 'high' && !notification.read && (
                        <Badge className="bg-red-100 text-red-800 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20 text-xs font-medium">
                          URGENT
                        </Badge>
                      )}
                    </div>
                    <p className={cn(
                      "text-sm",
                      notification.read ? "text-muted-foreground/70" : "text-muted-foreground"
                    )}>
                      {notification.message}
                    </p>
                    <span className="text-xs text-muted-foreground/50 font-medium mt-2 block">
                      {formatTime(notification.time)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-muted-foreground/50 hover:text-red-500"
                      onClick={() => deleteNotification(notification.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
