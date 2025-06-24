"use client"

import { useState } from "react"
import { Search, Shield, AlertTriangle, Eye, Download } from "lucide-react"

const mockSecurityLogs = [
  {
    id: "LOG-001",
    timestamp: "2024-01-20 14:30:00",
    level: "warning",
    event: "Multiple failed login attempts",
    user: "unknown@email.com",
    ipAddress: "192.168.1.100",
    location: "Unknown",
    userAgent: "Chrome/120.0.0.0",
    details: "5 consecutive failed login attempts from same IP",
    action: "IP temporarily blocked",
  },
  {
    id: "LOG-002",
    timestamp: "2024-01-20 13:15:00",
    level: "info",
    event: "Admin login successful",
    user: "admin@fundwavesl.com",
    ipAddress: "192.168.1.101",
    location: "Freetown, Sierra Leone",
    userAgent: "Chrome/120.0.0.0",
    details: "Admin user logged in successfully",
    action: "Session created",
  },
  {
    id: "LOG-003",
    timestamp: "2024-01-20 12:45:00",
    level: "critical",
    event: "Suspicious transaction pattern",
    user: "suspicious@email.com",
    ipAddress: "192.168.1.102",
    location: "Unknown",
    userAgent: "Bot/1.0",
    details: "Rapid donation attempts with different payment methods",
    action: "Account flagged for review",
  },
  {
    id: "LOG-004",
    timestamp: "2024-01-20 11:20:00",
    level: "info",
    event: "Password changed",
    user: "user@email.com",
    ipAddress: "192.168.1.103",
    location: "Bo, Sierra Leone",
    userAgent: "Safari/17.0",
    details: "User successfully changed password",
    action: "Password updated",
  },
]

export default function SecurityLogsPage() {
  const [logs, setLogs] = useState(mockSecurityLogs)
  const [searchTerm, setSearchTerm] = useState("")
  const [levelFilter, setLevelFilter] = useState("all")
  const [eventFilter, setEventFilter] = useState("all")

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ipAddress.includes(searchTerm)
    const matchesLevel = levelFilter === "all" || log.level === levelFilter
    const matchesEvent = eventFilter === "all" || log.event.toLowerCase().includes(eventFilter.toLowerCase())
    return matchesSearch && matchesLevel && matchesEvent
  })

  const getLevelColor = (level: string) => {
    switch (level) {
      case "critical":
        return "bg-red-100 text-red-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "info":
        return "bg-blue-100 text-blue-800"
      case "success":
        return "bg-green-100 text-green-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "critical":
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      default:
        return <Shield className="w-4 h-4 text-blue-600" />
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Security Logs</h1>
          <p className="text-slate-600">Monitor security events and system activities</p>
        </div>
        <button className="btn-outline flex items-center">
          <Download className="w-4 h-4 mr-2" />
          Export Logs
        </button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Events</p>
              <p className="text-2xl font-bold text-slate-900">{logs.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Critical Events</p>
              <p className="text-2xl font-bold text-red-600">{logs.filter((l) => l.level === "critical").length}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Warnings</p>
              <p className="text-2xl font-bold text-yellow-600">{logs.filter((l) => l.level === "warning").length}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Info Events</p>
              <p className="text-2xl font-bold text-blue-600">{logs.filter((l) => l.level === "info").length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search logs..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Levels</option>
              <option value="critical">Critical</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
            </select>
            <select
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Events</option>
              <option value="login">Login Events</option>
              <option value="transaction">Transactions</option>
              <option value="admin">Admin Actions</option>
            </select>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Event</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Level</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">User</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Location</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Timestamp</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} className="border-t border-slate-200 hover:bg-slate-50">
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-medium text-slate-900">{log.event}</div>
                      <div className="text-sm text-slate-600">{log.details}</div>
                      <div className="text-sm text-slate-500">Action: {log.action}</div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      {getLevelIcon(log.level)}
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(log.level)}`}>
                        {log.level}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-medium text-slate-900">{log.user}</div>
                      <div className="text-sm text-slate-500">{log.userAgent}</div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <div className="text-slate-900">{log.location}</div>
                      <div className="text-sm text-slate-500">{log.ipAddress}</div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-slate-600">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="py-4 px-4">
                    <button className="text-indigo-600 hover:text-indigo-800" title="View Details">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
