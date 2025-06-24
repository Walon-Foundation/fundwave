"use client"

import { useState } from "react"
import { DollarSign, TrendingUp, TrendingDown, CreditCard, Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react"

const mockFinanceData = {
  totalRevenue: 125000000,
  monthlyRevenue: 8500000,
  totalTransactions: 15420,
  pendingWithdrawals: 2300000,
  recentTransactions: [
    {
      id: "1",
      type: "donation",
      amount: 50000,
      campaign: "Clean Water for Makeni",
      user: "Aminata Kamara",
      date: "2024-01-22",
      status: "completed",
    },
    {
      id: "2",
      type: "withdrawal",
      amount: 150000,
      campaign: "School Building Project",
      user: "Mohamed Sesay",
      date: "2024-01-22",
      status: "pending",
    },
    {
      id: "3",
      type: "refund",
      amount: 25000,
      campaign: "Medical Emergency",
      user: "Sarah Bangura",
      date: "2024-01-21",
      status: "completed",
    },
  ],
  monthlyStats: [
    { month: "Jan", revenue: 8500000, transactions: 1240 },
    { month: "Dec", revenue: 7200000, transactions: 1180 },
    { month: "Nov", revenue: 6800000, transactions: 1050 },
    { month: "Oct", revenue: 7500000, transactions: 1320 },
  ],
}

export default function FinanceOverview() {
  const [data] = useState(mockFinanceData)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-SL", {
      style: "currency",
      currency: "SLL",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "donation":
        return <ArrowUpRight className="w-4 h-4 text-green-600" />
      case "withdrawal":
        return <ArrowDownRight className="w-4 h-4 text-blue-600" />
      case "refund":
        return <ArrowDownRight className="w-4 h-4 text-red-600" />
      default:
        return <CreditCard className="w-4 h-4 text-slate-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Financial Overview</h1>
        <p className="text-slate-600">Monitor platform financial performance and transactions</p>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Revenue</p>
              <p className="text-2xl font-bold text-slate-900">{formatCurrency(data.totalRevenue)}</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                +12.5% from last month
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Monthly Revenue</p>
              <p className="text-2xl font-bold text-slate-900">{formatCurrency(data.monthlyRevenue)}</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                +8.2% from last month
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Transactions</p>
              <p className="text-2xl font-bold text-slate-900">{data.totalTransactions.toLocaleString()}</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                +15.3% from last month
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Pending Withdrawals</p>
              <p className="text-2xl font-bold text-slate-900">{formatCurrency(data.pendingWithdrawals)}</p>
              <p className="text-sm text-red-600 flex items-center mt-1">
                <TrendingDown className="w-4 h-4 mr-1" />
                Requires attention
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Wallet className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Monthly Revenue Trend</h3>
          <div className="space-y-4">
            {data.monthlyStats.map((stat, index) => (
              <div key={stat.month} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 text-sm font-medium text-slate-600">{stat.month}</div>
                  <div className="flex-1 mx-4">
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-indigo-600 to-sky-500 h-2 rounded-full"
                        style={{ width: `${(stat.revenue / 10000000) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-slate-900">{formatCurrency(stat.revenue)}</div>
                  <div className="text-xs text-slate-500">{stat.transactions} transactions</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction Types */}
        <div className="card">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Transaction Breakdown</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded mr-3"></div>
                <span className="text-slate-700">Donations</span>
              </div>
              <div className="text-right">
                <div className="font-medium text-slate-900">12,450</div>
                <div className="text-sm text-slate-500">80.7%</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded mr-3"></div>
                <span className="text-slate-700">Withdrawals</span>
              </div>
              <div className="text-right">
                <div className="font-medium text-slate-900">2,340</div>
                <div className="text-sm text-slate-500">15.2%</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 rounded mr-3"></div>
                <span className="text-slate-700">Refunds</span>
              </div>
              <div className="text-right">
                <div className="font-medium text-slate-900">630</div>
                <div className="text-sm text-slate-500">4.1%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Recent Transactions</h3>
          <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-medium text-slate-700">Type</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Campaign</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">User</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Date</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.recentTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-slate-100">
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      {getTransactionIcon(transaction.type)}
                      <span className="ml-2 capitalize font-medium text-slate-900">{transaction.type}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-medium text-slate-900">{formatCurrency(transaction.amount)}</td>
                  <td className="py-4 px-4 text-slate-700">{transaction.campaign}</td>
                  <td className="py-4 px-4 text-slate-700">{transaction.user}</td>
                  <td className="py-4 px-4 text-slate-600">{new Date(transaction.date).toLocaleDateString()}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}
                    >
                      {transaction.status}
                    </span>
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
