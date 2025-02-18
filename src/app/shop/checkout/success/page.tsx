'use client';

import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckoutSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to shop if accessed directly
    if (!document.referrer.includes('/checkout')) {
      router.push('/shop');
    }
  }, [router]);

  return (
    <div className="min-h-screen pt-20 px-4 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex justify-center mb-6">
          <CheckCircle size={64} className="text-[#C99733]" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">
          Order Confirmed!
        </h1>
        <p className="text-white/80 mb-8 max-w-md mx-auto">
          Thank you for your purchase. We'll send you an email with your order details and tracking information once your order ships.
        </p>
        <Link
          href="/shop"
          className="inline-block bg-gradient-to-r from-[#C99733] to-[#FFD163] text-black px-8 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
        >
          Continue Shopping
        </Link>
      </motion.div>
    </div>
  );
} 