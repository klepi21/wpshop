'use client';

import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, updateQuantity, removeFromCart, total, clearCart } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
          />

          {/* Cart Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-black border-l-2 border-[#A67C52]/20 z-[201] flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-[#A67C52]/20 flex items-center justify-between bg-zinc-950/80">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-[#A67C52]" />
                <h2 className="text-lg font-semibold text-white">Cart</h2>
                <span className="bg-[#A67C52]/10 text-[#A67C52] px-2 py-0.5 rounded-full text-sm">
                  {items.length} items
                </span>
              </div>
              <div className="flex items-center gap-2">
                {items.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="p-2 text-white/60 hover:text-red-500 rounded-lg hover:bg-white/5"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 text-white/60 hover:text-white rounded-lg hover:bg-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center p-4">
                  <ShoppingBag className="w-12 h-12 text-white/20 mb-4" />
                  <p className="text-white/60 mb-4">Your cart is empty</p>
                  <Link
                    href="/shop"
                    onClick={onClose}
                    className="px-4 py-2 bg-[#A67C52] hover:bg-[#A67C52]/90 text-white rounded-lg transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                <div className="p-4 space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-3 bg-zinc-950/50 border border-[#A67C52]/10 rounded-xl"
                    >
                      {/* Product Image */}
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border border-[#A67C52]/20">
                        <Image
                          src={item.images[0]}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="text-white font-medium">{item.name}</h3>
                            {item.selectedSize && (
                              <p className="text-white/60 text-sm mt-1">Size: {item.selectedSize}</p>
                            )}
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-white/40 hover:text-red-500 p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2 bg-black/20 rounded-lg p-1">
                            <button
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="p-1 text-white/60 hover:text-white hover:bg-white/10 rounded"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="text-white min-w-[2rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 text-white/60 hover:text-white hover:bg-white/10 rounded"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="text-right">
                            <p className="text-[#A67C52] font-medium">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                            <p className="text-white/60 text-sm">
                              ${item.price.toFixed(2)} each
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer with Summary and Checkout */}
            {items.length > 0 && (
              <div className="border-t border-[#A67C52]/20 p-4 bg-zinc-950/80">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-white/60">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between text-white font-medium text-lg pt-2 border-t border-[#A67C52]/20">
                    <span>Total</span>
                    <span className="text-[#A67C52]">${total.toFixed(2)}</span>
                  </div>
                </div>
                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="block w-full py-3 bg-[#A67C52] hover:bg-[#A67C52]/90 text-white font-medium rounded-xl text-center transition-colors"
                >
                  Proceed to Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 