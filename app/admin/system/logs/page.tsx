"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Download,
  RefreshCw,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Eye,
  Calendar,
  User,
  Activity,
} from "lucide-react"
import { Button } from "../../../../components/ui/button"
import { Input } from "../../../../components/ui/input"
import { Badge } from "../../../../components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../components/ui/dialog"

interface LogEntry {
  id: string
  timestamp: string
  level: "info" | "warning" | "error" | "success"
  category: string
  event: string
  user?: string
  userId?: string
  ipAddress: string
  userAgent: string
  details: string
  metadata?: Record<string, any>
}

const mockLogs: LogEntry[] = [
  {
    id: "LOG-001",
    timestamp: "2024-01-20 14:30:15",
    level: "info",
    category: "Authentication",
    event: "User Login",
    user: "aminata@example.com",
    userId: "user_123",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    details: "User successfully logged in",
    metadata: { loginMethod: "email", twoFactorUsed: false },
  },
  {
    id: "LOG-002",
    timestamp: "2024-01-20 14:25:32",
    level: "warning",
    category: "Security",
    event: "Failed Login Attempt",
    user: "unknown@email.com",
    ipAddress: "192.168.1.101",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    details: "Multiple failed login attempts detected",
    metadata: { attemptCount: 5, blocked: true },
  },
  {
    id: "LOG-003",
    timestamp: "2024-01-20 14:20:45",
    level: "success",
    category: "Campaign",
    event: "Campaign Created",
    user: "mohamed@example.com",
    userId: "user_456",
    ipAddress: "192.168.1.102",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    details: "New campaign 'Clean Water Project' created successfully",
    metadata: { campaignId: "camp_789", targetAmount: 5000000 },
  },
  {
    id: "LOG-004",
    timestamp: "2024-01-20 14:15:20",
    level: "error",
    category: "Payment",
    event: "Payment Processing Failed",
    user: "fatima@example.com",
    userId: "user_789",
    ipAddress: "192.168.1.103",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
    details: "Payment processing failed due to insufficient funds",
    metadata: { paymentId: "pay_123", amount: 100000, method: "orange_money" },
  },
  {
    id: "LOG-005",
    timestamp: "2024-01-20 14:10:10",
    level: "info",
    category: "System",
    event: "Database Backup",
    ipAddress: "127.0.0.1",
    userAgent: "System/1.0",
    details: "Automated database backup completed successfully",
    metadata: { backupSize: "2.5GB", duration: "45s" },
  },
  {
    id: "LOG-006",
    timestamp: "2024-01-20 14:05:55",
    level: "warning",
    category: "Campaign",
    event: "Campaign Reported",
    user: "reporter@example.com",
    userId: "user_101",
    ipAddress: "192.168.1.104",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    details: "Campaign reported for suspicious activity",
    metadata: { campaignId: "camp_456", reportReason: "fraud_suspicion" },
  },
  {
    id: "LOG-007",
    timestamp: "2024-01-20 14:00:30",
    level: "success",
    category: "Donation",
    event: "Donation Processed",
    user: "donor@example.com",
    userId: "user_202",
    ipAddress: "192.168.1.105",
    userAgent: "Mozilla/5.0 (Android 14; Mobile; rv:109.0) Gecko/109.0 Firefox/119.0",
    details: "Donation of Le 250,000 processed successfully",
    metadata: { donationId: "don_789", campaignId: "camp_123", amount: 250000 },
  },
  {
    id: "LOG-008",
    timestamp: "2024-01-20 13:55:15",
    level: "error",
    category: "System",
    event: "API Rate Limit Exceeded",
    ipAddress: "192.168.1.106",
    userAgent: "Bot/1.0",
    details: "API rate limit exceeded for IP address",
    metadata: { endpoint: "/api/campaigns", requestCount: 1000, timeWindow: "1h" },
  },
]

const categories = ["All", "Authentication", "Security", "Campaign", "Payment", "Donation", "System", "User"]
const levels = ["All", "info", "warning", "error", "success"]

