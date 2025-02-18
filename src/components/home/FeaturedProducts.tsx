'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FallbackImage } from '@/components/ui/FallbackImage';
import { MarqueeDemo } from '@/components/ui/marquee-demo';

interface FeaturedProductsProps {
  products: any[];
  isLoading: boolean;
}

export function FeaturedProducts({ products, isLoading }: FeaturedProductsProps) {
  if (isLoading) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Featured Products</h2>
          <div className="text-white text-center">Loading featured products...</div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Featured Products</h2>
          <div className="text-white text-center">No products available</div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group"
              >
                <Link href={`/shop/product/${product.id}`}>
                  <div className="relative aspect-square overflow-hidden rounded-xl bg-zinc-900">
                    <FallbackImage
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-4">
                    <h3 className="text-white font-medium">{product.name}</h3>
                    <p className="text-white/60">${product.price.toFixed(2)}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <MarqueeDemo />
    </>
  );
} 