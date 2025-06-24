"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Activity,
  Search,
  Filter,
  Download,
  Calendar,
  User,
  Settings,
  FileText,
  Shield,
  AlertTriangle,
  Clock,
} from "lucide-react"

const auditStats = [
  {
    title: "Total Events",
    value: "15,234",
    change: "+234 today",
    icon: Activity,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    title: "Critical Events",
    value: "12",
    change: "3 in last hour",
    icon: AlertTriangle,
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
  {
    title: "User Actions",
    value: "8,901",
    change: "+156 today",
    icon: User,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    title: "System Changes",
    value: "45",
    change: "2 pending review",
    icon: Settings,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
]

const auditLogs = [
  {
    id: 1,
    timestamp: "2024-12-24 10:30:15",
    user: "admin@fundwavesl.com",
    action: "User Created",
    resource: "User Management",
    details: "Created new user account for john.doe@example.com",
    ip: "192.168.1.100",
    severity: "Info",
    status: "Success",
  },
  {
    id: 2,
    timestamp: "2024-12-24 10:25:42",
    user: "jane@fundwavesl.com",
    action: "Campaign Approved",
    resource: "Campaign Management",
    details: "Approved campaign 'Help Build School in Freetown'",
    ip: "192.168.1.101",
    severity: "Info",
    status: "Success",
  },
  {
    id: 3,
    timestamp: "2024-12-24 10:20:33",
    user: "system",
    action: "Security Alert",
    resource: "Security System",
    details: "Multiple failed login attempts detected from IP 192.168.1.200",
    ip: "192.168.1.200",
    severity: "High",
    status: "Alert",
  },
  {
    id: 4,
    timestamp: "2024-12-24 10:15:18",
    user: "mike@fundwavesl.com",
    action: "Settings Updated",
    resource: "System Settings",
    details: "Updated payment gateway configuration",
    ip: "192.168.1.102",
    severity: "Medium",
    status: "Success",
  },
  {
    id: 5,
    timestamp: "2024-12-24 10:10:05",
    user: "admin@fundwavesl.com",
    action: "User Suspended",
    resource: "User Management",
    details: "Suspended user account for policy violation",
    ip: "192.168.1.100",
    severity: "High",
    status: "Success",
  },
  {
    id: 6,
    timestamp: "2024-12-24 10:05:22",
    user: "sarah@fundwavesl.com",
    action: "Campaign Rejected",
    resource: "Campaign Management",
    details: "Rejected campaign for violating community guidelines",
    ip: "192.168.1.103",
    severity: "Medium",
    status: "Success",
  },
]

export default function AdminAuditTrailPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [actionFilter, setActionFilter] = useState("all")

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High":
        return "bg-red-100 text-red-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Info":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Success":
        return "bg-green-100 text-green-800"
      case "Failed":
        return "bg-red-100 text-red-800"
      case "Alert":
        return "bg-orange-100 text-orange-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getActionIcon = (action: string) => {
    if (action.includes("User")) return <User className="w-4 h-4" />
    if (action.includes("Campaign")) return <FileText className="w-4 h-4" />
    if (action.includes("Settings")) return <Settings className="w-4 h-4" />
    if (action.includes("Security")) return <Shield className="w-4 h-4" />
    return <Activity className="w-4 h-4" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Trail</h1>
          <p className="text-gray-600">Track all system activities and changes</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Logs
          </Button>
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Date Range
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {auditStats.map((stat, index) => (
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

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Audit Logs</CardTitle>
          <CardDescription>Detailed log of all system activities and user actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search audit logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="info">Info</SelectItem>
              </SelectContent>
            </Select>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Action Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="user">User Actions</SelectItem>
                <SelectItem value="campaign">Campaign Actions</SelectItem>
                <SelectItem value="system">System Actions</SelectItem>
                <SelectItem value="security">Security Events</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>

          {/* Audit Logs Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-gray-50">
                    <TableCell className="font-mono text-sm">
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-2 text-gray-400" />
                        {log.timestamp}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="font-medium">{log.user}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {getActionIcon(log.action)}
                        <div className="ml-2">
                          <p className="font-medium">{log.action}</p>
                          <p className="text-sm text-gray-500 max-w-xs truncate">{log.details}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{log.resource}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getSeverityColor(log.severity)}>{log.severity}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(log.status)}>{log.status}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm text-gray-600">{log.ip}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-600">Showing 1-6 of 15,234 entries</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
