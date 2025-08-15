"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Bell, Check, CheckCheck, Trash2, Settings, Filter } from "lucide-react"
import Link from "next/link"

interface Notification {
  id: string
  title: string
  message: string
  type: string
  read: boolean
  createdAt: string
  data?: any
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "New donation received",
    message: "John Doe donated $50 to your campaign 'Help Build School'",
    type: "donation",
    read: false,
    createdAt: "2024-12-24T10:30:00Z",
  },
  {
    id: "2",
    title: "Campaign milestone reached",
    message: "Your campaign has reached 75% of its goal!",
    type: "milestone",
    read: false,
    createdAt: "2024-12-24T09:15:00Z",
  },
  {
    id: "3",
    title: "New comment on campaign",
    message: "Someone left a supportive comment on your campaign",
    type: "comment",
    read: true,
    createdAt: "2024-12-24T08:45:00Z",
  },
  {
    id: "4",
    title: "Campaign approved",
    message: "Your campaign 'Help Build School' has been approved and is now live",
    type: "approval",
    read: true,
    createdAt: "2024-12-23T16:20:00Z",
  },
  {
    id: "5",
    title: "Weekly summary",
    message: "Your campaigns received 12 donations totaling $450 this week",
    type: "summary",
    read: true,
    createdAt: "2024-12-23T09:00:00Z",
  },
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [selectedTab, setSelectedTab] = useState("all")

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = (notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "donation":
        return "bg-green-100 text-green-800"
      case "milestone":
        return "bg-blue-100 text-blue-800"
      case "comment":
        return "bg-purple-100 text-purple-800"
      case "approval":
        return "bg-emerald-100 text-emerald-800"
      case "summary":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredNotifications = notifications.filter((notification) => {
    if (selectedTab === "unread") return !notification.read
    if (selectedTab === "read") return notification.read
    return true
  })

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 mb-6 sm:mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
              <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Notifications</h1>
              <p className="text-sm sm:text-base text-slate-600">Stay updated with your campaign activities</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={markAllAsRead} className="text-xs sm:text-sm bg-transparent">
              <CheckCheck className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Mark All Read</span>
              <span className="sm:hidden">Mark Read</span>
            </Button>
            <Button variant="outline" className="text-xs sm:text-sm bg-transparent">
              <Settings className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Settings</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Notifications</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{notifications.length}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Unread</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{unreadCount}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <span className="text-sm sm:text-base text-red-600 font-bold">{unreadCount}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">This Week</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {
                      notifications.filter((n) => {
                        const weekAgo = new Date()
                        weekAgo.setDate(weekAgo.getDate() - 7)
                        return new Date(n.createdAt) > weekAgo
                      }).length
                    }
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Filter className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg sm:text-xl">Your Notifications</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Recent updates and activities from your campaigns
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="mb-4 sm:mb-6 w-full sm:w-auto">
                <TabsTrigger value="all" className="text-xs sm:text-sm">
                  All ({notifications.length})
                </TabsTrigger>
                <TabsTrigger value="unread" className="text-xs sm:text-sm">
                  Unread ({unreadCount})
                </TabsTrigger>
                <TabsTrigger value="read" className="text-xs sm:text-sm">
                  Read ({notifications.length - unreadCount})
                </TabsTrigger>
              </TabsList>

              <TabsContent value={selectedTab}>
                <div className="space-y-3 sm:space-y-4">
                  {filteredNotifications.length === 0 ? (
                    <div className="text-center py-8 sm:py-12">
                      <Bell className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No notifications</h3>
                      <p className="text-sm sm:text-base text-gray-600">
                        {selectedTab === "unread"
                          ? "You're all caught up! No unread notifications."
                          : "You don't have any notifications yet."}
                      </p>
                    </div>
                  ) : (
                    filteredNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 sm:p-4 border rounded-lg transition-all hover:shadow-md ${
                          !notification.read ? "bg-blue-50 border-blue-200" : "bg-white border-gray-200"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center flex-wrap gap-2 mb-2">
                              <h3 className="font-medium text-slate-900 text-sm sm:text-base truncate">
                                {notification.title}
                              </h3>
                              <Badge className={`${getTypeColor(notification.type)} text-xs`}>
                                {notification.type}
                              </Badge>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                              )}
                            </div>
                            <p className="text-slate-600 mb-2 text-sm sm:text-base leading-relaxed">
                              {notification.message}
                            </p>
                            <p className="text-xs sm:text-sm text-slate-400">
                              {new Date(notification.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                className="p-1 sm:p-2"
                              >
                                <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                              className="text-red-600 hover:text-red-700 p-1 sm:p-2"
                            >
                              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="mt-6 sm:mt-8 text-center">
          <Button asChild variant="outline" className="w-full sm:w-auto bg-transparent">
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
