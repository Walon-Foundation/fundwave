"use client";

import { useEffect, useState } from "react";
import { Users, Target, DollarSign, AlertTriangle, TrendingUp, CheckCircle } from "lucide-react";

interface AdminStats {
  campaigns: {
    total: number;
    active: number;
    completed: number;
    newThisMonth: number;
  };
  users: {
    total: number;
    verified: number;
    newThisMonth: number;
  };
  donations: {
    totalAmount: number;
    totalCount: number;
  };
  reports: {
    pending: number;
  };
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats');
        const data = await response.json();
        if (data.ok) {
          setStats(data.data);
        }
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-SL', {
      style: 'currency',
      currency: 'SLE',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Overview</h2>
        <span className="text-sm text-neutral-500">
          Last updated: {new Date().toLocaleTimeString()}
        </span>
      </div>
      
      {/* Main Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-neutral-500">Total Campaigns</div>
              <div className="text-2xl font-bold">
                {loading ? "—" : formatNumber(stats?.campaigns.total || 0)}
              </div>
              <div className="text-xs text-green-600 mt-1">
                +{stats?.campaigns.newThisMonth || 0} this month
              </div>
            </div>
            <Target className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-neutral-500">Total Users</div>
              <div className="text-2xl font-bold">
                {loading ? "—" : formatNumber(stats?.users.total || 0)}
              </div>
              <div className="text-xs text-green-600 mt-1">
                +{stats?.users.newThisMonth || 0} this month
              </div>
            </div>
            <Users className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-neutral-500">Total Donations</div>
              <div className="text-2xl font-bold">
                {loading ? "—" : formatCurrency(stats?.donations.totalAmount || 0)}
              </div>
              <div className="text-xs text-blue-600 mt-1">
                {formatNumber(stats?.donations.totalCount || 0)} donations
              </div>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-neutral-500">Pending Reports</div>
              <div className="text-2xl font-bold text-orange-600">
                {loading ? "—" : formatNumber(stats?.reports.pending || 0)}
              </div>
              <div className="text-xs text-neutral-500 mt-1">
                Require attention
              </div>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>
      
      {/* Campaign Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-neutral-500">Active Campaigns</div>
              <div className="text-xl font-semibold text-blue-600">
                {loading ? "—" : formatNumber(stats?.campaigns.active || 0)}
              </div>
            </div>
            <TrendingUp className="w-6 h-6 text-blue-500" />
          </div>
        </div>
        
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-neutral-500">Completed Campaigns</div>
              <div className="text-xl font-semibold text-green-600">
                {loading ? "—" : formatNumber(stats?.campaigns.completed || 0)}
              </div>
            </div>
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
        </div>
        
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-neutral-500">Verified Users</div>
              <div className="text-xl font-semibold text-purple-600">
                {loading ? "—" : formatNumber(stats?.users.verified || 0)}
              </div>
            </div>
            <Users className="w-6 h-6 text-purple-500" />
          </div>
        </div>
      </div>
    </section>
  );
}
