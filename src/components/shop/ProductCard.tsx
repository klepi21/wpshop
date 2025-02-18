'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FallbackImage } from '@/components/ui/FallbackImage';

interface ProductCardProps {
  product: any;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group"
    >
      <Link href={`/shop/product/${product.slug}`}>
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
  );
} 