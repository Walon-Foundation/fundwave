"use client"

import { useState, useEffect } from "react"
import { Bell, X, DollarSign, MessageCircle, TrendingUp, CheckCircle, AlertTriangle } from "lucide-react"

interface Notification {
  id: string
  type: "donation" | "comment" | "milestone" | "update" | "system" | "achievement"
  title: string
  message: string
  timestamp: string
  read: boolean
  actionUrl?: string
  data?: any
}

interface RealTimeNotificationsProps {
  userId: string
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left"
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "donation",
    title: "New Donation Received!",
    message: "Mohamed S. donated SLL 50,000 to your Clean Water campaign",
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    read: false,
    actionUrl: "/campaigns/1",
    data: { amount: 50000, donor: "Mohamed S.", campaignId: "1" },
  },
  {
    id: "2",
    type: "milestone",
    title: "Milestone Reached! 🎉",
    message: "Your Youth Skills Training campaign reached 50% funding!",
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    read: false,
    actionUrl: "/campaigns/2",
    data: { percentage: 50, campaignId: "2" },
  },
  {
    id: "3",
    type: "comment",
    title: "New Comment",
    message: "Fatima K. commented on your Clean Water campaign",
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    read: true,
    actionUrl: "/campaigns/1#comments",
    data: { commenter: "Fatima K.", campaignId: "1" },
  },
]

export default function RealTimeNotifications({ userId, position = "top-right" }: RealTimeNotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [isOpen, setIsOpen] = useState(false)
  const [newNotificationCount, setNewNotificationCount] = useState(0)

  useEffect(() => {
    // Simulate real-time notifications
    const interval = setInterval(() => {
      // Randomly add new notifications
      if (Math.random() > 0.7) {
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: ["donation", "comment", "milestone"][Math.floor(Math.random() * 3)] as any,
          title: "New Activity!",
          message: "Something exciting happened on your campaign",
          timestamp: new Date().toISOString(),
          read: false,
          actionUrl: "/campaigns/1",
        }

        setNotifications((prev) => [newNotification, ...prev.slice(0, 9)])
        setNewNotificationCount((prev) => prev + 1)

        // Show toast notification
        showToastNotification(newNotification)
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const showToastNotification = (notification: Notification) => {
    // Create and show toast notification
    const toast = document.createElement("div")
    toast.className = `fixed ${getPositionClasses(position)} z-50 bg-white rounded-lg shadow-lg border p-4 max-w-sm animate-slide-in`

    toast.innerHTML = `
      <div class="flex items-start space-x-3">
        <div class="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
          ${getToastNotificationIcon(notification.type)}
        </div>
        <div class="flex-1">
          <h4 class="font-medium text-slate-900 text-sm">${notification.title}</h4>
          <p class="text-sm text-slate-600 mt-1">${notification.message}</p>
        </div>
        <button onclick="this.parentElement.parentElement.remove()" class="text-slate-400 hover:text-slate-600">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    `

    document.body.appendChild(toast)

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove()
      }
    }, 5000)
  }

  const getPositionClasses = (pos: string) => {
    switch (pos) {
      case "top-right":
        return "top-4 right-4"
      case "top-left":
        return "top-4 left-4"
      case "bottom-right":
        return "bottom-4 right-4"
      case "bottom-left":
        return "bottom-4 left-4"
      default:
        return "top-4 right-4"
    }
  }

  const getToastNotificationIcon = (type: string) => {
    switch (type) {
      case "donation":
        return '<svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path></svg>'
      case "comment":
        return '<svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>'
      case "milestone":
        return '<svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>'
      default:
        return '<svg class="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5v-5zM4 19h5v-5H4v5z"></path></svg>'
    }
  }

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === notificationId ? { ...notif, read: true } : notif)))
    setNewNotificationCount((prev) => Math.max(0, prev - 1))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
    setNewNotificationCount(0)
  }

  const deleteNotification = (notificationId: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== notificationId))
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "donation":
        return <DollarSign className="w-4 h-4 text-green-600" />
      case "comment":
        return <MessageCircle className="w-4 h-4 text-blue-600" />
      case "milestone":
        return <TrendingUp className="w-4 h-4 text-purple-600" />
      case "update":
        return <Bell className="w-4 h-4 text-indigo-600" />
      case "achievement":
        return <CheckCircle className="w-4 h-4 text-yellow-600" />
      case "system":
        return <AlertTriangle className="w-4 h-4 text-orange-600" />
      default:
        return <Bell className="w-4 h-4 text-slate-600" />
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold text-slate-900">Notifications</h3>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button onClick={markAllAsRead} className="text-sm text-indigo-600 hover:text-indigo-800">
                  Mark all read
                </button>
              )}
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                    !notification.read ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4
                            className={`text-sm font-medium ${!notification.read ? "text-slate-900" : "text-slate-700"}`}
                          >
                            {notification.title}
                          </h4>
                          <p className="text-sm text-slate-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-slate-500 mt-2">{formatTimeAgo(notification.timestamp)}</p>
                        </div>
                        <div className="flex items-center space-x-1 ml-2">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-indigo-600 hover:text-indigo-800 text-xs"
                            >
                              Mark read
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="text-slate-400 hover:text-slate-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      {notification.actionUrl && (
                        <button
                          onClick={() => {
                            window.location.href = notification.actionUrl!
                            markAsRead(notification.id)
                          }}
                          className="text-xs text-indigo-600 hover:text-indigo-800 mt-2"
                        >
                          View Details →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-slate-900 mb-2">No notifications</h4>
                <p className="text-slate-600">You're all caught up! We'll notify you when something new happens.</p>
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t bg-slate-50">
              <button className="w-full text-center text-sm text-indigo-600 hover:text-indigo-800">
                View All Notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
