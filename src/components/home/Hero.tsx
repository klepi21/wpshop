'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative h-[80vh] flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black z-10" />
      <div className="relative z-20 text-center px-4">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-bold text-white mb-6"
        >
          Official Merch Store
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-white/80 mb-8 max-w-2xl mx-auto"
        >
          Exclusive merchandise for our community. Wear your passion.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Link 
            href="/shop"
            className="bg-gradient-to-r from-[#C99733] to-[#FFD163] text-black px-8 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
          >
            Shop Now
          </Link>
        </motion.div>
      </div>
    </section>
  );
} 