'use client';

import { useState, useEffect } from 'react';
import { Clock, Package, CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useGetAccount } from '@multiversx/sdk-dapp/hooks';
import { orderService } from '@/services/orders';
import { WalletButton } from '@/components/wallet/WalletButton';

export default function UserOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const { address } = useGetAccount();

  useEffect(() => {
    const fetchOrders = async () => {
      if (address) {
        try {
          const userOrders = await orderService.getOrdersByWallet(address);
          setOrders(userOrders);
        } catch (error) {
          console.error('Error fetching orders:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrders();
  }, [address]);

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

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (!address) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Connect Wallet</h1>
          <p className="text-white/60 mb-8">Please connect your wallet to view your orders</p>
          <WalletButton />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#A67C52]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">My Orders</h1>
        
        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="text-center py-12 bg-zinc-950 border border-white/10 rounded-xl">
              <p className="text-white/60">You haven't placed any orders yet.</p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="bg-zinc-950 border border-white/10 rounded-xl overflow-hidden">
                {/* Order Header - Always visible */}
                <div 
                  className="p-6 cursor-pointer hover:bg-white/5 transition-colors"
                  onClick={() => toggleOrderExpansion(order.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {getStatusIcon(order.status)}
                      <div>
                        <p className="text-white font-medium">Order #{order.id}</p>
                        <p className="text-white/60 text-sm">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-white font-medium">${order.total_amount}</p>
                        <p className="text-white/60 text-sm">
                          {order.order_items?.length} {order.order_items?.length === 1 ? 'item' : 'items'}
                        </p>
                      </div>
                      {expandedOrder === order.id ? (
                        <ChevronUp className="w-5 h-5 text-white/60" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-white/60" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Details - Expandable */}
                {expandedOrder === order.id && (
                  <div className="border-t border-white/10 p-6">
                    {/* Shipping Information */}
                    <div className="mb-6">
                      <h3 className="text-white font-medium mb-2">Shipping Details</h3>
                      <div className="bg-white/5 rounded-lg p-4">
                        <p className="text-white">{order.full_name}</p>
                        <p className="text-white/60">{order.shipping_address}</p>
                        <p className="text-white/60">{order.city}, {order.country} {order.postal_code}</p>
                      </div>
                    </div>

                    {/* Tracking Information */}
                    <div className="mb-6">
                      <h3 className="text-white font-medium mb-2">Tracking Information</h3>
                      <div className="bg-white/5 rounded-lg p-4">
                        {order.tracking_number ? (
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-[#A67C52]" />
                            <p className="text-white">{order.tracking_number}</p>
                          </div>
                        ) : (
                          <p className="text-white/40 italic">
                            Tracking number will be available as soon as the package is ready
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Order Items */}
                    <div>
                      <h3 className="text-white font-medium mb-2">Order Items</h3>
                      <div className="space-y-4">
                        {order.order_items?.map((item: any) => (
                          <div key={item.id} className="flex items-center gap-4 bg-white/5 rounded-lg p-4">
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                              <img
                                src={item.product?.images[0]}
                                alt={item.product?.name}
                                className="object-cover w-full h-full"
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-white font-medium">
                                {item.product?.name}
                                {item.selected_size && (
                                  <span className="text-white/60 ml-2">- Size: {item.selected_size}</span>
                                )}
                              </h4>
                              <p className="text-white/60 text-sm">Quantity: {item.quantity}</p>
                              <p className="text-white/60 text-sm">Price: ${item.unit_price}</p>
                              {item.customization && (
                                <p className="text-white/60 text-sm mt-1">
                                  <span className="font-medium">Customization:</span> {item.customization}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-white font-medium">
                                ${(item.quantity * item.unit_price).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 