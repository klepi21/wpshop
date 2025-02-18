'use client';

import { useState, useEffect } from 'react';
import { orderService } from '@/services/orders';
import { Clock, Package, CheckCircle, XCircle, Search } from 'lucide-react';
import { toast } from 'sonner';

interface TrackingNumber {
  orderId: string;
  number: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingTrackingNumber, setEditingTrackingNumber] = useState<TrackingNumber | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getAll();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await orderService.updateStatus(orderId, newStatus);
      toast.success('Order status updated');
      fetchOrders(); // Refresh orders list
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const handleTrackingNumberUpdate = async (orderId: string, trackingNumber: string) => {
    try {
      await orderService.updateTrackingNumber(orderId, trackingNumber);
      setEditingTrackingNumber(null);
      toast.success('Tracking number updated');
      fetchOrders(); // Refresh orders list
    } catch (error) {
      console.error('Error updating tracking number:', error);
      toast.error('Failed to update tracking number');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'processing':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const filteredOrders = orders
    .filter(order => {
      const matchesSearch = 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.wallet_address.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#A67C52]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Orders</h1>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#A67C52] focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#A67C52] focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-zinc-950 border border-white/10 rounded-xl overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-grow">
                    <div>
                      <p className="text-sm text-white/60">Order ID</p>
                      <p className="text-white font-medium">#{order.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-white/60">Customer</p>
                      <p className="text-white">{order.full_name}</p>
                      <p className="text-white/60 text-sm">{order.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-white/60">Wallet</p>
                      <p className="text-white/80 text-sm font-mono break-all">
                        {order.wallet_address}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-white/60">Status</p>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`mt-1 px-2 py-1 rounded text-sm font-medium border-0
                          ${order.status === 'completed' && 'bg-emerald-500/20 text-emerald-500'}
                          ${order.status === 'processing' && 'bg-blue-500/20 text-blue-500'}
                          ${order.status === 'pending' && 'bg-yellow-500/20 text-yellow-500'}
                          ${order.status === 'cancelled' && 'bg-red-500/20 text-red-500'}
                        `}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {order.order_items?.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                        <img
                          src={item.product?.images[0]}
                          alt={item.product?.name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div>
                        <h3 className="text-white font-medium">{item.product?.name}
                          {item.selected_size && (
                            <span className="text-white/60 ml-2">- Size: {item.selected_size}</span>
                          )}
                        </h3>
                        <p className="text-white/60 text-sm">Quantity: {item.quantity}</p>
                        <p className="text-white/60 text-sm">Price: ${item.unit_price}</p>
                      </div>
                    </div>
                  ))}

                  <div className="pt-4 border-t border-white/10">
                    <div className="flex justify-between text-white">
                      <span>Total Amount:</span>
                      <span>${order.total_amount}</span>
                    </div>
                    <p className="text-white/60 text-sm mt-2">
                      Ordered on: {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-white/60">Tracking Number</p>
                    {editingTrackingNumber?.orderId === order.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editingTrackingNumber?.number || ''}
                          onChange={(e) => setEditingTrackingNumber({
                            orderId: order.id,
                            number: e.target.value
                          })}
                          className="bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-sm"
                        />
                        <button
                          onClick={() => {
                            if (editingTrackingNumber) {
                              handleTrackingNumberUpdate(order.id, editingTrackingNumber.number);
                            }
                          }}
                          className="text-emerald-500 text-sm hover:text-emerald-400"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingTrackingNumber(null)}
                          className="text-red-500 text-sm hover:text-red-400"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <p className="text-white">{order.tracking_number || 'Not set'}</p>
                        <button
                          onClick={() => setEditingTrackingNumber({
                            orderId: order.id,
                            number: order.tracking_number || ''
                          })}
                          className="text-[#A67C52] text-sm hover:text-[#A67C52]/80"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 