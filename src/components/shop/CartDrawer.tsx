'use client';

import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';

export function CartDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { items, updateQuantity, removeFromCart, total } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-red z-[200]" onClick={onClose} />

          {/* Cart Panel */}
          <div className="fixed top-0 right-0 h-full w-full max-w-md bg-[#000000] z-[200] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-[#A67C52]/20">
              <div className="flex justify-between items-center">
                <h2 className="text-lg text-white">Cart ({items.length} items)</h2>
                <button onClick={onClose}>
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Items List */}
            <div className="flex-1 p-4 bg-[#000000]">
              {items.map((item) => (
                <div key={item.id} className="mb-4 p-4 bg-[#000000] rounded-lg">
                  <div className="flex gap-4">
                    {/* Image */}
                    <div className="relative w-20 h-20">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 bg-[#000000]">
                      <div className="flex justify-between bg-[#000000]">
                        <div>
                          <h3 className="text-white">{item.name}</h3>
                          {item.variation && (
                            <p className="text-sm text-white/60">Size: {item.variation}</p>
                          )}
                        </div>
                        <button onClick={() => removeFromCart(item.id)}>
                          <X className="w-4 h-4 text-white/60" />
                        </button>
                      </div>
                      
                      {/* Price and Quantity */}
                      <div className="mt-2 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 bg-zinc-800 rounded"
                          >
                            <Minus className="w-4 h-4 text-white" />
                          </button>
                          <span className="text-white">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 bg-zinc-800 rounded"
                          >
                            <Plus className="w-4 h-4 text-white" />
                          </button>
                        </div>
                        <p className="text-[#A67C52]">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-35 border-t border-[#A67C52]/20 p-4 bg-[#000000]">
              <div className="flex justify-between mb-2">
                <span className="text-white/60">Subtotal</span>
                <span className="text-white">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="text-white/60">Shipping</span>
                <span className="text-white">Free</span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="text-white font-medium">Total</span>
                <span className="text-[#A67C52] font-medium">${total.toFixed(2)}</span>
              </div>
              <Link
                href="/checkout"
                className="block w-full py-3 bg-[#A67C52] text-white text-center rounded-lg"
                onClick={onClose}
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
} 