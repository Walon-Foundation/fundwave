"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Badge } from "../../../../components/ui/badge"
import { Input } from "../../../../components/ui/input"
import { Label } from "../../../../components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"
import { Alert, AlertDescription } from "../../../../components/ui/alert"
import { Key, Plus, Trash2, Eye, EyeOff, Copy, Activity, Shield, CheckCircle, BarChart3, RefreshCw } from "lucide-react"
import { toast } from "sonner"

interface ApiKey {
  id: string
  name: string
  key: string
  permissions: string[]
  lastUsed: string
  requests: number
  status: "active" | "inactive" | "expired"
  createdAt: string
  expiresAt: string
}

const mockApiKeys: ApiKey[] = [
  {
    id: "1",
    name: "Production API",
    key: "fw_live_sk_1234567890abcdef",
    permissions: ["campaigns:read", "donations:write", "users:read"],
    lastUsed: "2024-12-24T10:30:00Z",
    requests: 15420,
    status: "active",
    createdAt: "2024-01-15T09:00:00Z",
    expiresAt: "2025-01-15T09:00:00Z",
  },
  {
    id: "2",
    name: "Development API",
    key: "fw_test_sk_abcdef1234567890",
    permissions: ["campaigns:read", "campaigns:write"],
    lastUsed: "2024-12-23T16:45:00Z",
    requests: 2340,
    status: "active",
    createdAt: "2024-11-01T14:20:00Z",
    expiresAt: "2025-11-01T14:20:00Z",
  },
  {
    id: "3",
    name: "Analytics Integration",
    key: "fw_live_sk_fedcba0987654321",
    permissions: ["analytics:read"],
    lastUsed: "2024-12-20T08:15:00Z",
    requests: 890,
    status: "inactive",
    createdAt: "2024-10-10T11:30:00Z",
    expiresAt: "2024-12-25T11:30:00Z",
  },
]

const apiEndpoints = [
  { method: "GET", path: "/api/campaigns", description: "List all campaigns", status: "active" },
  { method: "POST", path: "/api/campaigns", description: "Create new campaign", status: "active" },
  { method: "GET", path: "/api/campaigns/{id}", description: "Get campaign details", status: "active" },
  { method: "PUT", path: "/api/campaigns/{id}", description: "Update campaign", status: "active" },
  { method: "DELETE", path: "/api/campaigns/{id}", description: "Delete campaign", status: "active" },
  { method: "POST", path: "/api/donations", description: "Process donation", status: "active" },
  { method: "GET", path: "/api/users/{id}", description: "Get user profile", status: "active" },
  { method: "GET", path: "/api/analytics", description: "Get analytics data", status: "maintenance" },
]

export default function ApiManagementPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(mockApiKeys)
  const [showKeys, setShowKeys] = useState<{ [key: string]: boolean }>({})
  const [isCreating, setIsCreating] = useState(false)

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys((prev) => ({ ...prev, [keyId]: !prev[keyId] }))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("API key copied to clipboard")
  }

  const revokeKey = (keyId: string) => {
    setApiKeys((prev) => prev.map((key) => (key.id === keyId ? { ...key, status: "inactive" as const } : key)))
    toast.success("API key revoked successfully")
  }

  const regenerateKey = (keyId: string) => {
    const newKey = `fw_live_sk_${Math.random().toString(36).substring(2, 18)}`
    setApiKeys((prev) =>
      prev.map((key) =>
        key.id === keyId
          ? {
              ...key,
              key: newKey,
              status: "active" as const,
              createdAt: new Date().toISOString(),
            }
          : key,
      ),
    )
    toast.success("API key regenerated successfully")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "expired":
        return "bg-red-100 text-red-800"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-blue-100 text-blue-800"
      case "POST":
        return "bg-green-100 text-green-800"
      case "PUT":
        return "bg-yellow-100 text-yellow-800"
      case "DELETE":
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
          <h1 className="text-2xl font-bold text-gray-900">API Management</h1>
          <p className="text-gray-600">Manage API keys, endpoints, and access controls</p>
        </div>
        <Button className="btn-primary" onClick={() => setIsCreating(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create API Key
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total API Keys</p>
                <p className="text-2xl font-bold text-gray-900">{apiKeys.length}</p>
              </div>
              <Key className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Keys</p>
                <p className="text-2xl font-bold text-gray-900">
                  {apiKeys.filter((key) => key.status === "active").length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900">
                  {apiKeys.reduce((sum, key) => sum + key.requests, 0).toLocaleString()}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Endpoints</p>
                <p className="text-2xl font-bold text-gray-900">{apiEndpoints.length}</p>
              </div>
              <Activity className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="keys" className="space-y-6">
        <TabsList>
          <TabsTrigger value="keys">API Keys</TabsTrigger>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="keys" className="space-y-6">
          {/* API Keys List */}
          <div className="space-y-4">
            {apiKeys.map((apiKey) => (
              <Card key={apiKey.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Key className="w-5 h-5 text-gray-500" />
                      <div>
                        <CardTitle className="text-lg">{apiKey.name}</CardTitle>
                        <CardDescription>
                          Created {new Date(apiKey.createdAt).toLocaleDateString()} • Last used{" "}
                          {new Date(apiKey.lastUsed).toLocaleDateString()}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={getStatusColor(apiKey.status)}>{apiKey.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* API Key */}
                  <div className="space-y-2">
                    <Label>API Key</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type={showKeys[apiKey.id] ? "text" : "password"}
                        value={apiKey.key}
                        readOnly
                        className="font-mono text-sm"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleKeyVisibility(apiKey.id)}
                        className="px-3"
                      >
                        {showKeys[apiKey.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => copyToClipboard(apiKey.key)} className="px-3">
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Permissions */}
                  <div className="space-y-2">
                    <Label>Permissions</Label>
                    <div className="flex flex-wrap gap-2">
                      {apiKey.permissions.map((permission) => (
                        <Badge key={permission} variant="secondary">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-sm text-gray-600">Requests</p>
                      <p className="font-semibold">{apiKey.requests.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Expires</p>
                      <p className="font-semibold">{new Date(apiKey.expiresAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => regenerateKey(apiKey.id)}>
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Regenerate
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => revokeKey(apiKey.id)}>
                        <Trash2 className="w-4 h-4 mr-1" />
                        Revoke
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="endpoints" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Endpoints</CardTitle>
              <CardDescription>Available API endpoints and their current status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {apiEndpoints.map((endpoint, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Badge className={getMethodColor(endpoint.method)}>{endpoint.method}</Badge>
                      <div>
                        <p className="font-mono text-sm font-medium">{endpoint.path}</p>
                        <p className="text-sm text-gray-600">{endpoint.description}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(endpoint.status)}>{endpoint.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Settings</CardTitle>
              <CardDescription>Configure global API settings and security options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  API settings affect all endpoints and keys. Changes may take up to 5 minutes to propagate.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Rate Limit (requests per minute)</Label>
                    <Input type="number" defaultValue="1000" />
                  </div>
                  <div>
                    <Label>Default Key Expiration (days)</Label>
                    <Input type="number" defaultValue="365" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label>Allowed Origins</Label>
                    <Input placeholder="https://example.com, https://app.example.com" />
                  </div>
                  <div>
                    <Label>Webhook Timeout (seconds)</Label>
                    <Input type="number" defaultValue="30" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="btn-primary">Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