export default function SystemLogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>(mockLogs)
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>(mockLogs)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedLevel, setSelectedLevel] = useState("All")
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(false)

  // Auto-refresh logs every 30 seconds if enabled
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      refreshLogs()
    }, 30000)

    return () => clearInterval(interval)
  }, [autoRefresh])

  // Filter logs based on search and filters
  useEffect(() => {
    let filtered = logs

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((log) => log.category === selectedCategory)
    }

    // Filter by level
    if (selectedLevel !== "All") {
      filtered = filtered.filter((log) => log.level === selectedLevel)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (log) =>
          log.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.ipAddress.includes(searchTerm),
      )
    }

    setFilteredLogs(filtered)
  }, [logs, selectedCategory, selectedLevel, searchTerm])

  const refreshLogs = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    // In real app, fetch fresh logs from API
    setIsLoading(false)
  }

  const exportLogs = () => {
    const csvContent = [
      ["Timestamp", "Level", "Category", "Event", "User", "IP Address", "Details"].join(","),
      ...filteredLogs.map((log) =>
        [
          log.timestamp,
          log.level,
          log.category,
          log.event,
          log.user || "System",
          log.ipAddress,
          `"${log.details}"`,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `system-logs-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "error":
        return <XCircle className="w-4 h-4 text-red-600" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      default:
        return <Info className="w-4 h-4 text-blue-600" />
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "error":
        return "bg-red-100 text-red-800 border-red-200"
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "success":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-blue-100 text-blue-800 border-blue-200"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Authentication":
        return <User className="w-4 h-4" />
      case "System":
        return <Activity className="w-4 h-4" />
      default:
        return <Info className="w-4 h-4" />
    }
  }

  const logStats = {
    total: logs.length,
    errors: logs.filter((l) => l.level === "error").length,
    warnings: logs.filter((l) => l.level === "warning").length,
    info: logs.filter((l) => l.level === "info").length,
    success: logs.filter((l) => l.level === "success").length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">System Logs</h1>
          <p className="text-slate-600">Monitor all system activities and events in real-time</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={autoRefresh ? "bg-green-50 border-green-200 text-green-700" : ""}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? "animate-spin" : ""}`} />
            Auto Refresh {autoRefresh ? "On" : "Off"}
          </Button>
          <Button variant="outline" onClick={refreshLogs} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={exportLogs}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Logs</p>
                <p className="text-2xl font-bold text-slate-900">{logStats.total}</p>
              </div>
              <Activity className="w-8 h-8 text-slate-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Errors</p>
                <p className="text-2xl font-bold text-red-600">{logStats.errors}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Warnings</p>
                <p className="text-2xl font-bold text-yellow-600">{logStats.warnings}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Success</p>
                <p className="text-2xl font-bold text-green-600">{logStats.success}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Info</p>
                <p className="text-2xl font-bold text-blue-600">{logStats.info}</p>
              </div>
              <Info className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search logs by event, user, IP, or details..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level === "All" ? "All" : level.charAt(0).toUpperCase() + level.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
            <Badge variant="secondary">
              {filteredLogs.length} of {logs.length} logs shown
            </Badge>
            <div className="text-sm text-slate-500">Last updated: {new Date().toLocaleTimeString()}</div>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            System Activity Logs
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Timestamp</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Level</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Event</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">User</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">IP Address</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log, index) => (
                  <tr
                    key={log.id}
                    className={`border-b border-slate-100 hover:bg-slate-50 ${index % 2 === 0 ? "bg-white" : "bg-slate-25"}`}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-slate-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-slate-900">
                            {new Date(log.timestamp).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        {getLevelIcon(log.level)}
                        <Badge className={`ml-2 ${getLevelColor(log.level)}`}>{log.level}</Badge>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        {getCategoryIcon(log.category)}
                        <span className="ml-2 text-sm text-slate-700">{log.category}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm font-medium text-slate-900">{log.event}</div>
                      <div className="text-xs text-slate-500 line-clamp-1">{log.details}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-slate-700">
                        {log.user ? (
                          <div>
                            <div className="font-medium">{log.user}</div>
                            {log.userId && <div className="text-xs text-slate-500">{log.userId}</div>}
                          </div>
                        ) : (
                          <span className="text-slate-500">System</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <code className="text-xs bg-slate-100 px-2 py-1 rounded">{log.ipAddress}</code>
                    </td>
                    <td className="py-3 px-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => setSelectedLog(log)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="flex items-center">
                              {getLevelIcon(log.level)}
                              <span className="ml-2">{log.event}</span>
                            </DialogTitle>
                            <DialogDescription>Detailed information about this log entry</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium text-slate-700">Timestamp</label>
                                <p className="text-sm text-slate-900">{log.timestamp}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-slate-700">Level</label>
                                <Badge className={`${getLevelColor(log.level)}`}>{log.level}</Badge>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-slate-700">Category</label>
                                <p className="text-sm text-slate-900">{log.category}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-slate-700">IP Address</label>
                                <code className="text-xs bg-slate-100 px-2 py-1 rounded">{log.ipAddress}</code>
                              </div>
                            </div>

                            {log.user && (
                              <div>
                                <label className="text-sm font-medium text-slate-700">User</label>
                                <p className="text-sm text-slate-900">{log.user}</p>
                                {log.userId && <p className="text-xs text-slate-500">ID: {log.userId}</p>}
                              </div>
                            )}

                            <div>
                              <label className="text-sm font-medium text-slate-700">Details</label>
                              <p className="text-sm text-slate-900">{log.details}</p>
                            </div>

                            <div>
                              <label className="text-sm font-medium text-slate-700">User Agent</label>
                              <p className="text-xs text-slate-600 break-all">{log.userAgent}</p>
                            </div>

                            {log.metadata && (
                              <div>
                                <label className="text-sm font-medium text-slate-700">Metadata</label>
                                <pre className="text-xs bg-slate-100 p-3 rounded mt-1 overflow-auto">
                                  {JSON.stringify(log.metadata, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredLogs.length === 0 && (
            <div className="text-center py-12">
              <Activity className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No logs found</h3>
              <p className="text-slate-600">Try adjusting your search criteria or filters</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
