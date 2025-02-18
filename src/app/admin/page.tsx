'use client';

import { useState, useEffect } from 'react';
import { orderService } from '@/services/orders';
import { DollarSign, ShoppingBag, Users, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  recentOrders: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch stats and recent orders in parallel
        const [statsData, recentOrders] = await Promise.all([
          orderService.getStats(),
          orderService.getRecent(5)
        ]);

        setStats({
          ...statsData,
          recentOrders
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen  px-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#A67C52]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-zinc-950 border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Total Orders</p>
                <p className="text-2xl font-bold text-white mt-1">{stats.totalOrders}</p>
              </div>
              <div className="bg-[#A67C52]/10 p-3 rounded-lg">
                <ShoppingBag className="w-6 h-6 text-[#A67C52]" />
              </div>
            </div>
          </div>

          <div className="bg-zinc-950 border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-white mt-1">${stats.totalRevenue.toFixed(2)}</p>
              </div>
              <div className="bg-[#A67C52]/10 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-[#A67C52]" />
              </div>
            </div>
          </div>

          <div className="bg-zinc-950 border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Total Customers</p>
                <p className="text-2xl font-bold text-white mt-1">{stats.totalCustomers}</p>
              </div>
              <div className="bg-[#A67C52]/10 p-3 rounded-lg">
                <Users className="w-6 h-6 text-[#A67C52]" />
              </div>
            </div>
          </div>

          <div className="bg-zinc-950 border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Avg. Order Value</p>
                <p className="text-2xl font-bold text-white mt-1">
                  ${stats.totalOrders > 0 ? (stats.totalRevenue / stats.totalOrders).toFixed(2) : '0.00'}
                </p>
              </div>
              <div className="bg-[#A67C52]/10 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-[#A67C52]" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-zinc-950 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="text-[#A67C52] hover:text-[#A67C52]/80 transition-colors"
            >
              View all
            </Link>
          </div>

          <div className="space-y-4">
            {stats.recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between py-4 border-b border-white/10 last:border-0">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-white font-medium">#{order.id}</p>
                    <p className="text-white/60 text-sm">{order.full_name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">${order.total_amount}</p>
                  <p className="text-white/60 text-sm">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 