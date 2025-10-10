"use client";

import { useEffect, useState } from "react";
import { Search, Filter, MoreHorizontal, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  isKyc: boolean;
  isVerified: boolean;
  amountContributed: number;
  district: string | null;
  occupation: string | null;
  status: "active" | "suspended" | "banned";
  createdAt: string;
  updatedAt: string;
}

interface UsersResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<UsersResponse['pagination'] | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
        search,
        status: statusFilter,
      });
      
      const response = await fetch(`/api/admin/users?${params}`);
      const data = await response.json();
      
      if (data.ok) {
        setUsers(data.data.users);
        setPagination(data.data.pagination);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId: string, newStatus: string) => {
    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userIdToUpdate: userId,
          status: newStatus,
        }),
      });
      
      const data = await response.json();
      if (data.ok) {
        fetchUsers(); // Refresh the list
      }
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  const setUserKyc = async (userId: string, approve: boolean) => {
    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "kyc", userIdToUpdate: userId, approve }),
      });
      const data = await response.json();
      if (data.ok) fetchUsers();
    } catch (error) {
      console.error("Error updating user KYC:", error);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to permanently delete this user?")) return;
    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", userIdToUpdate: userId }),
      });
      const data = await response.json();
      if (data.ok) fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, search, statusFilter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "suspended":
        return <Badge className="bg-yellow-100 text-yellow-800">Suspended</Badge>;
      case "banned":
        return <Badge className="bg-red-100 text-red-800">Banned</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-SL', {
      style: 'currency',
      currency: 'SLE',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">User Management</h2>
          <p className="text-neutral-600">Manage user accounts and permissions</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
                <Input
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="banned">Banned</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Users ({pagination?.total || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-neutral-500">
              Loading users...
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-neutral-500">
              No users found
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="border rounded-lg p-4 hover:bg-neutral-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{user.name}</h3>
                        {getStatusBadge(user.status)}
                        {user.isKyc && (
                          <Badge className="bg-blue-100 text-blue-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            KYC Verified
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-neutral-600 space-y-1">
                        <div>Email: {user.email}</div>
                        {user.phone && <div>Phone: {user.phone}</div>}
                        {user.district && <div>District: {user.district}</div>}
                        {user.occupation && <div>Occupation: {user.occupation}</div>}
                        <div>Contributed: {formatCurrency(user.amountContributed)}</div>
                        <div>Joined: {new Date(user.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* KYC Actions */}
                      {!user.isKyc ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setUserKyc(user.id, true)}
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                        >
                          Approve KYC
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setUserKyc(user.id, false)}
                          className="text-yellow-600 border-yellow-200 hover:bg-yellow-50"
                        >
                          Revoke KYC
                        </Button>
                      )}

                      {/* Status Actions */}
                      {user.status === "active" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateUserStatus(user.id, "suspended")}
                            className="text-yellow-600 border-yellow-200 hover:bg-yellow-50"
                          >
                            Suspend
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateUserStatus(user.id, "banned")}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            Ban
                          </Button>
                        </>
                      )}
                      {user.status === "suspended" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateUserStatus(user.id, "active")}
                            className="text-green-600 border-green-200 hover:bg-green-50"
                          >
                            Activate
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateUserStatus(user.id, "banned")}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            Ban
                          </Button>
                        </>
                      )}
                      {user.status === "banned" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateUserStatus(user.id, "active")}
                          className="text-green-600 border-green-200 hover:bg-green-50"
                        >
                          Unban
                        </Button>
                      )}

                      {/* Delete */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteUser(user.id)}
                        className="text-red-700 border-red-300 hover:bg-red-50"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-neutral-600">
            Page {currentPage} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === pagination.totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </section>
  );
}
