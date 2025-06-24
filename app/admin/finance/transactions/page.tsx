"use client"

import { useState } from "react"
import { Search, Download, Eye, CreditCard, ArrowUpRight, ArrowDownLeft } from "lucide-react"

const mockTransactions = [
  {
    id: "TXN-001",
    type: "donation",
    amount: 50000,
    currency: "SLL",
    from: "Aminata Kamara",
    to: "Clean Water Project",
    method: "Orange Money",
    status: "completed",
    timestamp: "2024-01-20 14:30:00",
    fee: 500,
    reference: "OM-123456789",
  },
  {
    id: "TXN-002",
    type: "withdrawal",
    amount: 200000,
    currency: "SLL",
    from: "Mohamed Sesay",
    to: "Bank Account",
    method: "Bank Transfer",
    status: "pending",
    timestamp: "2024-01-20 13:15:00",
    fee: 2000,
    reference: "BT-987654321",
  },
  {
    id: "TXN-003",
    type: "refund",
    amount: 25000,
    currency: "SLL",
    from: "System",
    to: "Fatima Bangura",
    method: "Africell Money",
    status: "completed",
    timestamp: "2024-01-20 12:45:00",
    fee: 0,
    reference: "AM-456789123",
  },
  {
    id: "TXN-004",
    type: "donation",
    amount: 100000,
    currency: "SLL",
    from: "Ibrahim Kargbo",
    to: "Education Fund",
    method: "QMoney",
    status: "failed",
    timestamp: "2024-01-20 11:20:00",
    fee: 1000,
    reference: "QM-789123456",
  },
]

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState(mockTransactions)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [methodFilter, setMethodFilter] = useState("all")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-SL", {
      style: "currency",
      currency: "SLL",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.reference.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || transaction.type === typeFilter
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter
    const matchesMethod = methodFilter === "all" || transaction.method === methodFilter
    return matchesSearch && matchesType && matchesStatus && matchesMethod
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      case "cancelled":
        return "bg-slate-100 text-slate-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "donation":
        return <ArrowUpRight className="w-4 h-4 text-green-600" />
      case "withdrawal":
        return <ArrowDownLeft className="w-4 h-4 text-blue-600" />
      case "refund":
        return <ArrowDownLeft className="w-4 h-4 text-orange-600" />
      default:
        return <CreditCard className="w-4 h-4 text-slate-600" />
    }
  }

  const totalAmount = filteredTransactions.reduce((sum, txn) => sum + txn.amount, 0)
  const totalFees = filteredTransactions.reduce((sum, txn) => sum + txn.fee, 0)

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Transactions</h1>
          <p className="text-slate-600">Monitor all financial transactions on the platform</p>
        </div>
        <button className="btn-outline flex items-center">
          <Download className="w-4 h-4 mr-2" />
          Export
        </button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Transactions</p>
              <p className="text-2xl font-bold text-slate-900">{filteredTransactions.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Volume</p>
              <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalAmount)}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <ArrowUpRight className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Fees</p>
              <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalFees)}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Success Rate</p>
              <p className="text-2xl font-bold text-slate-900">
                {Math.round((transactions.filter((t) => t.status === "completed").length / transactions.length) * 100)}%
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-green-600" />
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
                placeholder="Search transactions..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Types</option>
              <option value="donation">Donations</option>
              <option value="withdrawal">Withdrawals</option>
              <option value="refund">Refunds</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Methods</option>
              <option value="Orange Money">Orange Money</option>
              <option value="Africell Money">Africell Money</option>
              <option value="QMoney">QMoney</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Transaction</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Type</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Method</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Date</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-t border-slate-200 hover:bg-slate-50">
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-medium text-slate-900">{transaction.id}</div>
                      <div className="text-sm text-slate-600">
                        {transaction.from} → {transaction.to}
                      </div>
                      <div className="text-sm text-slate-500">Ref: {transaction.reference}</div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      {getTypeIcon(transaction.type)}
                      <span className="ml-2 capitalize">{transaction.type}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-medium text-slate-900">{formatCurrency(transaction.amount)}</div>
                      {transaction.fee > 0 && (
                        <div className="text-sm text-slate-500">Fee: {formatCurrency(transaction.fee)}</div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-600">{transaction.method}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-slate-600">
                    {new Date(transaction.timestamp).toLocaleString()}
                  </td>
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
