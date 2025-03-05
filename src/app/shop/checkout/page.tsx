'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { orderService } from '@/services/orders';
import { productService } from '@/services/products';
import { CustomsInfoModal } from '@/components/shop/CustomsInfoModal';

interface CheckoutForm {
  email: string;
  name: string;
  address: string;
  city: string;
  country: string;
  zip: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<CheckoutForm>({
    email: '',
    name: '',
    address: '',
    city: '',
    country: '',
    zip: ''
  });
  const [isCustomsModalOpen, setIsCustomsModalOpen] = useState(false);

  if (items.length === 0) {
    router.push('/shop');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create order items with variations
      const orderItems = items.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
        variation: item.variation
      }));

      const orderData = {
        customer_name: form.name,
        customer_email: form.email,
        customer_address: form.address,
        customer_city: form.city,
        customer_country: form.country,
        customer_postal_code: form.zip,
        items: orderItems,
        total_amount: total,
        payment_method: 'crypto',
        status: 'pending'
      };

      const order = await orderService.create(orderData);

      // Update stock for each item
      for (const item of items) {
        if (item.variation) {
          // Update variation stock
          await productService.updateVariationStock(
            item.id,
            item.variation,
            -item.quantity
          );
        } else {
          // Update product stock
          await productService.updateStock(item.id, -item.quantity);
        }
      }

      // Clear cart and redirect to success page
      clearCart();
      router.push('/shop/checkout/success');
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to process checkout');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Checkout Form */}
          <div>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-white">Checkout</h1>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-lg font-medium text-white">Contact Information</h2>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/60"
                />
              </div>

              <div className="space-y-4">
                <h2 className="text-lg font-medium text-white">Shipping Information</h2>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/60"
                />
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  required
                  value={form.address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/60"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    required
                    value={form.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/60"
                  />
                  <input
                    type="text"
                    name="country"
                    placeholder="Country"
                    required
                    value={form.country}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/60"
                  />
                </div>
                <input
                  type="text"
                  name="zip"
                  placeholder="ZIP / Postal Code"
                  required
                  value={form.zip}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/60"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#C99733] to-[#FFD163] text-black py-3 px-6 rounded-xl font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>Place Order - ${total.toFixed(2)}</>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-white">Order Summary</h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 bg-white/5 rounded-xl"
                >
                  <div className="relative w-20 aspect-square rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-medium">{item.name}</h3>
                    <p className="text-white/60">Quantity: {item.quantity}</p>
                    <p className="text-[#C99733]">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-4 space-y-4">
              <div className="flex justify-between text-white">
                <span>Total</span>
                <span className="font-medium">${total.toFixed(2)}</span>
              </div>
              
              <button
                onClick={() => setIsCustomsModalOpen(true)}
                className="w-full px-4 py-3 bg-zinc-900 border border-white/10 rounded-lg text-white/80 hover:text-white hover:border-white/20 flex items-center justify-center gap-2 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                View Customs & VAT Information
              </button>
            </div>
          </div>
        </div>
      </div>

      <CustomsInfoModal
        isOpen={isCustomsModalOpen}
        onClose={() => setIsCustomsModalOpen(false)}
      />
    </div>
  );
} 