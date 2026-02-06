'use client'

import { useState, useEffect } from 'react'
import { DashboardShell } from '@/components/dashboard/shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  FileBarChart2,
  Users,
  Shield,
  Trash2,
  Check,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'audit',
      title: 'Audit terminé : Recrutement Tech',
      message: 'Votre audit a été complété avec un score de 72%. 2 biais critiques détectés.',
      time: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false,
      priority: 'high',
    },
    {
      id: '2',
      type: 'compliance',
      title: 'Mise à jour réglementaire',
      message: 'Le règlement AI Act entre en vigueur. Vérifiez votre conformité.',
      time: new Date(Date.now() - 5 * 60 * 60 * 1000),
      read: false,
      priority: 'high',
    },
    {
      id: '3',
      type: 'team',
      title: 'Nouveau membre d\'équipe',
      message: 'Marie Dupont a rejoint votre équipe en tant que Data Scientist.',
      time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      read: true,
      priority: 'normal',
    },
    {
      id: '4',
      type: 'info',
      title: 'Nouvelle fonctionnalité disponible',
      message: 'Le Chat AI propulsé par Gemini est maintenant actif. Essayez-le !',
      time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      read: true,
      priority: 'normal',
    },
    {
      id: '5',
      type: 'audit',
      title: 'Rapport prêt à télécharger',
      message: 'Le rapport PDF de votre audit "Scoring Crédit" est disponible.',
      time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      read: true,
      priority: 'normal',
    },
  ])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    )
    toast.success('Notification marquée comme lue')
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
      case 'team':
        return <Users className="h-5 w-5" />
      case 'info':
        return <Info className="h-5 w-5" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  const getIconColor = (type) => {
    switch (type) {
      case 'audit':
        return 'bg-blue-100 text-blue-600'
      case 'compliance':
        return 'bg-orange-100 text-orange-600'
      case 'team':
        return 'bg-green-100 text-green-600'
      case 'info':
        return 'bg-purple-100 text-purple-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  const formatTime = (date) => {
    const now = new Date()
    const diff = now - date
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)

    if (days > 0) return `Il y a ${days} jour${days > 1 ? 's' : ''}`
    if (hours > 0) return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`
    return 'Il y a quelques minutes'
  }

  const unreadNotifications = notifications.filter(n => !n.read)
  const readNotifications = notifications.filter(n => n.read)

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-muted-foreground mt-1">
              {unreadCount > 0 ? `Vous avez ${unreadCount} notification${unreadCount > 1 ? 's' : ''} non lue${unreadCount > 1 ? 's' : ''}` : 'Toutes vos notifications sont à jour'}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              <Check className="h-4 w-4 mr-2" />
              Tout marquer comme lu
            </Button>
          )}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">
              Toutes ({notifications.length})
            </TabsTrigger>
            <TabsTrigger value="unread">
              Non lues ({unreadCount})
              {unreadCount > 0 && (
                <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-primary text-white">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {notifications.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Aucune notification</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {notifications.map((notification) => (
                  <Card key={notification.id} className={cn('transition-all', !notification.read && 'border-primary/50 bg-primary/5')}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className={cn('p-2 rounded-lg', getIconColor(notification.type))}>
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-semibold">{notification.title}</h3>
                              <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                              <p className="text-xs text-muted-foreground mt-2">{formatTime(notification.time)}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  <CheckCircle2 className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteNotification(notification.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="unread" className="space-y-4">
            {unreadNotifications.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-muted-foreground">Aucune notification non lue</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {unreadNotifications.map((notification) => (
                  <Card key={notification.id} className="border-primary/50 bg-primary/5">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className={cn('p-2 rounded-lg', getIconColor(notification.type))}>
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-semibold">{notification.title}</h3>
                              <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                              <p className="text-xs text-muted-foreground mt-2">{formatTime(notification.time)}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                              >
                                <CheckCircle2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteNotification(notification.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  )
}
