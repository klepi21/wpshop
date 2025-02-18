'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { orderService } from '@/services/orders';
import { CheckCircle2, Package, Truck, MapPin, Wallet } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function ReceiptPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { clearCart } = useCart();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderData = await orderService.getById(id as string);
        setOrder(orderData);
        clearCart();
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, clearCart]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#A67C52]" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Order Not Found</h1>
          <p className="text-white/60">The order you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-zinc-950 border border-[#A67C52]/20 rounded-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white">Order Receipt</h1>
            <div className="flex items-center gap-2 bg-green-500/10 px-4 py-2 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span className="text-green-500 font-medium">Order Confirmed</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-[#A67C52]" />
                Order Details
              </h2>
              <div className="space-y-3 text-white/60">
                <p>Order ID: <span className="text-white font-medium">#{order.id}</span></p>
                <p>Date: <span className="text-white">{new Date(order.created_at).toLocaleDateString()}</span></p>
                <p>Status: <span className="text-green-500 font-medium">{order.status}</span></p>
                <div className="pt-2">
                  <p className="text-sm text-white/40 mb-1">Payment Method</p>
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-[#A67C52]" />
                    <span className="text-white">Cryptocurrency</span>
                  </div>
                </div>
                <div className="pt-2">
                  <p className="text-sm text-white/40 mb-1">Wallet Address</p>
                  <p className="text-xs text-white font-mono bg-white/5 p-2 rounded break-all">
                    {order.wallet_address}
                  </p>
                </div>
                <div className="space-y-2 text-white/60">
                  <p>Order ID: #{order.id}</p>
                  <p>Status: {order.status}</p>
                  <p>Payment Method: Cryptocurrency</p>
                  <p className="break-all">Wallet: {order.wallet_address}</p>
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-sm text-white/60 mb-1">Tracking Number</p>
                    {order.tracking_number ? (
                      <p className="text-white font-medium">{order.tracking_number}</p>
                    ) : (
                      <p className="text-white/40 italic">Tracking number will be available as soon as the package is ready</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#A67C52]" />
                Shipping Information
              </h2>
              <div className="space-y-3 text-white/60">
                <p className="text-white font-medium">{order.full_name}</p>
                <p>{order.email}</p>
                <div className="pt-2">
                  <p className="text-sm text-white/40 mb-1">Delivery Address</p>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#A67C52] mt-1" />
                    <div>
                      <p>{order.shipping_address}</p>
                      <p>{order.city}, {order.country} {order.postal_code}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-white mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.order_items?.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between py-4 border-b border-white/10">
                  <div className="flex items-center gap-4">
                    {item.product?.images?.[0] && (
                      <div className="relative w-16 h-16">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="rounded-lg object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <p className="text-white font-medium">{item.product?.name}</p>
                      <p className="text-white/60">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="text-white">${(item.unit_price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-white/10 pt-6">
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-white/60">
                  <span>Subtotal</span>
                  <span>${order.total_amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Shipping</span>
                  <span>{order.shipping_method === 'fast' ? '$20.00' : 'Free'}</span>
                </div>
                <div className="flex justify-between text-white font-medium text-lg">
                  <span>Total</span>
                  <span>${order.total_amount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center px-6 py-3 bg-[#A67C52] text-white font-medium rounded-xl hover:bg-[#A67C52]/90 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 