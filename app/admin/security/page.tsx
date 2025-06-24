"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge"
import { Alert, AlertDescription } from "../../../components/ui/alert"
import { Key, Activity, AlertTriangle, CheckCircle, XCircle, Users, Lock, Eye, FileText, Clock } from "lucide-react"
import Link from "next/link"

const securityStats = [
  {
    title: "Active Sessions",
    value: "1,234",
    change: "12 new today",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    title: "Failed Logins",
    value: "23",
    change: "-15% from yesterday",
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
  {
    title: "Security Alerts",
    value: "3",
    change: "2 resolved today",
    icon: AlertTriangle,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
  {
    title: "System Health",
    value: "99.9%",
    change: "All systems operational",
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
]

const securityAlerts = [
  {
    id: 1,
    type: "High",
    title: "Multiple failed login attempts",
    description: "User attempted to login 5 times with wrong password",
    time: "2 minutes ago",
    status: "Active",
  },
  {
    id: 2,
    type: "Medium",
    title: "Unusual access pattern detected",
    description: "Admin user logged in from new location",
    time: "1 hour ago",
    status: "Investigating",
  },
  {
    id: 3,
    type: "Low",
    title: "Password policy violation",
    description: "User attempted to set weak password",
    time: "3 hours ago",
    status: "Resolved",
  },
]

const recentActivity = [
  {
    id: 1,
    action: "User login",
    user: "admin@fundwavesl.com",
    ip: "192.168.1.100",
    time: "2024-12-24 10:30:00",
    status: "Success",
  },
  {
    id: 2,
    action: "Password change",
    user: "user@example.com",
    ip: "192.168.1.101",
    time: "2024-12-24 10:25:00",
    status: "Success",
  },
  {
    id: 3,
    action: "Failed login",
    user: "unknown@example.com",
    ip: "192.168.1.102",
    time: "2024-12-24 10:20:00",
    status: "Failed",
  },
]

export default function AdminSecurityPage() {
  const getAlertColor = (type: string) => {
    switch (type) {
      case "High":
        return "bg-red-100 text-red-800 border-red-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Low":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Success":
        return "bg-green-100 text-green-800"
      case "Failed":
        return "bg-red-100 text-red-800"
      case "Active":
        return "bg-red-100 text-red-800"
      case "Resolved":
        return "bg-green-100 text-green-800"
      case "Investigating":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Security Center</h1>
          <p className="text-gray-600">Monitor system security and manage access controls</p>
        </div>
      </div>

      {/* Security Alert */}
      <Alert className="border-yellow-200 bg-yellow-50">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-800">
          <strong>Security Notice:</strong> 3 active security alerts require attention. Review and take action as
          needed.
        </AlertDescription>
      </Alert>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {securityStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Security Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-red-600" />
            </div>
            <CardTitle>Security Logs</CardTitle>
            <CardDescription>View detailed security logs and audit trails</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild className="w-full">
              <Link href="/admin/security/logs">View Logs</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Key className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle>Access Control</CardTitle>
            <CardDescription>Manage user permissions and access rights</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild className="w-full">
              <Link href="/admin/security/access">Manage Access</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle>Audit Trail</CardTitle>
            <CardDescription>Track all system activities and changes</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild className="w-full">
              <Link href="/admin/security/audit">View Audit Trail</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Security Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
            Active Security Alerts
          </CardTitle>
          <CardDescription>Recent security events that require attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {securityAlerts.map((alert) => (
              <div key={alert.id} className={`p-4 rounded-lg border ${getAlertColor(alert.type)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline" className={getAlertColor(alert.type)}>
                        {alert.type}
                      </Badge>
                      <Badge className={getStatusColor(alert.status)}>{alert.status}</Badge>
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1">{alert.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      {alert.time}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm">Resolve</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="w-5 h-5 text-blue-600 mr-2" />
            Recent Security Activity
          </CardTitle>
          <CardDescription>Latest security-related events and actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <Lock className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{activity.action}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{activity.user}</span>
                      <span>•</span>
                      <span>{activity.ip}</span>
                      <span>•</span>
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
                <Badge className={getStatusColor(activity.status)}>{activity.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
