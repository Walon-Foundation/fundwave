"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, Upload, Clock, CheckCircle, RefreshCw, Calendar, HardDrive, Shield, Settings } from "lucide-react"
import { toast } from "sonner"

interface Backup {
  id: string
  name: string
  type: "full" | "incremental" | "differential"
  size: string
  status: "completed" | "running" | "failed" | "scheduled"
  createdAt: string
  duration: string
  location: string
}

const mockBackups: Backup[] = [
  {
    id: "1",
    name: "Daily Full Backup",
    type: "full",
    size: "2.4 GB",
    status: "completed",
    createdAt: "2024-12-24T02:00:00Z",
    duration: "45 minutes",
    location: "AWS S3",
  },
  {
    id: "2",
    name: "Incremental Backup",
    type: "incremental",
    size: "156 MB",
    status: "completed",
    createdAt: "2024-12-23T14:00:00Z",
    duration: "8 minutes",
    location: "Local Storage",
  },
  {
    id: "3",
    name: "Weekly Full Backup",
    type: "full",
    size: "2.3 GB",
    status: "running",
    createdAt: "2024-12-23T02:00:00Z",
    duration: "35 minutes",
    location: "Google Cloud",
  },
  {
    id: "4",
    name: "Emergency Backup",
    type: "differential",
    size: "890 MB",
    status: "failed",
    createdAt: "2024-12-22T16:30:00Z",
    duration: "12 minutes",
    location: "Azure Blob",
  },
]

export default function BackupsPage() {
  const [backups, setBackups] = useState<Backup[]>(mockBackups)
  const [isCreatingBackup, setIsCreatingBackup] = useState(false)

  const handleCreateBackup = async () => {
    setIsCreatingBackup(true)
    // Simulate backup creation
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const newBackup: Backup = {
      id: Date.now().toString(),
      name: "Manual Backup",
      type: "full",
      size: "2.5 GB",
      status: "completed",
      createdAt: new Date().toISOString(),
      duration: "42 minutes",
      location: "AWS S3",
    }

    setBackups((prev) => [newBackup, ...prev])
    setIsCreatingBackup(false)
    toast.success("Backup created successfully")
  }

  const handleRestore = (backupId: string) => {
    toast.success("Restore initiated - this may take several minutes")
  }

  const handleDelete = (backupId: string) => {
    setBackups((prev) => prev.filter((backup) => backup.id !== backupId))
    toast.success("Backup deleted successfully")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "running":
        return "bg-blue-100 text-blue-800"
      case "failed":
        return "bg-red-100 text-red-800"
      case "scheduled":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "full":
        return "bg-purple-100 text-purple-800"
      case "incremental":
        return "bg-blue-100 text-blue-800"
      case "differential":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const completedBackups = backups.filter((b) => b.status === "completed").length
  const totalSize = backups.reduce((sum, backup) => {
    const size = Number.parseFloat(backup.size.replace(/[^\d.]/g, ""))
    return sum + (backup.size.includes("GB") ? size : size / 1000)
  }, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Backup Management</h1>
          <p className="text-gray-600">Manage database backups and restore points</p>
        </div>
        <Button className="btn-primary" onClick={handleCreateBackup} disabled={isCreatingBackup}>
          {isCreatingBackup ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          {isCreatingBackup ? "Creating..." : "Create Backup"}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Backups</p>
                <p className="text-2xl font-bold text-gray-900">{backups.length}</p>
              </div>
              <HardDrive className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Successful</p>
                <p className="text-2xl font-bold text-gray-900">{completedBackups}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Size</p>
                <p className="text-2xl font-bold text-gray-900">{totalSize.toFixed(1)} GB</p>
              </div>
              <Shield className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Last Backup</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Date(backups[0]?.createdAt).toLocaleDateString()}
                </p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Backup Schedule Alert */}
      <Alert>
        <Calendar className="h-4 w-4" />
        <AlertDescription>
          <strong>Scheduled Backups:</strong> Full backup runs daily at 2:00 AM, incremental backups every 6 hours. Next
          backup scheduled for today at 8:00 PM.
        </AlertDescription>
      </Alert>

      {/* Backups List */}
      <Card>
        <CardHeader>
          <CardTitle>Backup History</CardTitle>
          <CardDescription>View and manage all database backups</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {backups.map((backup) => (
              <div key={backup.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <HardDrive className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium">{backup.name}</h3>
                      <Badge className={getTypeColor(backup.type)}>{backup.type}</Badge>
                      <Badge className={getStatusColor(backup.status)}>{backup.status}</Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>Size: {backup.size}</span>
                      <span>Duration: {backup.duration}</span>
                      <span>Location: {backup.location}</span>
                      <span>{new Date(backup.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {backup.status === "running" && (
                    <div className="flex items-center space-x-2">
                      <Progress value={65} className="w-20" />
                      <span className="text-sm text-gray-600">65%</span>
                    </div>
                  )}
                  {backup.status === "completed" && (
                    <>
                      <Button variant="outline" size="sm" onClick={() => handleRestore(backup.id)}>
                        <Upload className="w-4 h-4 mr-1" />
                        Restore
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </>
                  )}
                  {backup.status === "failed" && (
                    <Button variant="outline" size="sm">
                      <RefreshCw className="w-4 h-4 mr-1" />
                      Retry
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(backup.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Backup Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Backup Settings</CardTitle>
          <CardDescription>Configure automatic backup schedules and retention policies</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Schedule Settings</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Configure Schedule
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  Retention Policy
                </Button>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">Storage Settings</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="w-4 h-4 mr-2" />
                  Encryption Settings
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <HardDrive className="w-4 h-4 mr-2" />
                  Storage Locations
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
