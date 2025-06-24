"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Badge } from "../../../../components/ui/badge"
import { Input } from "../../../../components/ui/input"
import { Switch } from "../../../../components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"
import { Key, Users, Shield, Plus, Search, Edit, Trash2, MoreHorizontal, UserCheck, UserX } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../../components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table"

const roles = [
  {
    id: 1,
    name: "Super Admin",
    description: "Full system access with all permissions",
    users: 2,
    permissions: 25,
    color: "bg-red-100 text-red-800",
  },
  {
    id: 2,
    name: "Admin",
    description: "Administrative access with limited system settings",
    users: 5,
    permissions: 18,
    color: "bg-blue-100 text-blue-800",
  },
  {
    id: 3,
    name: "Moderator",
    description: "Content moderation and user management",
    users: 12,
    permissions: 10,
    color: "bg-green-100 text-green-800",
  },
  {
    id: 4,
    name: "Support",
    description: "Customer support and basic user assistance",
    users: 8,
    permissions: 6,
    color: "bg-yellow-100 text-yellow-800",
  },
]

const permissions = [
  { id: 1, name: "User Management", description: "Create, edit, and delete users", category: "Users" },
  { id: 2, name: "Campaign Management", description: "Manage fundraising campaigns", category: "Campaigns" },
  { id: 3, name: "Financial Access", description: "View and manage financial data", category: "Finance" },
  { id: 4, name: "System Settings", description: "Modify system configuration", category: "System" },
  { id: 5, name: "Security Logs", description: "Access security and audit logs", category: "Security" },
  { id: 6, name: "Content Moderation", description: "Moderate user-generated content", category: "Content" },
  { id: 7, name: "Analytics Access", description: "View system analytics and reports", category: "Analytics" },
  { id: 8, name: "API Management", description: "Manage API keys and integrations", category: "System" },
]

const adminUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@fundwavesl.com",
    role: "Super Admin",
    status: "Active",
    lastLogin: "2024-12-24 10:30",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@fundwavesl.com",
    role: "Admin",
    status: "Active",
    lastLogin: "2024-12-24 09:15",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@fundwavesl.com",
    role: "Moderator",
    status: "Inactive",
    lastLogin: "2024-12-20 14:22",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export default function AdminAccessControlPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Inactive":
        return "bg-gray-100 text-gray-800"
      case "Suspended":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Access Control</h1>
          <p className="text-gray-600">Manage user roles, permissions, and access rights</p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Role
          </Button>
          <Button variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Admin User
          </Button>
        </div>
      </div>

      <Tabs defaultValue="roles" className="space-y-6">
        <TabsList>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="users">Admin Users</TabsTrigger>
          <TabsTrigger value="permissions">Permission Matrix</TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="space-y-6">
          {/* Roles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((role) => (
              <Card key={role.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge className={role.color}>{role.name}</Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Role
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Users className="w-4 h-4 mr-2" />
                          Manage Users
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Role
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardDescription>{role.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Users:</span>
                      <span className="font-medium">{role.users}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Permissions:</span>
                      <span className="font-medium">{role.permissions}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search admin users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Admin Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>Admin Users</CardTitle>
              <CardDescription>Manage administrative users and their access levels</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">{user.lastLogin}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Key className="w-4 h-4 mr-2" />
                              Change Role
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              {user.status === "Active" ? (
                                <>
                                  <UserX className="w-4 h-4 mr-2" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <UserCheck className="w-4 h-4 mr-2" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Permission Matrix</CardTitle>
              <CardDescription>Configure permissions for each role</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {["Users", "Campaigns", "Finance", "System", "Security", "Content", "Analytics"].map((category) => (
                  <div key={category} className="space-y-3">
                    <h3 className="font-medium text-gray-900 flex items-center">
                      <Shield className="w-4 h-4 mr-2" />
                      {category}
                    </h3>
                    <div className="space-y-2">
                      {permissions
                        .filter((p) => p.category === category)
                        .map((permission) => (
                          <div key={permission.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900">{permission.name}</p>
                              <p className="text-sm text-gray-500">{permission.description}</p>
                            </div>
                            <div className="flex items-center space-x-4">
                              {roles.map((role) => (
                                <div key={role.id} className="flex items-center space-x-2">
                                  <Switch defaultChecked={Math.random() > 0.3} />
                                  <span className="text-xs text-gray-500">{role.name}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
