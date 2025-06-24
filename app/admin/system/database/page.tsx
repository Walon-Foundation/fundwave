"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Database,
  HardDrive,
  Activity,
  Clock,
  CheckCircle,
  RefreshCw,
  Download,
  Upload,
  Settings,
  BarChart3,
  Zap,
} from "lucide-react"
import { toast } from "sonner"

const databaseStats = {
  totalSize: "2.4 GB",
  usedSpace: 68,
  totalTables: 24,
  totalRecords: 156789,
  activeConnections: 12,
  maxConnections: 100,
  uptime: "15 days, 4 hours",
  lastBackup: "2024-12-24T02:00:00Z",
}

const tableStats = [
  { name: "users", records: 45230, size: "245 MB", growth: "+2.3%" },
  { name: "campaigns", records: 8945, size: "156 MB", growth: "+5.7%" },
  { name: "donations", records: 67890, size: "890 MB", growth: "+12.4%" },
  { name: "transactions", records: 23456, size: "345 MB", growth: "+8.9%" },
  { name: "notifications", records: 89012, size: "123 MB", growth: "+15.2%" },
  { name: "audit_logs", records: 234567, size: "567 MB", growth: "+3.1%" },
]

const recentQueries = [
  {
    query: "SELECT * FROM campaigns WHERE status = 'active'",
    duration: "0.045s",
    timestamp: "2024-12-24T12:30:15Z",
    status: "success",
  },
  {
    query: "UPDATE users SET last_login = NOW() WHERE id = 12345",
    duration: "0.012s",
    timestamp: "2024-12-24T12:29:45Z",
    status: "success",
  },
  {
    query: "INSERT INTO donations (campaign_id, amount, user_id) VALUES...",
    duration: "0.089s",
    timestamp: "2024-12-24T12:28:30Z",
    status: "success",
  },
  {
    query: "SELECT COUNT(*) FROM transactions WHERE created_at > '2024-12-01'",
    duration: "2.345s",
    timestamp: "2024-12-24T12:27:12Z",
    status: "slow",
  },
]

export default function DatabasePage() {
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [isBackingUp, setIsBackingUp] = useState(false)

  const handleOptimize = async () => {
    setIsOptimizing(true)
    // Simulate optimization
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setIsOptimizing(false)
    toast.success("Database optimization completed")
  }

  const handleBackup = async () => {
    setIsBackingUp(true)
    // Simulate backup
    await new Promise((resolve) => setTimeout(resolve, 5000))
    setIsBackingUp(false)
    toast.success("Database backup completed")
  }

  const getQueryStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800"
      case "slow":
        return "bg-yellow-100 text-yellow-800"
      case "error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Database Management</h1>
          <p className="text-gray-600">Monitor database performance, tables, and maintenance</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleOptimize} disabled={isOptimizing}>
            {isOptimizing ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Zap className="w-4 h-4 mr-2" />}
            {isOptimizing ? "Optimizing..." : "Optimize"}
          </Button>
          <Button className="btn-primary" onClick={handleBackup} disabled={isBackingUp}>
            {isBackingUp ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
            {isBackingUp ? "Backing up..." : "Backup Now"}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Database Size</p>
                <p className="text-2xl font-bold text-gray-900">{databaseStats.totalSize}</p>
                <Progress value={databaseStats.usedSpace} className="mt-2" />
              </div>
              <HardDrive className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Records</p>
                <p className="text-2xl font-bold text-gray-900">{databaseStats.totalRecords.toLocaleString()}</p>
              </div>
              <Database className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Connections</p>
                <p className="text-2xl font-bold text-gray-900">
                  {databaseStats.activeConnections}/{databaseStats.maxConnections}
                </p>
              </div>
              <Activity className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Uptime</p>
                <p className="text-2xl font-bold text-gray-900">{databaseStats.uptime}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tables" className="space-y-6">
        <TabsList>
          <TabsTrigger value="tables">Tables</TabsTrigger>
          <TabsTrigger value="queries">Query Log</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="tables" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Database Tables</CardTitle>
              <CardDescription>Overview of all database tables and their statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tableStats.map((table, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Database className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="font-medium">{table.name}</p>
                        <p className="text-sm text-gray-600">{table.records.toLocaleString()} records</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-medium">{table.size}</p>
                        <Badge variant="secondary" className="text-xs">
                          {table.growth}
                        </Badge>
                      </div>
                      <Button variant="outline" size="sm">
                        <BarChart3 className="w-4 h-4 mr-1" />
                        Analyze
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="queries" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Queries</CardTitle>
              <CardDescription>Monitor recent database queries and their performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentQueries.map((query, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded flex-1 mr-4">{query.query}</code>
                      <Badge className={getQueryStatusColor(query.status)}>{query.status}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Duration: {query.duration}</span>
                      <span>{new Date(query.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Database Maintenance</CardTitle>
              <CardDescription>Perform maintenance tasks and view backup history</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Last backup completed on {new Date(databaseStats.lastBackup).toLocaleString()}
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Maintenance Tasks</h3>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Rebuild Indexes
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="w-4 h-4 mr-2" />
                      Update Statistics
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Database className="w-4 h-4 mr-2" />
                      Vacuum Database
                    </Button>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold">Backup Options</h3>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="w-4 h-4 mr-2" />
                      Full Backup
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Upload className="w-4 h-4 mr-2" />
                      Restore from Backup
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Clock className="w-4 h-4 mr-2" />
                      Schedule Backup
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
